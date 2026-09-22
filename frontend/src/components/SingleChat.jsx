import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { ArrowLeft, Send, Users } from "lucide-react";
import io from "socket.io-client";

import { getSender, getSenderFull } from "../config/ChatLogics";
import ProfileModal from "./miscelleneous/ProfileModal";
import ScrollableChat from "./ScrollableChat";
import UpdateGroupChatModal from "./miscelleneous/UpdateGroupChatModal";
import { useChatStore } from "../stores/chatStore";
import { API_URL } from "../config/api";

const SingleChat = ({ setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUserName, setTypingUserName] = useState("");
  const socketRef = useRef(null);
  const selectedChatRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const { selectedChat, setSelectedChat, user, setNotification } = useChatStore();

  const fetchMessages = useCallback(async () => {
    if (!selectedChat?._id || !user?.token) return;
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/message/${selectedChat._id}`, { headers: { Authorization: `Bearer ${user.token}` } });
      setMessages(data);
      socketRef.current?.emit("join chat", selectedChat._id);
    } catch {
      toast.error("Failed to load the messages");
    } finally {
      setLoading(false);
    }
  }, [selectedChat, user]);

  useEffect(() => {
    selectedChatRef.current = selectedChat;
    // This is an asynchronous server synchronization, not a derived-state update.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchMessages();
  }, [fetchMessages, selectedChat]);

  useEffect(() => {
    if (!user) return undefined;
    const currentSocket = io(API_URL);
    socketRef.current = currentSocket;
    currentSocket.emit("setup", user);
    currentSocket.on("connected", () => setSocketConnected(true));
    currentSocket.on("typing", ({ name }) => {
      setTypingUserName(name || "Someone");
      setIsTyping(true);
    });
    currentSocket.on("stop typing", () => {
      setIsTyping(false);
      setTypingUserName("");
    });
    return () => {
      clearTimeout(typingTimeoutRef.current);
      currentSocket.disconnect();
      socketRef.current = null;
    };
  }, [user]);

  useEffect(() => {
    const currentSocket = socketRef.current;
    if (!currentSocket) return undefined;
    const receiveMessage = (incomingMessage) => {
      if (selectedChatRef.current?._id !== incomingMessage.chat._id) {
        setNotification((previous) => previous.some((message) => message._id === incomingMessage._id) ? previous : [incomingMessage, ...previous]);
        setFetchAgain((previous) => !previous);
        return;
      }
      setMessages((previous) => previous.some((message) => message._id === incomingMessage._id) ? previous : [...previous, incomingMessage]);
    };
    currentSocket.on("message recieved", receiveMessage);
    return () => currentSocket.off("message recieved", receiveMessage);
  }, [setFetchAgain, setNotification, socketConnected]);

  const stopTyping = () => {
    clearTimeout(typingTimeoutRef.current);
    if (typing && selectedChat?._id) {
      socketRef.current?.emit("stop typing", {
        chatId: selectedChat._id,
        userId: user._id,
      });
      setTyping(false);
    }
  };

  const handleMessageChange = (event) => {
    setNewMessage(event.target.value);
    if (!socketConnected || !selectedChat?._id) return;
    if (!typing) {
      setTyping(true);
      socketRef.current?.emit("typing", {
        chatId: selectedChat._id,
        userId: user._id,
        name: user.name,
      });
    }
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(stopTyping, 3000);
  };

  const sendMessage = async (event) => {
    event.preventDefault();
    const content = newMessage.trim();
    if (!content || !selectedChat?._id || sending) return;
    stopTyping();
    setSending(true);
    setNewMessage("");
    try {
      const { data } = await axios.post("/api/message", { content, chatId: selectedChat._id }, { headers: { "Content-type": "application/json", Authorization: `Bearer ${user.token}` } });
      socketRef.current?.emit("new message", data);
      setMessages((previous) => [...previous, data]);
    } catch {
      setNewMessage(content);
      toast.error("Failed to send the message");
    } finally {
      setSending(false);
    }
  };

  if (!selectedChat) {
    return <div className="flex h-full w-full items-center justify-center bg-slate-950 px-6"><div className="max-w-sm text-center"><div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 text-blue-400 shadow-xl"><Send size={25} /></div><p className="text-xl font-semibold text-slate-200">Choose a conversation</p><p className="mt-2 text-sm text-slate-500">Select a chat from the sidebar to view its messages.</p></div></div>;
  }

  const isGroup = selectedChat.isGroupChat;
  const otherUser = !isGroup ? getSenderFull(user, selectedChat.users) : null;
  const title = isGroup ? selectedChat.chatName : getSender(user, selectedChat.users);

  return (
    <section className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-950 shadow-2xl shadow-black/20">
      <header className="flex min-h-[72px] items-center border-b border-slate-800 bg-slate-900/95 px-3 sm:px-5">
        <button className="mr-2 flex h-10 w-10 items-center justify-center rounded-xl text-slate-300 transition hover:bg-slate-800 hover:text-white md:hidden" onClick={() => setSelectedChat(undefined)} aria-label="Back to chats"><ArrowLeft size={20} /></button>
        <div className="flex min-w-0 flex-1 items-center gap-3">
          {isGroup ? <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500/15 text-blue-300"><Users size={19} /></div> : <img className="h-10 w-10 shrink-0 rounded-full border border-slate-700 object-cover" src={otherUser?.pic} alt={title} />}
          <div className="min-w-0"><h1 className="truncate text-base font-semibold text-white sm:text-lg">{title}</h1><p className="mt-0.5 text-xs text-slate-400">{isGroup ? `${selectedChat.users.length} members` : "Direct message"}</p></div>
        </div>
        {isGroup ? <UpdateGroupChatModal fetchMessages={fetchMessages} setFetchAgain={setFetchAgain} /> : <ProfileModal user={otherUser} />}
      </header>
      <div className="relative min-h-0 flex-1 bg-gradient-to-b from-slate-900 to-slate-950">
        {loading ? <div className="flex h-full items-center justify-center"><div className="h-9 w-9 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500" /></div> : <div className="h-full overflow-y-auto px-3 py-4 sm:px-5"><ScrollableChat messages={messages} /></div>}
        {isTyping && (
          <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-2xl rounded-bl-md border border-slate-700/80 bg-slate-800/95 px-3 py-2 shadow-lg shadow-black/20 backdrop-blur-sm">
            <span className="text-xs font-medium text-slate-400">{typingUserName} is typing</span>
            <span className="flex items-center gap-1" aria-label="Typing indicator">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-400 [animation-delay:-0.3s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-400 [animation-delay:-0.15s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-400" />
            </span>
          </div>
        )}
      </div>
      <form onSubmit={sendMessage} className="border-t border-slate-800 bg-slate-900 p-3 sm:p-4"><div className="mx-auto flex max-w-5xl items-center gap-2"><input type="text" placeholder="Write a message…" value={newMessage} onChange={handleMessageChange} maxLength={2000} className="min-w-0 flex-1 rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" /><button type="submit" disabled={!newMessage.trim() || sending} aria-label="Send message" title="Send message" className="group flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-blue-400/30 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-950/50 transition duration-200 hover:-translate-y-0.5 hover:from-blue-400 hover:to-indigo-600 hover:shadow-blue-500/25 active:translate-y-0 disabled:cursor-not-allowed disabled:border-slate-700 disabled:bg-slate-800 disabled:text-slate-500 disabled:shadow-none"><Send size={18} className="translate-x-px transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></button></div></form>
    </section>
  );
};

export default SingleChat;

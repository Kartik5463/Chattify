import { Plus } from "lucide-react";

import axios from "axios";

import { useEffect } from "react";

import { getSender, getSenderFull } from "../../config/ChatLogics";

import ChatLoading from "../ChatLoading";

import { useChatStore } from "../../stores/chatStore";

import toast from "react-hot-toast";
import GroupChatModal from "./GroupChatModel";

const MyChats = ({ fetchAgain }) => {
  const { selectedChat, setSelectedChat, user, chats, setChats } = useChatStore();
  const fetchChats = async () => {
    if (!user?.token) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);

      setChats(data);
    } catch (error) {
      console.error("Fetch chats error:", error);
      toast.error("Failed to load the chats");
    }
  };

  useEffect(() => {
    void fetchChats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchAgain, user]);

  return (
    <div
      className={`
        ${selectedChat ? "hidden md:flex" : "flex"}
        flex-col
        items-center
        p-3
        bg-[#0d1420]
        w-full
        md:w-[31%]
        rounded-xl
        border
        border-[#1c2540]
      `}
    >
      {/* Header */}
      <div
        className="
          pb-4
          px-2
          text-[26px]
          md:text-[28px]
          font-display
          font-medium
          tracking-tight
          flex
          w-full
          justify-between
          items-center
          text-[#f1e9d8]
        "
      >
        <span>My Chats</span>

        <GroupChatModal>
          <button
            type="button"
            className="
      flex items-center gap-2
      bg-lime-400
      hover:bg-lime-600
      active:bg-amber-600
      text-blue-950
      px-3 py-2
      rounded-lg
      text-sm md:text-xs lg:text-sm
      font-bold
      shadow-sm
      transition-colors duration-200
      whitespace-nowrap
    "
          >
            <span>New Group Chat</span>
            <Plus size={18} strokeWidth={2.5} />
          </button>
        </GroupChatModal>
      </div>

      {/* Chats Container */}
      <div
        className="
          flex
          flex-col
          bg-[#12192a]
          w-full
          h-full
          rounded-xl
          overflow-hidden
          border
          border-[#1c2540]
        "
      >
        {chats ? (
          <div
            className="
              flex
              flex-col
              overflow-y-auto
              scrollbar-thin
              scrollbar-thumb-[#2a3552]
              scrollbar-track-transparent
            "
          >
            {chats.map((chat, idx) => {
              const isSelected = selectedChat?._id === chat?._id;

              const otherUser =
                !chat?.isGroupChat && user && Array.isArray(chat?.users)
                  ? getSenderFull(user, chat.users)
                  : null;

              return (
                <div
                  key={chat?._id}
                  onClick={() => setSelectedChat(chat)}
                  className={`
                    relative
                    cursor-pointer
                    px-4
                    py-3
                    flex
                    items-center
                    gap-3
                    transition-colors
                    duration-150
                    ${idx !== 0 ? "border-t border-[#1c2540]" : ""}
                    ${isSelected ? "bg-[#1a2338]" : "hover:bg-[#161f33]"}
                  `}
                >
                  {/* Selected indicator bar */}
                  {isSelected && (
                    <span
                      className="
                        absolute
                        left-0
                        top-0
                        bottom-0
                        w-[3px]
                        bg-[#d4a656]
                      "
                    />
                  )}

                  {/* Avatar */}
                  {!chat?.isGroupChat ? (
                    <img
                      src={otherUser?.pic}
                      alt={otherUser?.name || "user"}
                      className={`
                        w-10
                        h-10
                        rounded-full
                        object-cover
                        shrink-0
                        ring-2
                        ${isSelected ? "ring-[#d4a656]" : "ring-[#232d42]"}
                      `}
                    />
                  ) : (
                    <div
                      className="
                        w-10
                        h-10
                        rounded-full
                        shrink-0
                        flex
                        items-center
                        justify-center
                        bg-[#232d42]
                        text-[#d4a656]
                        text-sm
                        font-semibold
                        ring-2
                        ring-[#1c2540]
                      "
                    >
                      {(chat?.chatName || "G")[0].toUpperCase()}
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    {/* Chat Name */}
                    <p
                      className={`
                        text-sm
                        truncate
                        ${
                          isSelected
                            ? "text-[#f1e9d8] font-semibold"
                            : "text-[#e2e8f0] font-medium"
                        }
                      `}
                    >
                      {!chat?.isGroupChat &&
                      user &&
                      Array.isArray(chat?.users)
                        ? getSender(user, chat.users)
                        : chat?.isGroupChat
                          ? chat?.chatName || "Group Chat"
                          : "Loading..."}
                    </p>

                    {/* Latest Message */}
                    {chat?.latestMessage && chat.latestMessage?.sender && (
                      <p className="text-xs mt-0.5 truncate text-[#6b7690]">
                        <span className="text-[#8a93ac]">
                          {chat.latestMessage.sender.name}:
                        </span>{" "}
                        {chat.latestMessage?.content
                          ? chat.latestMessage.content.length > 50
                            ? chat.latestMessage.content.substring(0, 51) +
                              "..."
                            : chat.latestMessage.content
                          : ""}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <ChatLoading />
        )}
      </div>
    </div>
  );
};

export default MyChats;

import ScrollableFeed from "react-scrollable-feed";
import { isLastMessage, isSameSender, isSameUser } from "../config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  if (!messages?.length) {
    return (
      <div className="flex min-h-full items-center justify-center px-6 py-16 text-center">
        <p className="max-w-xs text-sm text-slate-500">No messages yet. Send the first one to start the conversation.</p>
      </div>
    );
  }

  return (
    <ScrollableFeed className="h-full">
      <div className="space-y-1 pb-3">
        {messages.map((message, index) => {
          const isMine = message.sender._id === user?._id;
          const showAvatar = !isMine && (isSameSender(messages, message, index, user?._id) || isLastMessage(messages, index, user?._id));
          const startsNewGroup = !isSameUser(messages, message, index);

          return (
            <div className={`flex items-end gap-2 ${isMine ? "justify-end" : "justify-start"} ${startsNewGroup ? "mt-3" : "mt-1"}`} key={message._id}>
              {!isMine && <div className="h-8 w-8 shrink-0">{showAvatar && <img className="h-8 w-8 rounded-full border border-slate-700 object-cover" src={message.sender.pic} alt={message.sender.name} title={message.sender.name} />}</div>}
              <div className="max-w-[82%] sm:max-w-[70%]">
                {!isMine && startsNewGroup && (
                  <div className="mb-1 flex items-center gap-1.5 px-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                    <p className="truncate text-[11px] font-semibold tracking-wide text-slate-400">{message.sender.name}</p>
                  </div>
                )}
                <div className={`rounded-2xl px-3.5 py-2 text-sm leading-relaxed shadow-sm ${isMine ? "rounded-br-md bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-blue-950/30" : "rounded-bl-md border border-slate-700/80 bg-slate-800 text-slate-100"}`}>
                  <p className="break-words whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </ScrollableFeed>
  );
};

export default ScrollableChat;

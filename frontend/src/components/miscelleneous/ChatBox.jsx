import SingleChat from "../SingleChat";
import { useChatStore } from "../../stores/chatStore";

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const selectedChat = useChatStore((state) => state.selectedChat);

  return (
    <div
      className={`
        ${selectedChat ? "flex" : "hidden"} md:flex
        items-center flex-col
        p-3
        bg-slate-900
        border border-slate-700
        rounded-lg
        w-full md:w-[68%]
      `}
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </div>
  );
};

export default ChatBox;
import { useState } from "react";
import SideDrawer from "../components/miscelleneous/SideDrawer";
import MyChats from "../components/miscelleneous/MyChats";
import Chatbox from "../components/miscelleneous/ChatBox";
import { useChatStore } from "../stores/chatStore";

const Chats = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const user = useChatStore((state) => state.user);

  return (
    <div className="w-full min-h-screen bg-slate-950">
      {user && <SideDrawer />}

      <div className="flex justify-between w-full h-[91.5vh] p-2.5 gap-2.5">
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </div>
    </div>
  );
};

export default Chats;
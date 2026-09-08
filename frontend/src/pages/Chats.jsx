import { useState } from "react";
import SideDrawer from "../components/miscelleneous/SideDrawer";
import MyChats from "../components/miscelleneous/MyChats";
import Chatbox from "../components/miscelleneous/Chatbox";
import { ChatState } from "../Context/ChatProvider";

const Chatpage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user } = ChatState();

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

export default Chatpage;
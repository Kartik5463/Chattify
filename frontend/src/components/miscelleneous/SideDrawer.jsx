import { useState } from "react";

import axios from "axios";

import { useNavigate } from "react-router-dom";

import { Bell, ChevronDown, Search, X } from "lucide-react";

import toast from "react-hot-toast";

import ChatLoading from "../ChatLoading";

import ProfileModal from "./ProfileModal";

import { getSender } from "../../config/ChatLogics";

import UserListItem from "../userAvatar/UserListItem";

import { useChatStore } from "../../stores/chatStore";

function SideDrawer() {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const {
    setSelectedChat,
    user,
    notification,
    setNotification,
    chats,
    setChats,
  } = useChatStore();

  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    useChatStore.getState().setUser(undefined);
    navigate("/");
  };

  const handleSearch = async () => {
    if (!search) {
      toast.error("Please enter something in search");
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `/api/user?search=${search}`,
        config
      );

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      setLoading(false);
      console.error(error);
      toast.error("Failed to load the search results");
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);

      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        `/api/chat`,
        { userId },
        config
      );
      console.log("Accessed chat data:", data);
      if (!chats.find((c) => c._id === data._id)) {
        setChats([data, ...chats]);
      }

      setSelectedChat(data);
      setLoadingChat(false);
      setIsOpen(false);
    } catch (error) {
      setLoadingChat(false);
      toast.error(`Error fetching the chat: ${error.message}`);
    }
  };

  return (
    <>
      {/* NAVBAR */}
      <div className="flex w-full items-center justify-between border-b border-[#1e3155] bg-[#071225] px-3 py-2 shadow-[0_4px_20px_rgba(0,0,0,0.25)]">
        
        {/* SEARCH */}
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center rounded-lg border border-transparent px-3 py-2 text-[#94a9c9] transition hover:border-[#203b68] hover:bg-[#0d1b34] hover:text-white"
          title="Search Users to chat"
        >
          <Search
            size={20}
            className="transition group-hover:text-[#3b82f6]"
          />

          <span className="hidden px-4 md:flex">
            Search User
          </span>
        </button>

        {/* TITLE */}
        <h1 className="font-display text-2xl font-semibold tracking-tight text-white">
          Chatti<span className="text-[#3b82f6]">fy</span>
        </h1>

        <div className="flex items-center gap-2">

          {/* NOTIFICATIONS */}
          <div className="relative">
            <button
              onClick={() =>
                setShowNotifications(!showNotifications)
              }
              className="relative rounded-lg border border-transparent p-2 text-[#94a9c9] transition hover:border-[#203b68] hover:bg-[#0d1b34] hover:text-white"
              title="Notifications"
            >
              <Bell
                size={22}
                className="transition"
              />

              {notification.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 px-1 text-xs font-bold text-white shadow-[0_0_12px_rgba(59,130,246,0.5)]">
                  {notification.length}
                </span>
              )}
            </button>

            {/* NOTIFICATION DROPDOWN */}
            {showNotifications && (
              <div className="absolute right-0 top-12 z-50 w-72 overflow-hidden rounded-xl border border-[#24385c] bg-[#0b172b] p-2 shadow-[0_15px_40px_rgba(0,0,0,0.5)]">

                <div className="border-b border-[#1c2e4d] px-3 py-2">
                  <h3 className="text-sm font-semibold text-white">
                    Notifications
                  </h3>
                </div>

                {notification.length === 0 && (
                  <div className="px-3 py-4 text-sm text-[#7185a5]">
                    No New Messages
                  </div>
                )}

                {notification.map((notif) => (
                  <button
                    key={notif._id}
                    onClick={() => {
                      setSelectedChat(notif.chat);
                      setNotification((previous) =>
                        previous.filter((item) => item._id !== notif._id)
                      );
                      setShowNotifications(false);
                    }}
                    className="w-full rounded-lg px-3 py-3 text-left text-sm text-[#a9b9d2] transition hover:bg-[#122441] hover:text-white"
                  >
                    {notif.chat.isGroupChat
                      ? `New Message in ${notif.chat.chatName}`
                      : `New Message from ${getSender(
                          user,
                          notif.chat.users
                        )}`}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* PROFILE */}
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-1 rounded-lg border border-transparent bg-[#0b172b] p-1 transition hover:border-[#203b68] hover:bg-[#10213d]"
            >
              <img
                src={user.pic}
                alt={user.name}
                className="h-8 w-8 rounded-full object-cover ring-2 ring-[#233c69]"
              />

              <ChevronDown
                size={18}
                className="text-[#8da3c3]"
              />
            </button>

            {/* PROFILE DROPDOWN */}
            {showProfile && (
              <div className="absolute right-0 top-11 z-50 w-48 overflow-hidden rounded-xl border border-[#24385c] bg-[#0b172b] py-2 shadow-[0_15px_40px_rgba(0,0,0,0.5)]">

                {/* PROFILE HEADER */}
                <div className="border-b border-[#1c2e4d] px-3 py-3">
                  <p className="truncate text-sm font-semibold text-white">
                    {user.name}
                  </p>

                  <p className="truncate text-xs text-[#7185a5]">
                    {user.email}
                  </p>
                </div>

                {/* MY PROFILE */}
                <div className="px-2 py-1">
                  <ProfileModal user={user}>
                    <span className="block w-full cursor-pointer rounded-lg px-3 py-2 text-sm text-[#a9b9d2] transition hover:bg-[#122441] hover:text-white">
                      My Profile
                    </span>
                  </ProfileModal>
                </div>

                <div className="mx-3 border-t border-[#1c2e4d]" />

                {/* LOGOUT */}
                <div className="px-2 pt-1">
                  <button
                    onClick={logoutHandler}
                    className="w-full rounded-lg px-3 py-2 text-left text-sm text-[#a9b9d2] transition hover:bg-[#351b2a] hover:text-red-300"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SEARCH DRAWER */}
      {isOpen && (
        <div className="fixed inset-0 z-50">

          {/* BACKDROP */}
          <div
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-[#020817]/75 backdrop-blur-sm"
          />

          {/* DRAWER */}
          <div className="absolute left-0 top-0 h-full w-full max-w-sm border-r border-[#1e3155] bg-[#071225] shadow-[15px_0_50px_rgba(0,0,0,0.5)]">

            {/* HEADER */}
            <div className="flex items-center justify-between border-b border-[#1e3155] px-5 py-4">
              <h2 className="text-lg font-semibold text-white">
                Search Users
              </h2>

              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-2 text-[#7185a5] transition hover:bg-[#10213d] hover:text-white"
              >
                <X size={22} />
              </button>
            </div>

            {/* BODY */}
            <div className="p-4">

              {/* SEARCH INPUT */}
              <div className="flex pb-4">
                <input
                  type="text"
                  placeholder="Search by name or email"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  className="mr-2 flex-1 rounded-lg border border-[#263a5c] bg-[#050d1c] px-3 py-2 text-sm text-white outline-none placeholder:text-[#526783] transition focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]/30"
                />

                <button
                  onClick={handleSearch}
                  className="rounded-lg bg-gradient-to-r from-[#2563eb] to-[#4f46e5] px-5 py-2 font-medium text-white shadow-[0_0_18px_rgba(59,130,246,0.25)] transition hover:brightness-110"
                >
                  Go
                </button>
              </div>

              {/* SEARCH RESULTS */}
              {loading ? (
                <ChatLoading />
              ) : (
                searchResult?.map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() =>
                      accessChat(user._id)
                    }
                  />
                ))
              )}

              {/* LOADING CHAT */}
              {loadingChat && (
                <div className="mt-3 flex justify-center">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#334a70] border-t-[#3b82f6]" />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SideDrawer;

import axios from "axios";
import { useState, useRef, useCallback } from "react";
import toast from "react-hot-toast";
import { X } from "lucide-react";
import { useChatStore } from "../../stores/chatStore";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import UserListItem from "../userAvatar/UserListItem";

const GroupChatModal = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const debounceRef = useRef(null);

  const { user, chats, setChats } = useChatStore();

  const onOpen = () => setIsOpen(true);
  const onClose = () => {
    setIsOpen(false);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setSearch("");
    setSearchResult([]);
    setSelectedUsers([]);
    setGroupChatName("");
  };

  const handleGroup = (userToAdd) => {
    if (selectedUsers.some((u) => u._id === userToAdd._id)) {
      toast.error("User already added");
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const fetchUsers = useCallback(
    async (query) => {
      if (!query) {
        setSearchResult([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.get(`/api/user?search=${query}`, config);
        setSearchResult(data);
    } catch {
      toast.error("Failed to Load the Search Results");
      } finally {
        setLoading(false);
      }
    },
    [user],
  );

  const handleSearch = (query) => {
    setSearch(query);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query) {
      setSearchResult([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    debounceRef.current = setTimeout(() => {
      fetchUsers(query);
    }, 500);
  };

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  const handleSubmit = async () => {
    if (!groupChatName || selectedUsers.length === 0) {
      toast.error("Please fill all the feilds");
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        `/api/chat/group`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config,
      );
      setChats([data, ...chats]);
      onClose();
      toast.success("New Group Chat Created!");
    } catch (error) {
      toast.error(
        typeof error.response?.data === "string"
          ? error.response.data
          : error.response?.data?.message || "Failed to Create the Chat!",
      );
    }
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="relative w-full max-w-md rounded-xl bg-slate-900 border border-slate-700 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-center relative px-6 pt-6 pb-4">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-amber-200 text-center">
                Create Group Chat
              </h2>
              <button
                onClick={onClose}
                className="absolute right-4 top-4 text-slate-400 hover:text-white transition-colors"
              >
                <X size={22} />
              </button>
            </div>

            {/* Body */}
            <div className="flex flex-col items-center px-6 gap-3">
              <input
                type="text"
                placeholder="Chat Name"
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
                className="w-full rounded-md bg-slate-800 border border-slate-600 text-white placeholder-slate-400 px-3 py-2 mb-1 text-sm font-medium tracking-normal focus:outline-none focus:ring-2 focus:ring-amber-400"
              />

              <input
                type="text"
                placeholder="Add Users eg: John, Piyush, Jane"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full rounded-md bg-slate-800 border border-slate-600 text-white placeholder-slate-400 px-3 py-2 text-sm font-medium tracking-normal focus:outline-none focus:ring-2 focus:ring-amber-400"
              />

              {selectedUsers.length > 0 && (
                <div className="w-full flex flex-wrap">
                  {selectedUsers.map((u) => (
                    <UserBadgeItem
                      key={u._id}
                      user={u}
                      handleFunction={() => handleDelete(u)}
                    />
                  ))}
                </div>
              )}

              <div className="w-full max-h-56 overflow-y-auto">
                {loading ? (
                  <div className="text-slate-400 text-sm font-medium py-2">
                    Loading...
                  </div>
                ) : (
                  searchResult
                    ?.slice(0, 4)
                    .map((u) => (
                      <UserListItem
                        key={u._id}
                        user={u}
                        handleFunction={() => handleGroup(u)}
                      />
                    ))
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end px-6 py-4 mt-2 border-t border-slate-700">
              <button
                onClick={handleSubmit}
                className="rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold tracking-normal px-5 py-2 transition-colors"
              >
                Create Chat
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GroupChatModal;

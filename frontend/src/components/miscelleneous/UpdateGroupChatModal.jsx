import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Eye, X, Loader2, Users, Search } from "lucide-react";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import UserListItem from "../userAvatar/UserListItem";
const UpdateGroupChatModal = ({ fetchMessages, setFetchAgain }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);
  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);
  const { selectedChat, setSelectedChat, user } = ChatState();
  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }
    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(`/api/user?search=${query}`, config);
      setSearchResult(data);
    } catch {
      toast.error("Failed to Load the Search Results");
    } finally {
      setLoading(false);
    }
  };
  const handleRename = async () => {
    if (!groupChatName) return;
    try {
      setRenameLoading(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.put(
        `/api/chat/rename`,
        { chatId: selectedChat._id, chatName: groupChatName },
        config,
      );
      setSelectedChat(data);
      setFetchAgain((previous) => !previous);
      toast.success("Group name updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error Occured!");
    } finally {
      setRenameLoading(false);
    }
    setGroupChatName("");
  };
  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      toast.error("User Already in group!");
      return;
    }
    if (selectedChat.groupAdmin._id !== user._id) {
      toast.error("Only admins can add someone!");
      return;
    }
    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.put(
        `/api/chat/groupadd`,
        { chatId: selectedChat._id, userId: user1._id },
        config,
      );
      setSelectedChat(data);
      setFetchAgain((previous) => !previous);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error Occured!");
    } finally {
      setLoading(false);
    }
    setGroupChatName("");
  };
  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      toast.error("Only admins can remove someone!");
      return;
    }
    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.put(
        `/api/chat/groupremove`,
        { chatId: selectedChat._id, userId: user1._id },
        config,
      );
      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain((previous) => !previous);
      fetchMessages();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error Occured!");
    } finally {
      setLoading(false);
    }
    setGroupChatName("");
  };
  return (
    <>
      {" "}
      {/* Open Button */}{" "}
      <button
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-slate-300 transition-all duration-200 hover:border-blue-500 hover:bg-slate-700 hover:text-blue-400 active:scale-95"
        onClick={onOpen}
        title="Group settings"
      >
        {" "}
        <Eye size={18} />{" "}
      </button>{" "}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm"
          onClick={onClose}
        >
          {" "}
          <div
            className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl shadow-black/40"
            onClick={(e) => e.stopPropagation()}
          >
            {" "}
            {/* Header */}{" "}
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-5 py-4">
              {" "}
              <div className="flex min-w-0 items-center gap-3">
                {" "}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                  {" "}
                  <Users size={20} />{" "}
                </div>{" "}
                <div className="min-w-0">
                  {" "}
                  <h2 className="truncate text-lg font-semibold text-white">
                    {" "}
                    {selectedChat.chatName}{" "}
                  </h2>{" "}
                  <p className="text-xs text-slate-500">
                    {" "}
                    {selectedChat.users.length} members{" "}
                  </p>{" "}
                </div>{" "}
              </div>{" "}
              <button
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-800 hover:text-white"
                onClick={onClose}
              >
                {" "}
                <X size={20} />{" "}
              </button>{" "}
            </div>{" "}
            {/* Body */}{" "}
            <div className="flex min-h-0 flex-col gap-5 overflow-y-auto px-5 py-5">
              {" "}
              {/* Members */}{" "}
              <div>
                {" "}
                <div className="mb-3 flex items-center justify-between">
                  {" "}
                  <h3 className="text-sm font-semibold text-slate-200">
                    {" "}
                    Group Members{" "}
                  </h3>{" "}
                  <span className="rounded-full bg-slate-800 px-2.5 py-1 text-xs text-slate-400">
                    {" "}
                    {selectedChat.users.length}{" "}
                  </span>{" "}
                </div>{" "}
                <div className="flex max-h-32 w-full flex-wrap gap-2 overflow-y-auto rounded-xl border border-slate-800 bg-slate-950/50 p-3">
                  {" "}
                  {selectedChat.users.map((u) => (
                    <UserBadgeItem
                      key={u._id}
                      user={u}
                      admin={selectedChat.groupAdmin}
                      handleFunction={() => handleRemove(u)}
                    />
                  ))}{" "}
                </div>{" "}
              </div>{" "}
              {/* Rename Group */}{" "}
              <div>
                {" "}
                <h3 className="mb-2 text-sm font-semibold text-slate-200">
                  {" "}
                  Group Name{" "}
                </h3>{" "}
                <div className="flex gap-2">
                  {" "}
                  <input
                    className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                    placeholder="Enter new group name"
                    value={groupChatName}
                    onChange={(e) => setGroupChatName(e.target.value)}
                  />{" "}
                  <button
                    className="flex min-w-[85px] items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={renameloading || !groupChatName.trim()}
                    onClick={handleRename}
                  >
                    {" "}
                    {renameloading ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      "Update"
                    )}{" "}
                  </button>{" "}
                </div>{" "}
              </div>{" "}
              {/* Add User */}{" "}
              <div>
                {" "}
                <h3 className="mb-2 text-sm font-semibold text-slate-200">
                  {" "}
                  Add Members{" "}
                </h3>{" "}
                <div className="relative">
                  {" "}
                  <Search
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                  />{" "}
                  <input
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 py-2.5 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                    placeholder="Search users..."
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                  />{" "}
                </div>{" "}
              </div>{" "}
              {/* Search Results */}{" "}
              <div className="min-h-[60px]">
                {" "}
                {loading ? (
                  <div className="flex items-center justify-center py-6">
                    {" "}
                    <Loader2
                      className="animate-spin text-blue-500"
                      size={26}
                    />{" "}
                  </div>
                ) : searchResult?.length > 0 ? (
                  <div className="space-y-2">
                    {" "}
                    {searchResult.map((u) => (
                      <div
                        key={u._id}
                        className="overflow-hidden rounded-xl border border-slate-800 bg-slate-800/60 transition hover:border-slate-700 hover:bg-slate-800"
                      >
                        {" "}
                        <UserListItem
                          user={u}
                          handleFunction={() => handleAddUser(u)}
                        />{" "}
                      </div>
                    ))}{" "}
                  </div>
                ) : search ? (
                  <div className="py-6 text-center text-sm text-slate-500">
                    {" "}
                    No users found{" "}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-slate-800 py-6 text-center">
                    {" "}
                    <p className="text-sm text-slate-500">
                      {" "}
                      Search for users to add them to the group{" "}
                    </p>{" "}
                  </div>
                )}{" "}
              </div>{" "}
            </div>{" "}
            {/* Footer */}{" "}
            <div className="flex items-center justify-between border-t border-slate-800 bg-slate-900 px-5 py-4">
              {" "}
              <p className="hidden text-xs text-slate-600 sm:block">
                {" "}
                Manage your group members{" "}
              </p>{" "}
              <button
                className="ml-auto rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-400 transition hover:border-red-500/50 hover:bg-red-500/20 hover:text-red-300"
                onClick={() => handleRemove(user)}
              >
                {" "}
                Leave Group{" "}
              </button>{" "}
            </div>{" "}
          </div>{" "}
        </div>
      )}{" "}
    </>
  );
};
export default UpdateGroupChatModal;

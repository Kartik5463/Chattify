import { X } from "lucide-react";

const UserBadgeItem = ({ user, handleFunction, admin }) => {
  return (
    <span
      onClick={handleFunction}
      className="inline-flex items-center gap-1 px-2 py-1 mt-1 mb-2 mr-1 rounded-lg bg-purple-600 text-white text-xs font-medium cursor-pointer hover:bg-purple-700 transition-colors"
    >
      {user.name}
      {admin?._id === user._id && <span>(Admin)</span>}
      <X className="w-3 h-3 ml-1" />
    </span>
  );
};

export default UserBadgeItem;

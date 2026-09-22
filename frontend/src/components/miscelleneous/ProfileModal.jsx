import { useState } from "react";
import { Eye, X } from "lucide-react";

const ProfileModal = ({ user, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  console.log(user);
  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  return (
    <>
      {/* Trigger */}
      {children ? (
        <span
          onClick={onOpen}
          className="cursor-pointer"
        >
          {children}
        </span>
      ) : (
        <button
          onClick={onOpen}
          className="flex items-center justify-center rounded-md p-2 text-[#94a3b8] transition hover:bg-[#1a2338] hover:text-[#f1e9d8]"
        >
          <Eye size={20} />
        </button>
      )}

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">

          {/* Overlay */}
          <div
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <div className="relative z-10 flex h-[420px] w-[90%] max-w-lg flex-col rounded-xl border border-[#1c2540] bg-[#12192a] shadow-2xl">

            {/* Header */}
            <div className="relative flex items-center justify-center border-b border-[#1c2540] px-6 py-5">

              <h2 className="font-display text-2xl font-medium tracking-tight text-[#f1e9d8]">
                {user.name}
              </h2>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute right-4 top-4 rounded-full p-2 text-[#6b7690] transition hover:bg-[#1a2338] hover:text-[#f1e9d8]"
              >
                <X size={22} />
              </button>
            </div>

            {/* Body */}
            <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 py-6">

              {/* Profile Image */}
              <img
                src={user.pic}
                alt={user.name}
                className="h-[140px] w-[140px] rounded-full object-cover ring-2 ring-[#d4a656]"
              />

              {/* Email */}
              <p className="text-base text-[#8a93ac] md:text-lg">
                {user.email}
              </p>
            </div>

            {/* Footer */}
            <div className="flex justify-end border-t border-[#1c2540] px-6 py-4">

              <button
                onClick={onClose}
                className="rounded-md bg-[#1a2338] px-5 py-2 text-sm font-medium text-[#e2e8f0] transition hover:bg-[#232d42]"
              >
                Close
              </button>

            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileModal;

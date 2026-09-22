import { create } from "zustand";

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("userInfo")) || undefined;
  } catch {
    localStorage.removeItem("userInfo");
    return undefined;
  }
};

export const useChatStore = create((set) => ({
  selectedChat: undefined,
  setSelectedChat: (selectedChat) => set({ selectedChat }),
  user: getStoredUser(),
  setUser: (user) => set({ user }),
  notification: [],
  setNotification: (notification) => set((state) => ({
    notification: typeof notification === "function"
      ? notification(state.notification)
      : notification,
  })),
  chats: [],
  setChats: (chats) => set((state) => ({
    chats: typeof chats === "function" ? chats(state.chats) : chats,
  })),
}));

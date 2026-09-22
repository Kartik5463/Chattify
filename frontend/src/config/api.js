import axios from "axios";
import { useChatStore } from "../stores/chatStore";

const configuredApiUrl = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
const apiUrl = configuredApiUrl || (import.meta.env.DEV ? "http://localhost:5000" : window.location.origin);

// Keep local development on Vite's /api proxy while allowing Vercel to call
// the separately deployed backend through VITE_API_URL.
axios.defaults.baseURL = apiUrl || undefined;

let isLoggingOut = false;

export const logoutUser = () => {
  localStorage.removeItem("userInfo");

  const { setUser, setSelectedChat, setChats, setNotification } =
    useChatStore.getState();
  setUser(undefined);
  setSelectedChat(undefined);
  setChats([]);
  setNotification([]);

  if (!isLoggingOut && window.location.pathname !== "/") {
    isLoggingOut = true;
    window.location.replace("/");
  }
};

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      logoutUser();
    }

    return Promise.reject(error);
  }
);

export const API_URL = apiUrl || window.location.origin;
export const SOCKET_URL = configuredApiUrl || window.location.origin;

import axios from "axios";

const configuredApiUrl = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
const apiUrl = configuredApiUrl || (import.meta.env.DEV ? "http://localhost:5000" : window.location.origin);

// Keep local development on Vite's /api proxy while allowing Vercel to call
// the separately deployed backend through VITE_API_URL.
axios.defaults.baseURL = apiUrl || undefined;

export const API_URL = apiUrl || window.location.origin;
export const SOCKET_URL = configuredApiUrl || window.location.origin;

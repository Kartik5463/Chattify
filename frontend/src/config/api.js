import axios from "axios";

const apiUrl = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

// Keep local development on Vite's /api proxy while allowing Vercel to call
// the separately deployed backend through VITE_API_URL.
axios.defaults.baseURL = apiUrl || undefined;

export const API_URL = apiUrl || window.location.origin;

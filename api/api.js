import axios from "axios";

// Debugging ke liye
console.log("🔍 FRONTEND is using API URL:", process.env.NEXT_PUBLIC_BACKEND_URL);

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL, // ✅ backend url env se lo
  withCredentials: true, // ✅ cookie bhej/receive
});

export default api;

import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL, // ✅ backend url env se lo
  withCredentials: true, // ✅ cookie bhej/receive
});

export default api;

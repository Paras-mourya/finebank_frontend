import axios from "axios";


console.log(" FRONTEND is using API URL:", process.env.NEXT_PUBLIC_BACKEND_URL);

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL, 
  withCredentials: true, 
});

export default api;

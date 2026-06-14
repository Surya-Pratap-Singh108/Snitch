import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/auth`,
  withCredentials: true,
});
api.interceptors.request.use((config) => {
    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find(c => c.trim().startsWith('token='));
    if (tokenCookie) {
        const token = tokenCookie.split('=')[1];
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const register = async ({ email, contact, password, fullname, isSeller }) => {
  const response = await api.post("/register", { email, contact, password, fullname, isSeller });
  return response.data;
};
export const verifyEmail = async ({ userId, otp }) => {
  const response = await api.post("/verify-email", { userId, otp });
  return response.data;
};
export const login = async ({ email, password }) => {
  const response = await api.post("/login", { email, password });
  return response.data;
};
export const getMe = async () => {
  const response = await api.get("/me");
  return response.data;
};
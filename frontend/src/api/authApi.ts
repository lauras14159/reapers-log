import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

//  attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const signupApi = async (
  name: string,
  email: string,
  password: string,
) => {
  const res = await API.post("/api/auth/signup", { name, email, password });
  localStorage.setItem("token", res.data.token); // save token
  return res.data;
};

export const loginApi = async (email: string, password: string) => {
  const res = await API.post("/api/auth/login", { email, password });
  localStorage.setItem("token", res.data.token); //  save token
  return res.data;
};

export const logoutApi = async () => {
  localStorage.removeItem("token"); //  just remove token
};

export const getMeApi = async () => {
  const res = await API.get("/api/auth/me");
  return res.data;
};

export const updateProfileApi = async (data: {
  name?: string;
  email?: string;
  password?: string;
  newPassword?: string;
}) => {
  const res = await API.put("/api/auth/profile", data);
  return res.data;
};

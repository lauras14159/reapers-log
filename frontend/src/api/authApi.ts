import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // sends cookies automatically
});

export const signupApi = async (
  name: string,
  email: string,
  password: string,
) => {
  const res = await API.post("/api/auth/signup", { name, email, password });
  return res.data;
};

export const loginApi = async (email: string, password: string) => {
  const res = await API.post("/api/auth/login", { email, password });
  return res.data;
};

export const logoutApi = async () => {
  await API.post("/api/auth/logout");
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

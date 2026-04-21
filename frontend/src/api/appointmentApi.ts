import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getAppointments = async () => {
  const res = await API.get("/api/appointments");
  return res.data;
};

export const createAppointment = async (data: any) => {
  const res = await API.post("/api/appointments", data);
  return res.data;
};

export const updateAppointment = async (id: string, data: any) => {
  const res = await API.put(`/api/appointments/${id}`, data);
  return res.data;
};

export const deleteAppointment = async (id: string) => {
  await API.delete(`/api/appointments/${id}`);
};

export const markAsDoneApi = async (id: string) => {
  const res = await API.patch(`/api/appointments/${id}/done`);
  return res.data;
};

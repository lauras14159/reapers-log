import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// rest of your functions unchanged...
export const getPatients = async () => {
  const res = await API.get("/api/patients");
  return res.data.map((p: any) => ({ ...p, _id: p._id.toString() }));
};

export const createPatient = async (data: any) => {
  const res = await API.post("/api/patients", data);
  return { ...res.data, _id: res.data._id.toString() };
};

export const updatePatient = async (id: string, data: any) => {
  const res = await API.put(`/api/patients/${id}`, data);
  return { ...res.data, _id: res.data._id.toString() };
};

export const deletePatient = async (id: string) => {
  await API.delete(`/api/patients/${id}`);
};

export const archivePatientApi = async (id: string) => {
  const res = await API.patch(`/api/patients/${id}/archive`);
  return res.data;
};

export const unarchivePatientApi = async (id: string) => {
  const res = await API.patch(`/api/patients/${id}/unarchive`);
  return res.data;
};

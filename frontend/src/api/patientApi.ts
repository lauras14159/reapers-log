const API = import.meta.env.VITE_API_URL;
const BASE_URL = `${API}/api/patients`;

//  GET
export const getPatients = async () => {
  const res = await fetch(BASE_URL);
  const data = await res.json();

  return data.map((p: any) => ({
    ...p,
    id: p._id ? p._id.toString() : undefined, // map Mongo → frontend
  }));
};

// CREATE
export const createPatient = async (data: any) => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const json = await res.json();

  return {
    ...json,
    id: json._id,
  };
};

// UPDATE
export const updatePatient = async (id: string, data: any) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const json = await res.json();

  return {
    ...json,
    id: json._id,
  };
};

// DELETE
export const deletePatient = async (id: string) => {
  await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
};

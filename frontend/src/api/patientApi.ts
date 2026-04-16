const API = import.meta.env.VITE_API_URL;
const BASE_URL = `${API}/api/patients`;

//  GET
export const getPatients = async () => {
  const res = await fetchWithRetry(BASE_URL);
  const data = await res.json();

  return data.map((p: any) => ({
    ...p,
    id: p._id ? p._id.toString() : undefined, // map Mongo → frontend
  }));
};

// CREATE
export const createPatient = async (data: any) => {
  const res = await fetchWithRetry(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("CREATE ERROR:", text);
    throw new Error("Failed to create patient");
  }

  const json = await res.json();

  return {
    ...json,
    id: json._id,
  };
};

// UPDATE
export const updatePatient = async (id: string, data: any) => {
  const res = await fetchWithRetry(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("UPDATE ERROR:", text);
    throw new Error("Failed to update patient");
  }

  const json = await res.json();

  return {
    ...json,
    id: json._id,
  };
};

// DELETE
export const deletePatient = async (id: string) => {
  await fetchWithRetry(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
};

// export const archivePatientApi = async (id: string) => {
//   const res = await fetchWithRetry(`${BASE_URL}/${id}/archive`, {
//     method: "PATCH",
//   });

//   if (!res.ok) {
//     const text = await res.text();
//     console.error("ARCHIVE ERROR:", text);
//     throw new Error("Failed to archive patient");
//   }

//   return await res.json();
// };

// export const unarchivePatientApi = async (id: string) => {
//   const res = await fetchWithRetry(`${BASE_URL}/${id}/unarchive`, {
//     method: "PATCH",
//   });

//   if (!res.ok) {
//     const text = await res.text();
//     console.error("UNARCHIVE ERROR:", text);
//     throw new Error("Failed to unarchive patient");
//   }

//   return await res.json();
// };

const fetchWithRetry = async (
  url: string,
  options?: RequestInit,
  retries = 2,
) => {
  try {
    const res = await fetch(url, options);
    return res;
  } catch (err) {
    if (retries === 0) throw err;

    console.log("Retrying request...");
    await new Promise((r) => setTimeout(r, 2000));

    return fetchWithRetry(url, options, retries - 1);
  }
};

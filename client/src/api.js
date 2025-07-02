const API_URL = "http://localhost:8080/api";

export async function listLogEntries() {
  const response = await fetch(`${API_URL}/logs`);
  return response.json();
}

// async function createLogEntry(entry) {
//   const response = await fetch(`${API_URL}/logs`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });
//   return response.json();
// }

// async function deleteLogEntry(id) {
//   const response = await fetch(`${API_URL}/logs/${id}`, {
//     method: "DELETE",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });
//   return response.json();
// }

// async function editLogEntry(id, updatedEntry) {
//   const response = await fetch(`${API_URL}/logs/${id}`, {
//     method: "PUT",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });
//   return response.json();
// }

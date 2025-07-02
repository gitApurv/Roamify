const API_URL = "http://localhost:8080/api";

export async function listLogEntries() {
  const response = await fetch(`${API_URL}/logs`);
  return response.json();
}

export async function createLogEntry(entry) {
  const response = await fetch(`${API_URL}/logs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(entry),
  });
  return response.json();
}

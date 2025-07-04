const API_URL = `${import.meta.env.VITE_APP_BASE_URL}/api`;

export async function listLogEntries() {
  try {
    const response = await fetch(`${API_URL}/get-logs`, {
      credentials: "include",
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.message || "Something went wrong");
    }
    return await response.json();
  } catch (err) {
    console.error("Fetch error:", err);
    throw err;
  }
}

export async function createLogEntry(entry) {
  const response = await fetch(`${API_URL}/create-logs`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(entry),
  });
  return response.json();
}

export async function loginUser(credentials) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  return response.json();
}

export async function signupUser(credentials) {
  const response = await fetch(`${API_URL}/signup`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  return response.json();
}

export async function logout() {
  const response = await fetch(`${API_URL}/logout`, {
    credentials: "include",
  });
  return response.json();
}

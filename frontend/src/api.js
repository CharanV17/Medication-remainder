import { API_URL } from "./config";

export async function login(email, password) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  return res.json();
}

export async function getMedications(token) {
  const res = await fetch(`${API_URL}/api/medications`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
}

export async function addMedication(token, medication) {
  const res = await fetch(`${API_URL}/api/medications`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(medication),
  });
  return res.json();
}

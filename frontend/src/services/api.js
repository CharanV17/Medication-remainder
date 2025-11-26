const API_URL = 'http://localhost:3000/api'

export const api = {
  login: async (email, password) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    return res.json()
  },

  register: async (name, email, password) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    })
    return res.json()
  },

  getMedications: async (token) => {
    const res = await fetch(`${API_URL}/medications`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return res.json()
  },

  addMedication: async (token, data) => {
    const res = await fetch(`${API_URL}/medications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(data)
    })
    return res.json()
  },

  deleteMedication: async (token, id) => {
    const res = await fetch(`${API_URL}/medications/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    return res.json()
  },

  getReminders: async (token) => {
    const res = await fetch(`${API_URL}/reminders`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return res.json()
  },

  addReminder: async (token, data) => {
    const res = await fetch(`${API_URL}/reminders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(data)
    })
    return res.json()
  },

  deleteReminder: async (token, id) => {
    const res = await fetch(`${API_URL}/reminders/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    return res.json()
  },

  updateMedication: async (token, id, data) => {
    const res = await fetch(`${API_URL}/medications/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(data)
    })
    return res.json()
  },

  updateReminder: async (token, id, data) => {
    const res = await fetch(`${API_URL}/reminders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(data)
    })
    return res.json()
  }
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api"

// 🧠 Login user
export async function login(email: string, password: string) {
  if (!email || !password) {
    throw new Error("Email and password are required")
  }

  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })

  if (!res.ok) {
    throw new Error("Invalid email or password")
  }

  const data = await res.json()
  const token = data.token

  if (!token) throw new Error("Token missing in response")

  // Store token locally
  localStorage.setItem("token", token)
  localStorage.setItem("userEmail", email)

  return { token, email }
}

// 🧠 Register user
export async function register(email: string, password: string, name: string, householdName?: string) {
  if (!email || !password || !name) {
    throw new Error("All fields are required")
  }

  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  })

  if (!res.ok) {
    throw new Error("Registration failed")
  }

  const data = await res.json()

  // Optionally auto-login after registration
  const loginRes = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })

  const loginData = await loginRes.json()
  const token = loginData.token

  if (token) {
    localStorage.setItem("token", token)
    localStorage.setItem("userEmail", email)
  }

  return data
}

// 🧠 Logout
export function logout() {
  localStorage.removeItem("token")
  localStorage.removeItem("userEmail")
}

// 🧠 Get JWT
export function getToken() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token")
  }
  return null
}

// 🧠 Get current user info from backend (optional)
export async function getCurrentUser() {
  const token = getToken()
  if (!token) return null

  const res = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!res.ok) return null

  return res.json()
}

// 🧠 Auth state helper
export function isAuthenticated() {
  return !!getToken()
}

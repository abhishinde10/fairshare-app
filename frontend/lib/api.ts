/*import { mockDataStore } from "./mock-data"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api"


function getHeaders() {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  }
}


// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

function generateId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export async function apiCall(endpoint: string, options: RequestInit = {}) {
  // For development, use mock data instead of making real API calls
  await delay(300) // Simulate network delay

  const method = options.method || "GET"
  const body = options.body ? JSON.parse(options.body) : null

  console.log("[v0] API Call:", method, endpoint, body)

  if (method === "GET") {
    if (endpoint === "/resources") {
      return mockDataStore.resources
    }
    if (endpoint === "/bookings") {
      return mockDataStore.bookings
    }
    if (endpoint === "/chores") {
      return mockDataStore.chores
    }
    if (endpoint === "/bills") {
      return mockDataStore.bills
    }
    if (endpoint === "/energy") {
      return mockDataStore.energyReadings
    }
    if (endpoint === "/alerts") {
      return mockDataStore.alerts
    }
    if (endpoint === "/household") {
      return { id: "household-1", name: "Cozy Apartment", members: ["user-1", "user-2", "user-3"] }
    }
  }

  if (method === "POST") {
    if (endpoint === "/resources") {
      const newResource = {
        id: generateId("res"),
        ...body,
        householdId: "household-1",
        createdBy: "user-1",
        createdAt: new Date().toISOString(),
      }
      mockDataStore.resources.push(newResource)
      console.log("[v0] Resource created:", newResource)
      return newResource
    }
    if (endpoint === "/bookings") {
      const newBooking = {
        id: generateId("book"),
        ...body,
        status: "pending",
        createdAt: new Date().toISOString(),
      }
      mockDataStore.bookings.push(newBooking)
      console.log("[v0] Booking created:", newBooking)
      return newBooking
    }
    if (endpoint === "/chores") {
      const newChore = {
        id: generateId("chore"),
        ...body,
        householdId: "household-1",
        createdAt: new Date().toISOString(),
      }
      mockDataStore.chores.push(newChore)
      console.log("[v0] Chore created:", newChore)
      return newChore
    }
    if (endpoint === "/bills") {
      const newBill = {
        id: generateId("bill"),
        ...body,
        householdId: "household-1",
        createdBy: "user-1",
        createdAt: new Date().toISOString(),
      }
      mockDataStore.bills.push(newBill)
      console.log("[v0] Bill created:", newBill)
      return newBill
    }
    if (endpoint === "/energy") {
      const newReading = {
        id: generateId("energy"),
        ...body,
        householdId: "household-1",
        createdAt: new Date().toISOString(),
      }
      mockDataStore.energyReadings.push(newReading)
      console.log("[v0] Energy reading created:", newReading)
      return newReading
    }
  }

  if (method === "PUT") {
    if (endpoint.startsWith("/bookings/")) {
      const id = endpoint.split("/")[2]
      const booking = mockDataStore.bookings.find((b) => b.id === id)
      if (booking) {
        Object.assign(booking, body)
        console.log("[v0] Booking updated:", booking)
        return booking
      }
    }
    if (endpoint.startsWith("/chores/")) {
      const id = endpoint.split("/")[2]
      const chore = mockDataStore.chores.find((c) => c.id === id)
      if (chore) {
        Object.assign(chore, body)
        console.log("[v0] Chore updated:", chore)
        return chore
      }
    }
    if (endpoint.startsWith("/bills/")) {
      const id = endpoint.split("/")[2]
      const bill = mockDataStore.bills.find((b) => b.id === id)
      if (bill) {
        Object.assign(bill, body)
        console.log("[v0] Bill updated:", bill)
        return bill
      }
    }
    if (endpoint.startsWith("/alerts/")) {
      const id = endpoint.split("/")[2]
      const alert = mockDataStore.alerts.find((a) => a.id === id)
      if (alert) {
        Object.assign(alert, body)
        console.log("[v0] Alert updated:", alert)
        return alert
      }
    }
  }

  if (method === "DELETE") {
    if (endpoint.startsWith("/resources/")) {
      const id = endpoint.split("/")[2]
      const index = mockDataStore.resources.findIndex((r) => r.id === id)
      if (index > -1) {
        mockDataStore.resources.splice(index, 1)
        console.log("[v0] Resource deleted:", id)
        return { success: true }
      }
    }
    if (endpoint.startsWith("/bookings/")) {
      const id = endpoint.split("/")[2]
      const index = mockDataStore.bookings.findIndex((b) => b.id === id)
      if (index > -1) {
        mockDataStore.bookings.splice(index, 1)
        console.log("[v0] Booking deleted:", id)
        return { success: true }
      }
    }
    if (endpoint.startsWith("/chores/")) {
      const id = endpoint.split("/")[2]
      const index = mockDataStore.chores.findIndex((c) => c.id === id)
      if (index > -1) {
        mockDataStore.chores.splice(index, 1)
        console.log("[v0] Chore deleted:", id)
        return { success: true }
      }
    }
    if (endpoint.startsWith("/bills/")) {
      const id = endpoint.split("/")[2]
      const index = mockDataStore.bills.findIndex((b) => b.id === id)
      if (index > -1) {
        mockDataStore.bills.splice(index, 1)
        console.log("[v0] Bill deleted:", id)
        return { success: true }
      }
    }
    if (endpoint.startsWith("/energy/")) {
      const id = endpoint.split("/")[2]
      const index = mockDataStore.energyReadings.findIndex((e) => e.id === id)
      if (index > -1) {
        mockDataStore.energyReadings.splice(index, 1)
        console.log("[v0] Energy reading deleted:", id)
        return { success: true }
      }
    }
  }

  return { success: true }
}

export const api = {
  // Resources
  getResources: () => apiCall("/resources"),
  getResource: (id: string) => apiCall(`/resources/${id}`),
  createResource: (data: any) => apiCall("/resources", { method: "POST", body: JSON.stringify(data) }),
  updateResource: (id: string, data: any) => apiCall(`/resources/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteResource: (id: string) => apiCall(`/resources/${id}`, { method: "DELETE" }),

  // Bookings
  getBookings: () => fetch(`${API_BASE_URL}/bookings`).then(res => res.json()),
createBooking: (data: any) => fetch(`${API_BASE_URL}/bookings`, { method: "POST", headers: getHeaders(), body: JSON.stringify(data) }).then(res => res.json()),
updateBooking: (id: string, data: any) => fetch(`${API_BASE_URL}/bookings/${id}`, { method: "PUT", headers: getHeaders(), body: JSON.stringify(data) }).then(res => res.json()),
deleteBooking: (id: string) => fetch(`${API_BASE_URL}/bookings/${id}`, { method: "DELETE", headers: getHeaders() }).then(res => res.json()),


  // Chores
  getChores: () => apiCall("/chores"),
  getChore: (id: string) => apiCall(`/chores/${id}`),
  createChore: (data: any) => apiCall("/chores", { method: "POST", body: JSON.stringify(data) }),
  updateChore: (id: string, data: any) => apiCall(`/chores/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteChore: (id: string) => apiCall(`/chores/${id}`, { method: "DELETE" }),

  // Bills
  getBills: () => apiCall("/bills"),
  getBill: (id: string) => apiCall(`/bills/${id}`),
  createBill: (data: any) => apiCall("/bills", { method: "POST", body: JSON.stringify(data) }),
  updateBill: (id: string, data: any) => apiCall(`/bills/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteBill: (id: string) => apiCall(`/bills/${id}`, { method: "DELETE" }),

  // Energy
  getEnergyReadings: () => apiCall("/energy"),
  createEnergyReading: (data: any) => apiCall("/energy", { method: "POST", body: JSON.stringify(data) }),
  deleteEnergyReading: (id: string) => apiCall(`/energy/${id}`, { method: "DELETE" }),

  // Alerts
  getAlerts: () => apiCall("/alerts"),
  markAlertAsRead: (id: string) => apiCall(`/alerts/${id}/read`, { method: "PUT" }),

  // Household
  getHousehold: () => apiCall("/household"),
  updateHousehold: (data: any) => apiCall("/household", { method: "PUT", body: JSON.stringify(data) }),
  addMember: (email: string) => apiCall("/household/members", { method: "POST", body: JSON.stringify({ email }) }),
}
*/
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api"

function getHeaders() {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  }
}


// ✅ Bookings & Resources connected to backend
export const api = {
  // 📘 Resources
  getResources: () =>
    fetch(`${API_BASE_URL}/resources`, { headers: getHeaders() }).then((res) => res.json()),

  getResource: (id: string) =>
    fetch(`${API_BASE_URL}/resources/${id}`, { headers: getHeaders() }).then((res) => res.json()),

  createResource: (data: any) =>
    fetch(`${API_BASE_URL}/resources`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then((res) => res.json()),

  updateResource: (id: string, data: any) =>
    fetch(`${API_BASE_URL}/resources/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then((res) => res.json()),

  deleteResource: (id: string) =>
    fetch(`${API_BASE_URL}/resources/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    }).then((res) => res.json()),

  // 📘 Bookings
  getBookings: () =>
    fetch(`${API_BASE_URL}/bookings`, { headers: getHeaders() }).then((res) => res.json()),

  getBooking: (id: string) =>
    fetch(`${API_BASE_URL}/bookings/${id}`, { headers: getHeaders() }).then((res) => res.json()),

  createBooking: (data: any) =>
    fetch(`${API_BASE_URL}/bookings`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then((res) => res.json()),

  updateBooking: (id: string, data: any) =>
    fetch(`${API_BASE_URL}/bookings/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then((res) => res.json()),

  deleteBooking: (id: string) =>
    fetch(`${API_BASE_URL}/bookings/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    }).then((res) => res.json()),
    // Bills (REAL API)
getBills: () =>
  fetch(`${API_BASE_URL}/bills`, { headers: getHeaders() }).then((res) => res.json()),
getBill: (id: string) =>
  fetch(`${API_BASE_URL}/bills/${id}`, { headers: getHeaders() }).then((res) => res.json()),
createBill: (data: any) =>
  fetch(`${API_BASE_URL}/bills`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data), // { title, amount(number), dueDate(YYYY-MM-DD), category, (optional) splitCount }
  }).then((res) => res.json()),
updateBill: (id: string, data: any) =>
  fetch(`${API_BASE_URL}/bills/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data), // { status: "paid" | "pending" }
  }).then((res) => res.json()),
deleteBill: (id: string) =>
  fetch(`${API_BASE_URL}/bills/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  }).then((res) => res.json()),
   // 💡 Chores (REAL API)
  getChores: () =>
    fetch(`${API_BASE_URL}/chores`, { headers: getHeaders() }).then((res) => res.json()),

  createChore: (data: any) =>
    fetch(`${API_BASE_URL}/chores`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data), // { title, description, dueDate, frequency }
    }).then((res) => res.json()),

  updateChore: (id: string, data: any) =>
    fetch(`${API_BASE_URL}/chores/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data), // { status: "in-progress" | "completed" }
    }).then((res) => res.json()),

  deleteChore: (id: string) =>
    fetch(`${API_BASE_URL}/chores/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    }).then((res) => res.json()),
 // ✅ Energy API Integration
getEnergyReadings: async () => {
  const res = await fetch(`${API_BASE_URL}/energy`, { headers: getHeaders() })
  if (!res.ok) throw new Error("Failed to fetch energy readings")
  return res.json()
},

createEnergyReading: async (data: any) => {
  const res = await fetch(`${API_BASE_URL}/energy`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Failed to create energy reading")
  return res.json()
},

deleteEnergyReading: async (id: string) => {
  const res = await fetch(`${API_BASE_URL}/energy/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  })
  if (!res.ok && res.status !== 204) throw new Error("Failed to delete energy reading")
  return { success: true }
},

getEnergyAnalytics: async () => {
  const res = await fetch(`${API_BASE_URL}/energy/analytics`, { headers: getHeaders() })
  if (!res.ok) throw new Error("Failed to fetch energy analytics")
  return res.json()
},





// (optional) Optimization helper if you add a UI later:
optimizeEnergyPlan: (payload: any) =>
  fetch(`${API_BASE_URL}/energy/optimize`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(payload), // { limit, scale?, items:[{name, units, benefit}] }
  }).then((res) => res.json()),
  // Behavior Tracking
getBehaviors: () =>
  fetch(`${API_BASE_URL}/behavior`, { headers: getHeaders() }).then((res) => res.json()),

updateBehavior: (data: any) =>
  fetch(`${API_BASE_URL}/behavior/update`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data), // { name, email, scoreDelta }
  }).then((res) => res.json()),

getTopBehaviors: (k = 3) =>
  fetch(`${API_BASE_URL}/behavior/top?k=${k}`, { headers: getHeaders() }).then((res) => res.json()),



      // 🧍 Roommates Module
  getRoommates: () =>
    fetch(`${API_BASE_URL}/roommates`, { headers: getHeaders() }).then((res) => res.json()),

  addRoommate: (data: any) =>
    fetch(`${API_BASE_URL}/roommates`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then((res) => res.json()),

  deleteRoommate: (id: string) =>
    fetch(`${API_BASE_URL}/roommates/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    }).then((res) => res.json()),

  getTopRoommates: (n = 5) =>
    fetch(`${API_BASE_URL}/roommates/top?n=${n}`, { headers: getHeaders() }).then((res) => res.json()),


  // ✅ Admin APIs

getHousehold: async () => {
  const res = await fetch(`${API_BASE_URL}/admin/household`, { headers: getHeaders() })
  if (!res.ok) throw new Error("Failed to fetch household data")
  return res.json()
},

deleteMember: async (id: string) => {
  const res = await fetch(`${API_BASE_URL}/admin/member/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  })
  if (res.status === 204) return { success: true }
  if (!res.ok) throw new Error("Failed to delete member")
  return res.json()
},
getAdminDashboard: async () =>
  fetch(`${API_BASE_URL}/admin/dashboard`, { headers: getHeaders() }).then((res) => res.json()),


addMember: async (email: string) =>
  fetch(`${API_BASE_URL}/admin/member`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ email }),
  }).then((res) => res.json()),


}



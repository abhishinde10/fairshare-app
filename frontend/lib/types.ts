// Core types for FairShare++ application

export interface User {
  id: string
  email: string
  name: string
  role: "user" | "admin"
  householdId: string
  createdAt: string
}

export interface AuthResponse {
  user: User
  token: string
}

export interface Resource {
  id: string
  name: string
  description: string
  category: "kitchen" | "bathroom" | "living-room" | "bedroom" | "outdoor" | "other"
  householdId: string
  createdBy: string
  createdAt: string
}

export interface Booking {
  id: string
  resourceId: string
  userId: string
  startTime: string
  endTime: string
  status: "pending" | "confirmed" | "cancelled"
  createdAt: string
}

export interface Chore {
  id: string
  title: string
  description: string
  assignedTo: string
  dueDate: string
  status: "pending" | "in-progress" | "completed"
  frequency: "once" | "daily" | "weekly" | "monthly"
  householdId: string
  createdAt: string
}

export interface Bill {
  id: string
  title: string
  amount: number
  dueDate: string
  category: "utilities" | "rent" | "groceries" | "other"
  householdId: string
  createdBy: string
  splits: BillSplit[]
  status: "pending" | "paid"
  createdAt: string
}

export interface BillSplit {
  userId: string
  amount: number
  paid: boolean
}

export interface EnergyReading {
  id: string
  householdId: string
  date: string
  consumption: number
  cost: number
  createdAt: string
}

export interface Alert {
  id: string
  userId: string
  type: "booking" | "chore" | "bill" | "energy" | "system"
  title: string
  message: string
  read: boolean
  createdAt: string
}

export interface Household {
  id: string
  name: string
  members: string[]
  createdAt: string
}

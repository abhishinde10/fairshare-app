// Mock data for development - simulates backend API responses
import type { Resource, Booking, Chore, Bill, EnergyReading, Alert, Household, User } from "./types"

export const mockUser: User = {
  id: "user-1",
  email: "user@example.com",
  name: "John Doe",
  role: "user",
  householdId: "household-1",
  createdAt: new Date().toISOString(),
}

export const mockHousehold: Household = {
  id: "household-1",
  name: "Cozy Apartment",
  members: ["user-1", "user-2", "user-3"],
  createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
}

export const mockDataStore = {
  resources: [
    {
      id: "res-1",
      name: "Living Room TV",
      description: "65-inch Smart TV for movie nights",
      category: "living-room",
      householdId: "household-1",
      createdBy: "user-1",
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "res-2",
      name: "Kitchen Blender",
      description: "High-power blender for smoothies",
      category: "kitchen",
      householdId: "household-1",
      createdBy: "user-1",
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "res-3",
      name: "Bathroom Scale",
      description: "Digital bathroom scale",
      category: "bathroom",
      householdId: "household-1",
      createdBy: "user-2",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ] as Resource[],
  bookings: [
    {
      id: "book-1",
      resourceId: "res-1",
      userId: "user-2",
      startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(),
      status: "pending",
      createdAt: new Date().toISOString(),
    },
    {
      id: "book-2",
      resourceId: "res-2",
      userId: "user-1",
      startTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
      endTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000 + 1 * 60 * 60 * 1000).toISOString(),
      status: "confirmed",
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ] as Booking[],
  chores: [
    {
      id: "chore-1",
      title: "Clean Kitchen",
      description: "Wipe counters, clean sink, sweep floor",
      assignedTo: "user-1",
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
      status: "pending",
      frequency: "weekly",
      householdId: "household-1",
      createdAt: new Date().toISOString(),
    },
    {
      id: "chore-2",
      title: "Vacuum Living Room",
      description: "Vacuum all carpeted areas",
      assignedTo: "user-2",
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      status: "in-progress",
      frequency: "weekly",
      householdId: "household-1",
      createdAt: new Date().toISOString(),
    },
    {
      id: "chore-3",
      title: "Take Out Trash",
      description: "Empty all trash bins",
      assignedTo: "user-3",
      dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      status: "completed",
      frequency: "weekly",
      householdId: "household-1",
      createdAt: new Date().toISOString(),
    },
  ] as Chore[],
  bills: [
    {
      id: "bill-1",
      title: "Electricity Bill",
      amount: 120,
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      category: "utilities",
      householdId: "household-1",
      createdBy: "user-1",
      splits: [
        { userId: "user-1", amount: 40, paid: true },
        { userId: "user-2", amount: 40, paid: false },
        { userId: "user-3", amount: 40, paid: false },
      ],
      status: "pending",
      createdAt: new Date().toISOString(),
    },
    {
      id: "bill-2",
      title: "Internet Bill",
      amount: 60,
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      category: "utilities",
      householdId: "household-1",
      createdBy: "user-1",
      splits: [
        { userId: "user-1", amount: 20, paid: true },
        { userId: "user-2", amount: 20, paid: true },
        { userId: "user-3", amount: 20, paid: true },
      ],
      status: "paid",
      createdAt: new Date().toISOString(),
    },
  ] as Bill[],
  energyReadings: [
    {
      id: "energy-1",
      householdId: "household-1",
      date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      consumption: 25.5,
      cost: 3.06,
      createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "energy-2",
      householdId: "household-1",
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      consumption: 28.2,
      cost: 3.38,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "energy-3",
      householdId: "household-1",
      date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      consumption: 22.1,
      cost: 2.65,
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "energy-4",
      householdId: "household-1",
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      consumption: 31.8,
      cost: 3.82,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "energy-5",
      householdId: "household-1",
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      consumption: 26.4,
      cost: 3.17,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "energy-6",
      householdId: "household-1",
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      consumption: 29.7,
      cost: 3.56,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ] as EnergyReading[],
  alerts: [
    {
      id: "alert-1",
      userId: "user-1",
      type: "booking",
      title: "Booking Pending",
      message: "Your booking for Living Room TV is pending confirmation",
      read: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: "alert-2",
      userId: "user-1",
      type: "bill",
      title: "Bill Due Soon",
      message: "Electricity bill is due in 5 days",
      read: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: "alert-3",
      userId: "user-1",
      type: "chore",
      title: "Chore Assigned",
      message: "You have been assigned to clean the kitchen",
      read: true,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ] as Alert[],
}

export const mockResources = mockDataStore.resources
export const mockBookings = mockDataStore.bookings
export const mockChores = mockDataStore.chores
export const mockBills = mockDataStore.bills
export const mockEnergyReadings = mockDataStore.energyReadings
export const mockAlerts = mockDataStore.alerts

"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"
import type { Booking, Chore, Bill, Alert, Resource } from "@/lib/types"
import { AlertCircle, CheckCircle2, Clock, DollarSign } from "lucide-react"

export default function DashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [resources, setResources] = useState<Resource[]>([])
  const [chores, setChores] = useState<Chore[]>([])
  const [bills, setBills] = useState<Bill[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // ✅ Load all modules
  useEffect(() => {
    async function loadData() {
      try {
        const [bookingsData, resourcesData, choresData, billsData, alertsData] = await Promise.all([
          api.getBookings?.().catch(() => []),
          api.getResources?.().catch(() => []),
          api.getChores?.().catch(() => []),
          api.getBills?.().catch(() => []),
          api.getAlerts?.() ? api.getAlerts().catch(() => []) : [],
        ])

        setBookings(Array.isArray(bookingsData) ? bookingsData : [])
        setResources(Array.isArray(resourcesData) ? resourcesData : [])
        setChores(Array.isArray(choresData) ? choresData : [])
        setBills(Array.isArray(billsData) ? billsData : [])
        setAlerts(Array.isArray(alertsData) ? alertsData : [])
      } catch (error) {
        console.error("Failed to load dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  // ✅ Helper: Get resource name by ID
  function getResourceName(resourceId: number | string | undefined) {
    const found = resources.find((r) => String(r.id) === String(resourceId))
    return found ? found.name : "Unknown Resource"
  }

  // ✅ Stats
  const pendingBookings = bookings.filter((b) => b.status === "pending").length
  const pendingChores = chores.filter((c) => c.status === "pending").length
  const pendingBills = bills.filter((b) => b.status === "pending").length
  const unreadAlerts = alerts.filter((a) => !a.read).length

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading dashboard data...</p>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back! Here's your household overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Bookings</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingBookings}</div>
            <p className="text-xs text-muted-foreground">Awaiting confirmation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Chores</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingChores}</div>
            <p className="text-xs text-muted-foreground">Tasks to complete</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Bills</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingBills}</div>
            <p className="text-xs text-muted-foreground">Bills awaiting payment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread Alerts</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unreadAlerts}</div>
            <p className="text-xs text-muted-foreground">Notifications</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>Your latest resource bookings</CardDescription>
          </CardHeader>
          <CardContent>
            {bookings.length === 0 ? (
              <p className="text-sm text-muted-foreground">No bookings yet</p>
            ) : (
              <div className="space-y-4">
                {bookings.slice(0, 5).map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg"
                  >
                    <div>
                      {/* ✅ Booking number + resource name */}
                      <p className="text-sm font-medium">
                        Booking #{String(booking.id)} — {getResourceName(booking.resourceId)}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {booking.status || "unknown"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(booking.startTime).toLocaleString()} -{" "}
                        {new Date(booking.endTime).toLocaleString()}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Chores */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Chores</CardTitle>
            <CardDescription>Your assigned tasks</CardDescription>
          </CardHeader>
          <CardContent>
            {chores.length === 0 ? (
              <p className="text-sm text-muted-foreground">No chores assigned</p>
            ) : (
              <div className="space-y-4">
                {chores.slice(0, 5).map((chore) => (
                  <div
                    key={chore.id}
                    className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-medium">{chore.title}</p>
                      <p className="text-xs text-muted-foreground">
                        Due:{" "}
                        {chore.dueDate
                          ? new Date(chore.dueDate).toLocaleDateString()
                          : "No date"}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Update
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

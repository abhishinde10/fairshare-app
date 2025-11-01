"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"
import type { Booking, Resource } from "@/lib/types"
import { Plus, Trash2, CheckCircle2, XCircle } from "lucide-react"
import { BookingForm } from "@/components/booking-form"

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [resources, setResources] = useState<Resource[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  // ✅ Load both bookings and resources
  async function loadData() {
    try {
      console.log("[v0] Loading bookings and resources...")
      const [bookingsData, resourcesData] = await Promise.all([
        api.getBookings(),
        api.getResources(),
      ])
      setBookings(Array.isArray(bookingsData) ? bookingsData : [])
      setResources(Array.isArray(resourcesData) ? resourcesData : [])
    } catch (error) {
      console.error("[v0] Failed to load data:", error)
      setBookings([])
      setResources([])
    } finally {
      setIsLoading(false)
    }
  }

  // ✅ Create a new booking
  async function handleCreateBooking(formData: any) {
    setIsSubmitting(true)
    try {
      await api.createBooking(formData)
      await loadData()
      setShowForm(false)
    } catch (error) {
      console.error("[v0] Failed to create booking:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // ✅ Update booking status
  async function handleUpdateBooking(id: string, status: string) {
    try {
      await api.updateBooking(id, { status })
      await loadData()
    } catch (error) {
      console.error("[v0] Failed to update booking:", error)
    }
  }

  // ✅ Delete booking
  async function handleDeleteBooking(id: string) {
    if (confirm("Are you sure you want to delete this booking?")) {
      try {
        await api.deleteBooking(id)
        await loadData()
      } catch (error) {
        console.error("[v0] Failed to delete booking:", error)
      }
    }
  }

  // ✅ Helper: Get resource name by ID
  function getResourceName(resourceId: number | string | undefined) {
    const found = resources.find((r) => String(r.id) === String(resourceId))
    return found ? found.name : "Unknown Resource"
  }

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Bookings</h1>
          <p className="text-muted-foreground mt-2">View and manage resource bookings</p>
        </div>
        <Button className="gap-2" onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4" />
          {showForm ? "Cancel" : "New Booking"}
        </Button>
      </div>

      {showForm && (
        <BookingForm
          resources={resources}
          onSubmit={handleCreateBooking}
          isLoading={isSubmitting}
        />
      )}

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading bookings...</p>
        </div>
      ) : bookings.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">No bookings yet</p>
            <Button onClick={() => setShowForm(true)}>Create First Booking</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <Card key={booking.id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    {/* ✅ Show booking ID and resource name */}
                    <p className="font-medium">
                      Booking #{String(booking.id)} — {getResourceName(booking.resourceId)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(booking.startTime).toLocaleString()} -{" "}
                      {new Date(booking.endTime).toLocaleString()}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      statusColors[booking.status] || statusColors.pending
                    }`}
                  >
                    {booking.status}
                  </span>

                  <div className="flex gap-2">
                    {booking.status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateBooking(booking.id, "confirmed")}
                          className="gap-1"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Confirm
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateBooking(booking.id, "cancelled")}
                          className="gap-1 text-destructive"
                        >
                          <XCircle className="w-4 h-4" />
                          Cancel
                        </Button>
                      </>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteBooking(booking.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

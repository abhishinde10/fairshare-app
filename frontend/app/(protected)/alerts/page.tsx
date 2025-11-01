"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"
import type { Alert } from "@/lib/types"

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadAlerts() {
      try {
        const data = await api.getAlerts().catch(() => [])
        setAlerts(data)
      } catch (error) {
        console.error("Failed to load alerts:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadAlerts()
  }, [])

  const typeColors: Record<string, string> = {
    booking: "bg-blue-100 text-blue-800",
    chore: "bg-purple-100 text-purple-800",
    bill: "bg-orange-100 text-orange-800",
    energy: "bg-green-100 text-green-800",
    system: "bg-gray-100 text-gray-800",
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Alerts & Notifications</h1>
        <p className="text-muted-foreground mt-2">Stay updated with household notifications</p>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading alerts...</p>
        </div>
      ) : alerts.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">No alerts at this time</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <Card key={alert.id} className={alert.read ? "opacity-60" : ""}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${typeColors[alert.type] || typeColors.system}`}
                      >
                        {alert.type}
                      </span>
                      {!alert.read && <span className="w-2 h-2 bg-primary rounded-full"></span>}
                    </div>
                    <p className="font-medium">{alert.title}</p>
                    <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
                    <p className="text-xs text-muted-foreground mt-2">{new Date(alert.createdAt).toLocaleString()}</p>
                  </div>
                  {!alert.read && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        api.markAlertAsRead(alert.id)
                        setAlerts(alerts.map((a) => (a.id === alert.id ? { ...a, read: true } : a)))
                      }}
                    >
                      Mark Read
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

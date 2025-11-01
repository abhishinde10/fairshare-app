"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"
import type { EnergyReading } from "@/lib/types"
import { Plus, Trash2, TrendingUp } from "lucide-react"
import { EnergyForm } from "@/components/energy-form"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

export default function EnergyPage() {
  const [readings, setReadings] = useState<EnergyReading[]>([])
  const [analytics, setAnalytics] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // ✅ Load readings & analytics on mount
  useEffect(() => {
    loadEnergyData()
  }, [])

  async function loadEnergyData() {
    try {
      const [readingsData, analyticsData] = await Promise.all([
        api.getEnergyReadings().catch(() => []),
        api.getEnergyAnalytics?.().catch(() => null),
      ])

      console.log("✅ Energy readings:", readingsData)
      console.log("✅ Analytics:", analyticsData)

      setReadings(Array.isArray(readingsData) ? readingsData : [])
      setAnalytics(analyticsData)
    } catch (error) {
      console.error("❌ Failed to load energy data:", error)
      setReadings([])
      setAnalytics(null)
    } finally {
      setIsLoading(false)
    }
  }

  // ✅ Create new energy reading
  async function handleCreateReading(formData: any) {
    setIsSubmitting(true)
    try {
      await api.createEnergyReading({
        device: formData.device,
        category: formData.category,
        units: parseFloat(formData.units) || 0,
        costPerUnit: parseFloat(formData.costPerUnit) || 0,
      })
      await loadEnergyData()
      setShowForm(false)
    } catch (error) {
      console.error("❌ Failed to create reading:", error)
      alert("Error: Could not save energy reading.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // ✅ Delete a reading
  async function handleDeleteReading(id: string) {
    if (!confirm("Are you sure you want to delete this reading?")) return
    try {
      await api.deleteEnergyReading(id)
      await loadEnergyData()
    } catch (error) {
      console.error("❌ Failed to delete reading:", error)
    }
  }

  // ✅ Derived values (fallback if analytics not available)
  const totalConsumption =
    analytics?.totalUnits ?? readings.reduce((sum, r) => sum + (r.units ?? 0), 0)
  const totalCost =
    analytics?.totalCost ?? readings.reduce((sum, r) => sum + (r.totalCost ?? 0), 0)
  const avgConsumption =
    analytics?.avgUnits ?? (readings.length ? totalConsumption / readings.length : 0)
  const avgCost =
    analytics?.avgCost ?? (readings.length ? totalCost / readings.length : 0)

  // ✅ Prepare chart data
  const chartData = readings
    .filter((r) => r.createdAt)
    .sort((a, b) => new Date(a.createdAt || "").getTime() - new Date(b.createdAt || "").getTime())
    .map((r) => ({
      date: new Date(r.createdAt || "").toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      consumption: r.units ?? 0,
      cost: r.totalCost ?? 0,
    }))

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Energy Tracking</h1>
          <p className="text-muted-foreground mt-2">
            Monitor household energy consumption and costs
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus className="w-4 h-4" />
          {showForm ? "Cancel" : "Log Reading"}
        </Button>
      </div>

      {/* Form */}
      {showForm && <EnergyForm onSubmit={handleCreateReading} isLoading={isSubmitting} />}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Consumption</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {totalConsumption.toFixed(2)} kWh
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Cost</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            ₹{totalCost.toFixed(2)}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Consumption</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {avgConsumption.toFixed(2)} kWh
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Cost</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            ₹{avgCost.toFixed(2)}
          </CardContent>
        </Card>
      </div>

      {/* Main Section */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading energy data...</p>
        </div>
      ) : readings.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">No energy readings recorded</p>
            <Button onClick={() => setShowForm(true)}>Log First Reading</Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Energy Consumption Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="consumption"
                      stroke="#8b5cf6"
                      name="Consumption (kWh)"
                    />
                    <Line
                      type="monotone"
                      dataKey="cost"
                      stroke="#ec4899"
                      name="Cost (₹)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-muted-foreground">No chart data available</p>
              )}
            </CardContent>
          </Card>

          {/* Recent Readings */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Recent Readings</h2>
            {readings
              .sort(
                (a, b) =>
                  new Date(b.createdAt || 0).getTime() -
                  new Date(a.createdAt || 0).getTime()
              )
              .map((r) => (
                <Card key={r.id}>
                  <CardContent className="flex justify-between items-center py-4">
                    <div>
                      <p className="font-medium">{r.device}</p>
                      <p className="text-sm text-muted-foreground">
                        {r.createdAt
                          ? new Date(r.createdAt).toLocaleDateString()
                          : "No Date"}{" "}
                        — {r.units ?? 0} kWh — ₹{(r.totalCost ?? 0).toFixed(2)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={() => handleDeleteReading(r.id.toString())}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
          </div>
        </>
      )}
    </div>
  )
}

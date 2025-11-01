"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface EnergyFormProps {
  onSubmit: (data: any) => Promise<void>
  isLoading?: boolean
}

export function EnergyForm({ onSubmit, isLoading = false }: EnergyFormProps) {
  const [formData, setFormData] = useState({
    device: "",
    category: "",
    units: "",
    costPerUnit: "",
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!formData.device || !formData.category || !formData.units || !formData.costPerUnit) {
      alert("Please fill in all fields before submitting.")
      return
    }

    await onSubmit({
      device: formData.device,
      category: formData.category,
      units: parseFloat(formData.units),
      costPerUnit: parseFloat(formData.costPerUnit),
    })

    setFormData({ device: "", category: "", units: "", costPerUnit: "" })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Log New Energy Reading</CardTitle>
        <CardDescription>Record your energy usage details for a household device</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Device Name */}
          <div className="space-y-2">
            <label htmlFor="device" className="text-sm font-medium">
              Device Name
            </label>
            <Input
              id="device"
              placeholder="e.g. Fan, Air Conditioner, Refrigerator"
              value={formData.device}
              onChange={(e) => setFormData({ ...formData, device: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label htmlFor="category" className="text-sm font-medium">
              Category
            </label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger id="category" disabled={isLoading}>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Kitchen">Kitchen</SelectItem>
                <SelectItem value="Bedroom">Bedroom</SelectItem>
                <SelectItem value="Living Room">Living Room</SelectItem>
                <SelectItem value="Bathroom">Bathroom</SelectItem>
                <SelectItem value="Outdoor">Outdoor</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Units */}
          <div className="space-y-2">
            <label htmlFor="units" className="text-sm font-medium">
              Units (kWh)
            </label>
            <Input
              id="units"
              type="number"
              step="0.01"
              placeholder="e.g. 5.5"
              value={formData.units}
              onChange={(e) => setFormData({ ...formData, units: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>

          {/* Cost Per Unit */}
          <div className="space-y-2">
            <label htmlFor="costPerUnit" className="text-sm font-medium">
              Cost per Unit (₹)
            </label>
            <Input
              id="costPerUnit"
              type="number"
              step="0.01"
              placeholder="e.g. 8.5"
              value={formData.costPerUnit}
              onChange={(e) => setFormData({ ...formData, costPerUnit: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Saving..." : "Add Reading"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

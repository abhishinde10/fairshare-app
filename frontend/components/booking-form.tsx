"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Resource } from "@/lib/types"

interface BookingFormProps {
  resources: Resource[]
  onSubmit: (data: any) => Promise<void>
  isLoading?: boolean
}

export function BookingForm({ resources, onSubmit, isLoading = false }: BookingFormProps) {
  const [formData, setFormData] = useState({
    resourceId: "",
    startTime: "",
    endTime: "",
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await onSubmit(formData)
    setFormData({ resourceId: "", startTime: "", endTime: "" })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Booking</CardTitle>
        <CardDescription>Book a shared household resource</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="resource" className="text-sm font-medium">
              Select Resource
            </label>
            <Select
              value={formData.resourceId}
              onValueChange={(value) => setFormData({ ...formData, resourceId: value })}
            >
              <SelectTrigger id="resource" disabled={isLoading}>
                <SelectValue placeholder="Choose a resource..." />
              </SelectTrigger>
              <SelectContent>
                {resources.map((resource) => (
                  <SelectItem key={resource.id} value={resource.id}>
                    {resource.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="startTime" className="text-sm font-medium">
              Start Time
            </label>
            <Input
              id="startTime"
              type="datetime-local"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="endTime" className="text-sm font-medium">
              End Time
            </label>
            <Input
              id="endTime"
              type="datetime-local"
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading || !formData.resourceId}>
            {isLoading ? "Creating..." : "Create Booking"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

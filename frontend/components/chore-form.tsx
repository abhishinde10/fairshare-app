"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ChoreFormProps {
  onSubmit: (data: any) => Promise<void>
  isLoading?: boolean
}

export function ChoreForm({ onSubmit, isLoading = false }: ChoreFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    frequency: "once",
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await onSubmit(formData)
    setFormData({ title: "", description: "", dueDate: "", frequency: "once" })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Chore</CardTitle>
        <CardDescription>Create a new household chore</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Chore Title
            </label>
            <Input
              id="title"
              placeholder="e.g., Clean the kitchen"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Input
              id="description"
              placeholder="e.g., Wipe counters, wash dishes, sweep floor"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="dueDate" className="text-sm font-medium">
              Due Date
            </label>
            <Input
              id="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="frequency" className="text-sm font-medium">
              Frequency
            </label>
            <Select
              value={formData.frequency}
              onValueChange={(value) => setFormData({ ...formData, frequency: value })}
            >
              <SelectTrigger id="frequency" disabled={isLoading}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="once">One Time</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Chore"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

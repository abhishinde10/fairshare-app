"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ResourceFormProps {
  onSubmit: (data: any) => Promise<void>
  isLoading?: boolean
}

export function ResourceForm({ onSubmit, isLoading = false }: ResourceFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "other",
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await onSubmit(formData)
    setFormData({ name: "", description: "", category: "other" })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Resource</CardTitle>
        <CardDescription>Create a new shared household resource</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Resource Name
            </label>
            <Input
              id="name"
              placeholder="e.g., Living Room TV"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
              placeholder="e.g., 55-inch Samsung TV in the living room"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="category" className="text-sm font-medium">
              Category
            </label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger id="category" disabled={isLoading}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kitchen">Kitchen</SelectItem>
                <SelectItem value="bathroom">Bathroom</SelectItem>
                <SelectItem value="living-room">Living Room</SelectItem>
                <SelectItem value="bedroom">Bedroom</SelectItem>
                <SelectItem value="outdoor">Outdoor</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Resource"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

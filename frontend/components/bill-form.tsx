"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface BillFormProps {
  onSubmit: (data: any) => Promise<void>
  isLoading?: boolean
}

export function BillForm({ onSubmit, isLoading = false }: BillFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    dueDate: "",
    category: "utilities",
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await onSubmit({
      ...formData,
      amount: Number.parseFloat(formData.amount),
    })
    setFormData({ title: "", amount: "", dueDate: "", category: "utilities" })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Bill</CardTitle>
        <CardDescription>Create a new household bill to split</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Bill Title
            </label>
            <Input
              id="title"
              placeholder="e.g., Electricity Bill"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="amount" className="text-sm font-medium">
              Total Amount
            </label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
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
            <label htmlFor="category" className="text-sm font-medium">
              Category
            </label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger id="category" disabled={isLoading}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="utilities">Utilities</SelectItem>
                <SelectItem value="rent">Rent</SelectItem>
                <SelectItem value="groceries">Groceries</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Bill"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

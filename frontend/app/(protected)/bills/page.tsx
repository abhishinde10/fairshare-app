"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"
import type { Bill } from "@/lib/types"
import { Plus, Trash2, CheckCircle2, IndianRupee } from "lucide-react"
import { BillForm } from "@/components/bill-form"

export default function BillsPage() {
  const [bills, setBills] = useState<Bill[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    loadBills()
  }, [])

  async function loadBills() {
    try {
      console.log("[v0] Loading bills...")
      const data = await api.getBills()
      console.log("[v0] Bills loaded:", data)
      setBills(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("[v0] Failed to load bills:", error)
      setBills([])
    } finally {
      setIsLoading(false)
    }
  }

  async function handleCreateBill(formData: any) {
    setIsSubmitting(true)
    try {
      console.log("[v0] Creating bill:", formData)
      await api.createBill(formData)
      console.log("[v0] Bill created successfully")
      await loadBills()
      setShowForm(false)
    } catch (error) {
      console.error("[v0] Failed to create bill:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleUpdateBill(id: string, status: string) {
    try {
      await api.updateBill(id, { status })
      await loadBills()
    } catch (error) {
      console.error("[v0] Failed to update bill:", error)
    }
  }

  async function handleDeleteBill(id: string) {
    if (confirm("Are you sure you want to delete this bill?")) {
      try {
        await api.deleteBill(id)
        await loadBills()
      } catch (error) {
        console.error("[v0] Failed to delete bill:", error)
      }
    }
  }

  const categoryColors: Record<string, string> = {
    utilities: "bg-blue-100 text-blue-800",
    rent: "bg-purple-100 text-purple-800",
    groceries: "bg-orange-100 text-orange-800",
    other: "bg-gray-100 text-gray-800",
  }

  const pendingBills = bills.filter((b) => b.status === "pending")
  const paidBills = bills.filter((b) => b.status === "paid")

  const totalPending = pendingBills.reduce((sum, b) => sum + (b.amount ?? 0), 0)
  const totalPaid = paidBills.reduce((sum, b) => sum + (b.amount ?? 0), 0)

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Bills</h1>
          <p className="text-muted-foreground mt-2">Manage and split household bills</p>
        </div>
        <Button className="gap-2" onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4" />
          {showForm ? "Cancel" : "Add Bill"}
        </Button>
      </div>

      {showForm && <BillForm onSubmit={handleCreateBill} isLoading={isSubmitting} />}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Bills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalPending.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">{pendingBills.length} bills</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Paid Bills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalPaid.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">{paidBills.length} bills</p>
          </CardContent>
        </Card>
      </div>

      {/* Bills List */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading bills...</p>
        </div>
      ) : bills.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">No bills created yet</p>
            <Button onClick={() => setShowForm(true)}>Create First Bill</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {/* Pending Bills */}
          {pendingBills.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-yellow-700">
                <IndianRupee className="w-5 h-5" /> Pending ({pendingBills.length})
              </h2>
              <div className="space-y-4">
                {pendingBills.map((bill) => (
                  <Card key={bill.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          {/* Title + Category */}
                          <div className="flex items-center gap-2 mb-2">
                            <p className="font-medium">{bill.title}</p>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                categoryColors[bill.category] || categoryColors.other
                              }`}
                            >
                              {bill.category}
                            </span>
                          </div>

                          <p className="text-sm text-muted-foreground">
                            Due: {new Date(bill.dueDate).toLocaleDateString()}
                          </p>

                          {/* ✅ Split Details */}
                          {Array.isArray(bill.splits) && bill.splits.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-border">
                              <p className="text-xs font-semibold mb-2 text-primary">
                                Split Details:
                              </p>
                              <div className="space-y-1">
                                {bill.splits.map((split: any, idx: number) => (
                                  <div
                                    key={idx}
                                    className="flex justify-between text-xs text-muted-foreground"
                                  >
                                    <span>{split.userName || `User ${idx + 1}`}</span>
                                    <span
                                      className={
                                        split.paid
                                          ? "line-through text-green-600"
                                          : "text-foreground"
                                      }
                                    >
                                      ₹{split.amount?.toFixed(2) ?? 0}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Amount + Actions */}
                        <div className="text-right flex flex-col items-end gap-2">
                          <p className="font-bold text-lg">₹{bill.amount.toFixed(2)}</p>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateBill(bill.id, "paid")}
                              className="gap-1"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              Mark Paid
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteBill(bill.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Paid Bills */}
          {paidBills.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-green-700">
                <CheckCircle2 className="w-5 h-5" /> Paid ({paidBills.length})
              </h2>
              <div className="space-y-4">
                {paidBills.map((bill) => (
                  <Card key={bill.id} className="opacity-75">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <p className="font-medium line-through">{bill.title}</p>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                categoryColors[bill.category] || categoryColors.other
                              }`}
                            >
                              {bill.category}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Paid on: {new Date(bill.dueDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right flex flex-col items-end gap-2">
                          <p className="font-bold text-lg">₹{bill.amount.toFixed(2)}</p>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteBill(bill.id)}
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
            </div>
          )}
        </div>
      )}
    </div>
  )
}

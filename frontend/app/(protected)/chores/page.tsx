"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"
import type { Chore } from "@/lib/types"
import { Plus, Trash2, CheckCircle2, Clock } from "lucide-react"
import { ChoreForm } from "@/components/chore-form"

export default function ChoresPage() {
  const [chores, setChores] = useState<Chore[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    loadChores()
  }, [])

  async function loadChores() {
    try {
      console.log("[v0] Loading chores...")
      const data = await api.getChores()
      console.log("[v0] Chores loaded:", data)
      setChores(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("[v0] Failed to load chores:", error)
      setChores([])
    } finally {
      setIsLoading(false)
    }
  }

  async function handleCreateChore(formData: any) {
    setIsSubmitting(true)
    try {
      console.log("[v0] Creating chore:", formData)
      await api.createChore(formData)
      console.log("[v0] Chore created successfully")
      await loadChores()
      setShowForm(false)
    } catch (error) {
      console.error("[v0] Failed to create chore:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleUpdateChore(id: string, status: string) {
    try {
      console.log("[v0] Updating chore:", id, "status:", status)
      await api.updateChore(id, { status })
      console.log("[v0] Chore updated successfully")
      await loadChores()
    } catch (error) {
      console.error("[v0] Failed to update chore:", error)
    }
  }

  async function handleDeleteChore(id: string) {
    if (confirm("Are you sure you want to delete this chore?")) {
      try {
        console.log("[v0] Deleting chore:", id)
        await api.deleteChore(id)
        console.log("[v0] Chore deleted successfully")
        await loadChores()
      } catch (error) {
        console.error("[v0] Failed to delete chore:", error)
      }
    }
  }

  const frequencyLabels: Record<string, string> = {
    once: "One Time",
    daily: "Daily",
    weekly: "Weekly",
    monthly: "Monthly",
  }

  const pendingChores = chores.filter((c) => c.status === "pending")
  const inProgressChores = chores.filter((c) => c.status === "in-progress")
  const completedChores = chores.filter((c) => c.status === "completed")

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Chores</h1>
          <p className="text-muted-foreground mt-2">Manage household chores and assignments</p>
        </div>
        <Button className="gap-2" onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4" />
          {showForm ? "Cancel" : "Add Chore"}
        </Button>
      </div>

      {showForm && <ChoreForm onSubmit={handleCreateChore} isLoading={isSubmitting} />}

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading chores...</p>
        </div>
      ) : chores.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">No chores assigned</p>
            <Button onClick={() => setShowForm(true)}>Create First Chore</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {/* Pending Chores */}
          {pendingChores.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-yellow-600" />
                Pending ({pendingChores.length})
              </h2>
              <div className="space-y-4">
                {pendingChores.map((chore) => (
                  <Card key={chore.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className="font-medium">{chore.title}</p>
                          <p className="text-sm text-muted-foreground">{chore.description}</p>
                          <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                            <span>Due: {new Date(chore.dueDate).toLocaleDateString()}</span>
                            <span className="capitalize">{frequencyLabels[chore.frequency]}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpdateChore(chore.id, "in-progress")}
                            className="gap-1"
                          >
                            <Clock className="w-4 h-4" />
                            Start
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteChore(chore.id)}
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

          {/* In Progress Chores */}
          {inProgressChores.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                In Progress ({inProgressChores.length})
              </h2>
              <div className="space-y-4">
                {inProgressChores.map((chore) => (
                  <Card key={chore.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className="font-medium">{chore.title}</p>
                          <p className="text-sm text-muted-foreground">{chore.description}</p>
                          <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                            <span>Due: {new Date(chore.dueDate).toLocaleDateString()}</span>
                            <span className="capitalize">{frequencyLabels[chore.frequency]}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpdateChore(chore.id, "completed")}
                            className="gap-1"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            Complete
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteChore(chore.id)}
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

          {/* Completed Chores */}
          {completedChores.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                Completed ({completedChores.length})
              </h2>
              <div className="space-y-4">
                {completedChores.map((chore) => (
                  <Card key={chore.id} className="opacity-75">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className="font-medium line-through">{chore.title}</p>
                          <p className="text-sm text-muted-foreground">{chore.description}</p>
                          <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                            <span>Due: {new Date(chore.dueDate).toLocaleDateString()}</span>
                            <span className="capitalize">{frequencyLabels[chore.frequency]}</span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteChore(chore.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
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

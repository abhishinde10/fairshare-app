"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"
import type { Resource } from "@/lib/types"
import { Plus, Trash2 } from "lucide-react"
import { ResourceForm } from "@/components/resource-form"

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    loadResources()
  }, [])

  async function loadResources() {
    try {
      console.log("[v0] Loading resources...")
      const data = await api.getResources()
      console.log("[v0] Resources loaded:", data)
      setResources(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("[v0] Failed to load resources:", error)
      setResources([])
    } finally {
      setIsLoading(false)
    }
  }

  async function handleCreateResource(formData: any) {
    setIsSubmitting(true)
    try {
      console.log("[v0] Creating resource:", formData)
      await api.createResource(formData)
      console.log("[v0] Resource created successfully")
      await loadResources()
      setShowForm(false)
    } catch (error) {
      console.error("[v0] Failed to create resource:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDeleteResource(id: string) {
    if (confirm("Are you sure you want to delete this resource?")) {
      try {
        console.log("[v0] Deleting resource:", id)
        await api.deleteResource(id)
        console.log("[v0] Resource deleted successfully")
        await loadResources()
      } catch (error) {
        console.error("[v0] Failed to delete resource:", error)
      }
    }
  }

  const categoryColors: Record<string, string> = {
    kitchen: "bg-orange-100 text-orange-800",
    bathroom: "bg-blue-100 text-blue-800",
    "living-room": "bg-green-100 text-green-800",
    bedroom: "bg-purple-100 text-purple-800",
    outdoor: "bg-yellow-100 text-yellow-800",
    other: "bg-gray-100 text-gray-800",
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Resources</h1>
          <p className="text-muted-foreground mt-2">Manage shared household resources</p>
        </div>
        <Button className="gap-2" onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4" />
          {showForm ? "Cancel" : "Add Resource"}
        </Button>
      </div>

      {showForm && <ResourceForm onSubmit={handleCreateResource} isLoading={isSubmitting} />}

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading resources...</p>
        </div>
      ) : resources.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">No resources created yet</p>
            <Button onClick={() => setShowForm(true)}>Create First Resource</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.map((resource) => (
            <Card key={resource.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle>{resource.name}</CardTitle>
                    <CardDescription>{resource.description}</CardDescription>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[resource.category] || categoryColors.other}`}
                  >
                    {resource.category}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full bg-transparent">
                  Book Now
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-destructive hover:text-destructive"
                  onClick={() => handleDeleteResource(resource.id)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

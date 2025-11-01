"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { api } from "@/lib/api"
import { Plus, Mail, UserCheck, Trash2, BarChart3, Crown } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

interface Roommate {
  id: string
  name: string
  email: string
  cleanliness: number
  cooperation: number
  responsibility: number
  noiseLevel: number
  behaviorScore: number
}

export default function RoommatesPage() {
  const [roommates, setRoommates] = useState<Roommate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showInviteForm, setShowInviteForm] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [isInviting, setIsInviting] = useState(false)
  const [rankings, setRankings] = useState<Roommate[]>([])
  const [showRankingsModal, setShowRankingsModal] = useState(false)

  // Load roommates on page load
  useEffect(() => {
    loadRoommates()
  }, [])

  async function loadRoommates() {
    setIsLoading(true)
    try {
      const data = await api.getRoommates()
      setRoommates(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Failed to load roommates:", error)
      setRoommates([])
    } finally {
      setIsLoading(false)
    }
  }

  async function handleInviteMember(e: React.FormEvent) {
    e.preventDefault()
    setIsInviting(true)
    try {
      await api.addRoommate({
        name: inviteEmail.split("@")[0],
        email: inviteEmail,
        cleanliness: Math.floor(Math.random() * 10) + 1,
        cooperation: Math.floor(Math.random() * 10) + 1,
        responsibility: Math.floor(Math.random() * 10) + 1,
        noiseLevel: Math.floor(Math.random() * 5) + 1,
      })
      setInviteEmail("")
      setShowInviteForm(false)
      await loadRoommates()
    } catch (error) {
      console.error("Failed to invite member:", error)
      alert("⚠️ Could not add roommate. Please try again.")
    } finally {
      setIsInviting(false)
    }
  }

  async function handleDeleteMember(id: string) {
    if (!confirm("Are you sure you want to remove this roommate?")) return
    try {
      await api.deleteRoommate(id)
      await loadRoommates()
    } catch (error) {
      console.error("Failed to delete roommate:", error)
      alert("⚠️ Could not delete roommate. Try again later.")
    }
  }

  // ✅ Open modal with top 5 roommates
  async function handleViewRankings() {
    try {
      const data = await api.getTopRoommates(5)
      if (!Array.isArray(data) || data.length === 0) {
        alert("No rankings available yet.")
        return
      }
      setRankings(data)
      setShowRankingsModal(true)
    } catch (error) {
      console.error("Failed to fetch rankings:", error)
      alert("⚠️ Could not fetch roommate rankings.")
    }
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Roommates</h1>
          <p className="text-muted-foreground mt-2">Manage and track roommate behavior</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={handleViewRankings}>
            <BarChart3 className="w-4 h-4" />
            View Rankings
          </Button>
          <Button className="gap-2" onClick={() => setShowInviteForm(!showInviteForm)}>
            <Plus className="w-4 h-4" />
            {showInviteForm ? "Cancel" : "Add Roommate"}
          </Button>
        </div>
      </div>

      {/* Invite Form */}
      {showInviteForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add a New Roommate</CardTitle>
            <CardDescription>Automatically generates random behavior metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleInviteMember} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="roommate@example.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  required
                  disabled={isInviting}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isInviting}>
                {isInviting ? "Adding..." : "Add Roommate"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Loading / Empty / Grid */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading roommates...</p>
        </div>
      ) : roommates.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">No roommates added yet</p>
            <Button onClick={() => setShowInviteForm(true)}>Invite First Roommate</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roommates.map((r) => (
            <Card key={r.id} className="relative group hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{r.name}</CardTitle>
                    <CardDescription className="text-xs mt-1">{r.email}</CardDescription>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <UserCheck className="w-5 h-5 text-primary" />
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="text-sm space-y-1">
                  <p>Cleanliness: {r.cleanliness}/10</p>
                  <p>Cooperation: {r.cooperation}/10</p>
                  <p>Responsibility: {r.responsibility}/10</p>
                  <p>Noise Level: {r.noiseLevel}/10</p>
                  <p className="font-medium text-primary mt-2">
                    Behavior Score: {r.behaviorScore?.toFixed(2) ?? "N/A"}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-4 gap-3">
                  <Button variant="outline" size="sm" className="flex-1 gap-2">
                    <Mail className="w-4 h-4" />
                    Message
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteMember(r.id)}
                    className="text-destructive hover:text-destructive"
                    title="Delete roommate"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Rankings Modal */}
      <Dialog open={showRankingsModal} onOpenChange={setShowRankingsModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl font-bold">
              <Crown className="text-yellow-500 w-6 h-6" />
              Top Roommates 🏆
            </DialogTitle>
            <DialogDescription>Ranked by highest behavior scores</DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-3">
            {rankings.map((r, i) => (
              <div
                key={r.id}
                className={`flex items-center justify-between p-3 rounded-md ${
                  i === 0
                    ? "bg-yellow-100"
                    : i === 1
                    ? "bg-gray-100"
                    : i === 2
                    ? "bg-orange-100"
                    : "bg-secondary/50"
                }`}
              >
                <div>
                  <p className="font-medium">{`${i + 1}. ${r.name}`}</p>
                  <p className="text-xs text-muted-foreground">{r.email}</p>
                </div>
                <p className="font-bold text-primary text-sm">{r.behaviorScore.toFixed(2)}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end">
            <Button onClick={() => setShowRankingsModal(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

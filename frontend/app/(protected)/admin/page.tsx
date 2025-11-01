"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { api } from "@/lib/api"
import { Users, Settings, BarChart3, Plus, Trash2, Zap, ClipboardList, DollarSign } from "lucide-react"

export default function AdminPage() {
  const [dashboard, setDashboard] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showInviteForm, setShowInviteForm] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [isInviting, setIsInviting] = useState(false)

  useEffect(() => {
    loadAdminDashboard()
  }, [])

  async function loadAdminDashboard() {
    try {
      const data = await api.getAdminDashboard()
      setDashboard(data)
    } catch (error) {
      console.error("Failed to load admin data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleInviteMember(e: React.FormEvent) {
    e.preventDefault()
    setIsInviting(true)
    try {
      await api.addMember(inviteEmail)
      setInviteEmail("")
      setShowInviteForm(false)
      await loadAdminDashboard()
    } catch (error) {
      console.error("Failed to invite member:", error)
    } finally {
      setIsInviting(false)
    }
  }

  async function handleDeleteMember(id: string) {
    if (!confirm("Are you sure you want to remove this member?")) return
    try {
      await api.deleteMember(id)
      await loadAdminDashboard()
    } catch (error) {
      console.error("Failed to delete member:", error)
    }
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">System administration and household management</p>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading admin data...</p>
        </div>
      ) : (
        <>
          {/* Household Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Household Overview
              </CardTitle>
              <CardDescription>Overview of household and system statistics</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Household Name</p>
                <p className="text-lg font-semibold">{dashboard?.householdName || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Members</p>
                <p className="text-lg font-semibold">{dashboard?.totalMembers || 0}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="text-lg font-semibold">
                  {dashboard?.createdAt ? new Date(dashboard.createdAt).toLocaleDateString() : "N/A"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Module Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <Zap className="w-4 h-4" /> Total Energy
                </CardTitle>
              </CardHeader>
              <CardContent className="text-2xl font-bold">
                {dashboard?.totalEnergy?.toFixed(2) ?? 0} kWh
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <DollarSign className="w-4 h-4" /> Total Bills
                </CardTitle>
              </CardHeader>
              <CardContent className="text-2xl font-bold">
                ₹{dashboard?.totalBills?.toFixed(2) ?? 0}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <ClipboardList className="w-4 h-4" /> Pending Chores
                </CardTitle>
              </CardHeader>
              <CardContent className="text-2xl font-bold">{dashboard?.pendingChores || 0}</CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <DollarSign className="w-4 h-4" /> Pending Bills
                </CardTitle>
              </CardHeader>
              <CardContent className="text-2xl font-bold">{dashboard?.pendingBills || 0}</CardContent>
            </Card>
          </div>

          {/* Member Management */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" /> Member Management
                  </CardTitle>
                  <CardDescription>Manage household members and permissions</CardDescription>
                </div>
                <Button className="gap-2" onClick={() => setShowInviteForm(!showInviteForm)}>
                  <Plus className="w-4 h-4" />
                  {showInviteForm ? "Cancel" : "Invite Member"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {showInviteForm && (
                <form onSubmit={handleInviteMember} className="p-4 bg-secondary/50 rounded-lg space-y-3">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">Email Address</label>
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
                    {isInviting ? "Sending..." : "Send Invite"}
                  </Button>
                </form>
              )}

              {dashboard?.members && dashboard.members.length > 0 ? (
                <div className="space-y-3">
                  {dashboard.members.map((member: any, idx: number) => (
                    <div
                      key={member.id || idx}
                      className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="text-sm font-semibold">{member.name?.[0] || "M"}</span>
                        </div>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-xs text-muted-foreground">{member.email}</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDeleteMember(member.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-sm text-muted-foreground">No members yet</p>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

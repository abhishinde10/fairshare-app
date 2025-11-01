"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  BookOpen,
  CheckSquare,
  DollarSign,
  Zap,
  Bell,
  Settings,
  LogOut,
  BarChart3,
  Users,
} from "lucide-react"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/resources", label: "Resources", icon: BookOpen },
  { href: "/bookings", label: "Bookings", icon: BookOpen },
  { href: "/chores", label: "Chores", icon: CheckSquare },
  { href: "/bills", label: "Bills", icon: DollarSign },
  { href: "/energy", label: "Energy", icon: Zap },
  { href: "/alerts", label: "Alerts", icon: Bell },
  { href: "/admin", label: "Admin", icon: BarChart3 },
  { href: "/roommates", label: "Roommates", icon: Users },
  { href: "/settings", label: "Settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const { logout } = useAuth()

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border h-screen flex flex-col">
      <div className="p-6 border-b border-sidebar-border">
        <h1 className="text-2xl font-bold text-sidebar-primary">FairShare++</h1>
        <p className="text-xs text-sidebar-foreground/60 mt-1">Shared Resource Manager</p>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link key={item.href} href={item.href}>
              <Button variant={isActive ? "default" : "ghost"} className="w-full justify-start gap-3" asChild>
                <span>
                  <Icon className="w-4 h-4" />
                  {item.label}
                </span>
              </Button>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border space-y-2">
        <Button variant="outline" className="w-full justify-start gap-3 bg-transparent" onClick={logout}>
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    </aside>
  )
}

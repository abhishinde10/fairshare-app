"use client"

import { useState, useEffect, useCallback } from "react"
import type { User } from "@/lib/types"
import { getToken, logout as logoutUtil, getCurrentUser } from "@/lib/auth"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadUser() {
      const token = getToken()
      if (!token) {
        setIsLoading(false)
        return
      }

      try {
        const currentUser = await getCurrentUser()
        if (currentUser) {
          setUser(currentUser)
        } else {
          logoutUtil()
        }
      } catch (err) {
        console.error("Failed to fetch current user:", err)
        logoutUtil()
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [])

  const logout = useCallback(() => {
    logoutUtil()
    setUser(null)
  }, [])

  return { user, isLoading, isAuthenticated: !!user, logout }
}

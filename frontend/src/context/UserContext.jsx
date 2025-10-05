import React, { createContext, useEffect, useState } from "react"
import axiosInstance from "../utils/axiosInstance"
import { API_PATHS } from "../utils/apiPaths"

export const UserContext = createContext()

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const accessToken = localStorage.getItem("token")
    if (!accessToken) {
      setLoading(false)
      return
    }

    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE)
        const data = response.data.data || response.data
        setUser(data.user || data)
      } catch (error) {
        console.error("User not authenticated", error)
        clearUser()
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, []) // ✅ Only once on mount

  const updateUser = ({ user, token }) => {
    setUser(user)
    if (token) localStorage.setItem("token", token)
    setLoading(false)
  }

  const clearUser = () => {
    setUser(null)
    localStorage.removeItem("token")
  }

  return (
    <UserContext.Provider value={{ user, loading, updateUser, clearUser }}>
      {children}
    </UserContext.Provider>
  )
}

export default UserProvider

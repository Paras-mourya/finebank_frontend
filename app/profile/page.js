"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getProfile } from "@/redux/slice/userSlice"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ProfileCard() {
  const dispatch = useDispatch()
  const { user, loading } = useSelector((state) => state.user)

  useEffect(() => {
    dispatch(getProfile())
  }, [dispatch])

  if (loading) return <p className="p-4 text-gray-500">Loading profile...</p>
  if (!user) return <p className="p-4 text-gray-500">No profile data</p>

  return (
    <Card className="bg-white shadow-xl rounded-2xl border border-gray-200 overflow-hidden">
      
      <CardHeader className="flex flex-col items-center bg-gradient-to-r from-teal-500 to-cyan-500 p-6">
        <img
          src={user.avatar?.secure_url || "/default-avatar.png"}
          alt={user.name}
          className="h-24 w-24 rounded-full object-cover border-4 border-white shadow-md"
        />
        <div className="mt-4 text-center">
          <CardTitle className="text-2xl font-bold text-white">
            {user.name}
          </CardTitle>
          <p className="text-sm text-gray-100">{user.email}</p>
        </div>
      </CardHeader>

      
      <CardContent className="p-6 grid grid-cols-2 gap-6">
        <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl shadow-sm">
          <span className="text-sm text-gray-500">📞 Phone</span>
          <p className="text-base font-medium text-gray-800 mt-1">
            {user.phone || "Not added"}
          </p>
        </div>

        <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl shadow-sm">
          <span className="text-sm text-gray-500">📅 Joined</span>
          <p className="text-base font-medium text-gray-800 mt-1">
            {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl shadow-sm col-span-2">
          <span className="text-sm text-gray-500">🌐 Role</span>
          <p className="text-base font-medium text-gray-800 mt-1">
            {user.role || "Customer"}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getProfile } from "@/redux/slice/userSlice"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export default function ProfileCard() {
  const dispatch = useDispatch()
  const { user, loading } = useSelector((state) => state.user)

  useEffect(() => {
    dispatch(getProfile())
  }, [dispatch])

  if (loading) return <p className="p-4 text-gray-500">Loading profile...</p>
  if (!user) return <p className="p-4 text-gray-500">No profile data</p>

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-2xl border rounded-3xl overflow-hidden">
      {/* Header */}
      <CardHeader className="flex flex-col  items-center bg-gradient-to-r from-teal-600 to-emerald-500 p-10">
        <Avatar className="h-32 w-32 border-4 border-white shadow-lg rounded-full">
          <AvatarImage
            src={user.avatar?.secure_url || "/default-avatar.png"}
            alt={user.name}
          />
          <AvatarFallback className="text-2xl font-bold text-white bg-gray-700">
            {user.name?.charAt(0) || "U"}
          </AvatarFallback>
        </Avatar>

        <div className="mt-6 text-center">
          <CardTitle className="text-3xl font-extrabold text-white tracking-wide">
            {user.name}
          </CardTitle>
          <CardDescription className="text-gray-100 dark:text-gray-900 text-2xl font-bold mt-2">
            {user.email}
          </CardDescription>
        </div>
      </CardHeader>

      
      <CardContent className="grid grid-cols-2 gap-6 p-8">
       
        <div className="flex flex-col mt-4  items-center gap-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-xl p-6 shadow-md">
          <span className="text-sm text-gray-600 dark:text-gray-300">📞 Phone</span>
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {user.phone || "Not added"}
          </p>
        </div>

        
        <div className="flex flex-col mt-4 items-center gap-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-xl p-6 shadow-md">
          <span className="text-sm text-gray-600 dark:text-gray-300">📅 Joined</span>
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>

        
        <div className="col-span-2 flex flex-col items-center gap-3 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-xl p-6 shadow-md">
          <span className="text-sm text-gray-600 dark:text-gray-300">🌐 Role</span>
          <Badge
            variant="secondary"
            className="capitalize text-base px-4 py-2 rounded-full"
          >
            {user.role || "Customer"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}

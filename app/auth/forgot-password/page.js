"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle password reset logic here
    console.log("Password reset requested for:", email)
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="text-4xl font-bold text-primary mb-4">FINEbank.IO</div>
            <CardTitle className="text-2xl">Check your email</CardTitle>
            <CardDescription>We've sent a password reset link to {email}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/auth">
              <Button variant="link" className="w-full text-muted-foreground hover:text-primary">
                Back to login
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="text-4xl font-bold text-primary mb-4">FINEbank.IO</div>
          <CardTitle className="text-2xl">Forgot Password?</CardTitle>
          <CardDescription>Enter your email address to get the password reset link.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="hello@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
              Password Reset
            </Button>
          </form>

          <div className="text-center">
            <Link href="/auth">
              <Button variant="link" className="text-muted-foreground hover:text-primary">
                Back to login
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "@/redux/slice/userSlice";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const { token } = useParams(); 
  console.log("Token from URL:", token);
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error, success } = useSelector((state) => state.user);
  const message = success ? "Password reset successfully! Redirecting to login..." : null;
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
  await dispatch(resetPassword({ resetToken: token, password })).unwrap();
  toast.success("Password reset successfully!");
} catch (err) {
  toast.error(err || "Something went wrong!");
}

    setTimeout(() => {
      router.push("/auth/login");
    }, 2000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/30 p-4">
      <Card className="w-full max-w-md shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold">
            Reset Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>New Password</Label>
              <Input
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <Label>Confirm Password</Label>
              <Input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>

          {message && (
            <p className="mt-4 text-green-600 text-center font-medium">
              {message}
            </p>
          )}
          {error && (
            <p className="mt-4 text-red-600 text-center font-medium">{error}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

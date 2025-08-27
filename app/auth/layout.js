"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Providers from "@/redux/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function AuthLayout({ children }) {
  return (
    <Providers>
      
      <div
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background min-h-screen`}
      >
        {children}
      </div>
    </Providers>
  );
}

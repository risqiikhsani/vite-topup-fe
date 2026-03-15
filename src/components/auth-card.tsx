import React from 'react'
import Image from "@/assets/images/Illustrasi Login.png"

export default function AuthCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
      <div className="hidden lg:block">
        <img
          src={Image}
          alt="Illustrasi Login"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  )
}

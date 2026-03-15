import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/store/authStore"
import { useState } from "react"

export default function Profile() {
  const profile = useAuthStore((s) => s.profile)
  const [isEditing, setIsEditing] = useState(false)

  

  return (
    <div className="p-8 max-w-lg mx-auto">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>

      {!profile && (
        <p className="text-muted-foreground">Loading profile…</p>
      )}

      {profile && (
        <div className="flex flex-col items-center gap-6">
          <img
            src={profile.profile_image}
            alt={`${profile.first_name} ${profile.last_name}`}
            className="h-20 w-20 rounded-full object-cover border"
          />
          <div className="flex flex-col gap-1">
            <p className="text-xl font-semibold">
              {profile.email}
            </p>
            <p className="text-xl font-semibold">
              {profile.first_name} 
            </p>
            <p className="text-xl font-semibold">
              {profile.last_name}
            </p>
            <Button>Edit Profile</Button>
            <Button>Save</Button>
            <Button>Logout</Button>
          </div>
        </div>
      )}
    </div>
  )
}

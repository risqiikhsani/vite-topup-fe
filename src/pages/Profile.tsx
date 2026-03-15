import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import api from "@/lib/api"
import { useAuthStore } from "@/store/authStore"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { Pencil } from "lucide-react"
import defaultProfile from "@/assets/images/Profile Photo.png"

export default function Profile() {
  const profile = useAuthStore((s) => s.profile)
  const setProfile = useAuthStore((s) => s.setProfile)
  const [isEditing, setIsEditing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name,
        last_name: profile.last_name,
      })
    }
  }, [profile])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 1024 * 1024) {
        toast.error("Image size must be less than 1MB")
        return
      }
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUpdate = async () => {
    try {
      // 1. Update Profile
      const response = await api.put("/profile/update", {
        first_name: formData.first_name,
        last_name: formData.last_name,
      })

      if (response.data.status !== 0) {
        toast.error(response.data.message || "Update failed")
        return
      }

      // 2. Update Image if selectedFile exists
      if (selectedFile) {
        const imagePayload = new FormData()
        imagePayload.append("file", selectedFile)

        await api.put("/profile/image", imagePayload, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
      }

      toast.success("Profile updated successfully")

      // Refetch profile data
      const getProfile = await api.get("/profile")
      if (getProfile.data.status === 0) {
        setProfile(getProfile.data.data)
      }
      setIsEditing(false)
      setSelectedFile(null)
      setPreviewImage(null)
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Update failed")
    }
  }

  const handleLogout = () => {
    useAuthStore.getState().logout()
  }

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-6 text-3xl font-bold text-center">Profile</h1>

      {!profile && <p className="text-muted-foreground text-center">Loading profile…</p>}

      {profile && (
        <div className="flex flex-col items-center gap-6">
          <div className="group relative">
            <img
              src={
                previewImage || (profile.profile_image && !profile.profile_image.includes("null")
                  ? profile.profile_image
                  : defaultProfile )
              }
              alt={`${profile.first_name} ${profile.last_name}`}
              className="h-24 w-24 rounded-full border-2 border-primary/20 object-cover"
            />
            {isEditing && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute right-0 bottom-0 rounded-full border border-border bg-white p-1.5 shadow-sm transition-colors hover:bg-muted"
                title="Ganti Foto"
              >
                <Pencil className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          <div className="flex w-full flex-col gap-4">
            <div className="flex flex-col gap-1">
              <p>Email</p>
              <Input value={profile.email} disabled />
            </div>

            <div className="flex flex-col gap-1">
              <p>Nama Depan</p>
              <Input
                value={formData.first_name}
                disabled={!isEditing}
                onChange={(e) =>
                  setFormData({ ...formData, first_name: e.target.value })
                }
              />
            </div>

            <div className="flex flex-col gap-1">
              <p>Nama Belakang</p>
              <Input
                value={formData.last_name}
                disabled={!isEditing}
                onChange={(e) =>
                  setFormData({ ...formData, last_name: e.target.value })
                }
              />
            </div>

            {!isEditing ? (
              <>
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
                <Button variant="destructive" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <Button onClick={handleUpdate}>Simpan</Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false)
                    setSelectedFile(null)
                    setPreviewImage(null)
                    setFormData({
                      first_name: profile.first_name,
                      last_name: profile.last_name,
                    })
                  }}
                >
                  Batal
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

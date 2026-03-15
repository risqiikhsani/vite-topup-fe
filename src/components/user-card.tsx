import { Button } from "./ui/button"
import { useAuthStore } from "@/store/authStore"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import defaultProfile from "@/assets/images/Profile Photo.png"
import useSWR from "swr"
import api from "@/lib/api"
import { useState } from "react"

const fetcher = (url: string) => api.get(url).then((res) => res.data.data)

export default function UserCard() {
  const profile = useAuthStore((s) => s.profile)
  const { data: balanceData } = useSWR("/balance", fetcher)
  const [showBalance, setShowBalance] = useState(false)

  const balance = balanceData?.balance ?? null

  const formattedBalance =
    balance !== null
      ? balance.toLocaleString("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 })
      : "…"

  return (
    <div className="mt-6 grid grid-cols-2 gap-8">
      {!profile && <p className="text-muted-foreground">Loading profile…</p>}
      {profile && (
        <div className="flex flex-col gap-2">
          <img
            src={
              profile.profile_image && !profile.profile_image.includes("null")
                ? profile.profile_image
                : defaultProfile
            }
            alt={`${profile.first_name} ${profile.last_name}`}
            className="h-20 w-20 rounded-full border object-cover"
          />
          <p className="text-muted-foreground capitalize">Selamat Datang,</p>
          <p className="font-bold text-xl capitalize">
            {profile.first_name} {profile.last_name}
          </p>
        </div>
      )}
      <div className="flex flex-col items-start gap-2 rounded-2xl bg-red-400 p-4">
        <p>Saldo anda</p>
        <p className="text-xl font-semibold">
          {showBalance ? formattedBalance : "Rp ••••••"}
        </p>
        <Button variant="ghost" onClick={() => setShowBalance((v) => !v)}>
          {showBalance ? <><EyeOffIcon /> Sembunyikan Saldo</> : <><EyeIcon /> Lihat Saldo</>}
        </Button>
      </div>
    </div>
  )
}

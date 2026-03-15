import UserCard from "@/components/user-card"
import { useAuthStore } from "@/store/authStore"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

type DataService = {
  service_code: string
  service_name: string
  service_icon: string
  service_tariff: number
}

export default function TopUp() {
  const token = useAuthStore((s) => s.token)
  const [dataServices, setDataServices] = useState<DataService[]>([])

  useEffect(() => {
    fetch("https://take-home-test-api.nutech-integrasi.com/services", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((json) => {
        if (json?.data) setDataServices(json.data)
      })
      .catch(() => {})
  }, [token])

  return (
    <div className="mx-auto flex flex-col gap-10 p-8">
      <div>
        <h1 className="text-3xl font-bold">TopUp</h1>
        <p className="mt-2 text-muted-foreground">Welcome to the TopUp page.</p>
      </div>
      <UserCard />
      <form>
        <p>Silahkan masukkan nominal topup</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Input
              type="number"
              placeholder="Nominal TopUp"
              className="w-full"
            />
            <Button type="submit">TopUp</Button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Button variant="outline">Rp 10.000</Button>
            <Button variant="outline">Rp 20.000</Button>
            <Button variant="outline">Rp 50.000</Button>
            <Button variant="outline">Rp 100.000</Button>
            <Button variant="outline">Rp 250.000</Button>
            <Button variant="outline">Rp 500.000</Button>
          </div>
        </div>
      </form>
    </div>
  )
}

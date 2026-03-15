import UserCard from "@/components/user-card"
import { useAuthStore } from "@/store/authStore"
import { useEffect, useState } from "react"

type DataService = {
  service_code: string
  service_name: string
  service_icon: string
  service_tariff: number
}

export default function Transaction() {
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
        <h1 className="text-3xl font-bold">Transaction</h1>
        <p className="mt-2 text-muted-foreground">Welcome to the Transaction page.</p>
      </div>
      <UserCard />
      <div>
        <div className="flex flex-row items-start gap-2 overflow-x-auto">
          {dataServices.map((service) => (
            <div
              key={service.service_code}
              className="flex w-100 flex-col items-center gap-2 text-center"
            >
              <img
                src={service.service_icon}
                alt={service.service_name}
                className="h-12 w-12 object-cover"
              />
              <div>
                <p className="text-sm">{service.service_name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

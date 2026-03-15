import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import UserCard from "@/components/user-card"
import api from "@/lib/api"
import { useState } from "react"
import { toast } from "sonner"
import { useSWRConfig } from "swr"

export default function TopUp() {
  const [amount, setAmount] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  const { mutate } = useSWRConfig()

  const handleTopUp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (amount <= 0) {
      toast.error("Nominal topup harus lebih dari 0")
      return
    }

    setLoading(true)
    try {
      const response = await api.post("/topup", { top_up_amount: amount })
      if (response.data.status === 0) {
        toast.success(response.data.message)
        mutate("/balance")
        setAmount(0)
      } else {
        toast.error(response.data.message)
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Terjadi kesalahan saat top up")
    } finally {
      setLoading(false)
    }
  }



  return (
    <div className="mx-auto flex flex-col gap-10 p-8">
      <div>
        <h1 className="text-3xl font-bold">TopUp</h1>
        <p className="mt-2 text-muted-foreground">Welcome to the TopUp page.</p>
      </div>
      <UserCard />
      <form onSubmit={handleTopUp}>
        <p>Silahkan masukkan nominal topup</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Input
              type="number"
              placeholder="Nominal TopUp"
              className="w-full"
              value={amount || ""}
              onChange={(e) => setAmount(Number(e.target.value))}
              min={10000}
            />
            <Button type="submit" disabled={loading || amount < 10000}>
              {loading ? "Processing..." : "TopUp"}
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[10000, 20000, 50000, 100000, 250000, 500000].map((val) => (
              <Button
                key={val}
                type="button"
                variant="outline"
                onClick={() => setAmount(val)}
              >
                Rp {val.toLocaleString("id-ID")}
              </Button>
            ))}
          </div>
        </div>
      </form>
    </div>
  )
}

import UserCard from "@/components/user-card"
import { useAuthStore } from "@/store/authStore"
import { useEffect, useState } from "react"
import api from "@/lib/api"

type TransactionRecord = {
  invoice_number: string
  transaction_type: string
  description: string
  total_amount: number
  created_on: string
}

export default function Transaction() {
  const token = useAuthStore((s) => s.token)
  const [history, setHistory] = useState<TransactionRecord[]>([])
  const [offset, setOffset] = useState(0)
  const limit = 5

  useEffect(() => {
    if (!token) return

    api
      .get(`/transaction/history?offset=${offset}&limit=${limit}`)
      .then((res) => {
        if (res.data?.data?.records) {
          if (offset === 0) {
            setHistory(res.data.data.records)
          } else {
            setHistory((prev) => [...prev, ...res.data.data.records])
          }
        }
      })
      .catch(() => {})
  }, [offset, token])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString))
  }

  return (
    <div className="mx-auto flex flex-col gap-10 p-8">
      <UserCard />
      <div>
        <h2 className="mb-6 text-xl font-bold text-[#333]">Semua Transaksi</h2>
        <div className="flex flex-col gap-4">
          {history.map((record) => (
            <div
              key={record.invoice_number}
              className="flex flex-col rounded-lg border border-gray-200 p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-lg font-bold ${
                    record.transaction_type === "TOPUP" ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {record.transaction_type === "TOPUP" ? "+" : "-"} {formatCurrency(record.total_amount)}
                </span>
                <span className="text-xs text-muted-foreground">{record.description}</span>
              </div>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground">{formatDate(record.created_on)} WIB</span>
              </div>
            </div>
          ))}
        </div>
        {history.length > 0 && (
          <button
            onClick={() => setOffset((prev) => prev + limit)}
            className="mt-8 block w-full text-center text-sm font-bold text-[#f7311e] hover:underline"
          >
            Show More
          </button>
        )}
        {history.length === 0 && (
          <p className="py-10 text-center text-muted-foreground">Belum ada history transaksi</p>
        )}
      </div>
    </div>
  )
}

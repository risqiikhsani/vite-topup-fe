import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import UserCard from "@/components/user-card"
import api from "@/lib/api"
import { useAuthStore } from "@/store/authStore"
import { useEffect, useState } from "react"

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
  const [selectedInvoice, setSelectedInvoice] =
    useState<TransactionRecord | null>(null)
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
    <div className="flex flex-col gap-10">
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
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-[10px] text-blue-600 hover:text-blue-800"
                  onClick={() => setSelectedInvoice(record)}
                >
                  Show Invoice
                </Button>
              </div>
              <div className="mt-1 flex items-center justify-between">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] text-muted-foreground">{formatDate(record.created_on)} WIB</span>
                </div>
                <p className="text-sm font-medium text-[#333]">{record.description}</p>
                
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

      <Dialog
        open={!!selectedInvoice}
        onOpenChange={(open) => !open && setSelectedInvoice(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center font-bold">
              Invoice Transaksi
            </DialogTitle>
          </DialogHeader>
          {selectedInvoice && (
            <div className="flex flex-col gap-6 py-4">
              <div className="flex flex-col items-center gap-1">
                <p className="text-sm text-muted-foreground">Total Transaksi</p>
                <p
                  className={`text-3xl font-bold ${
                    selectedInvoice.transaction_type === "TOPUP"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {selectedInvoice.transaction_type === "TOPUP" ? "+" : "-"}{" "}
                  {formatCurrency(selectedInvoice.total_amount)}
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Nomor Invoice</span>
                  <span className="font-medium">
                    {selectedInvoice.invoice_number}
                  </span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Tipe Transaksi</span>
                  <span className="font-medium">
                    {selectedInvoice.transaction_type}
                  </span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Deskripsi</span>
                  <span className="font-medium text-right">
                    {selectedInvoice.description}
                  </span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Waktu Transaksi</span>
                  <span className="font-medium">
                    {formatDate(selectedInvoice.created_on)} WIB
                  </span>
                </div>
              </div>

              <Button
                className="mt-4 w-full bg-[#f7311e] hover:bg-[#d12918]"
                onClick={() => setSelectedInvoice(null)}
              >
                Tutup
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

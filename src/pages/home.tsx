import UserCard from "@/components/user-card"
import api from "@/lib/api"
import useSWR, { useSWRConfig } from "swr"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

const fetcher = (url: string) => api.get(url).then((res) => res.data.data)

type DataService = {
  service_code: string
  service_name: string
  service_icon: string
  service_tariff: number
}

type DataBanner = {
  description: string
  banner_name: string
  banner_image: string
}

export default function Home() {
  const { data: dataServices, isLoading: isLoadingServices } = useSWR<DataService[]>(
    "/services",
    fetcher
  )
  const { data: dataBanners, isLoading: isLoadingBanners } = useSWR<DataBanner[]>(
    "/banner",
    fetcher
  )

  const { mutate } = useSWRConfig()
  const [selectedService, setSelectedService] = useState<DataService | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const handlePurchase = async () => {
    if (!selectedService) return

    setIsProcessing(true)
    try {
      const response = await api.post("/transaction", {
        service_code: selectedService.service_code,
      })

      if (response.data.status === 0) {
        const invoiceNumber = response.data.data?.invoice_number
        toast.success(
          `${response.data.message || "Transaksi berhasil"}! No. Invoice: ${invoiceNumber}`
        )
        mutate("/balance")
        setIsDialogOpen(false)
      } else {
        toast.error(response.data.message || "Transaksi gagal")
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Terjadi kesalahan saat transaksi")
    } finally {
      setIsProcessing(false)
    }
  }

  const isLoading = isLoadingServices || isLoadingBanners

  return (
    <div className="mx-auto flex flex-col gap-10 p-8">
      <div>
        <h1 className="text-3xl font-bold">Home</h1>
        <p className="mt-2 text-muted-foreground">Welcome to the Home page.</p>
      </div>
      <UserCard />

      {isLoading ? (
        <div className="flex h-20 items-center justify-center">
          <p className="animate-pulse text-muted-foreground">Loading...</p>
        </div>
      ) : (
        <>
          <div className="flex flex-row items-start gap-2 overflow-x-auto">
            {dataServices?.map((service) => (
              <div
                key={service.service_code}
                className="flex w-100 cursor-pointer flex-col items-center gap-2 text-center"
                onClick={() => {
                  setSelectedService(service)
                  setIsDialogOpen(true)
                }}
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

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Purchase Service</DialogTitle>
                <DialogDescription>
                  Are you sure you want to purchase {selectedService?.service_name} for{" "}
                  <span className="font-bold">
                    Rp {selectedService?.service_tariff.toLocaleString("id-ID")}
                  </span>
                  ?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex flex-row justify-end space-x-2">
                <Button variant="ghost" onClick={() => setIsDialogOpen(false)} disabled={isProcessing}>
                  Batal
                </Button>
                <Button
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={handlePurchase}
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : "Bayar"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <div className="flex flex-row items-start gap-4 overflow-x-auto">
            {dataBanners?.map((banner) => (
              <div
                key={banner.banner_name}
                className="flex w-100 flex-col items-center gap-2 text-center"
              >
                <img
                  src={banner.banner_image}
                  alt={banner.banner_name}
                  className="h-40 w-full rounded-lg object-cover"
                />
                <div>
                  <p className="text-sm">{banner.description}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

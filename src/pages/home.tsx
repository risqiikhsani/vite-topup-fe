import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import UserCard from "@/components/user-card"
import api from "@/lib/api"
import { useAuthStore } from "@/store/authStore"
import { useState } from "react"
import { toast } from "sonner"
import useSWR, { useSWRConfig } from "swr"
import type { DataBanner, DataService } from "@/lib/types"

const fetcher = (url: string) => api.get(url).then((res) => res.data.data)

export default function Home() {
  const { isLoggedIn } = useAuthStore()
  const { data: dataServices, isLoading: isLoadingServices } = useSWR<
    DataService[]
  >("/services", fetcher)
  const { data: dataBanners, isLoading: isLoadingBanners } = useSWR<
    DataBanner[]
  >("/banner", fetcher)

  const { mutate } = useSWRConfig()
  const [selectedService, setSelectedService] = useState<DataService | null>(
    null
  )
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
      toast.error(
        error.response?.data?.message || "Terjadi kesalahan saat transaksi"
      )
    } finally {
      setIsProcessing(false)
    }
  }

  const isLoading = isLoadingServices || isLoadingBanners

  return (
    <>
      {!isLoggedIn ? (
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-3xl font-bold">Selamat Datang</h1>
          <p className="text-muted-foreground">Login terlebih dahulu.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-10">
          <div>
            <h1 className="text-3xl font-bold">Home</h1>
            <p className="mt-2 text-muted-foreground">
              Welcome to the Home page.
            </p>
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
                    <DialogTitle>Beli</DialogTitle>
                    <DialogDescription>
                      Apakah Anda yakin ingin membeli{" "}
                      {selectedService?.service_name} seharga{" "}
                      <span className="font-bold">
                        Rp{" "}
                        {selectedService?.service_tariff.toLocaleString(
                          "id-ID"
                        )}
                      </span>
                      ?
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="flex flex-row justify-end space-x-2">
                    <Button
                      variant="ghost"
                      onClick={() => setIsDialogOpen(false)}
                      disabled={isProcessing}
                    >
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
      )}
    </>
  )
}

export type DataService = {
  service_code: string
  service_name: string
  service_icon: string
  service_tariff: number
}

export type DataBanner = {
  description: string
  banner_name: string
  banner_image: string
}

export type TransactionRecord = {
  invoice_number: string
  transaction_type: string
  description: string
  total_amount: number
  created_on: string
}

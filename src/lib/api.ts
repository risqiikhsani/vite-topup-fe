import axios from "axios"
import { useAuthStore } from "@/store/authStore"

const api = axios.create({
  baseURL: "https://take-home-test-api.nutech-integrasi.com",
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api

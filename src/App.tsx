import { useEffect } from "react"
import { Route, Routes } from "react-router-dom"
import TopUp from "@/pages/TopUp"
import Transaction from "@/pages/Transaction"
import SignIn from "@/pages/SignIn"
import SignUp from "@/pages/SignUp"
import NotFound from "@/pages/NotFound"
import Profile from "@/pages/Profile"
import Home from "./pages/Home"
import { useAuthStore } from "@/store/authStore"
import Layout from "@/components/layout"

const API_URL = import.meta.env.VITE_API_URL

export default function App() {
  const token = useAuthStore((s) => s.token)
  const setProfile = useAuthStore((s) => s.setProfile)

  useEffect(() => {
    if (!token) return

    fetch(`${API_URL}/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((json) => {
        if (json?.data) setProfile(json.data)
      })
      .catch(() => {})
  }, [token, setProfile])

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/topup" element={<TopUp />} />
        <Route path="/transaction" element={<Transaction />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
    </Routes>
  )
}

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
import api from "@/lib/api"

export default function App() {
  const token = useAuthStore((s) => s.token)
  const setProfile = useAuthStore((s) => s.setProfile)

  useEffect(() => {
    if (!token) return

    api
      .get("/profile")
      .then((res) => {
        if (res.data?.data) setProfile(res.data.data)
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

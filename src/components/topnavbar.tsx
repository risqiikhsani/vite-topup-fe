import { useAuthStore } from "@/store/authStore"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "./ui/button"
import Logo from "@/assets/images/Logo.png"

export default function TopNavbar() {
  const { isLoggedIn, logout } = useAuthStore()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate("/signin")
  }

  return (
    <nav className="flex items-center justify-between border-b px-8 py-4">
      <div className="flex items-center gap-4">
        <Link to="/" className="font-medium hover:underline flex items-center gap-2">
          <img src={Logo} alt="Logo" className="h-8" /> <span className="font-bold">SIMS PPOB-RISQI</span>
        </Link>
      </div>
      <div className="flex items-center gap-4">
        {isLoggedIn ? (
          <div className="flex items-center gap-6">
            <Link to="/topup" className="font-medium hover:underline">
              TopUp
            </Link>
            <Link to="/transaction" className="font-medium hover:underline">
              Transaction
            </Link>
            <Link to="/profile" className="font-medium hover:underline">
              Akun
            </Link>
            <Button onClick={handleLogout} className="bg-red-400">Sign Out</Button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link to="/signin" className="text-sm font-medium hover:underline">
              Sign In
            </Link>
            <Link to="/signup" className="text-sm font-medium hover:underline">
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}

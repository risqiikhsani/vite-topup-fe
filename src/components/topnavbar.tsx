import { useAuthStore } from "@/store/authStore"
import { Link, useNavigate } from "react-router-dom"

export default function TopNavbar() {
  const { isLoggedIn, logout } = useAuthStore()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate("/signin")
  }

  return (
    <nav className="flex items-center justify-between border-b px-8 py-3">
      <div className="flex gap-4">
        <Link to="/" className="font-medium hover:underline">
          Home
        </Link>
      </div>
      <div className="flex gap-4">
        {isLoggedIn ? (
          <div className="flex gap-4">
            <Link to="/topup" className="font-medium hover:underline">
              TopUp
            </Link>
            <Link to="/transaction" className="font-medium hover:underline">
              Transaction
            </Link>
            <Link to="/profile" className="font-medium hover:underline">
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-destructive hover:underline"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className="flex gap-4">
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

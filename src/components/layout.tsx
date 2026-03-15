import { Outlet } from "react-router-dom"
import TopNavbar from "./topnavbar"

export default function Layout() {
  return (
    <div className="min-h-screen">
      <TopNavbar />
      <main className="container mx-auto max-w-7xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}

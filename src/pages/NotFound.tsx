import { Link } from "react-router-dom"

export default function NotFound() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">404 – Page Not Found</h1>
      <p className="mt-2 text-muted-foreground">The page you're looking for doesn't exist.</p>
      <Link to="/" className="mt-4 inline-block underline">
        Go home
      </Link>
    </div>
  )
}

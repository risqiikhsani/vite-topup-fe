import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import useSWRMutation from "swr/mutation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import AuthCard from "@/components/auth-card"

const API_URL = import.meta.env.VITE_API_URL

async function registerFetcher(
  url: string,
  {
    arg,
  }: {
    arg: {
      email: string
      first_name: string
      last_name: string
      password: string
    }
  }
) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(arg),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data?.message ?? "Registration failed")
  return data
}

export default function SignUp() {
  const navigate = useNavigate()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const { trigger, isMutating, error } = useSWRMutation(
    `${API_URL}/registration`,
    registerFetcher
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error("Password dan Konfirmasi Password tidak sama")
      return
    }

    try {
      await trigger({
        email,
        first_name: firstName,
        last_name: lastName,
        password,
      })
      toast.success("Registration successful! Please sign in.")
      navigate("/signin")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong")
    }
  }

  return (
    <AuthCard>
      <Card className="border-none shadow-none">
        <CardHeader className="items-center text-center">
          <CardTitle className="text-3xl font-bold">Lengkapi data untuk membuat akun</CardTitle>
          <CardDescription>
            Silakan masukkan data Anda untuk melanjutkan.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <CardContent className="flex flex-col gap-6">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="firstName">Nama Depan</Label>
              <Input
                id="firstName"
                type="text"
                placeholder="nama depan"
                required
                className="h-12"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="lastName">Nama Belakang</Label>
              <Input
                id="lastName"
                type="text"
                placeholder="nama belakang"
                required
                className="h-12"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="masukkan email anda"
                required
                className="h-12"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="buat password anda"
                required
                minLength={8}
                className="h-12"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="konfirmasi password anda"
                required
                minLength={8}
                className="h-12"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            {error instanceof Error && (
              <p className="text-sm text-destructive">{error.message}</p>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button type="submit" className="h-12 w-full bg-[#f7311e] hover:bg-[#d12918]" disabled={isMutating}>
              {isMutating ? "Creating account…" : "Registrasi"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Sudah punya akun?{" "}
              <Link
                to="/signin"
                className="font-bold text-[#f7311e] hover:underline"
              >
                login di sini
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </AuthCard>
  )
}

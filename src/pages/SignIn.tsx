import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import useSWRMutation from "swr/mutation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useAuthStore } from "@/store/authStore"
import AuthCard from "@/components/auth-card"
import api from "@/lib/api"

async function loginFetcher(
  url: string,
  { arg }: { arg: { email: string; password: string } }
) {
  const res = await api.post(url, arg)
  return res.data
}

export default function SignIn() {
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const { trigger, isMutating, error } = useSWRMutation(
    "/login",
    loginFetcher
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      const data = await trigger({ email, password })

      const token = data?.data?.token
      if (token) {
        login(token)
      }

      toast.success(data?.message ?? "Signed in successfully!")
      navigate("/")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong")
    }
  }

  return (
    <AuthCard>
      <Card className="border-none shadow-none">
        <CardHeader className="items-center text-center">
          <CardTitle className="text-3xl font-bold">Masuk atau buat akun untuk memulai</CardTitle>
          <CardDescription>
            Silakan masukkan email dan password Anda.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="flex flex-col gap-6">
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
                placeholder="masukkan password anda"
                required
                className="h-12"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error instanceof Error && (
              <p className="text-sm text-destructive">{error.message}</p>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button type="submit" className="h-12 w-full bg-[#f7311e] hover:bg-[#d12918]" disabled={isMutating}>
              {isMutating ? "Signing in…" : "Masuk"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Belum punya akun?{" "}
              <Link to="/signup" className="font-bold text-[#f7311e] hover:underline">
                registrasi di sini
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </AuthCard>)
}

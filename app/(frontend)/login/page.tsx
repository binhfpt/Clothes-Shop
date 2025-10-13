"use client"
import React, { useMemo, useState } from "react"
import axios, { AxiosError } from "axios"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { LoaderIcon } from 'lucide-react'
import Link from "next/link"
type SignupForm = {
    email: string
    password: string
}

export default function LoginPage() {
    const router = useRouter()
    const [form, setForm] = useState<SignupForm>({
        email: "",
        password: ""
    })
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")

    const onChange =
        (field: keyof SignupForm) =>
            (ev: React.ChangeEvent<HTMLInputElement>) => {
                setForm((prev) => ({ ...prev, [field]: ev.target.value }))
            }

    const onSubmit = async (ev: React.FormEvent) => {
        ev.preventDefault()
        try {
            setLoading(true)
            // KHÔNG gửi repassword
            const payload = {
                email: form.email.trim(),
                password: form.password,
            }
            // Dùng URL tương đối hoặc NEXT_PUBLIC_DOMAIN
            const res = await axios.post("/api/login", payload)
            if (res.data.success) router.push("/home")
            toast.success("Login successfully")

        } catch (err) {
            const ax = err as AxiosError<any>
            const apiMsg =
                ax.response?.data?.message ||
                ax.response?.data?.error ||
                ax.message ||
                "Đăng ký thất bại"
            setMessage(apiMsg)
            toast.error(apiMsg)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-md h-full mx-auto mt-30 mb-30 bg-background space-y-4 px-10 pt-6 pb-10 border-gray-200 border-t-2 rounded-2xl shadow-shadow-best">
            <h1 className="text-3xl  font-bold text-center text-bg-btn-dynamic">
                Login
            </h1>
            {message && <p className="text-center text-sm text-red-500 mt-2">{message}</p>}
            <form className="space-y-4 mt-10" onSubmit={onSubmit} noValidate>
                <div className="space-y-2">
                    <Label className="text-text-l" htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="Enter email"
                        value={form.email}
                        onChange={onChange("email")}
                        autoComplete="email"
                        className="text-text-description
                                    selection:text-text-description selection:bg-foreground"
                    />
                </div>
                <div className="space-y-2">
                    <Label className="text-text-l" htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        placeholder="Enter password"
                        value={form.password}
                        onChange={onChange("password")}
                        autoComplete="new-password"
                        className="text-text-description
                                    selection:text-text-description selection:bg-foreground"
                    />
                </div>
                <Button
                    type="submit"
                    className="w-full bg-bg-btn-dynamic p-6 mt-6 text-text-button shadow-shadow-best hover:bg-btn-hv-bg cursor-pointer hover:text-text-l"
                    disabled={loading}
                >
                    {loading ? <LoaderIcon /> : "Login"}
                </Button>
            </form>
            <div className="flex justify-between">
                <Link href={"/signup"} className="text-center text-sm text-text-description-2 mt-2 hover:text-bg-btn-dynamic font-semibold border-b-2 border-bg-btn-dynamic pb-1">Signup</Link>
                <Link href={"/forgetpassword"} className="text-center text-sm text-text-description-2 mt-2 hover:text-bg-btn-dynamic font-semibold border-b-2 border-bg-btn-dynamic pb-1">Forget password</Link>
            </div>

        </div>
    )
}

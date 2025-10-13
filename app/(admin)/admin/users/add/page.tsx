"use client"
import React, { useMemo, useState } from "react"
import axios, { AxiosError } from "axios"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { LoaderIcon } from 'lucide-react'
import { Card } from "@/components/ui/card"
type SignupForm = {
    email: string
    password: string
    username: string
    phone: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^[0-9+\-\s]{8,20}$/ // tùy luật của bạn

export default function AdminSignupPage() {
    const router = useRouter()
    const [form, setForm] = useState<SignupForm>({
        email: "",
        password: "",
        username: "",
        phone: "",
    })
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")

    const errors = useMemo(() => {
        const e: Partial<Record<keyof SignupForm, string>> = {}
        const email = form.email.trim()
        const username = form.username.trim()
        const phone = form.phone.trim()

        if (!username) e.username = "Username is required"
        if (!EMAIL_RE.test(email)) e.email = "Email is invalid"
        if (!PHONE_RE.test(phone)) e.phone = "Phone is invalid"
        if (form.password.length < 6) e.password = "Password must be ≥ 6 chars"
        return e
    }, [form])

    const isValid = useMemo(() => Object.keys(errors).length === 0, [errors])

    const onChange =
        (field: keyof SignupForm) =>
            (ev: React.ChangeEvent<HTMLInputElement>) => {
                setForm((prev) => ({ ...prev, [field]: ev.target.value }))
            }

    const onSubmit = async (ev: React.FormEvent) => {
        ev.preventDefault()
        if (!isValid) {
            toast.error("Vui lòng kiểm tra lại thông tin.", { style: { boxShadow: "none" } })
            return
        }

        try {
            setLoading(true)
            // KHÔNG gửi repassword
            const payload = {
                email: form.email.trim(),
                password: form.password,
                username: form.username.trim(),
                phone: form.phone.trim(),
            }

            // Dùng URL tương đối hoặc NEXT_PUBLIC_DOMAIN
            const res = await axios.post("/api/signup", payload)

            setMessage(res.data?.message ?? "Registered successfully")
            toast.success("Sign up Successfully", { style: { boxShadow: "none" } })

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
        <div className="max-w-md ml-70 bg-background px-10 pt-6 pb-10 border-gray-200 border-t-2 rounded-2xl shadow-shadow-best">
            <h1 className="text-3xl font-bold text-center mb-10 text-bg-btn-dynamic">
                New User
            </h1>

            <form className="space-y-4" onSubmit={onSubmit} noValidate>
                <div className="space-y-2">
                    <Label className="text-text-l" htmlFor="username">Username</Label>
                    <Input
                        id="username"
                        type="text"
                        placeholder="Enter username"
                        value={form.username}
                        onChange={onChange("username")}
                        autoComplete="username"
                        className="text-text-description
                                    selection:text-text-description selection:bg-foreground"
                        aria-invalid={!!errors.username}
                    />
                    {errors.username && <p className="text-sm text-red-500">{errors.username}</p>}
                </div>

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
                        aria-invalid={!!errors.email}
                    />
                    {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                    <Label className="text-text-l" htmlFor="phone">Phone</Label>
                    <Input
                        id="phone"
                        type="tel"
                        placeholder="Enter phone number"
                        value={form.phone}
                        onChange={onChange("phone")}
                        autoComplete="tel"
                        className="text-text-description
                                    selection:text-text-description selection:bg-foreground"
                        aria-invalid={!!errors.phone}
                    />
                    {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
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
                        aria-invalid={!!errors.password}
                    />
                    {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                </div>

                <Button
                    type="submit"
                    className="w-full py-6 bg-bg-btn-dynamic text-text-button  hover:bg-foreground hover:text-text-l"
                    disabled={!isValid || loading}
                >
                    {loading ? <LoaderIcon /> : "ADD"}
                </Button>
                <div className="w-full text-center font-semibold dark:bg-lightground text-text-l  cursor-pointer dark:hover:text-text-l hover:text-bg-btn-dynamic border-[var(--border-light)] " onClick={() => router.push("/admin/users")} >Back to user page</div>
            </form>


            {message && <p className="text-center text-sm text-gray-600 mt-2">ADD Successfully</p>}
        </div>
    )
}

"use client"
import { useEffect, useState } from "react"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { LoaderIcon, Image as ImageIcon } from "lucide-react"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

export default function BrandForm({ onAdd }: { onAdd: (brand: any) => void }) {
    const [logo, setLogo] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [logoUrl, setLogoUrl] = useState("")
    const [name, setName] = useState("")
    const [error, setError] = useState<string | null>(null)

    // cleanup blob url
    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview)
        }
    }, [preview])

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        // optional: validate size/type
        if (!file.type.startsWith("image/")) {
            setError("File phải là ảnh")
            return
        }
        if (file.size > 5 * 1024 * 1024) { // 5MB
            setError("Ảnh quá lớn (max 5MB)")
            return
        }
        setError(null)
        setLogo(file)
        setLogoUrl("")
        const url = URL.createObjectURL(file)
        setPreview((old) => {
            if (old) URL.revokeObjectURL(old)
            return url
        })
    }

    // 👉 Unsigned upload (demo). Đặt preset KHÔNG có dấu cách, ví dụ: "clothes_shop"
    const handleUpload = async () => {
        if (!logo) throw new Error("Chưa chọn ảnh")
        if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
            throw new Error("Thiếu NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME")
        }

        const formData = new FormData()
        formData.append("file", logo)
        formData.append("upload_preset", "clothes_shop") // đổi sang preset thật của bạn

        const res = await fetch(
            `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
            { method: "POST", body: formData }
        )
        if (!res.ok) {
            const t = await res.text().catch(() => "")
            throw new Error(`Upload thất bại: ${t || res.status}`)
        }
        const data = await res.json()
        setLogoUrl(data.secure_url as string)
        return data.secure_url as string
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (!name.trim()) {
            setError("Hãy nhập tên brand")
            return
        }
        if (!logo && !logoUrl) {
            setError("Hãy chọn logo")
            return
        }

        try {
            setLoading(true)
            let finalLogoUrl = logoUrl
            if (!finalLogoUrl) {
                finalLogoUrl = await handleUpload() // <- dùng return, KHÔNG lấy từ state
                setLogoUrl(finalLogoUrl)            // (tuỳ chọn) đồng bộ lại state để UI biết
            }

            const res = await fetch("/api/add/brand", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: name.trim(), logo: finalLogoUrl }),
            })
            if (!res.ok) {
                const t = await res.text().catch(() => "")
                throw new Error(`Tạo brand thất bại: ${t || res.status}`)
            }
            const data = await res.json()
            console.log("Added brand:", data)
            onAdd(data.brand)

            // Reset form (nếu muốn)
            setName("")
            setLogo(null)
            if (preview) URL.revokeObjectURL(preview)
            setPreview(null)
            setLogoUrl("")

            // Option: tự đóng dialog bằng click vào DialogClose
            // (Ở đây mình không auto-close để bạn xem log; nếu muốn auto-close
            // có thể wrap nút Add bằng <DialogClose asChild> khi submit xong.)
        } catch (err: any) {
            setError(err?.message || "Có lỗi xảy ra")
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Dialog>
                <form onSubmit={handleSubmit}>
                    <DialogTrigger asChild>
                        <Button className="bg-btn-hv-bg hover:bg-bg-btn-dynamic cursor-pointer p-6">Add New Brand</Button>
                    </DialogTrigger>

                    <DialogContent id="brand-dialog" className="sm:max-w-[700px] flex gap-6">
                        {/* left side */}
                        <div className="flex flex-col w-1/2 gap-4">
                            <DialogHeader>
                                <DialogTitle className="text-bg-btn-dynamic text-center">New Brand</DialogTitle>
                                <DialogDescription>
                                    Add new brand to your shop here. Click Add when you&apos;re done.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="flex flex-col gap-3">
                                <Label htmlFor="name" className="text-text-l">Name</Label>
                                <Input id="name" name="name" className="text-text-l" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter brand name" />
                            </div>

                            <div className="flex flex-col gap-3">
                                <Label htmlFor="logo" className="text-text-l">Picture - Logo</Label>
                                <input
                                    type="file"
                                    id="logo"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                                <label
                                    htmlFor="logo"
                                    className="bg-header-table cursor-pointer rounded-md flex items-center justify-center py-2 transition-all hover:bg-header-table"
                                >
                                    <ImageIcon size={24} className="text-bg-btn-dynamic" />
                                </label>
                                {error && <p className="text-red-500 text-sm">{error}</p>}
                            </div>

                            <Button disabled={loading} type="button" onClick={handleSubmit}
                                className="cursor-pointer hover:bg-bg-btn-dynamic bg-btn-hv-bg transition-all py-6"
                            >
                                {loading ? "Saving..." : "Add"}
                            </Button>
                        </div>

                        {/* right side */}
                        <div className="w-1/2 flex items-center justify-center bg-gray-50 rounded-md border">
                            {preview ? (
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="max-w-full max-h-[250px] object-contain rounded-md"
                                />
                            ) : (
                                <p className="text-gray-400">No image selected</p>
                            )}
                        </div>
                    </DialogContent>
                </form>
            </Dialog>

        </>

    )
}

"use client"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import axios from "axios"
export default function LogoutButton() {
    const router = useRouter()

    const handleLogout = async () => {
        try {
            await axios.get("/api/logout")
            router.push("/login")
        } catch (err) {
            console.error("Logout failed:", err)
        }
    }

    return (
        <div className="flex gap-2 w-full h-full items-center" onClick={handleLogout}>
            <LogOut />
            <button >Log out</button>
        </div>
    )
}

"use client"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { useDispatch } from "react-redux";
import { clearMe } from "@/app/redux/slice/user/me";
export default function LogoutButton() {
    const dispatch = useDispatch();
    const router = useRouter()

    const handleLogout = async () => {
        try {
            await axios.get("/api/logout")
            dispatch(clearMe())
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

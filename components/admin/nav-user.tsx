"use client"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Settings, User } from "lucide-react"
import Link from "next/link"
import LogoutButton from "../logout-button"
import { useEffect, useState } from "react"

export function NavUser() {
    const [admin, setAdmin] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const getAdmin = async () => {
            try {
                const res = await fetch("/api/me", {
                    cache: "no-cache",
                    method: "GET"
                })
                if (!res.ok) {
                    throw new Error('Failed to fetch user')
                }

                const data = await res.json()
                setAdmin(data.user)
            } catch (error) {
                console.error('Error fetching user:', error)
            } finally {
                setLoading(false)
            }
        }

        getAdmin()
    }, [])

    if (loading) {
        return (
            <SidebarMenu className="bg-gray-100 rounded-xl py-2 shadow-lg shadow-gray-300 border-b-7 border-gray-300">
                <SidebarMenuItem>
                    <div className="px-2 py-1.5">
                        <div className="animate-pulse flex items-center space-x-2">
                            <div className="rounded-lg bg-gray-300 h-8 w-8"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-300 rounded w-24"></div>
                                <div className="h-3 bg-gray-300 rounded w-32"></div>
                            </div>
                        </div>
                    </div>
                </SidebarMenuItem>
            </SidebarMenu>
        )
    }

    if (!admin) {
        return (
            <SidebarMenu className="bg-gray-100 rounded-xl py-2 shadow-lg shadow-gray-300 border-b-7 border-gray-300">
                <SidebarMenuItem>
                    <div className="px-2 py-1.5 text-sm text-gray-500">
                        Vui lòng đăng nhập
                    </div>
                </SidebarMenuItem>
            </SidebarMenu>
        )
    }

    return (
        <SidebarMenu className="bg-gray-100 rounded-xl py-2 shadow-lg shadow-gray-300 border-b-7 border-gray-300">
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar className="h-8 w-8 rounded-lg grayscale">
                                <AvatarImage src={"/image.png"} alt={admin.username || "User"} />
                                <AvatarFallback className="rounded-lg">
                                    {admin.username?.charAt(0)?.toUpperCase() || 'U'}
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">{admin.username || 'User'}</span>
                                <span className="text-muted-foreground truncate text-xs">
                                    {admin.email || 'No email'}
                                </span>
                            </div>
                            <Settings />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarImage src={"/image.png"} alt={admin.username || "User"} />
                                    <AvatarFallback className="rounded-lg">
                                        {admin.username?.charAt(0)?.toUpperCase() || 'U'}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">{admin.username || 'User'}</span>
                                    <span className="text-muted-foreground truncate text-xs">
                                        {admin.email || 'No email'}
                                    </span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <Link className="flex gap-2 w-full" href={"/admin/account"}>
                                    <User />
                                    Account
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <LogoutButton />
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
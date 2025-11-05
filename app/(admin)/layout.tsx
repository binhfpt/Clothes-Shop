"use client"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AdminSidebar } from "@/components/admin/sidebar"
import { usePathname } from "next/navigation";
import CurrentPath from "../helpers/current-path";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <AdminSidebar />
            <main className="flex flex-col w-full min-h-screen bg-background overflow-x-hidden">
                <div className="w-full flex items-center gap-x-2 py-2 mb-5 rounded-none border-b-4 text-start">
                    <SidebarTrigger className="text-gray-950" />
                    <p className="text-sm font-medium"></p>
                    <CurrentPath />
                </div>

                <div className="flex-1 flex justify-center items-start overflow-x-hidden">
                    <div className="w-full max-w-full overflow-x-hidden px-4">
                        {children}
                    </div>
                </div>
            </main>
        </SidebarProvider>
    )
}
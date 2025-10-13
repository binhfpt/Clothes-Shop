// app/(frontend)/layout.tsx
"use client";
import NavBar from "@/components/ui/navbar";
import { Geist, Geist_Mono } from "next/font/google";
import { useMemo, useState } from "react";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
    const [dark, setDark] = useState(false);
    const rootClass = useMemo(
        () => (dark ? "dark" : ""),
        [dark]
    );
    return (
        <div
            className={`${rootClass} min-h-screen flex flex-col antialiased 
              bg-[linear-gradient(to_bottom,var(--primary),var(--secondary))] 
              bg-fixed`}
        >
            <NavBar onDarkmode={setDark} initialDark={false} />
            <div className="flex-1">

                {children}
            </div>
        </div>
    );
}

"use client"
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
    Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "./button";
import { Label } from "./label";
import { Input } from "./input";
import { Moon, Sun } from "lucide-react";
// giữ nguyên các import khác...

type NavBarProps = {
    onDarkmode?: (isOn: boolean) => void;   // callback lên cha (optional)
    initialDark?: boolean;                  // nếu muốn
};

const NavBar = ({ onDarkmode, initialDark = false }: NavBarProps) => {
    const [isOn, setIsOn] = useState(initialDark);

    // thông báo lên cha mỗi khi isOn đổi
    useEffect(() => {
        onDarkmode?.(isOn);
    }, [isOn, onDarkmode]);
    return (
        <nav className="w-full  top-0 py-2 bg-background shadow-md  dark:border-gray-700 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <Link href="/" className="flex-shrink-0 text-xl font-bold text-bg-btn-dynamic">
                        Inv1nc1ble
                    </Link>

                    <div className="hidden md:flex space-x-6">
                        <a className="text-text-l hover:text-bg-btn-dynamic">Home</a>
                        <a className="text-text-l hover:text-bg-btn-dynamic">About</a>
                        <a className="text-text-l hover:text-bg-btn-dynamic">Services</a>
                        <a className="text-text-l hover:text-bg-btn-dynamic">Contact</a>
                    </div>

                    <div className="hidden md:flex items-center gap-3">


                        <Link href={"/login"}>
                            <Button className="bg-bg-btn-dynamic text-text-button hover:bg-btn-hv-bg cursor-pointer">Log in</Button>
                        </Link>


                        <button className="w-10 h-10 flex items-center justify-center rounded-ful cursor-pointer -gray-700 transition" onClick={() => setIsOn(v => !v)}>

                            {isOn ? (
                                <Sun className="text-text-l" />

                            ) : (
                                <Moon className="text-text-l " />
                            )}

                        </button>

                    </div>

                    <div className="md:hidden">{/* icon menu ... */}</div>
                </div>
            </div>
        </nav>
    );
};
export default NavBar;

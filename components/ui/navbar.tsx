"use client"
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"

import {
    Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "./button";
import { Label } from "./label";
import { Input } from "./input";
import { CircleUserRound, DoorOpenIcon, Fingerprint, Heart, HelpCircle, Moon, Settings, ShoppingCart, Sun, User2 } from "lucide-react";
import { useGetClientInformationQuery } from "@/app/redux/api/meAPI";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "./dropdown-menu";
import LogoutButton from "../logout-button";
// giữ nguyên các import khác...

type NavBarProps = {
    onDarkmode?: (isOn: boolean) => void;   // callback lên cha (optional)
    initialDark?: boolean;                  // nếu muốn
};

const NavBar = ({ onDarkmode, initialDark = false }: NavBarProps) => {
    const [isOn, setIsOn] = useState(initialDark);

    const { data, error, isLoading } = useGetClientInformationQuery()

    // thông báo lên cha mỗi khi isOn đổi
    useEffect(() => {
        onDarkmode?.(isOn);
    }, [isOn, onDarkmode]);
    return (
        <nav id="navbar" className="w-full  top-0 py-1.5 bg-background shadow-md  dark:border-gray-700 z-50">
            <div className="flex justify-between w-full h-16 items-center">
                <Link href="/" className="flex-shrink-0 ml-20 text-xl font-bold text-bg-btn-dynamic">
                    Inv1nc1ble
                </Link>

                {/* <div className="hidden  md:flex space-x-6">
                        <a className="text-text-l hover:text-bg-btn-dynamic">Home</a>
                        <a className="text-text-l hover:text-bg-btn-dynamic">About</a>
                        <a className="text-text-l hover:text-bg-btn-dynamic">Services</a>
                        <a className="text-text-l hover:text-bg-btn-dynamic">Contact</a>
                    </div> */}

                <div className="hidden md:flex items-center mr-8 gap-3">

                    {isLoading ? <div className="flex items-center space-x-4">
                        <Skeleton className="h-8 w-8 rounded-full" />
                    </div> : data && data.user ?
                        <DropdownMenu >
                            <DropdownMenuTrigger asChild>
                                <Avatar>
                                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side="left" className="w-56" align="center">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuGroup>
                                    <DropdownMenuItem>
                                        Profile
                                        <DropdownMenuShortcut><User2 /></DropdownMenuShortcut>

                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        Billing
                                        <DropdownMenuShortcut><Fingerprint /></DropdownMenuShortcut>

                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        Settings
                                        <DropdownMenuShortcut><Settings /></DropdownMenuShortcut>

                                    </DropdownMenuItem>

                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    {/* <DropdownMenuSub>
                                        <DropdownMenuSubTrigger>Products</DropdownMenuSubTrigger>
                                        <DropdownMenuPortal>
                                            <DropdownMenuSubContent>
                                                <DropdownMenuItem>Email</DropdownMenuItem>
                                                <DropdownMenuItem>Message</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem>More...</DropdownMenuItem>
                                            </DropdownMenuSubContent>
                                        </DropdownMenuPortal>
                                    </DropdownMenuSub> */}
                                    <DropdownMenuItem>
                                        Products
                                        <DropdownMenuShortcut><Heart fill="red" strokeWidth={0.5} /></DropdownMenuShortcut>

                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        Brands
                                        <DropdownMenuShortcut><Heart fill="red" strokeWidth={0.5} /></DropdownMenuShortcut>

                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Support
                                    <DropdownMenuShortcut><HelpCircle /></DropdownMenuShortcut>

                                </DropdownMenuItem>
                                <DropdownMenuItem disabled>...</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <LogoutButton />
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        : <Link href={"/login"}>
                            <Button className="bg-bg-btn-dynamic text-text-button hover:bg-btn-hv-bg cursor-pointer">Log in</Button>
                        </Link>}

                    <Sheet>
                        <SheetTrigger asChild>
                            <div className="relative h-10 w-8 flex justify-between items-center ">
                                <ShoppingCart className="text-text-l cursor-pointer" />
                                <div className="w-5 h-5 cursor-pointer rounded-full flex items-center justify-center text-xs absolute top-0 right-0 font-satoshi font-semibold bg-red-500 text-white">
                                    12
                                </div>
                            </div>
                        </SheetTrigger>
                        <SheetContent>
                            <SheetHeader>
                                <SheetTitle>Edit profile</SheetTitle>
                                <SheetDescription>
                                    Make changes to your profile here. Click save when you&apos;re done.
                                </SheetDescription>
                            </SheetHeader>
                            <div className="grid flex-1 auto-rows-min gap-6 px-4">
                                <div className="grid gap-3">
                                    <Label htmlFor="sheet-demo-name">Name</Label>
                                    <Input id="sheet-demo-name" defaultValue="Pedro Duarte" />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="sheet-demo-username">Username</Label>
                                    <Input id="sheet-demo-username" defaultValue="@peduarte" />
                                </div>
                            </div>
                            <SheetFooter>
                                <Button type="submit">Save changes</Button>
                                <SheetClose asChild>
                                    <Button variant="outline">Close</Button>
                                </SheetClose>
                            </SheetFooter>
                        </SheetContent>
                    </Sheet>


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
        </nav>
    );
};
export default NavBar;

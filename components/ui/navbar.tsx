"use client"
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
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
import { CircleUserRound, DoorOpenIcon, Fingerprint, Heart, HelpCircle, Minus, Moon, Plus, Settings, ShoppingCart, Sun, Trash, User2, X } from "lucide-react";
import { useGetClientInformationQuery } from "@/app/redux/api/meAPI";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "./dropdown-menu";
import LogoutButton from "../logout-button";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store/store";
// giữ nguyên các import khác...

type NavBarProps = {
    onDarkmode?: (isOn: boolean) => void;
    initialDark?: boolean;
};

const NavBar = ({ onDarkmode, initialDark = false }: NavBarProps) => {
    const [isOn, setIsOn] = useState(initialDark);
    const productCards = useSelector((state: RootState) => state.productCard.productCards)
    const { data, error, isLoading } = useGetClientInformationQuery()

    const myCards = useMemo(() => {
        const map: Record<any, any> = {}
        for (const v of productCards) {
            const key = `${v.variant.sku}`
            if (!map[key]) {
                map[key] = { ...v, count: 1 }
            } else {
                map[key].count += 1
            }
        }
        return Object.values(map)
    }, [productCards])
    // thông báo lên cha mỗi khi isOn đổi
    const totalMoney = useMemo(() => {
        let temp = 0
        myCards.map((mc: any, ind: number) => (
            temp += mc.variant.price * mc.count
        ))
        return temp
    }, [myCards])
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
                            <div onClick={() => console.log(myCards)} className="relative h-10 w-8 flex justify-between items-center ">
                                <ShoppingCart className="text-text-l cursor-pointer" />
                                <div className="w-5 h-5 cursor-pointer rounded-full flex items-center justify-center text-xs absolute top-0 right-0 font-satoshi font-semibold bg-red-500 text-white">
                                    {productCards.length}
                                </div>
                            </div>
                        </SheetTrigger>
                        <SheetContent className="max-h-screen overflow-y-auto">
                            <SheetHeader>
                                <SheetTitle className="text-gray-800">Manage your cards</SheetTitle>
                                <SheetDescription className="text-gray-700">
                                    Make changes to your cards here. Click save when you&apos;re done.
                                </SheetDescription>
                            </SheetHeader>
                            <>
                                <div className="grid flex-1 auto-rows-min gap-6 px-4">
                                    {myCards.map((mc: any, ind: number) => (
                                        <div key={mc.variant.sku}>
                                            <div className="w-full  flex gap-5  h-40">
                                                <div style={{ backgroundImage: `url(${mc.product.images[0]})` }} className="w-[30%] rounded-2xl h-full bg-cover bg-center">

                                                </div>
                                                <div className="w-[70%] flex-col flex gap-0.5 h-full">
                                                    <div className="text-neutral-800 font-sans h-full font-semibold line-clamp-2 break-words">{mc.product.title}</div>
                                                    <div className="flex gap-1 items-center">
                                                        <div className="text-neutral-500">{mc.variant.color}</div>
                                                        <div>|</div>
                                                        <div className="text-neutral-500">{mc.variant.size}</div>
                                                    </div>
                                                    <div className='flex gap-2  items-center '>
                                                        <div className='text-neutral-800' >Amout:</div>
                                                        <Minus size={18} className='text-gray-400 cursor-pointer  hover:text-bg-btn-dynamic' />

                                                        <div className={` bg-neutral-100 px-3 py-1 text-xl text-red-400 font-semibold`}  >{mc.count}</div>
                                                        <Plus size={18} className='text-gray-400 cursor-pointer  hover:text-bg-btn-dynamic' />
                                                    </div>

                                                    <div className="flex h-full justify-end flex-col  ">
                                                        <div className="flex justify-between items-center">
                                                            <h3
                                                                style={{ fontSize: "16px" }}
                                                                className="text-green-500 w-20 border-2 flex items-center hover:bg-green-50 cursor-pointer  justify-center rounded-2xl px-5 py-1.5 border-green-500 "
                                                            >
                                                                ${mc.variant.price * mc.count}
                                                            </h3>
                                                            <h3
                                                                style={{ fontSize: "16px" }}
                                                                className="text-red-500   flex items-center hover:bg-red-50 cursor-pointer  justify-center  rounded-2xl px-2.5 py-1.5 border-red-500 "
                                                            >
                                                                <Trash size={20} />
                                                            </h3>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="w-full h-[1px] bg-neutral-200"></div>
                                        </div>
                                    ))}
                                    {myCards.length > 0 ? <div className="flex justify-between px-5 items-center">
                                        <div className="text-neutral-800 ">
                                            Sub-Total:
                                        </div><div className="text-xl text-red-500">
                                            ${totalMoney}
                                        </div>
                                    </div> : ""}
                                    {myCards.length > 0 ?
                                        <div className="flex w-full justify-center gap-2">
                                            <h3
                                                style={{ fontSize: "16px" }}
                                                className="text-gray-800 w-[45%] border-2 flex items-center hover:bg-gray-50 cursor-pointer  justify-center rounded-4xl px-5 py-3 font-semibold border-gray-300 "
                                            >
                                                View card
                                            </h3><h3
                                                style={{ fontSize: "16px" }}
                                                className="text-gray-50 w-[45%] border-2 flex items-center hover:bg-gray-700 bg-gray-800 cursor-pointer  justify-center rounded-4xl px-5 py-3  font-semibold"
                                            >
                                                Check out
                                            </h3>
                                        </div> : ""}
                                </div>

                            </>
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

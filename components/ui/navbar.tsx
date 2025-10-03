import Link from "next/link";
import React from "react";
import {
    Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "./button";
import { Label } from "./label";
import { Input } from "./input";
// giữ nguyên các import khác...

const NavBar = () => {
    return (
        <nav className="sticky top-0 bg-white shadow-md z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <Link href="/" className="flex-shrink-0 text-xl font-bold text-bg-btn-dynamic">
                        MyBrand
                    </Link>

                    <div className="hidden md:flex space-x-6">
                        <a className="text-gray-700 hover:text-bg-btn-dynamic">Home</a>
                        <a className="text-gray-700 hover:text-bg-btn-dynamic">About</a>
                        <a className="text-gray-700 hover:text-bg-btn-dynamic">Services</a>
                        <a className="text-gray-700 hover:text-bg-btn-dynamic">Contact</a>
                    </div>

                    <div className="hidden md:flex items-center gap-3">
                        <Dialog>
                            <form>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="bg-bg-btn-dynamic cursor-pointer">Open Dialog</Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle className="text-text-tilte">Login</DialogTitle>
                                        <DialogDescription className="text-text-description">
                                            Make changes to your profile here. Click save when you&apos;re
                                            done.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 ">
                                        <div className="grid gap-3">
                                            <Label htmlFor="name-1" className="text-text-tilte">Name</Label>
                                            <Input id="name-1" name="name" defaultValue="Pedro Duarte" />
                                        </div>
                                        <div className="grid gap-3">
                                            <Label htmlFor="username-1" className="text-text-tilte" >Username</Label>
                                            <Input id="username-1" name="username" defaultValue="@peduarte" />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button variant="outline">Cancel</Button>
                                        </DialogClose>
                                        <Button type="submit">Save changes</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </form>
                        </Dialog>


                    </div>

                    <div className="md:hidden">{/* icon menu ... */}</div>
                </div>
            </div>
        </nav>
    );
};
export default NavBar;

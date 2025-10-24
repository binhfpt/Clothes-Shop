"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button'
import React from 'react'
import { ArrowRight, UserIcon, Shirt, Store, GalleryHorizontalEnd, TicketSlash } from "lucide-react";
import Link from 'next/link';

const dashData = [
    {
        name: "Products",
        description: "Manage all store products",
        icon: Shirt,
        arrowIcon: ArrowRight,
        webName: "@Inv1nc1ble",
        link: "/admin/products",
    },
    {
        name: "Users",
        description: "Manage all registered users",
        icon: UserIcon,
        arrowIcon: ArrowRight,
        webName: "@Inv1nc1ble",
        link: "/admin/users",
    },
    {
        name: "Brands",
        description: "Manage all brands",
        icon: Store,
        arrowIcon: ArrowRight,
        webName: "@Inv1nc1ble",
        link: "/admin/brand",
    }, {
        name: "Categories",
        description: "Manage all categories ",
        icon: GalleryHorizontalEnd,
        arrowIcon: ArrowRight,
        webName: "@Inv1nc1ble",
        link: "/admin/category",
    },
    {
        name: "Vouchers",
        description: "Manage all vouchers",
        icon: TicketSlash,
        arrowIcon: ArrowRight,
        webName: "@Inv1nc1ble",
        link: "/admin/voucher",
    },

    // ... các mục khác giữ nguyên
]

// Mảng màu cố định cho từng card


const AdminDashboard = () => {
    return (
        <div className="ml-10 flex flex-wrap gap-x-6 gap-y-6">
            {dashData.map(({ name, description, icon: Icon, arrowIcon: ArrowIcon, webName, link }, index) => (
                <Tooltip key={link}>
                    <TooltipTrigger asChild>
                        <Link href={link} className='shadow-shadow-best border-2 rounded-2xl w-[280px] h-[200px]'>
                            <Card
                                className="flex flex-col justify-between text-center w-[280px] h-[200px] rounded-2xl  p-4 hover:shadow-lg hover:scale-[1.02] hover:bg-[linear-gradient(to_bottom,var(--primary),var(--secondary))] hover:border cursor-pointer
                                bg-background "
                            >
                                {/* Header */}
                                <CardHeader>
                                    <div className="flex justify-between items-center">
                                        <Icon fill='var(--color-dynamic)' className="w-6 h-6 text-gray-600" />
                                        <ArrowIcon className="w-6 h-6 text-gray-400" />
                                    </div>
                                </CardHeader>

                                {/* Title + Description */}
                                <CardHeader className="space-y-1">
                                    <CardTitle className="text-2xl font-bold truncate text-bg-btn-dynamic font-satoshi">{name}</CardTitle>
                                    <CardDescription className="text-base line-clamp-2 font-satoshi">{description}</CardDescription>
                                </CardHeader>

                                {/* Footer */}
                                <CardFooter className="justify-center mt-auto font-sans">
                                    <CardDescription className="text-xs text-muted-foreground truncate">
                                        {webName}
                                    </CardDescription>
                                </CardFooter>
                            </Card>
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent className='bg-gray-950'>
                        <p>{description}</p>
                    </TooltipContent>
                </Tooltip>
            ))}
        </div>
    );
};

export default AdminDashboard;

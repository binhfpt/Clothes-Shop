"use client"
import BrandForm from '@/components/admin/brand-form'
import React, { useEffect, useState } from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { BinhDropdownMenuGeneric } from '@/components/admin/drop-down-setting'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import useFetch from '@/app/hooks/useFetchData'
const BrandPage = () => {
    const [newBrand, SetNewBrand] = useState<any>(null)
    const [brands, setBrands] = useState<any>([])
    const { data, error, loading } = useFetch("/api/brand", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    useEffect(() => {
        if (data && data.brands) {
            setBrands(data.brands)
        }
    }, [data])
    useEffect(() => {
        if (newBrand) {
            setBrands((prev: any) => [...prev, newBrand])
        }
    }, [newBrand])
    if (loading) return <div>LOADING....</div>
    if (error) return <div>error: {error}</div>
    if (!data || data.brands?.length === 0) return <div>Empty brand</div>

    return (
        <div className='flex flex-col ml-5 mr-5'>
            <div className="space-y-4">
                <div className="flex justify-evenly items-center">
                    <h2 className="text-lg font-semibold text-text-tilte">All Brands</h2>
                    <div className='flex flex-col gap-6'>
                        <Input
                            className=' w-[350px] text-black'
                            // onChange={(e) => setSearch(e.target.value)}
                            // value={search}
                            type='text'
                            placeholder='Search user by name or email'
                        />

                    </div>
                    <BrandForm onAdd={SetNewBrand} />
                </div>

                <Table className=''>
                    <TableHeader className='h-15 border-b-2 border-btn-hv-bg'>
                        <TableRow className="bg-background ">
                            <TableHead className='text-lightground w-[400px]  '>Brand</TableHead>
                            <TableHead className='text-lightground w-[100px] '>Status</TableHead>
                            <TableHead className='text-lightground w-[100px] '>Amout of products</TableHead>
                            <TableHead className='text-lightground w-[100px] '>Create At</TableHead>
                            <TableHead className='text-lightground w-[100px] '>Action</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody className='h-60'>
                        {brands.map((brand: any) => (
                            <TableRow key={brand._id} className="border-b-2 border-foreground">
                                <TableCell >
                                    <div className='flex items-center gap-2'>
                                        <Avatar className='w-12 h-12'>
                                            <AvatarImage src={brand.logo} className="object-cover" alt="@shadcn" />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>
                                        <div className='flex flex-col'>
                                            <h2 className='text-text-tilte '>{brand.name}</h2>
                                            <h4 className='text-lightground text-[12px]'>{brand.slug}</h4>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>{brand.isActive}</TableCell>
                                <TableCell>189</TableCell>
                                <TableCell>{brand.createdAt}</TableCell>
                                <TableCell>Click</TableCell>
                            </TableRow>
                        ))}

                    </TableBody>
                </Table>
            </div>

        </div>
    )
}

export default BrandPage
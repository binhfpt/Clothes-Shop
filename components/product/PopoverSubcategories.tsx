"use client"
import React, { useEffect, useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { BookMarked, ChevronDown, Palette, Trello } from 'lucide-react'
import NoDataFound from '../ui/nodata'
import LoadingBig from '../loading-big'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/app/redux/store/store'
import { Checkbox } from '../ui/checkbox'
import { useGetSubCategoriesQuery } from '@/app/redux/api/categoryAPI'
import { useGetbrandsQuery } from '@/app/redux/api/brandAPI'
import { useGetProductsQuery } from '@/app/redux/api/productAPI'
import { PopoverClose } from '@radix-ui/react-popover'
import { setSubCategory } from '@/app/redux/slice/subcategory/subcategoriesSelected'
import { setcolor } from '@/app/redux/slice/product/colorSelected'
import { setbrand } from '@/app/redux/slice/brand/brandSelected'

const PopoverSubcategories = ({ type }: { type: string }) => {

    const { data: sub, error: suberror, isLoading: subisLoading } = useGetSubCategoriesQuery()
    const { data: brand, error: branderror, isLoading: brandisLoading } = useGetbrandsQuery()
    const { data: products, error: productserror, isLoading: productsisLoading } = useGetProductsQuery()
    const dispatch = useDispatch()


    const raw_colors = Array.from(
        new Set(
            products?.products?.flatMap((p: any) =>
                p.variants.map((v: any) => v.color)
            )
        )
    )

    const selectedColor = useSelector((state: RootState) => state.color.selectedColors)
    const selectedSubCategory = useSelector((state: RootState) => state.subCategory.selectedSubCategories)
    const selectedBrand = useSelector((state: RootState) => state.brand.selectedBrands)

    const final_colors = raw_colors.map((rc: any) => {
        switch (rc) {
            case "red":
                return { _id: "#ef4444", name: "Red" }
            case "blue":
                return { _id: "#3b82f6", name: "Blue" }
            case "green":
                return { _id: "#22c55e", name: "Green" }
            case "black":
                return { _id: "#000000", name: "Black" }
            case "white":
                return { _id: "#ffffff", name: "White" }
            case "yellow":
                return { _id: "#eab308", name: "Yellow" }
            default:
                return { _id: "#9ca3af", name: "Gray" }
        }
    })

    const selectedcategory = useSelector((state: RootState) => state.category.selectedCategory)

    if (type === "subcategories") {
        if (suberror) return <div> LOL</div>
        if (subisLoading) return <LoadingBig />
        if (sub && sub?.categories?.length === 0) return <NoDataFound />
    }
    if (type === "brands") {
        if (branderror) return <div> LOL</div>
        if (brandisLoading) return <LoadingBig />
        if (brand && brand?.brands?.length === 0) return <NoDataFound />
    }

    return (

        <div>
            <Popover >
                <PopoverTrigger asChild>
                    <Button className=' relative bg-white text-[#303032] font-medium font-satoshi rounded-2xl border-[2.5px] border-[#303032] py-4.5' variant="outline"><span>{type === "brands" ? <Trello /> : type === "subcategories" ? <BookMarked /> : <Palette />}</span>{type === "brands" ? "Brands" : type === "subcategories" ? "Categories" : "Colors"}<span><ChevronDown /></span>
                        <div style={{ fontSize: "10px" }} className='rounded-full absolute right-[-5px] top-[-7px] border-2 flex items-center justify-center border-white bg-[#303032] text-neutral-50 px-1.5 py-0.5'>
                            {type === "brands" ? selectedBrand.length : type === "subcategories" ? selectedSubCategory.length : selectedColor.length}
                        </div>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 flex flex-col justify-center gap-10">
                    {type === "brands" ? brand?.brands?.map((item: any, i: number) => (
                        <Label key={item._id} className='cursor-pointer flex gap-5 items-center justify-between'>
                            <div className='flex gap-5 items-center'>
                                <Checkbox className={`scale-125 data-[state=checked]:bg-blue-50
    data-[state=checked]:border-indigo-500`} checked={selectedBrand.includes(item._id)}
                                    onCheckedChange={() => dispatch(setbrand(item._id))} id={item._id} />
                                <Label htmlFor={item._id} className='font-normal text-2xs'>{item.name}</Label>
                            </div>
                            <p className='text-neutral-500 font-normal text-xs'>{item.amount} products</p>
                        </Label>
                    )) : type === "subcategories" ? sub?.categories?.filter((e: any) => e.parent === selectedcategory)?.map((item: any, i: number) => (

                        <Label key={item._id} className='cursor-pointer flex gap-5 items-center justify-between'>
                            <div className='flex gap-5 items-center'>
                                <Checkbox className='scale-125 data-[state=checked]:bg-blue-50
    data-[state=checked]:border-indigo-500' checked={selectedSubCategory.includes(item._id)}
                                    onCheckedChange={() => dispatch(setSubCategory(item._id))} id={item._id} />
                                <Label htmlFor={item._id} className='font-normal text-2xs'>{item.name}</Label>
                            </div>
                            <p className='text-neutral-500 font-normal text-xs'>{item.amount} products</p>
                        </Label>

                    )) :
                        final_colors?.map((item: any, i: number) => (
                            <Label key={item._id} className='cursor-pointer flex gap-5 items-center justify-between'>
                                <div className='flex gap-5 items-center'>
                                    <Checkbox className='scale-125 data-[state=checked]:bg-blue-50
    data-[state=checked]:border-indigo-500' checked={selectedColor.includes(item.name.toLowerCase())}
                                        onCheckedChange={() => dispatch(setcolor(item.name.toLowerCase()))} id={item._id} />
                                    <Label htmlFor={item._id} className='font-normal text-2xs'>{item.name}</Label>
                                </div>
                                <Label htmlFor={item._id} style={{ backgroundColor: item._id }} className={`cursor-pointer border-[1px] w-5 h-5 rounded-full border-gray-400`}></Label>
                            </Label>
                        ))}
                    <div className='flex w-full justify-between items-center '>
                        <Button className=' hover:bg-neutral-200 border-2 cursor-pointer text-neutral-900'>Cancel</Button>
                        <Button className='border-2 border-bg-btn-dynamic hover:bg-btn-hv-bg hover:text-white cursor-pointer font-satoshi text-bg-btn-dynamic '>Apply</Button>
                    </div>
                </PopoverContent>

            </Popover>
        </div>
    )
}

export default PopoverSubcategories
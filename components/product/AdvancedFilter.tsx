"use client"
import React, { useState } from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { SlidersHorizontal, StarOff, Star } from 'lucide-react'
import { Button } from '../ui/button'
import { DialogHeader, DialogFooter, Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Label } from '../ui/label'
import { Slider } from '../ui/slider'

const AdvancedFilter = () => {
    const [openFilter, setOpenFilter] = useState(false)
    const [rating, setRating] = useState(0)
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]) // [min, max]
    const [selectedAdvancedFilter, setSelectedAdvancedFilter] = useState<any>([])

    //sort
    const [sortType, setSortType] = useState("date-desc")

    // const [brand,setBrand] = useState()
    // const [category,setCategory] = useState()
    // const [subCategory,setSubCategory] = useState()

    function handleClear(): void {
        setOpenFilter(false)
        setRating(0)
        setPriceRange([0, 1000])
        setSelectedAdvancedFilter([])

    }


    return (
        <Tooltip >
            <TooltipContent className='bg-background border-2 border-gray-200 cursor-pointer'>
                <p className='text-gray-700 '>Advanced filter</p>
            </TooltipContent>
            <Dialog open={openFilter} onOpenChange={setOpenFilter}>
                <TooltipTrigger asChild className='cursor-pointer'>
                    <DialogTrigger asChild >
                        <div className='flex justify-center items-center gap-3 rounded-2xl bg-[#303032] text-white py-2'><SlidersHorizontal size={24} className='text-white ' /><span className=''>Filters</span></div>
                    </DialogTrigger>
                </TooltipTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className='text-gray-700'>Filter</DialogTitle>
                        <DialogDescription>
                            Make changes to your filter here. Click apply when you&apos;re
                            done.
                        </DialogDescription>
                    </DialogHeader>
                    <div className='flex-col flex gap-3'>
                        <div className="flex flex-col">
                            <Label className='text-gray-600'>Rating<p className='text-red-400 text-xl'>*</p></Label>
                            <div className="flex items-center  gap-1 ml-2 mt-2">
                                <StarOff size={24} className='text-red-300 cursor-pointer mr-2 ' onClick={(e) => setRating(0)} />
                                {Array.from({ length: 5 }, (_, i) => (
                                    <Star
                                        onClick={(e) => setRating(i + 1)}
                                        key={i}
                                        size={24}
                                        className={i < rating ? "fill-invincible-yellow text-invincible-yellow cursor-pointer" : "text-gray-300 cursor-pointer"}
                                    />
                                ))}
                                <span className="text-sm text-gray-600 ml-1">({rating}/5)</span>

                            </div>
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label className="text-gray-600">Price <p className='text-red-400 text-xl'>*</p></Label>
                            <Slider
                                className='text-bg-btn-dynamic'
                                defaultValue={[0, 1000]}
                                max={1000}
                                step={1}
                                value={priceRange}
                                onValueChange={(val) => setPriceRange(val as [number, number])}
                            />
                            <div className="flex justify-between text-sm text-gray-500">
                                <span>{priceRange[0].toLocaleString()}$</span>
                                <span>{priceRange[1].toLocaleString()}$</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label className="text-gray-600">Product <p className='text-red-400 text-xl'>*</p></Label>
                            <div className='flex gap-3'>
                                <Button
                                    className={`${selectedAdvancedFilter.includes("new")
                                        ? "bg-bg-btn-dynamic text-gray-50"
                                        : "bg-gray-100 text-gray-500"
                                        } hover:bg-btn-hv-bg hover:text-gray-50 cursor-pointer`}
                                    type="button"
                                    onClick={(e) => setSelectedAdvancedFilter((prev: any) => {
                                        const alreadySelected = prev.includes("new")
                                        if (alreadySelected) {
                                            return prev.filter((id: any) => id !== "new")
                                        } else return [...prev, "new"]
                                    })}                                    >
                                    New
                                </Button>
                                <Button
                                    className={`${selectedAdvancedFilter.includes("inStock")
                                        ? "bg-bg-btn-dynamic text-gray-50"
                                        : "bg-gray-100 text-gray-500"
                                        } hover:bg-btn-hv-bg hover:text-gray-50 cursor-pointer`}
                                    type="button"
                                    onClick={(e) => setSelectedAdvancedFilter((prev: any) => {
                                        const alreadySelected = prev.includes("inStock")
                                        if (alreadySelected) {
                                            return prev.filter((id: any) => id !== "inStock")
                                        } else return [...prev, "inStock"]
                                    })}                                    >
                                    In Stock
                                </Button>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleClear} className='text-gray-700 cursor-pointer bg-gray-200' variant="outline">Clear</Button>
                        <DialogClose asChild>
                            <Button className='bg-bg-btn-dynamic hover:bg-btn-hv-bg cursor-pointer' >Apply</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>

            </Dialog>
        </Tooltip>
    )
}

export default AdvancedFilter
"use client"
import useFetch from '@/app/hooks/useFetchData'
import { ProductCard } from '@/components/admin/ProductCard'
import LoadingBig from '@/components/loading-big'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import BinhSearch from '@/components/ui/custom-search'
import { Label } from '@/components/ui/label'
import NoDataFound from '@/components/ui/nodata'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowDownNarrowWide, ArrowDownUp, ArrowUpNarrowWide, BadgeCheckIcon, Loader2, Plus, SlidersHorizontal, Star, StarOff, StepBack, StepForward } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useMemo, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { getPageData, getTotalPage } from '@/app/helpers/Page-stuff'

const ProductAdminPage = () => {
    const { data: product, error: productError, loading: productLoading } = useFetch("/api/product", {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
        },
    })
    const { data: brand, error: brandError, loading: brandLoading } = useFetch("/api/brand", {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
        },
    })
    const { data: category, error: categoryError, loading: categoryLoading } = useFetch("/api/get/categories", {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
        },
    })
    const { data: subCategory, error: subCategoryError, loading: subCategoryLoading } = useFetch("/api/get/subcategories", {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
        },
    })

    const [pageProduct, setPageProduct] = useState<any>()
    const [search, setSearch] = useState("")
    const [selectedCategory, setSelectedCategory] = useState<any>("all")
    const [selectedBrand, setSelectedBrand] = useState<any>("all")
    const [selectedSub, setSelectedSub] = useState<any>([])
    const [selectedAdvancedFilter, setSelectedAdvancedFilter] = useState<any>([])

    //advanced filter
    const [openFilter, setOpenFilter] = useState(false)
    const [rating, setRating] = useState(0)
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]) // [min, max]

    //sort
    const [sortType, setSortType] = useState("date-desc")

    // const [brand,setBrand] = useState()
    // const [category,setCategory] = useState()
    // const [subCategory,setSubCategory] = useState()
    useEffect(() => {
        if (selectedCategory === "all") {
            setSelectedSub([]);
        }
    }, [selectedCategory]);
    const filterProduct = useMemo(() => {
        if (!product?.products) return []
        let rtn: any[] = product.products
        //brand
        rtn = rtn.filter((s: any) => selectedBrand === "all" ? s : s.brand === selectedBrand)
        //category
        rtn = rtn.filter((s: any) => selectedCategory === "all" ? s : s.category === selectedCategory)

        //sub categories
        if (selectedSub.length > 0 && selectedCategory != "all") {
            rtn = rtn.filter((s: any) =>
                s.categories.some((c: string) => selectedSub.includes(c))
            )
        }

        //sort
        if (sortType === "price-asc") rtn.sort((a, b) => a.price - b.price)
        if (sortType === "price-desc") rtn.sort((a, b) => b.price - a.price)
        if (sortType === "date-desc") {
            rtn.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        }
        if (sortType === "date-asc") {
            rtn.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        }
        // price range
        rtn = rtn.filter((c: any) => priceRange[0] <= c.price && c.price <= priceRange[1])
        //advanced

        // rating
        if (rating) {
            rtn = rtn.filter((c: any) => Math.ceil(c.ratingAvg) === rating)
        }

        // advanced filter
        if (selectedAdvancedFilter.includes("new")) {
            rtn = rtn.filter((c: any) => c.isNew === true)
        }
        if (selectedAdvancedFilter.includes("inStock")) {
            rtn = rtn.filter((c: any) => c.stock > 0)
        }

        //search
        return rtn.filter((s: any) =>
            s.title?.toLowerCase().includes(search.toLowerCase())
        )
    }, [product, search, selectedBrand, selectedCategory, selectedSub, sortType, rating, priceRange, selectedAdvancedFilter])
    function handleClear(): void {
        setOpenFilter(false)
        setRating(0)
        setPriceRange([0, 1000])
        setSelectedAdvancedFilter([])

    }
    //page
    const [page, setPage] = useState(1)
    const pageSize = 30
    const totalPages = getTotalPage(filterProduct, pageSize)

    const finalData = useMemo(() => {
        return getPageData(filterProduct, pageSize, page)
    }, [page, filterProduct])

    if (productError) return <div>Eroro</div>
    if (productLoading) return <LoadingBig />
    if (!product || product.products.length === 0) return <div>nothing there</div>



    return (
        <div className='flex flex-col gap-10 ml-10'>
            <div className='mb-25 mt-5 mr-5 flex gap-5 items-start justify-end relative'>
                <div className='absolute  left-0 flex gap-5'>
                    <div className='flex flex-col gap-5'>
                        <BinhSearch onSearch={(value) => setSearch(value)} />
                        <div className='flex gap-3'>
                            <div className=''>
                                <Select
                                    name="brand"
                                    onValueChange={(value) =>
                                        setSelectedBrand(value)
                                    }
                                >
                                    <SelectTrigger className="w-[180px] text-bg-btn-dynamic">
                                        <SelectValue className='text-text-tilte' placeholder="Select a brand" />
                                    </SelectTrigger>
                                    <SelectContent className='text-text-tilte' >
                                        <SelectGroup className='text-text-tilte' >
                                            <SelectLabel>All Brands</SelectLabel>
                                            <SelectItem value={"all"}>All</SelectItem>


                                        </SelectGroup>
                                        <SelectGroup className='text-text-tilte' >
                                            <SelectLabel>Brands</SelectLabel>
                                            {!brandLoading && brand.brands.length > 0 && brand.brands.map((brand: any) => (
                                                <SelectItem key={brand._id} className='text-text-tilte' value={brand._id}>{brand.name}</SelectItem>
                                            ))}

                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className=''>
                                <Select name='category' onValueChange={(value) =>
                                    setSelectedCategory(value)
                                } >
                                    <SelectTrigger className="w-[180px] text-bg-btn-dynamic">
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent >
                                        <SelectGroup>
                                            <SelectLabel>All categories</SelectLabel>
                                            <SelectItem value={"all"}>All</SelectItem>


                                        </SelectGroup>
                                        <SelectGroup>
                                            <SelectLabel>Main Categories</SelectLabel>
                                            {!categoryLoading && category.categories.length > 0 && category.categories.map((cate: any) => (
                                                <SelectItem key={cate._id} value={cate._id}>{cate.name}</SelectItem>
                                            ))}

                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div>
                            <Select
                                name="sort"
                                onValueChange={(value) =>
                                    setSortType(value)
                                }
                            >
                                <SelectTrigger className="w-[180px] text-bg-btn-dynamic">
                                    <SelectValue className='text-text-tilte' placeholder="Sort" />
                                </SelectTrigger>
                                <SelectContent className='text-text-tilte' >

                                    <SelectGroup className='text-text-tilte' >
                                        <SelectLabel>Increase</SelectLabel>
                                        <SelectItem className='text-text-tilte flex items-center justify-between' value={"price-asc"}><p>Price</p><ArrowUpNarrowWide /></SelectItem>
                                        <SelectItem className='text-text-tilte flex items-center justify-between' value={"date-asc"}><p>Created at</p><ArrowUpNarrowWide /></SelectItem>

                                    </SelectGroup>
                                    <SelectGroup className='text-text-tilte' >
                                        <SelectLabel>Decrease</SelectLabel>
                                        <SelectItem className='text-text-tilte flex items-center justify-between' value={"price-desc"}><p>Price</p><ArrowDownNarrowWide /></SelectItem>
                                        <SelectItem className='text-text-tilte flex items-center justify-between' value={"date-desc"}><p>Created at</p><ArrowDownNarrowWide /></SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className=''>
                        <div className='flex gap-3 flex-wrap'>
                            {!subCategoryLoading && subCategory.categories.length > 0 ? (
                                subCategory.categories.map((ca: any) => (
                                    selectedCategory && ca.parent === selectedCategory ? <Button
                                        key={ca._id}
                                        className={`${selectedSub.includes(ca._id)
                                            ? "bg-bg-btn-dynamic text-gray-50"
                                            : "bg-gray-100 text-gray-500"
                                            } hover:bg-btn-hv-bg hover:text-gray-50 cursor-pointer`}
                                        type="button"
                                        onClick={(e) => setSelectedSub((prev: any) => {
                                            const alreadySelected = prev.includes(ca._id)
                                            if (alreadySelected) {
                                                return prev.filter((id: any) => id !== ca._id)
                                            } else return [...prev, ca._id]
                                        })}                                    >
                                        {ca.name}
                                    </Button> : ""
                                ))
                            ) : (
                                <p className='text-sm text-gray-700'>There's no sub categories</p>
                            )}
                        </div>

                    </div>
                </div>
                {/* sub categories */}
                <div className='flex flex-col'>
                    <div className='flex gap-5 items-center'>
                        <Tooltip>
                            <TooltipContent className='bg-background border-2 border-gray-200 cursor-pointer'>
                                <p className='text-gray-700 '>Advanced filter</p>
                            </TooltipContent>
                            <Dialog open={openFilter} onOpenChange={setOpenFilter}>
                                <TooltipTrigger asChild className='cursor-pointer'>
                                    <DialogTrigger asChild >
                                        <SlidersHorizontal size={28} className='text-bg-btn-dynamic ' />

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

                        <Link href={"products/add"} >
                            <Button size={'lg'} className='bg-bg-btn-dynamic hover:bg-btn-hv-bg cursor-pointer'> <Plus size={16} />Create Product</Button>
                        </Link>
                    </div>

                </div>



            </div>
            <div className='flex flex-wrap gap-7'>

                {finalData.length > 0 ? finalData.map((p: any) => (
                    <ProductCard key={p._id} product={p} />
                )) :
                    <NoDataFound />}


            </div>
            <div className="flex items-center bg-background justify-center gap-4 mt-4 py-10">
                <Button
                    variant="outline"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className='rounded-full bg-header-table text-bg-btn-dynamic'
                >
                    <StepBack />
                </Button>

                <span className="text-gray-600 font-semibold">
                    {page} / {totalPages}
                </span>

                <Button
                    variant="outline"
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className='rounded-full bg-header-table text-bg-btn-dynamic'

                >
                    <StepForward />
                </Button>
            </div>
        </div>
    )
}

export default ProductAdminPage
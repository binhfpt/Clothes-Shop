"use client"
import React, { useEffect, useState } from 'react'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../ui/carousel'
import { addProductCards } from '@/app/redux/slice/product-card/productCard'
import { Palette, Ruler, Minus, Plus, ShoppingCart, ScanBarcode } from 'lucide-react'
import { StarRating } from '../admin/star-rating'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/app/redux/store/store'

const SheetContentProduct = ({ product, final_colors, variant }: { product: any, final_colors: any, variant: any }) => {
    const myProductCards = useSelector((state: RootState) => state.productCard.productCards)
    const colorParse = (color: string) => {
        switch (color) {
            case "#ef4444":
                return "red"
            case "#3b82f6":
                return "blue"
            case "#22c55e":
                return "green"
            case "#000000":
                return "black"
            case "#ffffff":
                return "white"
            case "#eab308":
                return "yellow"
            default:
                return "#9ca3af"
        }
    }
    const dispatch = useDispatch()
    const [productSheetAmount, setProductSheetAmount] = useState(1)
    const [totalAmount, setTotalAmount] = useState(variant[0].price)
    const [selectedColor, setSelectedColor] = useState(final_colors[0])
    const [selectedSize, setSelectedSize] = useState(variant[0].size)
    const [currentVariant, setCurrenVariant] = useState(variant[0])
    const [rawSize, setRawSize] = useState(variant.filter((v: any) => v.color === colorParse(selectedColor)).map((x: any) => x.size))


    enum TypeAmountChange {
        INCREASE = 'increase',
        DECREASE = 'decrease'
    }

    useEffect(() => {
        setSelectedSize(variant[0].size)
        setRawSize(variant.filter((v: any) => v.color === colorParse(selectedColor)).map((x: any) => x.size))
    }, [selectedColor])

    const handleAmountChange = (type: TypeAmountChange) => {
        if (type === TypeAmountChange.INCREASE) {
            setProductSheetAmount(prev => prev + 1)
        }
        if (type === TypeAmountChange.DECREASE) {
            productSheetAmount === 0 ? null : setProductSheetAmount(prev => prev - +1)
        }
    }

    useEffect(() => {
        const temp = variant.filter((v: any) => v.size === selectedSize && v.color === colorParse(selectedColor))
        setCurrenVariant(temp[0])
    }, [selectedSize, selectedColor])

    useEffect(() => {
        setTotalAmount((currentVariant?.price ?? 0) * productSheetAmount)
    }, [productSheetAmount, currentVariant])


    const handleColorChange = (color: any) => {
        setSelectedColor(color)
    }
    const handleSizeChange = (size: any) => {
        setSelectedSize(size)
    }

    const handleAddToCard = () => {
        for (let index = 0; index < productSheetAmount; index++) {
            dispatch(addProductCards({ product: product, variant: currentVariant }))
        }
    }
    return (
        <div className="flex gap-20 px-4">
            <div className=' flex gap-2 h-[360px]'>
                <Carousel className="w-full max-w-xs relative">
                    <CarouselContent >
                        {Array.from(product.images).map((productImage, index) => (
                            <CarouselItem key={index}>
                                <div style={{ backgroundImage: `url(${productImage})` }} className="bg-blue-50 w-[310px] bg-cover bg-center h-[360px] rounded-2xl">

                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent >
                    <CarouselPrevious className='bg-neutral-200 absolute left-1 top-1/2 -translate-y-1/2 text-neutral-800 cursor-pointer hover:bg-btn-hv-bg hover:text-white' />
                    <CarouselNext className='bg-neutral-200 absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-800 cursor-pointer hover:bg-btn-hv-bg hover:text-white' />
                </Carousel>
                <div className='flex flex-col justify-between'>
                    <div style={{ backgroundImage: `url(${product?.images?.[0]})` }} className="bg-blue-50 w-[150px] bg-cover bg-center h-[173px] rounded-2xl">

                    </div>
                    <div style={{ backgroundImage: `url(${product?.images?.[1]})` }} className="bg-blue-50 w-[150px] bg-cover bg-center h-[173px] rounded-2xl">

                    </div>
                </div>
            </div>
            <div className='max-w-full mr-50 min-w-100'>
                <h3 className='text-neutral-900 font-sans text-2xl'>{product.title}</h3>
                <div className=' flex justify-between items-center '>
                    <StarRating rating={product.ratingAvg} />
                    <p className='text-text-description text-sm'>
                        {`${product.sold} sold`}
                    </p>
                </div>
                <h3 style={{ fontSize: "32px" }} className='text-[#EE4D2D] mt-2   font-semibold'>
                    {`$${currentVariant?.price ?? 0}`}                </h3>
                <div className='mt-8  flex gap-2 items-center '>
                    <Palette className='text-neutral-800 mr-5' />
                    {final_colors.map((vari: any, i: any) => (
                        <div onClick={() => handleColorChange(vari)} className={`  w-5 h-5 cursor-pointer rounded-full   ${vari === selectedColor ? "ring-neutral-500 ring-2" : "ring-0"}`} key={i} style={{ backgroundColor: vari }} />
                    ))}
                </div>
                <div className='mt-5  flex gap-2  items-center '>
                    <Ruler className='text-neutral-800 mr-5' />
                    {rawSize.map((vari: any, i: any) => (
                        <div onClick={() => handleSizeChange(vari)} className={`  px-3 py-1 cursor-pointer  ${vari === selectedSize ? "bg-blue-100 text-bg-btn-dynamic" : "bg-neutral-50 text-neutral-800"}`} key={i}  >{vari}</div>
                    ))}
                </div>
                <div className='mt-5  flex gap-2  items-center '>
                    <div className='text-neutral-800 mr-5' >Amout:</div>
                    <Minus size={18} onClick={() => handleAmountChange(TypeAmountChange.DECREASE)} className='text-gray-400 cursor-pointer  hover:text-bg-btn-dynamic' />

                    <div className={` bg-neutral-100 px-3 py-1 text-xl text-red-400 font-semibold`}  >{productSheetAmount}</div>
                    <Plus onClick={() => handleAmountChange(TypeAmountChange.INCREASE)} size={18} className='text-gray-400 cursor-pointer  hover:text-bg-btn-dynamic' />
                </div>
                <div className='h-0.5 mt-5 w-full bg-gray-200' />
                <div className='w-full flex mt-3 justify-end'>
                    <div className='text-red-500 text-2xl font-sans'>Total: {totalAmount}</div>
                </div>
                <div className='w-full flex mt-3 gap-5 justify-start'>
                    <h3
                        style={{ fontSize: "16px" }}
                        onClick={handleAddToCard}
                        className="text-green-500 border-2 flex items-center hover:bg-green-50 cursor-pointer  justify-between rounded-2xl px-5 py-1.5 border-green-500 "
                    >
                        <ShoppingCart size={20} />
                        <span className="font-satoshi ml-5 ">Add to card</span>
                    </h3>
                    <h3
                        style={{ fontSize: "16px" }}
                        onClick={() => console.log(myProductCards)}
                        className="text-orange-500 border-2 font-sans flex items-center hover:bg-orange-50 cursor-pointer  justify-between rounded-2xl px-5 py-1.5 border-orange-500 "
                    >
                        <ScanBarcode size={20} />
                        <span className="font-satoshi ml-5 ">Buy</span>
                    </h3>
                </div>
            </div>

        </div>
    )
}

export default SheetContentProduct
import React from 'react'
import { Badge } from '../ui/badge'
import { StarRating } from './star-rating'
import Image from 'next/image'
import { useGetProductsQuery } from '@/app/redux/api/productAPI'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/app/redux/store/store'
import { Minus, Palette, Plus, Ruler, ScanBarcode, ShoppingCart } from 'lucide-react'
import { addProductCards } from '@/app/redux/slice/product-card/productCard'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Button } from '../ui/button'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../ui/carousel'
import { Card, CardContent } from '../ui/card'
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet'
import SheetContentProduct from '../product/SheetContentProduct'



export const ProductCard = ({ product }: { product: any }) => {

    const raw_colors = Array.from(new Set(product.variants.map((v: any) => v.color)))
    const raw_size = Array.from(new Set(product.variants.map((v: any) => v.size)))
    const variant = product.variants
    const dispatch = useDispatch()
    const final_colors = raw_colors.map((rc: any) => {
        switch (rc) {
            case "red":
                return "#ef4444"
            case "blue":
                return "#3b82f6"
            case "green":
                return "#22c55e"
            case "black":
                return "#000000"
            case "white":
                return "#ffffff"
            case "yellow":
                return "#eab308"
            default:
                return "#9ca3af"
        }
    })


    return (
        <div className='flex flex-col w-[310px] h-[560px] bg-background  border-gray-200 rounded-3xl'>
            {/* image here */}
            <div className='h-[60%] border-2 border-gray-100 p-0.5 rounded-3xl relative overflow-hidden group'>
                {/* ảnh mặc định */}
                <Image
                    sizes="310px"
                    fill
                    src={product?.images?.[0]}
                    alt='product'
                    className='object-cover rounded-3xl  w-full h-full transition-opacity duration-500 group-hover:opacity-0'
                />

                {/* ảnh khi hover */}
                <Image
                    sizes="310px"
                    fill
                    src={product?.images?.[1] ?? product?.images?.[0]}
                    alt='product-hover'
                    className='object-cover w-full h-full absolute top-0 left-0 transition-opacity duration-500 opacity-0 group-hover:opacity-100'
                />

                {/* <p className='absolute top-0 right-0 bg-invincible-yellow px-2 text-orange-600 rounded-tr-2xl font-semibold'>-80%</p> */}
            </div>

            {/* title here */}
            <div className='mt-5 ml-2 flex gap-2'>
                {final_colors.map((vari: any, i: any) => (
                    <div className={`  w-4 h-4 rounded-full`} key={i} style={{ backgroundColor: vari }} />
                ))}
            </div>
            <h4 className='ml-2 text-gray-800 font-satoshi mt-4 font-semibold line-clamp-2 leading-[130%]'>  {product.title}</h4>
            {/* star  */}
            <div className='mt-2 flex justify-between items-center '>
                <StarRating rating={product.ratingAvg} />
                <p className='text-text-description text-sm'>
                    {`${product.sold} sold`}
                </p>
            </div>
            {/* price + amount sell */}
            <div className='flex ml-2  mt-4 justify-between items-center '>

                <h3 style={{ fontSize: "20px" }} className='text-[#EE4D2D]   font-semibold'>
                    {`$${product.price}`}
                </h3>
                <Sheet >
                    <SheetTrigger asChild>
                        <h3
                            style={{ fontSize: "18px" }}
                            className="text-green-500 border-2 flex items-center hover:bg-green-50 cursor-pointer w-25 justify-between rounded-2xl px-3 py-1.5 border-green-500 font-semibold"
                        >
                            <ShoppingCart size={20} />
                            <span className="font-satoshi text-sm font-semibold">ADD</span>
                        </h3>
                    </SheetTrigger>
                    <SheetContent side="bottom" className='pl-20' >
                        <SheetHeader>
                            <SheetTitle className='text-gray-800'>Add to card</SheetTitle>
                            <SheetDescription>
                                Make changes to your card here. Click save when you&apos;re done.
                            </SheetDescription>
                        </SheetHeader>
                        {/* <div className="flex gap-20 px-4">
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
                                    {`$${product.price}`}
                                </h3>
                                <div className='mt-8  flex gap-2 items-center '>
                                    <Palette className='text-neutral-800 mr-5' />
                                    {final_colors.map((vari: any, i: any) => (
                                        <div className={`  w-5 h-5 rounded-full`} key={i} style={{ backgroundColor: vari }} />
                                    ))}
                                </div>
                                <div className='mt-5  flex gap-2  items-center '>
                                    <Ruler className='text-neutral-800 mr-5' />
                                    {raw_size.map((vari: any, i: any) => (
                                        <div className={` bg-neutral-50 px-3 py-1 text-neutral-800`} key={i}  >{vari}</div>
                                    ))}
                                </div>
                                <div className='mt-5  flex gap-2  items-center '>
                                    <div className='text-neutral-800 mr-5' >Amout:</div>
                                    <Minus size={18} className='text-gray-400' />

                                    <div className={` bg-neutral-100 px-3 py-1 text-xl text-red-400 font-semibold`}  >1</div>
                                    <Plus size={18} className='text-gray-400' />
                                </div>
                                <div className='h-0.5 mt-5 w-full bg-gray-200' />
                                <div className='w-full flex mt-3 justify-end'>
                                    <div className='text-red-500 text-2xl font-sans'>Total: 120</div>
                                </div>
                                <div className='w-full flex mt-3 gap-5 justify-start'>
                                    <h3
                                        style={{ fontSize: "16px" }}
                                        onClick={() => dispatch(addProductCards(product))}
                                        className="text-green-500 border-2 flex items-center hover:bg-green-50 cursor-pointer  justify-between rounded-2xl px-5 py-1.5 border-green-500 "
                                    >
                                        <ShoppingCart size={20} />
                                        <span className="font-satoshi ml-5 ">Add to card</span>
                                    </h3>
                                    <h3
                                        style={{ fontSize: "16px" }}
                                        onClick={() => dispatch(addProductCards(product))}
                                        className="text-orange-500 border-2 font-sans flex items-center hover:bg-orange-50 cursor-pointer  justify-between rounded-2xl px-5 py-1.5 border-orange-500 "
                                    >
                                        <ScanBarcode size={20} />
                                        <span className="font-satoshi ml-5 ">Buy</span>
                                    </h3>
                                </div>
                            </div>

                        </div> */}
                        <SheetContentProduct variant={variant} final_colors={final_colors} product={product} />
                        <SheetFooter>
                            <Button type="submit">Save changes</Button>
                            <SheetClose asChild>
                                <Button variant="outline">Close</Button>
                            </SheetClose>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>



            </div>

        </div>
    )
}

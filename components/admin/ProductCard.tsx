import React from 'react'
import { Badge } from '../ui/badge'
import { StarRating } from './star-rating'
import Image from 'next/image'
import { useGetProductsQuery } from '@/app/redux/api/productAPI'
import { useSelector } from 'react-redux'
import { RootState } from '@/app/redux/store/store'



export const ProductCard = ({ product }: { product: any }) => {

    const raw_colors = Array.from(new Set(product.variants.map((v: any) => v.color)))

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
                    fill
                    src={product?.images?.[0]}
                    alt='product'
                    className='object-cover rounded-3xl  w-full h-full transition-opacity duration-500 group-hover:opacity-0'
                />

                {/* ảnh khi hover */}
                <Image
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
            <div className='mt-2'>
                <StarRating rating={product.ratingAvg} />
            </div>
            {/* price + amount sell */}
            <div className='flex  ml-2 mt-4 justify-between items-center w-[92%]'>

                <h3 style={{ fontSize: "18px" }} className='text-[#EE4D2D] border-2 rounded-2xl px-5 py-0.5 border-[#EE4D2D] font-semibold'>
                    {`$${product.price}`}
                </h3>
                <p className='text-text-description'>
                    {`Sold:${product.sold}`}
                </p>
            </div>

        </div>
    )
}

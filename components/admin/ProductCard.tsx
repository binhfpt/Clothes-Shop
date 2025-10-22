import React from 'react'
import { Badge } from '../ui/badge'
import { StarRating } from './star-rating'

export const ProductCard = ({ product }: { product: any }) => {
    return (
        <div className='flex flex-col w-[220px] h-[330px] bg-background border-[1px] border-gray-200 rounded-xl'>
            {/* image here */}
            <div className='h-[60%]  relative overflow-hidden group'>
                {/* ảnh mặc định */}
                <img
                    src={product?.images?.[0]}
                    alt='product'
                    className='object-cover  w-full h-full transition-opacity duration-500 group-hover:opacity-0'
                />

                {/* ảnh khi hover */}
                <img
                    src={product?.images?.[1] ?? product?.images?.[0]}
                    alt='product-hover'
                    className='object-cover w-full h-full absolute top-0 left-0 transition-opacity duration-500 opacity-0 group-hover:opacity-100'
                />

                <p className='absolute top-0 right-0 bg-invincible-yellow px-2 text-orange-600 font-semibold'>-80%</p>
            </div>

            {/* title here */}
            <div className='mt-2'>
                <h4 className='ml-2 text-text-tilte line-clamp-2 leading-[130%]'>  <Badge className='bg-invincible-yellow text-orange-600 font-semibold mr-1'>Tag crazy</Badge>{product.title}</h4>
            </div>
            {/* star  */}
            <div>
                <StarRating rating={product.ratingAvg} />
            </div>
            {/* price + amount sell */}
            <div className='flex  ml-2 mt-1.5 justify-between items-center w-[92%]'>

                <h3 className='text-orange-500 text-xl font-semibold'>
                    {`${product.price}$`}
                </h3>
                <p className='text-text-description'>
                    {`Sold:${product.sold}`}
                </p>
            </div>

        </div>
    )
}

"use client"
import useFetch from '@/app/hooks/useFetchData'
import React, { useEffect, useState } from 'react'
import LoadingBig from './loading-big'
import NoDataFound from './ui/nodata'
import { ArrowUpRight, Blocks, Footprints, Mars, MousePointer2, Venus } from 'lucide-react'
import { useGetCategoriesQuery, useGetSubCategoriesQuery } from '@/app/redux/api/categoryAPI'
import { useGetProductsQuery } from '@/app/redux/api/productAPI'

const StartExploring = () => {

    const { data: cate, error: cateerr, isLoading: cateload } = useGetCategoriesQuery()

    const { data: sub, error: suberr, isLoading: subload } = useGetSubCategoriesQuery()


    const [selectedCate, setSelectedCate] = useState(0)
    const [propCate, setPropCate] = useState<any>()


    useEffect(() => {
        if (cate && cate?.categories?.length > 0) {
            setPropCate(cate.categories[selectedCate])
        }

    }, [selectedCate, cate])



    const iconCate = [
        <Mars size={22} className={`${selectedCate === 0 ? "text-neutral-50" : "text-neutral-400"}`} />,
        <Venus size={22} className={`${selectedCate === 1 ? "text-neutral-50" : "text-neutral-400"}`} />,
        <Blocks size={22} className={`${selectedCate === 2 ? "text-neutral-50" : "text-neutral-400"}`} />,
        <Footprints size={22} className={`${selectedCate === 3 ? "text-neutral-50" : "text-neutral-400"}`} />
    ]

    const iconSub = [
        "/pic/fire-svgrepo-com.svg",
        "/pic/sneakers-svgrepo-com.svg",
        "/pic/shirt-svgrepo-com.svg",
        "/pic/pants-svgrepo-com.svg",
        "/pic/jacket-uniform-svgrepo-com.svg",
        "/pic/hat-svgrepo-com.svg",
        "/pic/dress-svgrepo-com.svg",
        "/pic/cup-svgrepo-com.svg",
        "/pic/ball-svgrepo-com.svg",
    ]

    if (cateerr || suberr)
        if (cateload || subload) return <LoadingBig />
    if ((cate && cate?.categories?.length === 0) || (sub && sub?.categories?.length === 0)) return <NoDataFound />

    return (
        <div className=' flex flex-col gap-10 items-center justify-center bg-blue-50'>
            <div className='text-gray-800 w-full mt-25 text-center font-bold font-satoshi text-5xl'>
                Start Shopping.
            </div>
            <div className='bg-[#ffffff] flex p-1.5 shadow-shadow mt-6 mb-2 rounded-3xl gap-1'>
                {cate?.categories?.map((cate: any, i: number) => (
                    <div onClick={() => setSelectedCate(i)} key={cate._id} className={` ${i === selectedCate ? "bg-gray-800 text-white" : "text-gray-800 "} font-sans flex items-center justify-center gap-3  h-full py-2 px-5 cursor-pointer rounded-3xl`}>{iconCate[i]}{cate.name}</div>
                ))}
            </div>
            <div className='gap-5 w-[94%] grid grid-cols-3 pb-40'>
                {sub?.categories?.filter((e: any, i: number) => (e.parent === propCate?._id)).map((s: any, i: any) => (
                    <div key={s._id} className='group hover:bg-[#ffffffc2] hover:shadow-xl cursor-pointer w-full h-[300px] flex flex-col items-center rounded-2xl  bg-[#ffffff]'>
                        <div className='flex justify-between mt-10 w-[80%] items-center'>
                            <div className='bg-blue-50 rounded-full h-[65px] w-[65px] flex justify-center items-center'>
                                <img src={iconSub[i]} alt='logo' className='w-[45px] h-[45px] '></img>
                            </div>
                            <MousePointer2 className='text-neutral-400 group-hover:scale-125' size={24} />
                        </div>
                        <div className='flex flex-col items-center justify-center'>
                            <h4 style={{ fontSize: "18px" }} className=' text-neutral-400'>{propCate.name}</h4>
                            <h3 className='text-4xl font-satoshi font-bold text-gray-800'>{s.name}</h3>
                        </div>
                        <div className='mt-20'>
                            <h4 className=' text-neutral-500' >{s.amount} products</h4>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default StartExploring
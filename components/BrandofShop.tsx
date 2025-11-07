import React, { useLayoutEffect, useRef, useState } from 'react'
import { useGetbrandsQuery } from '@/app/redux/api/brandAPI'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import NoDataFound from './ui/nodata'
import LoadingBig from './loading-big'
import ButtonInvincible from './custom/Button'
import { motion } from 'framer-motion'

const CARD_WIDTH = 250

const BrandofShop = () => {
    const { data, error, isLoading } = useGetbrandsQuery()
    const [currentIndex, setCurrentIndex] = useState(0)
    const visibleCount = 4
    const maxIndex = Math.max(0, (data?.brands?.length ?? 0) - visibleCount)

    const containerRef = useRef<HTMLDivElement>(null)
    const [slideDistance, setSlideDistance] = useState(0)


    // Tính khoảng   cách giữa 2 items đầu tiên
    useLayoutEffect(() => {
        if (containerRef.current && data?.brands && data.brands.length >= 2) {
            const container = containerRef.current
            const items = container.children

            if (items.length >= 2) {
                const item1 = (items[0] as HTMLElement).getBoundingClientRect()
                const item2 = (items[1] as HTMLElement).getBoundingClientRect()
                const dist = item2.left - item1.left

                console.log("Item1 tọa độ:", item1)
                console.log("Item2 tọa độ:", item2)
                console.log("Khoảng cách cần slide:", dist)
                setSlideDistance(dist)
            }
        }
    }, [data])

    const handlePrev = () => {
        setCurrentIndex((prev) => Math.max(0, prev - 1))
    }

    const handleNext = () => {
        setCurrentIndex((prev) => Math.min(maxIndex, prev + 1))
    }

    // Translate theo slideDistance đã tính
    const translateX = -(currentIndex * slideDistance)

    if (isLoading) return <LoadingBig />
    if (error) return <div>ERROR</div>
    if (!data || data.brands.length === 0) return <NoDataFound />

    return (
        <div id='BrandofShop' className="bg-white h-screen overflow-hidden pl-10 pr-10 pt-10">
            <h2 className="text-gray-700 flex items-center relative h-[12%] font-semibold mb-15 font-satoshi text-4xl">
                Choose Your Favorite Brand.
                <div className="flex gap-3 absolute right-0 top-0 h-full items-center w-[15%] justify-center">
                    <button
                        onClick={handlePrev}
                        disabled={currentIndex === 0}
                        className={`p-2 rounded-full border-2 hover:border-btn-hv-bg text-gray-400 hover:text-bg-btn-dynamic ${currentIndex === 0
                            ? "opacity-40 cursor-not-allowed hover:border-2 hover:text-gray-400"
                            : ""
                            }`}
                    >
                        <ArrowLeft size={28} />
                    </button>
                    <button
                        onClick={handleNext}
                        disabled={currentIndex === maxIndex}
                        className={`p-2 rounded-full border-2 hover:border-btn-hv-bg text-gray-400 hover:text-bg-btn-dynamic ${currentIndex === maxIndex
                            ? "opacity-40 cursor-not-allowed hover:border-2 hover:text-gray-400"
                            : ""
                            }`}
                    >
                        <ArrowRight size={28} />
                    </button>
                </div>
            </h2>

            {/* Danh sách brand */}
            <div className="relative overflow-hidden">
                <div
                    ref={containerRef}
                    style={{
                        transform: `translateX(${translateX}px)`,
                    }}
                    className='w-full flex items-center justify-between transition-transform duration-300 ease-in-out'
                >
                    {data.brands.slice(0, visibleCount + 1).map((card, i) => (
                        <div
                            key={card.id || i}
                            style={{ width: CARD_WIDTH }}
                            className="flex flex-col group items-center flex-shrink-0"
                        >
                            <motion.div

                                style={{
                                    backgroundImage: `url(${card.logo})`,
                                    height: CARD_WIDTH
                                }}

                                className="rounded-full relative border-2 flex items-center justify-center h-full border-gray-300 bg-cover bg-center w-full"
                            >

                                <div className='absolute inset-0 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                                    <ButtonInvincible value={'View Brand'} width={120} height={40} border={5} />
                                    <div className="absolute inset-0 rounded-full bg-black/50" />
                                </div>
                            </motion.div>
                            <div className="flex items-center gap-1 flex-col justify-center mt-8 font-satoshi text-neutral-900 text-xl">
                                <h3 className='border-[0.5px] border-gray-400  px-5 py-1 rounded-2xl'>{card.name}</h3>
                                <p className='text-neutral-400 font-satoshi text-sm'>
                                    {card.amount} products
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default BrandofShop
"use client"

import React, { useState } from "react"
import Card from "./SaleUIHome/Card"
import { ArrowLeft, ArrowRight } from "lucide-react"

const data = [
    { img: "/pic/pexels-skylar-kang-6046231-removebg-preview.png", percent: "80" },
    { img: "/pic/pexels-skylar-kang-6046231-removebg-preview.png", percent: "50" },
    { img: "/pic/pexels-skylar-kang-6046231-removebg-preview.png", percent: "30" },
    { img: "/pic/pexels-skylar-kang-6046231-removebg-preview.png", percent: "30" },
    { img: "/pic/pexels-skylar-kang-6046231-removebg-preview.png", percent: "30" },
]

const CARD_WIDTH = 460 // px
const GAP = 32 // = gap-8

const SaleUIHome = () => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const visibleCount = 3
    const maxIndex = Math.max(0, data.length - visibleCount)

    const handlePrev = () => {
        setCurrentIndex((prev) => Math.max(0, prev - 1))
    }

    const handleNext = () => {
        setCurrentIndex((prev) => Math.min(maxIndex, prev + 1))
    }

    const translateX = -(currentIndex * (CARD_WIDTH + GAP))

    return (
        <div className="bg-white h-screen pl-10 pt-10">
            <h2 className="text-gray-700 flex items-center relative h-[12%] font-semibold mb-15 font-satoshi text-4xl">
                Sale Collection.
                <span className="ml-2 text-gray-400">Discover limited-time offers</span>
                <div className="flex gap-3 absolute right-0 top-0 h-full items-center w-[15%] justify-center">
                    <button
                        onClick={handlePrev}
                        className={`p-2 rounded-full border-2 hover:border-btn-hv-bg text-gray-400 hover:text-bg-btn-dynamic ${currentIndex === 0 ? "opacity-40 cursor-not-allowed hover:border-2 hover:text-gray-400" : ""
                            }`}
                    >
                        <ArrowLeft className="cursor-pointer" size={28} />
                    </button>
                    <button
                        onClick={handleNext}
                        className={`p-2 rounded-full border-2 hover:border-btn-hv-bg text-gray-400 hover:text-bg-btn-dynamic ${currentIndex === maxIndex ? "opacity-40 cursor-not-allowed hover:border-2 hover:text-gray-400" : ""
                            }`}
                    >
                        <ArrowRight className="cursor-pointer" size={28} />
                    </button>
                </div>
            </h2>

            {/* khung hiển thị 3 card */}
            <div
                className="relative"
                style={{
                    width: visibleCount * CARD_WIDTH + (visibleCount - 1) * GAP,
                    overflow: "hidden",
                }}
            >
                {/* dải card */}
                <div
                    className="flex"
                    style={{
                        gap: GAP,
                        transform: `translateX(${translateX}px)`,
                        transition: "transform 0.35s ease",
                    }}
                >
                    {data.map((card, i) => (
                        <div key={i} style={{ width: CARD_WIDTH, flex: "0 0 auto" }}>
                            {/* ở đây control chiều cao card */}
                            <Card img={card.img} percent={card.percent} className="h-[280px]" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default SaleUIHome

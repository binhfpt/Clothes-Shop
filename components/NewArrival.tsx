"use client"
import React, { useState } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import useFetch from "@/app/hooks/useFetchData"
import { ProductCard } from "./admin/ProductCard"
import { Separator } from "./ui/separator"

const CARD_WIDTH = 340 // px
const GAP = 32 // = gap-8

const NewArrival = () => {
    const { data, error, loading } = useFetch("/api/product", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    })

    const [currentIndex, setCurrentIndex] = useState(0)
    const visibleCount = 4
    const maxIndex = Math.max(0, (data?.products?.length ?? 0) - visibleCount)

    const handlePrev = () => setCurrentIndex((prev) => Math.max(0, prev - 1))
    const handleNext = () => setCurrentIndex((prev) => Math.min(maxIndex, prev + 1))

    const translateX = -(currentIndex * (CARD_WIDTH + GAP))

    if (loading) return <div>Loading...</div>
    if (error) return <div>Error loading products</div>
    if (!data?.products) return <div>No products found</div>

    return (
        <div className="bg-white h-screen pl-10 -mt-24 overflow-hidden">
            <h2 className="text-gray-700  flex items-center relative h-[12%] font-semibold mb-10 font-satoshi text-4xl">
                New Products.
                <span className="ml-2 text-gray-400">New more clothes</span>

                {/* Nút điều hướng */}
                <div className="flex gap-3 absolute right-0 top-0 h-full items-center w-[15%] justify-center">
                    <button
                        onClick={handlePrev}
                        className={`p-2 rounded-full border-2 hover:border-btn-hv-bg text-gray-400 hover:text-bg-btn-dynamic ${currentIndex === 0
                            ? "opacity-40 cursor-not-allowed hover:border-2 hover:text-gray-400"
                            : ""
                            }`}
                    >
                        <ArrowLeft className="cursor-pointer" size={28} />
                    </button>
                    <button
                        onClick={handleNext}
                        className={`p-2 rounded-full border-2 hover:border-btn-hv-bg text-gray-400 hover:text-bg-btn-dynamic ${currentIndex === maxIndex
                            ? "opacity-40 cursor-not-allowed hover:border-2 hover:text-gray-400"
                            : ""
                            }`}
                    >
                        <ArrowRight className="cursor-pointer" size={28} />
                    </button>
                </div>
            </h2>

            {/* Slider hiển thị card */}
            <div
                className="relative overflow-hidden "
                style={{
                    width: visibleCount * CARD_WIDTH + (visibleCount - 1) * GAP,
                }}
            >
                <div
                    className="flex "
                    style={{
                        gap: GAP,
                        transform: `translateX(${translateX}px)`,
                        transition: "transform 0.35s ease",
                    }}
                >
                    {data.products.map((pro: any) => (
                        <div key={pro._id} className="" style={{ width: CARD_WIDTH, flex: "0 0 auto" }}>
                            <ProductCard product={pro} key={pro._id} />
                        </div>

                    ))}
                </div>
            </div>

        </div>
    )
}

export default NewArrival

"use client"
import { animate, motion, useMotionValue } from "framer-motion"
import { Plus } from "lucide-react"
import React, { useEffect } from "react"
import useMeasure from "react-use-measure"

const InfiniteScroll = ({ data, vector }: { data: string[], vector: string }) => {
    let [ref, { width }] = useMeasure()
    const x = useMotionValue(0)

    useEffect(() => {
        if (!width) return
        // gap-4 = 16px

        const final = -(width / 2 + 8) // 8 là nửa gap
        const controls = animate(x, vector === "left_to_right" ? [final, 0] : [0, final], {
            ease: "linear",
            duration: 25, // Tăng duration cho mượt hơn
            repeat: Infinity,
            repeatType: "loop",
            repeatDelay: 0,
        })
        return () => controls.stop()
    }, [width, x])

    return (
        <div className="relative w-full h-[200px] overflow-hidden">
            <motion.div
                ref={ref}
                style={{ x }}
                className="absolute flex gap-4 will-change-transform"
            >
                {[...data, ...data].map((item, idx) => (
                    <div
                        key={idx}
                        className="group relative h-[200px] w-[200px] shrink-0 overflow-hidden rounded-xl"
                    >
                        <img
                            src={item}
                            alt="product"
                            className="block h-full w-full object-cover"
                        />

                        {/* Bỏ pointer-events-none và dùng group-hover */}
                        <div className="absolute inset-0 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="absolute inset-0 bg-black/50" />
                            <button className="relative z-10 flex items-center gap-1 rounded-full bg-white px-3 py-2 text-sm font-semibold text-gray-800 hover:scale-105 transition-transform">
                                Explore Now <Plus className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </motion.div>
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute left-0 top-0 h-full w-40 bg-gradient-to-r from-background to-transparent" />
                <div className="absolute right-0 top-0 h-full w-40 bg-gradient-to-l from-background to-transparent" />
            </div>

        </div>
    )
}

export default InfiniteScroll
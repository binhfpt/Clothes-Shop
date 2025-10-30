import { motion } from 'framer-motion'
import React, { useRef } from 'react'
import InfiniteScroll from '../InfiniteScroll';

const data: string[] = [
    "/pic/pexels-ron-lach-9594418.jpg",
    "/pic/pexels-ivan-samkov-7671168.jpg",
    "/pic/pexels-fahmi-garna-249814583-13094233.jpg",
    "/pic/pexels-fahmi-garna-249814583-13094187.jpg"
    , "/pic/pexels-dayong-tien-681073045-18186107.jpg"
    , "/pic/pexels-d-ng-thanh-tu-2922122-5693888.jpg"
    , "/pic/pexels-content-prod-co-5995825.jpg"
    , "/pic/pexels-anna-nekrashevich-8532616.jpg"
]

const FindPerfectMatch = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <div className="bg-background min-h-screen pt-80 items-center justify-center  overflow-x-hidden">
            <div className="flex flex-col items-center overflow-x-hidden justify-center text-center py-20">
                {/* <div className=" overflow-hidden w-screen mb-20">
                    <motion.div
                        animate={{ x: ["-50%", "0%"] }}
                        transition={{
                            repeat: Infinity,
                            duration: 20, // tốc độ trượt (giảm để nhanh hơn)
                            ease: "linear",
                        }}
                        className="flex gap-10 w-full" // nhân đôi chiều dài
                    >
                        {data.map((i: any, index: number) => (
                            <div
                                key={index}
                                className="w-[220px] h-[200px] flex-none flex items-center justify-center"
                            >
                                <img
                                    src={i}
                                    alt="product"
                                    className="object-cover w-full h-full"
                                />
                            </div>
                        ))}
                    </motion.div>
                </div> */}
                <InfiniteScroll vector='left_to_right' data={data} />

                <motion.h1
                    className="text-5xl font-bold font-satoshi mt-20 text-gray-600 tracking-tight leading-[1.1]"
                >
                    Find Your
                </motion.h1>




                <div className="flex gap-3 mt-2 mb-20">
                    <motion.h2 className="text-6xl font-semibold text-gray-600 font-satoshi leading-[1.2]">
                        Perfect
                    </motion.h2>
                    <motion.h2 className="text-6xl font-semibold font-satoshi text-bg-btn-dynamic  leading-[1.2]">
                        Match
                    </motion.h2>
                </div>

                <InfiniteScroll vector='right_to_left' data={data} />




            </div>

        </div>
    )
}

export default FindPerfectMatch

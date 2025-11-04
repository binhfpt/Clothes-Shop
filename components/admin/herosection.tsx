"use client"
import React from 'react'
import ButtonInvincible from '../custom/Button'
import { motion } from 'framer-motion'
import { Eye } from 'lucide-react'

const HeroSection = () => {
    return (
        <div className="bg-blue-50 bg-center text-start flex w-full relative h-screen">
            <img
                src="/pic/pexels-kowalievska-1127000.jpg"
                alt="background"
                className="absolute inset-0 w-full h-full object-cover  "
            />
            <div className="z-10 absolute inset-0 bg-black/30"></div>
            <div className="absolute left-15 z-20 top-15  leading-tight">
                <motion.h1
                    initial={{ opacity: 0.3, x: 180 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="text-5xl md:text-6xl z-20 font-satoshi mb-3 font-semibold text-[#FDC600]"
                // style={{
                //     WebkitTextStroke: '1px black',

                // }}
                >
                    Make yourself
                </motion.h1>

                <motion.span
                    initial={{ opacity: 0.3, x: -180 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
                    whileHover={{ x: 30, transition: { duration: 0.5, ease: "easeOut" } }}
                    className="block text-[#09A8CA] z-20 font-semibold mb-3 font-satoshi text-7xl md:text-8xl"
                >
                    Invincible
                </motion.span>

                <motion.h1
                    initial={{ opacity: 0.3, x: 200 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.8 }}
                    className="text-5xl  md:text-7xl z-20 font-satoshi font-semibold text-[#FDC600]"
                // style={{
                //     WebkitTextStroke: '1px white',

                // }}
                >
                    through the
                </motion.h1>
                <motion.h1
                    initial={{ opacity: 0.3, x: 200 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.8 }}
                    className="text-5xl mt-4 md:text-7xl flex gap-1 z-20 font-satoshi font-semibold text-[#FDC600]"
                // style={{
                //     WebkitTextStroke: '1px white',

                // }}
                >
                    {/* l<Eye size={64} /><Eye size={64} />k */}
                    look <Eye />
                </motion.h1>
            </div>

            {/* <motion.img
                initial={{ opacity: 1, y: 100, x: 20 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                whileHover={{ y: -80, x: -20 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="absolute inset-0 m-auto"
                width={550}
                height={614}
                src="/pic/freepik_br_5ae3b68a-2a71-4ba8-b3e4-c55d92a0698b.png"
            /> */}
            <div className="absolute z-20 right-25 bottom-45 w-100 text-wrap">
                <div className="flex gap-5 w-full flex-col justify-center items-center inset-0">
                    <motion.h4
                        initial={{ opacity: 0.1, y: -100, x: 20 }}
                        animate={{ opacity: 1, y: 0, x: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="text-gray-200 ">Every outfit tells your story — a reflection of strength, freedom, and individuality. Discover fashion that doesn’t just follow trends, but defines your identity.</motion.h4>
                    <ButtonInvincible border={10} width={200} height={70} value="Explore Collection" />
                </div>

            </div>
            {/* <motion.img
          initial={{ opacity: 1, y: 20, x: 20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          whileHover={{ y: -20, x: 20 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute left-20 bottom-20"
          width={120}

          src="/pic/pexels-skylar-kang-6046231-removebg-preview.png"
        /> */}

        </div>
    )
}

export default HeroSection
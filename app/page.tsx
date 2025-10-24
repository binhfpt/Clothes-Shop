"use client"
import ButtonInvincible from "@/components/custom/Button";
import NavBar from "@/components/ui/navbar";
import Image from "next/image";
import { motion } from "framer-motion"

export default function Home() {


  return (
    <div>
      <NavBar />
      <div className="bg-blue-50 flex w-full relative h-screen">
        <div className="absolute left-15 top-15 text-center leading-tight">
          <motion.h1
            initial={{ opacity: 0.3, x: 180 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-5xl md:text-6xl font-satoshi mb-3 font-semibold text-gray-700"
          >
            Make yourself
          </motion.h1>

          <motion.span
            initial={{ opacity: 0.3, x: -180 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
            whileHover={{ x: 30, transition: { duration: 0.5, ease: "easeOut" } }}
            className="block text-bg-btn-dynamic font-semibold mb-3 font-satoshi text-6xl md:text-7xl"
          >
            Invincible
          </motion.span>

          <motion.h1
            initial={{ opacity: 0.3, x: 200 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.8 }}
            className="text-5xl md:text-6xl font-satoshi font-semibold text-gray-700"
          >
            through the look
          </motion.h1>
        </div>

        <motion.img
          initial={{ opacity: 1, y: 100, x: 20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          whileHover={{ y: -80, x: -20 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute inset-0 m-auto"
          width={550}
          height={614}
          src="/pic/freepik_br_5ae3b68a-2a71-4ba8-b3e4-c55d92a0698b.png"
        />
        <div className="absolute  right-25 bottom-70 w-100 text-wrap">
          <div className="flex gap-5 w-full flex-col justify-center items-center inset-0">
            <motion.h4
              initial={{ opacity: 0.1, y: -100, x: 20 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              whileHover={{ y: -5, transition: { duration: 0.5, ease: "easeOut" } }}

              className="text-gray-500 ">Every outfit tells your story — a reflection of strength, freedom, and individuality. Discover fashion that doesn’t just follow trends, but defines your identity.</motion.h4>
            <ButtonInvincible border={5} width={200} height={70} value="Explore Collection" />
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
    </div>
  )
}

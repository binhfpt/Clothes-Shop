// import React from 'react'
// import ButtonInvincible from '../custom/Button'
// import { motion } from 'framer-motion'

// const Card = ({ percent, img }: { percent: string, img: string }) => {
//     return (
//         <motion.div
//             initial="rest"
//             whileHover="hover"
//             animate="rest"
//             variants={{
//                 rest: {},
//                 hover: {}
//             }}
//             className="relative z-0 flex gap-8 justify-center h-[45%] bg-blue-50 rounded-2xl w-[31%] items-center overflow-hidden"
//         >
//             {/* overlay */}
//             <motion.div
//                 variants={{
//                     rest: { opacity: 0 },
//                     hover: { opacity: 0.2 },
//                 }}
//                 transition={{ duration: 0.3 }}
//                 className="absolute z-10 inset-0 bg-black rounded-2xl"
//             />

//             {/* content */}
//             <div className="h-[80%] flex flex-col z-20 justify-between items-center w-[50%] relative">
//                 <div className="text-gray-800">
//                     <h4 className="text-gray-500 mb-2">Sale collection</h4>
//                     <h3 className="font-semibold font-satoshi text-2xl">Up to</h3>
//                     <h3 className="font-semibold font-satoshi text-2xl">
//                         {percent}% off retail
//                     </h3>
//                 </div>
//                 <ButtonInvincible
//                     onclick={() => alert('lol')}
//                     border={8}
//                     height={50}
//                     width={150}
//                     value="Show me all"
//                 />
//             </div>

//             {/* image */}
//             <div className="h-full items-center flex w-[50%] relative z-20">
//                 <img src={img} width={200} alt="Sale collection product" />
//             </div>
//         </motion.div>
//     )
// }

// export default Card
import React from "react"
import ButtonInvincible from "../custom/Button"
import { motion } from "framer-motion"

type CardProps = {
    percent: string
    img: string
    className?: string
}

const Card = ({ percent, img, className = "" }: CardProps) => {
    return (
        <motion.div
            initial="rest"
            whileHover="hover"
            animate="rest"
            variants={{
                rest: { scale: 1 },
                hover: { scale: 1.015 },
            }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className={
                "relative z-0 flex gap-8 justify-center bg-blue-50 rounded-2xl items-center overflow-hidden " +
                className
            }
        >
            {/* overlay */}
            <motion.div
                variants={{
                    rest: { opacity: 0 },
                    hover: { opacity: 0.2 },
                }}
                transition={{ duration: 0.25 }}
                className="absolute z-10 inset-0 bg-black rounded-2xl"
            />

            {/* content */}
            <div className="h-[80%] flex flex-col z-20 justify-between items-center w-[50%] relative">
                <div className="text-gray-800">
                    <h4 className="text-gray-500 mb-2">Sale collection</h4>
                    <h3 className="font-semibold font-satoshi text-2xl">Up to</h3>
                    <h3 className="font-semibold font-satoshi text-2xl">
                        {percent}% off retail
                    </h3>
                </div>
                <ButtonInvincible
                    needHover={true}
                    onclick={() => alert("lol")}
                    border={8}
                    height={50}
                    width={150}
                    value="Show me all"
                />
            </div>

            {/* image */}
            <div className="h-full items-center flex w-[50%] relative z-20">
                <img src={img} width={200} alt="Sale collection product" />
            </div>
        </motion.div>
    )
}

export default Card

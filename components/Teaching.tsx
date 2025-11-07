import React from 'react'
import { Separator } from './ui/separator'

const data = [
    { img: "/pic/search.svg", title: "Filter & Discover", subTitle: "Smart filtering and suggestions make it easy to find", step: "Step 1", color: "#C30407", colorbg: "#FFE0E1" },
    { img: "/pic/basket-2.svg", title: "Add to basket", subTitle: "Easily add your favorite products to the shopping basket with one click.", step: "Step 2", color: "#C30407", colorbg: "#FFE0E1" },
    { img: "/pic/delivery-truck-clock.svg", title: "Fast Delivery", subTitle: "We ensure your order is delivered quickly and safely to your doorstep.", step: "Step 3", color: "#C30407", colorbg: "#FFE0E1" },
    { img: "/pic/smiley-happy-flat.svg", title: "Enjoy Your Product", subTitle: "Experience and enjoy the quality of the product you’ve chosen.", step: "Step 4", color: "#C30407", colorbg: "#FFE0E1" },
]

const Teaching = () => {
    return (
        <div id='Teaching' className='h-screen bg-white relative overflow-hidden  pt-18'>
            <svg width="1719" height="70" viewBox="0 0 1719 70" fill="none" className='absolute mt-30 z-0 opacity-15' xmlns="http://www.w3.org/2000/svg">
                <g filter="url(#filter0_d_0_1)">
                    <path d="M1.5 4.51953C47.6667 23.1862 157.1 60.5195 225.5 60.5195C293.9 60.5195 494.333 23.1862 586 4.51953C693 -1.14713 911.9 -5.18047 931.5 24.0195C951.1 53.2195 1176.67 23.1862 1287 4.51953" stroke="black" strokeDasharray="10 10" />
                    <path d="M1.5 4.51953C47.6667 23.1862 157.1 60.5195 225.5 60.5195C293.9 60.5195 494.333 23.1862 586 4.51953C693 -1.14713 911.9 -5.18047 931.5 24.0195C951.1 53.2195 1176.67 23.1862 1287 4.51953" stroke="url(#paint0_linear_0_1)" strokeOpacity="0.2" strokeDasharray="10 10" />
                    <path d="M1.5 4.51953C47.6667 23.1862 157.1 60.5195 225.5 60.5195C293.9 60.5195 494.333 23.1862 586 4.51953C693 -1.14713 911.9 -5.18047 931.5 24.0195C951.1 53.2195 1176.67 23.1862 1287 4.51953" stroke="black" strokeOpacity="0.2" strokeDasharray="10 10" />
                    <path d="M1.5 4.51953C47.6667 23.1862 157.1 60.5195 225.5 60.5195C293.9 60.5195 494.333 23.1862 586 4.51953C693 -1.14713 911.9 -5.18047 931.5 24.0195C951.1 53.2195 1176.67 23.1862 1287 4.51953" stroke="black" strokeOpacity="0.2" strokeDasharray="10 10" />
                </g>
                <path d="M1345.5 4.51953C1391.67 23.1862 1501.1 60.5195 1569.5 60.5195C1637.9 60.5195 1838.33 23.1862 1930 4.51953C2037 -1.14713 2255.9 -5.18047 2275.5 24.0195C2295.1 53.2195 2520.67 23.1862 2631 4.51953" strokeDasharray="10 10" stroke="black" />
                <defs>
                    <filter id="filter0_d_0_1" x="-2.68742" y="0.000976562" width="1293.77" height="69.0186" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                        <feFlood floodOpacity="0" result="BackgroundImageFix" />
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                        <feOffset dy="4" />
                        <feGaussianBlur stdDeviation="2" />
                        <feComposite in2="hardAlpha" operator="out" />
                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_0_1" />
                        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_0_1" result="shape" />
                    </filter>
                    <linearGradient id="paint0_linear_0_1" x1="644.25" y1="0.5" x2="644.25" y2="60.5195" gradientUnits="userSpaceOnUse">
                        <stop stopOpacity="0" />
                        <stop offset="1" />
                    </linearGradient>
                    <linearGradient id="paint1_linear_0_1" x1="1988.25" y1="0.5" x2="1988.25" y2="60.5195" gradientUnits="userSpaceOnUse">
                        <stop stopOpacity="0" />
                        <stop offset="1" />
                    </linearGradient>
                </defs>
            </svg>

            <div className="absolute left-10 right-10 h-[1px] bg-gray-300"></div>
            <div className='flex gap-15 mt-25 items-center justify-center'>
                {data.map((ca, ind) => (
                    <div key={ind} className='w-[20%] gap-2 flex flex-col justify-center items-center'>
                        <div className='mb-6  z-10'>
                            <img className='w-[120px] h-[120px]' src={ca.img}></img>
                        </div>
                        <h4 style={{ color: ca.color, backgroundColor: ca.colorbg }} className='py-1 mb-3 px-4 text-xs font-satoshi font-semibold rounded-xl'>{ca.step}</h4>
                        <h3 className='text-gray-900 font-satoshi text-base font-bold'>{ca.title}</h3>
                        <h4 className='text-neutral-600 text-sm font-satoshi text-center'>{ca.subTitle}</h4>
                    </div>
                ))}
            </div>
        </div>

    )
}

export default Teaching
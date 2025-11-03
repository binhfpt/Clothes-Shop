import React from "react"

type Props = {
    value: string,
    width: number,
    height: number,
    border: number,
    onclick?: () => void,
    needHover?: boolean
}



export default function ButtonInvincible({ value, width, height, onclick, border, needHover }: Props) {

    return (
        <div className="relative flex justify-center items-center w-full" onClick={onclick}>
            <div
                style={{ width: `${width}px`, height: `${height}px` }}
                className={`
          relative flex items-center justify-center
          font-semibold rounded-xl overflow-hidden
          text-gray-50 cursor-pointer
          
          before:content-[''] before:absolute
          before:left-1/2 before:top-1/2
          before:w-[360px] before:h-[360px]
          before:-translate-x-1/2 before:-translate-y-1/2
          before:rounded-[inherit]
          before:z-0 before:opacity-0
          before:bg-[conic-gradient(at_50%_50%,transparent_0_18%,#527FE6_88%_92%,transparent_92%_100%)]
          ${needHover ? "hover:before:opacity-80 hover:before:animate-[spin_3s_linear_infinite]" : "before:opacity-80 before:animate-[spin_3s_linear_infinite]"}
          transition-all duration-300
         `}
            >
                <span
                    style={{
                        width: `${width - border}px`,
                        height: `${height - border}px`,
                    }}
                    className="relative z-10 bg-[#303032] rounded-xl flex items-center justify-center"
                >
                    {value}
                </span>
            </div>
        </div>
    )
}

import React from 'react'
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
interface ChatTopProps {
    onClose?: () => void;
}
import { X, Phone } from 'lucide-react'
const ChatTop = ({ onClose }: ChatTopProps) => {

    return (
        <div className='flex relative w-full p-2 shadow-[0_4px_6px_rgba(0,0,0,0.3)]'>
            <div className="flex gap-2">
                {/* Avatar */}
                <Avatar className="shadow-md h-8 w-8">
                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>

                {/* Info */}
                <div className="flex flex-col justify-center gap-0.5">
                    <p className="font-semibold text-sm leading-tight">Mark Grayson</p>
                    <p className="text-xs text-gray-500 leading-tight">@Invincible</p>
                </div>
            </div>

            <div className='absolute flex right-2 top-1/2 justify-between items-center gap-1.5 -translate-y-1/2'>
                <X onClick={onClose} className='w-7 h-7 cursor-pointer  ' />
            </div>
        </div>
    )
}

export default ChatTop
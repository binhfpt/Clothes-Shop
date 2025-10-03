"use client"
import * as React from "react"
import { useEffect, useRef, useState } from "react"
import { SquarePen } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

import ChatTop from "./chat-top"
import ChatBody from "./chat-body"
import ChatBottom from "./chat-bottom"

export interface Message {
    id: number
    text: string
    sender: "bot" | "user"
    timestamp: Date
    kind: "text" | "image"
    imageUrl?: string
    imageName?: string
}

export const ChatButton = () => {
    const [open, setOpen] = useState(true);

    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            text: "Xin chào! Tôi có thể giúp gì cho bạn?",
            sender: "bot",
            timestamp: new Date(),
            kind: "text",
        },
    ])

    // Lưu các ObjectURL để revoke khi unmount
    const objectUrlsRef = useRef<string[]>([])
    useEffect(() => {
        return () => {
            objectUrlsRef.current.forEach((u) => URL.revokeObjectURL(u))
        }
    }, [])

    const handleSendMessage = (text: string) => {
        const t = text.trim()
        if (!t) return

        setMessages((prev) => [
            ...prev,
            {
                id: Date.now(),
                text: t,
                sender: "user",
                timestamp: new Date(),
                kind: "text",
            },
        ])

        // Giả lập bot reply
        setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now() + 1,
                    text: "Cảm ơn bạn đã nhắn tin! Tôi đang xử lý yêu cầu của bạn.",
                    sender: "bot",
                    timestamp: new Date(),
                    kind: "text",
                },
            ])
        }, 1000)
    }

    const handleSendImage = (file: File) => {
        const url = URL.createObjectURL(file)
        objectUrlsRef.current.push(url)

        setMessages((prev) => [
            ...prev,
            {
                text: '',
                id: Date.now(),
                sender: "user",
                timestamp: new Date(),
                kind: "image",
                imageUrl: url,
                imageName: file.name,
            },
        ])
    }

    return (
        <div className="fixed bottom-5 right-10 flex bg-black rounded-full p-4 hover:bg-gray-600 cursor-pointer dark:hover:bg-gray-700 transition z-50">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger>
                    <SquarePen className="text-white" />
                </PopoverTrigger>
                <PopoverContent className="fixed bottom-[-20] right-10 h-[520px] w-[350px] shadow-2xl rounded-xl p-0 overflow-hidden flex flex-col border-gray-300">
                    <ChatTop onClose={() => setOpen(false)} />
                    <ChatBody messages={messages} />
                    <ChatBottom onSendMessage={handleSendMessage} onSendImage={handleSendImage} />
                </PopoverContent>
            </Popover>
        </div>
    )
}
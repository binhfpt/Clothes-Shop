// ChatBody.tsx
import React, { useEffect, useRef } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './avatar'

interface Message {
  id: number
  text: string
  sender: 'bot' | 'user'
  imageName?: string
  imageUrl?: string
  timestamp: Date
  kind: 'text' | 'image'
}

interface ChatBodyProps {
  messages: Message[]
}

const ChatBody = ({ messages }: ChatBodyProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto scroll to bottom khi có tin nhắn mới
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const timeOf = (d: Date) =>
    d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })

  return (
    <div className="flex-1 overflow-y-auto py-4 pl-4 pr-2 bg-gray-50">
      {(!messages || messages.length === 0) ? (
        <div className="flex items-center justify-center h-full text-gray-400">
          <p>Chưa có tin nhắn nào</p>
        </div>
      ) : (
        messages.map((message) =>
          message.sender === 'bot' ? (
            <div key={message.id} className="flex gap-2 mb-4">
              <Avatar className="shadow-md h-8 w-8">
                <AvatarImage src="https://github.com/shadcn.png" alt="@bot" />
                <AvatarFallback>BOT</AvatarFallback>
              </Avatar>

              {/* ==== BOT BUBBLE ==== */}
              <div className={`rounded-lg  max-w-[75%] ${message.kind === 'text' ? "p-3 bg-white shadow-sm" : ""}`}>
                {message.kind === 'image' ? (
                  <>
                    <figure className="space-y-1">
                      <img
                        src={message.imageUrl}
                        alt={message.imageName || 'image'}
                        className="rounded-md max-h-72 object-contain bg-black/5"
                        loading="lazy"
                        onLoad={() =>
                          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
                        }
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).alt = 'Không thể tải ảnh'
                        }}
                      />
                      {(message.imageName || message.text) && (
                        <figcaption className="text-xs text-gray-500">
                          {message.imageName || message.text}
                        </figcaption>
                      )}
                    </figure>
                    <span className="text-xs text-gray-400 mt-1 block">
                      {timeOf(message.timestamp)}
                    </span>
                  </>
                ) : (
                  <>
                    <div className="text-sm text-gray-800 text-wrap">{message.text}</div>
                    <span className="text-xs text-gray-400 mt-1 block">
                      {timeOf(message.timestamp)}
                    </span>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div key={message.id} className="flex gap-2 mb-4 justify-end">
              {/* ==== USER BUBBLE ==== */}
              <div className={`rounded-lg  max-w-[75%] ${message.kind === 'text' ? "bg-blue-500 text-white shadow-sm p-3" : "text-black"}`}>
                {message.kind === 'image' ? (
                  <>
                    <figure className="space-y-1">
                      <img
                        src={message.imageUrl}
                        alt={message.imageName || 'image'}
                        className="rounded-md max-h-72 object-contain"
                        loading="lazy"
                        onLoad={() =>
                          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
                        }
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).alt = 'Không thể tải ảnh'
                        }}
                      />
                      {/* {(message.imageName || message.text) && (
                        <figcaption className="text-xs text-black">
                          {message.imageName || message.text}
                        </figcaption>
                      )} */}
                    </figure>
                    <span className="text-xs text-gray-400 mt-1 block text-right">
                      {timeOf(message.timestamp)}
                    </span>
                  </>
                ) : (
                  <>
                    <div className="text-sm text-wrap">{message.text}</div>
                    <span className="text-xs text-blue-100 mt-1 block text-right">
                      {timeOf(message.timestamp)}
                    </span>
                  </>
                )}
              </div>

              <Avatar className="shadow-md h-8 w-8">
                <AvatarImage src="https://github.com/evilrabbit.png" alt="@user" />
                <AvatarFallback>YOU</AvatarFallback>
              </Avatar>
            </div>
          )
        )
      )}
      <div ref={messagesEndRef} />
    </div>
  )
}

export default ChatBody

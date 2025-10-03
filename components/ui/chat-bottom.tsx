// ChatBottom.tsx
import { Image as ImageIcon, File as FileIcon, Send } from 'lucide-react'
import React, { useState, useRef, KeyboardEvent } from 'react'
import { Textarea } from './textarea'
import { Input } from './input'

interface ChatBottomProps {
    onSendMessage: (text: string) => void
    onSendImage?: (file: File) => void
}

const ChatBottom = ({ onSendMessage, onSendImage }: ChatBottomProps) => {
    const [message, setMessage] = useState('')
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleClick = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputEl = e.target as HTMLInputElement
        const file = inputEl.files?.[0]
        if (!file) return

        const validImageTypes: Record<string, string> = {
            'image/jpeg': 'JPEG',
            'image/jpg': 'JPG',
            'image/png': 'PNG',
            'image/gif': 'GIF',
            'image/webp': 'WebP',
            // Nếu không xử lý sanitize SVG, bạn có thể tạm bỏ dòng dưới:
            'image/svg+xml': 'SVG',
        }

        if (!Object.prototype.hasOwnProperty.call(validImageTypes, file.type)) {
            alert(
                `File không hợp lệ!\n\nChỉ chấp nhận: ${Object.values(validImageTypes).join(', ')}\nFile của bạn: ${file.type || 'Không xác định'}`
            )
            inputEl.value = ''
            return
        }

        // Validate file size (< 10MB)
        const maxSizeInMB = 10
        const maxSizeInBytes = maxSizeInMB * 1024 * 1024
        const fileSizeInMB = (file.size / 1024 / 1024).toFixed(2)

        if (file.size > maxSizeInBytes) {
            alert(`File quá lớn!\n\nKích thước tối đa: ${maxSizeInMB}MB\nFile của bạn: ${fileSizeInMB}MB`)
            inputEl.value = ''
            return
        }

        console.log(`File hợp lệ: ${file.name} (${fileSizeInMB}MB)`)

        const reader = new FileReader()
        reader.readAsDataURL(file)

        onSendImage?.(file)
        inputEl.value = ''
    }

    const handleSend = () => {
        const text = message.trim()
        if (text) {
            onSendMessage(text)
            setMessage('')
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto'
            }
        }
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        // Enter để gửi, Shift+Enter để xuống dòng
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    const handleInput = () => {
        const el = textareaRef.current
        if (el) {
            el.style.height = 'auto'
            el.style.height = `${el.scrollHeight}px`
        }
    }

    return (
        <div className="w-full p-3 bg-white border-t">
            <div className="flex items-end gap-2">
                <button
                    type="button"
                    onClick={handleClick}
                    aria-label="Tải ảnh"
                    className="p-2 hover:bg-gray-100 rounded-lg transition mb-1"
                >
                    <ImageIcon className="w-5 h-5 text-gray-600" />
                </button>

                <Input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
                    className="hidden"
                    onChange={handleFileChange}
                />

                <button
                    type="button"
                    aria-label="Tải tệp"
                    className="p-2 hover:bg-gray-100 rounded-lg transition mb-1"
                >
                    <FileIcon className="w-5 h-5 text-gray-600" />
                </button>

                <Textarea
                    ref={textareaRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onInput={handleInput}
                    placeholder="Type your message here..."
                    className="flex-1 min-h-[40px] max-h-[120px] resize-none"
                    rows={1}
                />

                <button
                    type="button"
                    onClick={handleSend}
                    disabled={!message.trim()}
                    aria-label="Gửi"
                    className="p-2 hover:bg-blue-100 rounded-lg transition mb-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Send className="w-5 h-5 text-blue-500" />
                </button>
            </div>
        </div>
    )
}

export default ChatBottom

import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Dot } from 'lucide-react'

const BlogAvatar = ({ author, publishDate }: { author: any, publishDate: Date }) => {
    return (
        <div className='flex items-center'>
            <Avatar className='w-7 h-7'>
                <AvatarImage src={author.avatar ?? "https://github.com/shadcn.png"} alt="@shadcn" />
                <AvatarFallback>{author.name}</AvatarFallback>
            </Avatar>
            <p className='text-neutral-900 ml-2 font-satoshi text-lg'>{author.username}</p>
            <Dot className='text-neutral-400' size={18} />
            <p className='text-neutral-500 text-sm'>
                {publishDate ? new Date(publishDate).toDateString() : "draft"}
            </p>
        </div>
    )
}

export default BlogAvatar
"use client"
import React from 'react'
import BlogAvatar from './blogAvatar'
import Image from 'next/image'



const BlogCard = ({ blog }: { blog: any }) => {

    return (
        <div className='flex relative flex-col w-full gap-3 h-125 text-neutral-800'>
            <div
                className="bg-cover bg-center w-full rounded-2xl h-[70%]"
                style={{ backgroundImage: `url(${blog.thumbnail})` }}
            ></div>
            <h2 className='text-xl font-satoshi font-semibold mt-2 line-clamp-1 leading-[130%] '>{blog.title}</h2>
            <h3 className='text-neutral-600 line-clamp-2'>{blog.subTitle}</h3>
            {/* <div
                className="prose prose-slate max-w-none"
                dangerouslySetInnerHTML={{ __html: blog.content }}
            /> */}
            <div className='absolute bottom-0 left-0'>
                <BlogAvatar author={blog.author} publishDate={blog.publishDate} />
            </div>
        </div>
    )
}

export default BlogCard
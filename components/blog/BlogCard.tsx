"use client"
import React from 'react'



const BlogCard = ({ blog }: { blog: any }) => {

    return (
        <div className='flex flex-col gap-3 text-neutral-800 bg-blue-50'>
            <h2>{blog.title}</h2>
            <img src={blog.thumbnail} alt='thumbnail'></img>
            <h3>{blog.subTitle}</h3>
            <div
                className="prose prose-slate max-w-none"
                dangerouslySetInnerHTML={{ __html: blog.content }}
            />
        </div>
    )
}

export default BlogCard
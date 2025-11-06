"use client"
import React from 'react'
import { useGetblogsQuery } from '@/app/redux/api/blogAPI'
import LoadingBig from '@/components/loading-big'
import NoDataFound from '@/components/ui/nodata'
import BlogCard from '@/components/blog/BlogCard'

const BlogPage = () => {
    const { data, error, isLoading } = useGetblogsQuery()

    if (error) return <div>ERROR</div>
    if (isLoading) return <LoadingBig />
    if (!data || data?.blogs?.length === 0) return <NoDataFound />
    return (
        <div className='bg-white h-screen w-full'>
            <div>
                {data?.blogs?.map((blog: any) => (
                    <div key={blog._id}>
                        <BlogCard blog={blog} />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default BlogPage
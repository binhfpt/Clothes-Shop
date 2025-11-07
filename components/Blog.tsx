import { useGetblogsQuery } from '@/app/redux/api/blogAPI'
import React from 'react'
import LoadingBig from './loading-big'
import NoDataFound from './ui/nodata'
import BlogCard from './blog/BlogCard'

const Blog = () => {

    const { data, error, isLoading } = useGetblogsQuery()

    if (error) return <div>ERROR</div>
    if (isLoading) return <LoadingBig />
    if (!data || data?.blogs?.length === 0) return <NoDataFound />
    return (
        <div className='bg-white h-auto w-full pl-10 pr-10 pb-20'>
            <h2 className="text-gray-700 flex items-center relative h-[12%] font-semibold font-satoshi text-4xl">
                Latest Blogs.
                <img src={"/pic/fire-svgrepo-com.svg"} alt='logo' className='w-[45px] h-[45px]'></img>

            </h2>
            <div className='flex flex-wrap gap-[3.5%] items-center'>
                {data?.blogs?.map((blog: any) => (
                    <div className='flex  w-[31%] mt-20' key={blog._id}>
                        <BlogCard blog={blog} />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Blog
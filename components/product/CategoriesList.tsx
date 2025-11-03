import { useGetCategoriesQuery } from '@/app/redux/api/categoryAPI'
import React, { useEffect } from 'react'
import NoDataFound from '../ui/nodata'
import LoadingBig from '../loading-big'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/app/redux/store/store'
import { clearCategory, setCategory } from '@/app/redux/slice/category/categorySelected'

const CategoriesList = () => {
    const { data, error, isLoading } = useGetCategoriesQuery()
    const dispatch = useDispatch()

    const selectedCategory = useSelector((state: RootState) => state.category.selectedCategory)

    useEffect(() => {
        if (data && data?.categories?.length > 0) {
            dispatch(setCategory(data?.categories?.[0]._id))
        }
    }, [data, data?.categories])

    const handleSelected = (id: string) => {
        dispatch(setCategory(id))
    }
    const handleClear = () => {
        dispatch(clearCategory())
    }

    if (error) return <div> LOL</div>
    if (isLoading) return <LoadingBig />
    if (data && data?.categories?.length === 0) return <NoDataFound />

    return (
        <div className='flex items-center gap-1.5 px-1 rounded-4xl '>
            {data?.categories.map((cate, i) => (
                <div key={cate._id} onClick={(e) => handleSelected(cate._id)} className={` ${selectedCategory === cate._id ? "bg-[#303032] text-white" : "bg-white text-[#303032]"} cursor-pointer rounded-4xl  py-2.5 px-5`}>
                    {cate.name}
                </div>
            ))}
        </div>
    )
}

export default CategoriesList
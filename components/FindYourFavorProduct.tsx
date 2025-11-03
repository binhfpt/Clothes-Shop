import { useGetProductsQuery } from '@/app/redux/api/productAPI';
import React, { useEffect, useMemo, useState } from 'react'
import CategoriesList from './product/CategoriesList';
import PopoverSubcategories from './product/PopoverSubcategories';
import SortProduct from './product/SortProduct';
import AdvancedFilter from './product/AdvancedFilter';
import { Input } from './ui/input';
import LoadingBig from './loading-big';
import NoDataFound from './ui/nodata';
import { ProductCard } from './admin/ProductCard';
import { ArrowBigLeftDash, Search } from 'lucide-react';
import ButtonInvincible from './custom/Button';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/redux/store/store';
import useDebounce from '@/app/hooks/useDebounce';

const FindYourFavorProduct = () => {
    const { data, error, isLoading } = useGetProductsQuery();
    const limit = 8
    const selectedMainCategory = useSelector((state: RootState) => state.category.selectedCategory)
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 300);
    const selectedColor = useSelector((state: RootState) => state.color.selectedColors)
    const selectedSubCategory = useSelector((state: RootState) => state.subCategory.selectedSubCategories)
    const selectedBrand = useSelector((state: RootState) => state.brand.selectedBrands)

    const handleCheckArraytoArray = (arr1: string[] = [], arr2: string[] = []): boolean => {
        return arr1.some(e => arr2.includes(e))
    }


    const filterData = useMemo(() => {
        let rtnData = []
        if (data && data?.products?.length > 0) {
            rtnData = data.products
        }
        if (selectedMainCategory) rtnData = rtnData.filter((e) => e.category === selectedMainCategory)
        if (debouncedSearch) rtnData = rtnData.filter((e) => e?.title?.toLowerCase().includes(debouncedSearch.toLowerCase()))
        if (selectedSubCategory.length > 0) rtnData = rtnData.filter((e) => handleCheckArraytoArray(e.categories, selectedSubCategory))
        if (selectedColor.length > 0) {
            rtnData = rtnData.filter((product) =>
                product.variants?.some((v: any) => selectedColor.includes(v.color.toLowerCase()))
            )
        }

        return rtnData
    }, [data, data?.products, selectedMainCategory, debouncedSearch, selectedBrand, selectedSubCategory, selectedColor])

    if (isLoading) return <LoadingBig />
    if (error) return <div>Error loading products</div>
    if (!data?.products) return <NoDataFound />
    return (
        <div className='bg-white flex flex-col pl-10 pr-10 pt-15'>
            {/* TITLE */}
            <h2 className="text-gray-700  flex items-center relative h-[12%] font-semibold mb-10 font-satoshi text-4xl">
                Discover and Shopping Now.
            </h2>
            <div className='flex flex-col gap-8'>
                <div className='flex justify-between items-center'>
                    <CategoriesList />
                    <div className='w-[10%]'>
                        <AdvancedFilter />
                    </div>
                </div>
                <div className='h-[1px] bg-gray-300'></div>
                <div className='flex justify-between items-center'>
                    <div className='flex gap-3'>
                        <PopoverSubcategories type='subcategories' />
                        <PopoverSubcategories type='brands' />
                        <PopoverSubcategories type='colors' />
                    </div>
                    <div className='flex w-[40%] gap-5 items-center justify-between relative'>
                        <Input onChange={(e) => setSearch(e.target.value)} className='h-10 text-2xl rounded-2xl border-2 pl-10 relative border-neutral-600 text-neutral-900 selection:bg-blue-100 selection:text-neutral-900' />
                        <Search className='absolute left-2 text-black' size={28} strokeWidth={1} />
                        <SortProduct />
                    </div>
                </div>
            </div>
            <div className={`flex flex-wrap gap-10 mt-15 ${filterData.length > 3 ? "justify-between" : "justify-start"} items-center`}>
                {filterData.length > 0 ? filterData.map((p: any, idx: number) => (
                    idx < limit ?
                        <div key={p._id} className=''>
                            <ProductCard product={p} />
                        </div> : ""
                )
                ) :
                    <NoDataFound />}
            </div>
            <div className={`flex items-center justify-center mt-5 ${filterData.length > 0 ? "" : "mt-20"}`}>
                <ButtonInvincible width={300} needHover={false} height={60} border={8} value={`Show me more...`} />
            </div>
            <div className='h-[1px] bg-gray-300 mt-30'></div>
        </div>

    )
}

export default FindYourFavorProduct
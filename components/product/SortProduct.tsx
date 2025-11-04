import React from 'react'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select'
import { ArrowDownAZ, ArrowDownNarrowWide, ArrowUpNarrowWide } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/app/redux/store/store'
import { setSortProducts } from '@/app/redux/slice/product/sortSlice'

const SortProduct = () => {
    const dispatch = useDispatch()

    return (
        <Select
            name="sort"
            onValueChange={(value) =>
                dispatch(setSortProducts(value))
            }
        >
            <SelectTrigger className=" text-bg-btn-dynamic bg-white border-[2.5px] border-neutral-900 rounded-2xl">
                <ArrowDownAZ strokeWidth={1.5} className='text-gray-800 size-5 font-normal' />
                <SelectValue className='text-neutral-900' placeholder="Sort" />
            </SelectTrigger>
            <SelectContent className='text-text-tilte' >

                <SelectGroup className='text-text-tilte' >
                    <SelectLabel>Increase</SelectLabel>
                    <SelectItem className='text-text-tilte flex items-center justify-between' value={"price-asc"}><p>Price</p><ArrowUpNarrowWide /></SelectItem>
                    <SelectItem className='text-text-tilte flex items-center justify-between' value={"date-asc"}><p>Created at</p><ArrowUpNarrowWide /></SelectItem>

                </SelectGroup>
                <SelectGroup className='text-text-tilte' >
                    <SelectLabel>Decrease</SelectLabel>
                    <SelectItem className='text-text-tilte flex items-center justify-between' value={"price-desc"}><p>Price</p><ArrowDownNarrowWide /></SelectItem>
                    <SelectItem className='text-text-tilte flex items-center justify-between' value={"date-desc"}><p>Created at</p><ArrowDownNarrowWide /></SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}

export default SortProduct
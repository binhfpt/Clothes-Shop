import BrandForm from '@/components/admin/brand-form'
import React from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { Input } from '@/components/ui/input'
import useFetch from '@/app/hooks/useFetchData'
import TableCategory from '@/components/admin/ssr-data/category-table'
const CategoryPage = () => {

    // const { data, error, loading } = useFetch("/api/get/categories", {
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    // })

    // if (loading) return <div>LOADING....</div>
    // if (error) return <div>error: {error}</div>
    // if (!data || data.brands?.length === 0) return <div>Empty categories</div>
    return (
        <div>
            <TableCategory />
        </div>
    )
}

export default CategoryPage
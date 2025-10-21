import AdminDataTable from '@/components/admin/admin-table'
import { Table } from '@/components/ui/table'
import React from 'react'


const subCategories = async () => {

    const res = await fetch(`${process.env.DOMAIN}/api/get/subcategories`, {
        cache: "no-cache",
        method: "GET"
    })
    const { categories } = await res.json()

    return (
        <div>
            <AdminDataTable data={categories} header={[{ atri: "Name", w: "400px" },
            { atri: "Description", w: "300px" },
            { atri: "Active", w: "200px" },
            { atri: "Created At", w: "300px" },


            ]} cell={[{ atri: "name" }, { atri: "description" }, { atri: "isActive" }, { atri: "createdAt" }]} />
        </div>
    )
}

export default subCategories
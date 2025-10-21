import useFetch from "@/app/hooks/useFetchData"
import AdminDataTable from "@/components/admin/admin-table"
import SubCateByParentData from "@/components/admin/subcategories/subCateByParent"
import React from "react"

const SubCatebyParent = async ({ params }: { params: { slug: string } }) => {
    const { slug } = params

    return (
        <SubCateByParentData slug={slug} />
    )
}

export default SubCatebyParent

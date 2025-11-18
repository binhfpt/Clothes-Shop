import { useEffect, useState } from "react"
import { useGetProductsQuery } from "../redux/api/productAPI"
import { useGetClientInformationQuery } from "../redux/api/meAPI"

export const IsLogin = () => {

    const { data, error, isLoading } = useGetClientInformationQuery()


}
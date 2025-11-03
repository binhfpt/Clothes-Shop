import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'


export const productApi = createApi({
    reducerPath: 'productApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
    endpoints: (builder) => ({
        getProducts: builder.query<{ products: any[] }, void>({
            query: () => 'product',
        }),
    }),
})

export const { useGetProductsQuery } = productApi

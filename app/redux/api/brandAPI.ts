import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'


export const brandAPI = createApi({
    reducerPath: 'brandApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
    endpoints: (builder) => ({
        getbrands: builder.query<{ brands: any[] }, void>({
            query: () => 'brand',
        }),
    }),
})

export const { useGetbrandsQuery } = brandAPI

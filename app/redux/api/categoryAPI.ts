import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'


export const categoryAPI = createApi({
    reducerPath: 'categoryAPI',
    baseQuery: fetchBaseQuery({ baseUrl: '/api/get' }),
    endpoints: (builder) => ({
        getCategories: builder.query<{ categories: any[] }>({
            query: () => 'categories',
        }),
    }),
})

export const subcategoryAPI = createApi({
    reducerPath: 'subcategoryAPI',
    baseQuery: fetchBaseQuery({ baseUrl: '/api/get' }),
    endpoints: (builder) => ({
        getSubCategories: builder.query<{ categories: any[] }>({
            query: () => 'subcategories',
        }),
    }),
})

export const { useGetSubCategoriesQuery } = subcategoryAPI

export const { useGetCategoriesQuery } = categoryAPI



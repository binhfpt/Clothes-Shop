import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'


export const blogAPI = createApi({
    reducerPath: 'blogApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
    endpoints: (builder) => ({
        getblogs: builder.query<{ blogs: any[] }, void>({
            query: () => 'blogs',
        }),
        createblog: builder.mutation({
            query: ({ html, blogform, imgUrl, type }) => ({
                url: "/blog",
                method: "POST",
                body: { content: html, form: blogform, imgUrl, type },
            }),
        })
    }),

})

export const { useGetblogsQuery, useCreateblogMutation } = blogAPI

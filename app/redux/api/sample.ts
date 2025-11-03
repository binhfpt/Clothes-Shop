// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// export const categoryAPI = createApi({
//     reducerPath: 'categoryAPI',
//     baseQuery: fetchBaseQuery({ baseUrl: '/api/get' }),

//     endpoints: (builder) => ({
//         //  Lấy tất cả danh mục
//         getCategories: builder.query<{ products: any[] }, void>({
//             query: () => 'categories',
//         }),

//         //  Lấy chi tiết 1 danh mục theo ID
//         getCategoryById: builder.query<any, string>({
//             query: (id) => `categories/${id}`,
//         }),

//         //  Tạo danh mục mới
//         createCategory: builder.mutation<any, { name: string }>({
//             query: (body) => ({
//                 url: 'categories',
//                 method: 'POST',
//                 body,
//             }),
//         }),
//     }),
// })

// Export các hook được RTK Query tự động tạo ra
// export const {
//     useGetCategoriesQuery,
//     useGetCategoryByIdQuery,
//     useCreateCategoryMutation,
// } = categoryAPI
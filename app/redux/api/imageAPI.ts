import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

export const imageAPI = createApi({
    reducerPath: 'imageApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image`,
    }),
    endpoints: (builder) => ({
        createImage: builder.mutation({
            query: (file: File) => {
                const formData = new FormData()
                formData.append('file', file)
                formData.append('upload_preset', UPLOAD_PRESET ?? '')
                return {
                    url: '/upload',
                    method: 'POST',
                    body: formData,
                }
            },
        }),
    }),
})

export const { useCreateImageMutation } = imageAPI

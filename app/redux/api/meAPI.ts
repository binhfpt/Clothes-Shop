import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'


export const meAPI = createApi({
    reducerPath: 'meApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
    endpoints: (builder) => ({
        getClientInformation: builder.query<{ user: any }, void>({
            query: () => 'me',
        }),
    }),
})

export const { useGetClientInformationQuery } = meAPI

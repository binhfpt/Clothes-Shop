'use client'

import { useGetClientInformationQuery } from '@/app/redux/api/meAPI'
import { clearMe, setMe } from '@/app/redux/slice/user/me'
import { RootState } from '@/app/redux/store/store'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const HomePage = () => {
    const { data, error, isLoading } = useGetClientInformationQuery()
    const dispatch = useDispatch()

    useEffect(() => {
        if (data?.user) {
            dispatch(setMe(data.user))
        } else if (error) {
            dispatch(clearMe())
        }
    }, [data, error, dispatch])

    if (isLoading) return <div>Đang tải...</div>
    if (error) return <div>error</div>
    if (!data || data.user === null) return <div>Không tìm thấy user</div>

    return (
        <div>
            <h1>Xin chào, {data.user.username}</h1>
            <p>Email: {data.user.email}</p>
        </div>
    )
}

export default HomePage

'use client'

import { useEffect, useState } from 'react'

const HomePage = () => {
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch('/api/me', {
                    method: 'GET',
                    cache: "no-cache"
                    // Browser tự động gửi cookies, không cần thêm gì!
                })

                if (!res.ok) {
                    throw new Error('Failed to fetch user')
                }

                const data = await res.json()
                setUser(data.user)
            } catch (err: any) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchUser()
    }, [])

    if (loading) return <div>Đang tải...</div>
    if (error) return <div>Lỗi: {error}</div>
    if (!user) return <div>Không tìm thấy user</div>

    return (
        <div>
            <h1>Xin chào, {user.username}</h1>
            <p>Email: {user.email}</p>
        </div>
    )
}

export default HomePage
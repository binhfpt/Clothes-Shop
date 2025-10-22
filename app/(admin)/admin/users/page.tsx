"use client"
import { BinhDropdownMenuGeneric } from '@/components/admin/drop-down-setting'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { BadgeCheckIcon, Copy, BadgeXIcon, Settings, ArrowUpWideNarrow, ArrowDownWideNarrow, XIcon, CircleXIcon, StepForward, StepBack, UserX, ChevronsUpDown } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { getTotalPage } from '@/app/helpers/Page-stuff'
import { getPageData } from '@/app/helpers/Page-stuff'
import TotalCard from '@/components/admin/total-card'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from '@/components/ui/checkbox'
import toast, { ToastBar, Toaster } from 'react-hot-toast'
import LoadingBig from '@/components/loading-big'
import NoDataFound from '@/components/ui/nodata'

type User = {
    username: string,
    email: string,
    phone: string,
    isVerified: boolean,
    role: string,
}

const UserAdminPage = () => {
    const [page, setPage] = useState(1)
    const pageSize = 9
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [allUsers, setAllUsers] = useState<any[]>([])
    const [search, setSearch] = useState("")
    const [renderUser, setRenderUser] = useState<any[]>([])
    const [filterObject, setFilterObject] = useState<any>({ filter: "all", sort: "asc" })
    const [debouncedSearch, setDebouncedSearch] = useState(search)
    const [selected, setSelected] = useState<string[]>([])
    const [onSelect, setOnSelect] = useState(false)

    // Tính toán danh sách users đã được filter và sort
    const filteredUsers = useMemo(() => {
        let result = allUsers.filter(u =>
            u.username.toLowerCase().includes(debouncedSearch.toLowerCase())
        )

        if (filterObject.filter !== "all") {
            const isVerified = filterObject.filter === "Verified"
            result = result.filter(u => u.isVerified === isVerified)
        }

        result = result.sort((a, b) => {
            if (filterObject.sort === "asc")
                return a.username.localeCompare(b.username)
            else
                return b.username.localeCompare(a.username)
        })

        return result
    }, [allUsers, debouncedSearch, filterObject])

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 300);

        return () => clearTimeout(timer); // huỷ timer khi search thay đổi
    }, [search]);

    // Reset về trang 1 khi filter/search thay đổi
    useEffect(() => {
        setPage(1)
    }, [debouncedSearch, filterObject])

    // Cập nhật renderUser dựa trên filteredUsers (không phải allUsers)
    useEffect(() => {
        const datafollowpage = getPageData(filteredUsers, pageSize, page)
        setRenderUser(datafollowpage)
    }, [page, filteredUsers])

    useEffect(() => {
        const getAllUsers = async () => {
            try {
                setLoading(true)
                const res = await fetch("/api/accounts", {
                    method: "GET",
                    cache: "no-cache"
                })
                if (!res.ok) {
                    throw new Error('Failed to fetch user')
                }
                const data = await res.json()
                setAllUsers(data.users)
            } catch (err: any) {
                setError(err.message)
            }
            finally {
                setLoading(false)
            }
        }
        getAllUsers()
    }, [])

    const totalPages = getTotalPage(filteredUsers, pageSize) // Sử dụng filteredUsers

    if (loading) return <LoadingBig />
    if (error) return <div>Error: {error}</div>
    if (allUsers.length === 0) return <NoDataFound />

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            const allIds = renderUser.map(u => u._id)
            setSelected(allIds)
        } else {
            setSelected([])
        }
    }
    // Xử lý chọn/bỏ chọn user
    const handleSelectUser = (userId: string, checked: boolean) => {
        if (checked) {
            setSelected(prev => [...prev, userId])
        } else {
            setSelected(prev => prev.filter(id => id !== userId))
        }
    }
    const isAllSelected = renderUser.length > 0 && renderUser.every(u => selected.includes(u._id))

    const handleDeleteSelected = async () => {
        if (selected.length === 0) {
            alert("Chưa chọn user nào!")
            return
        }
        const selectedUsernames = allUsers
            .filter(u => selected.includes(u._id))
            .map(u => u.username)
            .join(", ")

        if (confirm(`Bạn có chắc muốn xóa ${selected.length} users: ${selectedUsernames}?`)) {
            console.log("Xóa các users có ID:", selected)
            // TODO: Gọi API xóa 
            await fetch("/api/users/delete", { method: "DELETE", body: JSON.stringify({ ids: selected }) })
            setRenderUser(prev => prev.filter(u => !selected.includes(u._id)));

            setAllUsers(prev => prev.filter(u => !selected.includes(u._id)));

            setSelected([])

        }
    }

    const handleDeleteUser = async (uid: string) => {
        if (uid.length === 0) return
        const ids = [uid];
        const res = await fetch("/api/users/delete", {
            headers: {
                "Content-Type": "application/json",
            }, method: "DELETE", body: JSON.stringify({ ids })
        })
        if (!res.ok) {
            console.error("Failed to delete user");
            return;
        }

        setRenderUser(prev => prev.filter(u => u._id !== uid));
        setAllUsers(prev => prev.filter(u => u._id !== uid));
        toast.success('Delete successfully!', {
            duration: 2000,
            style: {
                boxShadow: 'none',
                background: '#a3ffbc',

            },
        })
    }

    return (
        <>
            <div className='flex gap-4 mb-4'>
                <TotalCard forward={"/admin/users/add"} amount={filteredUsers.length} />

                <div className='w-full  flex flex-col relative '>
                    {onSelect ? (
                        <div className=' ml-4 absolute top-0 mt-10'>
                            <div className='flex gap-6'>
                                <Button
                                    variant={'secondary'}
                                    onClick={handleDeleteSelected}
                                    className=" text-gray-900 bg-background rounded-2xl border-2 border-gray-200  cursor-pointer flex items-center gap-1"
                                >
                                    <CircleXIcon className="w-6 h-6 text-red-500" />
                                    Delete
                                </Button>
                            </div>

                        </div>
                    ) : null}
                    <div className='flex ml-8 gap-6  absolute bottom-0 mb-5'>
                        {/* search */}
                        <div className='flex flex-col gap-6'>
                            <Input
                                className=' w-[350px] text-black'
                                onChange={(e) => setSearch(e.target.value)}
                                value={search}
                                type='text'
                                placeholder='Search user by name or email'
                            />

                        </div>
                        {/* filter */}
                        <div className="">
                            <Select
                                value={filterObject.filter}
                                onValueChange={(value) => setFilterObject({ ...filterObject, filter: value })}
                            >
                                <SelectTrigger className="w-[150px] ">
                                    <SelectValue placeholder="Filter" className='text-black' />
                                </SelectTrigger>
                                <SelectContent className='text-black'>
                                    <SelectGroup>
                                        <SelectLabel>Verified</SelectLabel>
                                        <SelectItem value='all' className='text-black'>
                                            <Badge variant={'destructive'} className='bg-lightground'>All</Badge>
                                        </SelectItem>
                                        <SelectItem value="Verified">
                                            <Badge
                                                variant="secondary"
                                                className="bg-blue-500 text-white dark:bg-blue-600 cursor-pointer"
                                            >
                                                <BadgeCheckIcon className='text-white' />
                                                Verified
                                            </Badge>
                                        </SelectItem>
                                        <SelectItem value="Unverified">
                                            <Badge
                                                variant="secondary"
                                                className="bg-red-500 text-white dark:bg-red-600 cursor-pointer"
                                            >
                                                <BadgeXIcon className='text-white cursor-pointer' />
                                                Unverified
                                            </Badge>
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* sort */}
                        <div className=''>
                            <Select
                                value={filterObject.sort}
                                onValueChange={(value) => setFilterObject({ ...filterObject, sort: value })}
                            >
                                <SelectTrigger className="w-[150px] ">
                                    <SelectValue placeholder="Sort" className='text-black' />
                                </SelectTrigger>
                                <SelectContent className='text-black'>
                                    <SelectGroup>
                                        <SelectLabel>Name</SelectLabel>
                                        <SelectItem value='asc' className='text-black'>
                                            <ArrowUpWideNarrow />
                                        </SelectItem>
                                        <SelectItem value="desc">
                                            <ArrowDownWideNarrow />
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        {/* selection */}
                        <div className=''>
                            <Button onClick={() => setOnSelect(!onSelect)} className='bg-bg-btn-dynamic text-white hover:bg-btn-hv-bg cursor-pointer px-8'>
                                Selection
                            </Button>
                        </div>

                    </div>
                </div>
            </div>
            <Table className=''>
                <TableCaption className='text-text-l bg-background m-0 pb-5'>
                    <div className="flex items-center bg-background justify-center gap-4 mt-4 ">
                        <Button
                            variant="outline"
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className='rounded-full bg-header-table text-bg-btn-dynamic'
                        >
                            <StepBack />
                        </Button>

                        <span className="text-gray-600 font-semibold">
                            {page} / {totalPages}
                        </span>

                        <Button
                            variant="outline"
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className='rounded-full bg-header-table text-bg-btn-dynamic'

                        >
                            <StepForward />
                        </Button>
                    </div>
                </TableCaption>
                <TableHeader className="h-15 border-b-2 bg-background border-btn-hv-bg">
                    <TableRow className='h-14 '>
                        {onSelect ? (<TableHead className='text-white'>
                            <Checkbox onCheckedChange={handleSelectAll} checked={isAllSelected} id="terms" /></TableHead>) : (null)}

                        <TableHead
                            className="text-text-tilte font-semibold pl-12"
                            style={{ fontSize: "16px" }}
                        >
                            <div className="flex items-center gap-1 cursor-pointer text-lightground">
                                <span>Name</span>
                                <ChevronsUpDown className="w-4 h-4 text-bg-btn-dynamic" />
                            </div>
                        </TableHead>
                        <TableHead
                            className="text-text-tilte font-semibold "
                            style={{ fontSize: "16px" }}
                        >
                            <div className="flex items-center gap-1 cursor-pointer text-lightground ">
                                <span>Email</span>
                                <ChevronsUpDown className="w-4 h-4 text-bg-btn-dynamic" />
                            </div>
                        </TableHead>
                        <TableHead
                            className="text-text-tilte font-semibold"
                            style={{ fontSize: "16px" }}
                        >
                            <div className="flex items-center gap-1 cursor-pointer text-lightground">
                                <span>Phone</span>
                                <ChevronsUpDown className="w-4 h-4 text-bg-btn-dynamic" />
                            </div>
                        </TableHead>
                        <TableHead
                            className="text-text-tilte font-semibold "
                            style={{ fontSize: "16px" }}
                        >
                            <div className="flex items-center gap-1 cursor-pointer text-lightground">
                                <span>Verified</span>
                                <ChevronsUpDown className="w-4 h-4 text-bg-btn-dynamic" />
                            </div>
                        </TableHead>
                        <TableHead
                            className="text-text-tilte font-semibold"
                            style={{ fontSize: "16px" }}
                        >
                            <div className="flex items-center gap-1 cursor-pointer text-lightground">
                                <span>Action</span>
                                <ChevronsUpDown className="w-4 h-4 text-bg-btn-dynamic" />
                            </div>
                        </TableHead>

                    </TableRow>
                </TableHeader >
                <TableBody>
                    {renderUser.map((u: any) => (
                        <TableRow key={u._id} className={`bg-background text-text-l h-16 border-b-2 border-foreground ${selected.includes(u._id) ? "bg-foreground" : ""}`} style={{ fontSize: "16px" }}>
                            {onSelect ? (<TableCell><Checkbox
                                checked={selected.includes(u._id)}
                                onCheckedChange={(checked) => handleSelectUser(u._id, checked as boolean)}
                                className='bg-white'
                            /></TableCell>) : (null)}

                            <TableCell className='pl-12'>{u.username}</TableCell>
                            <TableCell>
                                <div className="flex gap-2 text-text-tilte">
                                    {u.email}
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Copy onClick={() => {
                                                navigator.clipboard.writeText(u.email);
                                            }} className="w-4 cursor-pointer" />
                                        </TooltipTrigger>
                                        <TooltipContent className='bg-gray-700'>
                                            <p>Copy</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex gap-2">
                                    {u.phone}
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Copy onClick={() => {
                                                navigator.clipboard.writeText(u.phone);
                                            }} className="w-4 cursor-pointer" />
                                        </TooltipTrigger>
                                        <TooltipContent className='bg-gray-700'>
                                            <p>Copy</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                            </TableCell>
                            <TableCell>
                                {u.isVerified ? (
                                    <Badge
                                        variant="secondary"
                                        className="bg-blue-500 text-white dark:bg-blue-600"
                                    >
                                        <BadgeCheckIcon />
                                        Verified
                                    </Badge>
                                ) : (
                                    <Badge
                                        variant="secondary"
                                        className="bg-red-500 text-white dark:bg-red-600"
                                    >
                                        <BadgeXIcon />
                                        Unverified
                                    </Badge>
                                )}
                            </TableCell>
                            <TableCell>

                                <BinhDropdownMenuGeneric
                                    data={u}
                                    options={[
                                        {
                                            label: "Delete",
                                            icon: <UserX className="w-4 h-4" />,
                                            onClick: (u) => handleDeleteUser(u._id),
                                        },
                                        {
                                            label: "Alert User",
                                            icon: <Settings className="w-4 h-4" />,
                                            onClick: () => toast.success('Delete successfully!', {
                                                style: {
                                                    boxShadow: 'none',
                                                    background: '#a3ffbc',

                                                },
                                            })

                                        },
                                    ]}
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table >
        </>
    )
}

export default UserAdminPage
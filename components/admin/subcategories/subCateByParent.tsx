"use client"
import useFetch from '@/app/hooks/useFetchData'
import React, { act, useEffect, useMemo, useState } from 'react'
import AdminDataTable from '../admin-table'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { useRouter } from 'next/navigation'
import { BadgeCheckIcon, BadgeXIcon, Pencil, Plus, Shirt } from 'lucide-react'
import BinhSearch from '@/components/ui/custom-search'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import toast from 'react-hot-toast'
const SubCateByParentData = ({ slug }: { slug: string }) => {
    const router = useRouter();

    /////////////// 
    const [form, setForm] = useState({
        name: "",
        slug: "",
        description: "",
        isActive: false,
    })

    const [formsub, setFormSub] = useState([])

    const [currentDialog, setCurrentDialog] = useState({
        _id: "",
        name: "",
        slug: "",
        description: "",
        isActive: false,
    })
    const [dialog, setDialog] = useState(false)
    useEffect(() => {
        const createSlug = (name: string): string => {
            return name
                .toLowerCase()                          // chuyển về chữ thường
                .normalize("NFD")                       // tách dấu tiếng Việt
                .replace(/[\u0300-\u036f]/g, "")        // xóa dấu
                .replace(/[^a-z0-9\s-]/g, "")           // xóa ký tự đặc biệt
                .trim()                                 // xóa khoảng trắng đầu/cuối
                .replace(/\s+/g, "-");                  // thay khoảng trắng bằng dấu gạch ngang
        }
        setForm((prev: any) => ({ ...prev, slug: createSlug(form.name) }))
    }, [form.name])
    useEffect(() => {
        const createSlug = (name: string): string => {
            return name
                .toLowerCase()                          // chuyển về chữ thường
                .normalize("NFD")                       // tách dấu tiếng Việt
                .replace(/[\u0300-\u036f]/g, "")        // xóa dấu
                .replace(/[^a-z0-9\s-]/g, "")           // xóa ký tự đặc biệt
                .trim()                                 // xóa khoảng trắng đầu/cuối
                .replace(/\s+/g, "-");                  // thay khoảng trắng bằng dấu gạch ngang
        }
        setCurrentDialog((prev: any) => ({ ...prev, slug: createSlug(currentDialog.name) }))
    }, [currentDialog.name])
    // Fetch main category theo slug
    const {
        data: mainCategory,
        loading: loadingMain,
        error: errorMain,
    } = useFetch(`/api/category/slug/${slug}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    })

    // State riêng để chứa subcategories
    const [subCategory, setSubCategory] = useState<any>(null)
    const [loadingSubs, setLoadingSubs] = useState(false)
    const [errorSub, setErrorSub] = useState<string | null>(null)
    const [active, setActive] = useState(false)
    const parentId = mainCategory?.category?.[0]?._id
    const [filterObject, setFilterObject] = useState<any>({ filter: "all", sort: "asc", key: "createdAt" })

    // Khi mainCategory đã load xong -> fetch subcategories
    useEffect(() => {
        const mc = mainCategory?.category?.[0]
        if (!mc) return
        setForm({
            name: mc.name ?? "",
            description: mc.description ?? "",
            slug: mc.slug ?? "",
            isActive: !!mc.isActive,
        })
        const fetchSub = async () => {
            if (!mainCategory?.category?.[0]?._id) return
            const id = mainCategory.category[0]._id
            console.log(id)
            setActive(mainCategory?.category[0]?.isActive)
            setLoadingSubs(true)
            setErrorSub(null)

            try {
                const res = await fetch(`/api/get/categories/${id}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                })
                const data = await res.json()
                setSubCategory(data.categories)
                setFormSub(data.categories)
            } catch (err: any) {
                setErrorSub(err.message)
            } finally {
                setLoadingSubs(false)
            }
        }

        fetchSub()
    }, [parentId])

    const handleSaveCategory = async (cateid: any) => {
        console.log(form)
        const res = await fetch("/api/category/update", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                form,
                cateid
            })
        })
        const data = await res.json();
        if (res.ok) {
            // nếu slug thay đổi thì điều hướng
            if (form.slug !== slug) {
                router.push(`/admin/category/subcategories/${form.slug}`);
            }
            toast.success('Save successfully!', {
                duration: 2000,
                style: {
                    boxShadow: 'none',
                    background: '#a3ffbc',

                },
            })
        } if (!res.ok) {
            toast.error('Failed to save category', {
                duration: 2000,
                style: { boxShadow: 'none', background: '#ff6b6b' }
            })
            return;
        }

    }
    const handleSaveSubCategory = async (cateid: any) => {
        const res = await fetch("/api/category/update", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                form: currentDialog,
                cateid
            })
        })
        const data = await res.json();
        if (res.ok) {
            toast.success('Save successfully!', {
                duration: 2000,
                style: {
                    boxShadow: 'none',
                    background: '#a3ffbc',

                },
            })
        } if (!res.ok) {
            toast.error('Failed to save category', {
                duration: 2000,
                style: { boxShadow: 'none', background: '#ff6b6b' }
            })
            return;
        }

    }
    const handleChangeCategory = (e: any) => {
        setForm((prev: any) => ({
            ...prev, [e.target.name]: e.target.value
        }))
    }

    /////////////// serach
    const [search, setSearch] = useState<string>("")

    const filtered = useMemo(() => {
        if (!subCategory) return [];

        let result = [...subCategory];

        if (filterObject.filter !== "all") {
            const isActive = filterObject.filter === "Active"
            result = result.filter((u: any) => u.isActive === isActive)
        }

        if (search && search.length > 0) {
            const lower = search.toLowerCase();
            result = result.filter((item: any) => item.name.toLowerCase().includes(lower))
        }

        result = result.sort((a: any, b: any) => {
            if (filterObject.sort === "asc")
                return a.createdAt.localeCompare(b.createdAt)
            else
                return b.createdAt.localeCompare(a.createdAt)
        })

        return result
    }, [search, subCategory, filterObject])

    // Render
    if (loadingMain) return <div>Loading main category...</div>
    if (errorMain) return <div>Error loading main category</div>
    if (!mainCategory) return <div>No category found</div>

    function handleSetting(id: string, type: string): void {
        if (type === "delete") {
            // TODO : them API delete subcategory
        }
        else if (type === "edit") {
            //TODO : lay data
            const checkExisted = subCategory.filter((u: any) => u._id === id)
            if (checkExisted) {
                const thisDialog = checkExisted[0]
                setCurrentDialog((prev: any) => ({
                    ...prev,
                    _id: thisDialog._id,
                    name: thisDialog.name,
                    description: thisDialog.description,
                    isActive: thisDialog.isActive

                }))
                setDialog(true)
            }

        }
    }

    return (
        <div className='pb-20'>
            <div className=' flex justify-between items-center mb-3 ml-3 py-3 relative'>
                <div className='flex border-b-1 flex-col items-start border-bg-btn-dynamic  pb-5 '>
                    <div className=" flex justify-center gap-3 items-center text-2xl text-bg-btn-dynamic ">
                        <Shirt />
                        <p className='font-semibold'>{mainCategory?.category?.[0]?.name || "No description"}</p>
                    </div>
                    <p className="text-lightground text-center">
                        <span className="font-medium text-gray-900"></span>{" "}
                        {mainCategory?.category?.[0]?.description || "No description"}
                    </p>
                    <div className="flex gap-3 justify-between mt-3 w-full">
                        {mainCategory?.category?.[0]?.isActive ? (
                            <span className="flex items-center gap-1 text-green-600 font-medium">
                                <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
                                Active
                            </span>
                        ) : (
                            <span className="flex items-center gap-1 text-red-600 font-medium">
                                <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
                                Inactive
                            </span>
                        )}
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline" className='bg-bg-btn-dynamic text-gray-50 hover:bg-btn-hv-bg hover:text-gray-50 cursor-pointer'><Pencil />Edit</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle className='text-bg-btn-dynamic'>Edit Main Category</DialogTitle>
                                    <DialogDescription>
                                        Make changes to your category here. Click save when you&apos;re
                                        done.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4">
                                    <div className="grid gap-3">
                                        <Label htmlFor="name-sub" className='text-text-l'>Name</Label>
                                        <Input id="name-sub" onChange={handleChangeCategory} name="name" className='text-lightground selection:bg-blue-500' value={form.name} />
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="description-sub" className='text-text-l'>Description</Label>
                                        <Input id="description-sub" onChange={handleChangeCategory} className='text-lightground selection:bg-blue-500' name="description" value={form.description} />
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            id="active-mode"
                                            checked={form.isActive}
                                            onCheckedChange={(v) => setForm(s => ({ ...s, isActive: v }))}
                                            className="data-[state=checked]:bg-invincible-yellow data-[state=unchecked]:bg-zinc-300
             [&>span]:bg-white data-[state=checked]:[&>span]:bg-bg-btn-dynamic"
                                        />
                                        <Label htmlFor="active-mode" className='text-text-l'>Active</Label>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button className='bg-foreground text-gray-700' variant="outline">Cancel</Button>
                                    </DialogClose>
                                    <Button onClick={(e) => handleSaveCategory(mainCategory.category[0]._id)} type="button" className='bg-bg-btn-dynamic text-gray-50 hover:bg-btn-hv-bg hover:text-gray-50 cursor-pointer'>Save changes</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
                <div className='flex gap-5 absolute bottom-0 right-10'>
                    {/* search */}
                    <BinhSearch onSearch={setSearch} data={filtered} q={undefined} />
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
                                    <SelectLabel>Active</SelectLabel>
                                    <SelectItem value='all' className='text-black'>
                                        <Badge variant={'destructive'} className='bg-lightground'>All</Badge>
                                    </SelectItem>
                                    <SelectItem value="Active">
                                        <Badge
                                            variant="secondary"
                                            className="bg-blue-500 text-white dark:bg-blue-600 cursor-pointer"
                                        >
                                            <BadgeCheckIcon className='text-white' />
                                            Active
                                        </Badge>
                                    </SelectItem>
                                    <SelectItem value="Unactive">
                                        <Badge
                                            variant="secondary"
                                            className="bg-red-500 text-white dark:bg-red-600 cursor-pointer"
                                        >
                                            <BadgeXIcon className='text-white cursor-pointer' />
                                            Unactive
                                        </Badge>
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>


                    <Button className='bg-bg-btn-dynamic hover:bg-btn-hv-bg hover:text-foreground cursor-pointer' size={'lg'}><Plus />Add subcategories</Button>
                </div>

            </div>



            {/* dialog cho cac sub */}
            <Dialog open={dialog} onOpenChange={setDialog}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className='text-bg-btn-dynamic'>Edit Category</DialogTitle>
                        <DialogDescription>
                            Make changes to your category here. Click save when you&apos;re
                            done.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                        <div className="grid gap-3">
                            <Label htmlFor="name-sub" className='text-text-l'>Name</Label>

                            <Input id="name-sub" onChange={(e) => {
                                setCurrentDialog((prev: any) => ({
                                    ...prev, name: e.target.value
                                }))
                            }} className='text-lightground selection:bg-blue-500' value={currentDialog.name} />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="description-sub" className='text-text-l'>Description</Label>
                            <Input id="description-sub" onChange={(e) => {
                                setCurrentDialog((prev: any) => ({
                                    ...prev, description: e.target.value
                                }))
                            }} className='text-lightground selection:bg-blue-500' value={currentDialog.description} />
                        </div>
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="active-mode2"
                                checked={form.isActive}
                                onCheckedChange={(v) => setCurrentDialog(s => ({ ...s, isActive: v }))}
                                className="data-[state=checked]:bg-invincible-yellow data-[state=unchecked]:bg-zinc-300
             [&>span]:bg-white data-[state=checked]:[&>span]:bg-bg-btn-dynamic"
                            />
                            <Label htmlFor="active-mode2" className='text-text-l'>Active</Label>
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button className='bg-foreground text-gray-700' variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button onClick={(e) => handleSaveSubCategory(currentDialog._id)} type="button" className='bg-bg-btn-dynamic text-gray-50 hover:bg-btn-hv-bg hover:text-gray-50 cursor-pointer'>Save changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {loadingSubs ? (
                <p>Loading subcategories...</p>
            ) : errorSub ? (
                <p className="text-red-600">Error: {errorSub}</p>
            ) : filtered?.length > 0 ? (
                <AdminDataTable onEvent={handleSetting} data={filtered} header={[{ atri: "Name", w: "400px" },
                { atri: "Description", w: "300px" },
                { atri: "Active", w: "200px" },
                { atri: "Created At", w: "300px" },
                ]} cell={[{ atri: "name" }, { atri: "description" }, { atri: "isActive" }, { atri: "createdAt" }]} />
            ) : (
                <p>No subcategories found.</p>
            )}
        </div>
    )
}

export default SubCateByParentData
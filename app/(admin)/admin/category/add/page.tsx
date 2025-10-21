"use client"
import useFetch from '@/app/hooks/useFetchData'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus } from 'lucide-react'
import React, { useState } from 'react'
import { preconnect } from 'react-dom'

const AddCategory = () => {


    const [subCategories, setSubCategories] = useState<any>([])
    const [formCategory, setFormCategory] = useState({
        name: "",
        slug: "",
        description: "",
    })

    const createSlug = (name: string): string => {
        return name
            .toLowerCase()                          // chuyển về chữ thường
            .normalize("NFD")                       // tách dấu tiếng Việt
            .replace(/[\u0300-\u036f]/g, "")        // xóa dấu
            .replace(/[^a-z0-9\s-]/g, "")           // xóa ký tự đặc biệt
            .trim()                                 // xóa khoảng trắng đầu/cuối
            .replace(/\s+/g, "-");                  // thay khoảng trắng bằng dấu gạch ngang
    };

    const addSubCategories = () => {
        setSubCategories((prev: any) => ([
            ...prev, {
                name: "",
                slug: "",
                description: "",
                parent: "",
                isActive: ""
            }
        ]))
    }
    const updateSub = (e: any, index: number, atri: string) => {
        const { value } = e.target;

        setSubCategories((prev: any[]) =>
            prev.map((sub, i) =>
                i === index ? { ...sub, [atri]: value } : sub
            )
        );
    };


    const updateForm = (e: any) => {
        setFormCategory((prev: any) => ({
            ...prev, [e.target.name]: e.target.value
        }
        ))
    }

    const CallAddApi = async (fom: any) => {
        try {
            const res = await fetch("/api/add/category", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(fom),
            });

            const data = await res.json();
            if (res.ok) {
                console.log("Category created:", data.category);
                return data
            } else {
                console.error(" Error:", data.message);
            }
        } catch (error) {
            console.error("Request failed:", error);
        }
    }
    const handleSubmit = async () => {
        try {
            // Tạo category cha
            const result = await CallAddApi(formCategory);
            if (!result?.category?._id) throw new Error("Không tạo được category cha");
            const parentId = result.category._id;

            //  Tạo subcategories
            const subPromises = subCategories.map((sub: any) => {
                const subData = {
                    ...sub,
                    slug: createSlug(sub.name),
                    parent: parentId,
                    isActive: true,
                };
                return CallAddApi(subData);
            });

            //  tất cả tạo xong
            const results = await Promise.all(subPromises);

            // 4️Kiểm tra thành công/thất bại
            const failed = results.filter(r => !r?.category);
            if (failed.length > 0)
                alert(`${failed.length} subcategories tạo thất bại.`);
            else
                alert(" Tạo category và subcategories thành công!");

            //  Reset form
            setFormCategory({ name: "", slug: "", description: "" });
            setSubCategories([]);
        } catch (error) {
            console.error("Lỗi:", error);
        }
    }

    return (
        <div className='pb-20' id='addpro'>
            <h1 className='text-text-tilte font-semibold text-3xl mb-4'>Add New Product</h1>

            <div>
                <h2 className="text-lg font-semibold text-gray-700 mb-4">
                    Category <span className="text-red-500">*</span>
                </h2>
                <div className='flex gap-3'>
                    <div className='flex flex-col gap-2'>
                        <Label htmlFor="name" className="text-text-l">Name</Label>
                        <Input className='text-text-tilte'
                            onChange={(e: any) => {
                                setFormCategory((prev: any) => ({
                                    ...prev, name: e.target.value, slug: createSlug(e.target.value)
                                }
                                ))
                            }}
                            name='name' type='text' id='name' />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <Label htmlFor="description" className="text-text-l">Description</Label>
                        <Input className='text-text-tilte'
                            onChange={updateForm}
                            type='text' name='description' id='description' />
                    </div>
                </div>
            </div>
            <div>
                <div className='flex w-full justify-between items-center'>
                    <h2 className="text-lg font-semibold text-gray-700 mb-4 ">
                        Sub Categories <span className="text-red-500">*</span>
                    </h2>
                    <Button
                        name='variants'
                        size={'lg'}
                        type="button"
                        onClick={addSubCategories}

                        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                    >
                        <Plus size={16} /> Add sub-categories
                    </Button>
                </div>

                {subCategories && subCategories.map((sub: any, idx: number) => (
                    <div className='flex gap-3' key={idx}>
                        <div className='flex flex-col gap-2'>
                            <Label htmlFor="subname" className="text-text-l">Name</Label>
                            <Input className='text-text-tilte'
                                onChange={(e) => updateSub(e, idx, "name")}
                                type='text' name='subname' id='subname' />
                        </div>
                        <div className='flex flex-col gap-2'>
                            <Label htmlFor="subdescription" className="text-text-l">Description</Label>
                            <Input className='text-text-tilte'
                                onChange={(e) => updateSub(e, idx, "description")}
                                type='text' name='subdescription' id='subdescription' />
                        </div>
                    </div>
                ))}


            </div>
            <div className='flex gap-3 justify-end mt-15'>
                <Button size={'lg'} onClick={() => console.log(subCategories)} className='bg-background border-2 border-gray-200 hover:bg-foreground text-text-tilte cursor-pointer font-normal'> Cancel</Button>

                <Button onClick={handleSubmit} size={'lg'} className='bg-bg-btn-dynamic hover:bg-btn-hv-bg cursor-pointer'> <Plus size={16} />Save changes</Button>
            </div>
        </div>
    )
}

export default AddCategory
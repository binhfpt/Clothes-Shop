"use client"
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useState } from 'react'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Plus, Trash2, Upload, X } from 'lucide-react'
import brand from '@/app/models/brand'
const AddProduct = () => {
    const [formData, setFormData] = useState<any>({
        title: '',
        slug: '',
        description: '',
        brand: '',
        category: '',
        categories: [],
        images: [],
        variants: [],
        price: '',
        discountPrice: '',
        stock: '',
        isActive: true,
        isNew: false,
        seoTitle: '',
        seoDescription: ''
    });

    //handle input
    const updateVariant = (index: any, field: any, value: any) => {
        setFormData((prev: any) => ({
            ...prev,
            variants: prev.variants.map((v: any, i: number) =>
                i === index ? { ...v, [field]: value } : v
            )
        }));
    };

    const categories = ([
        { _id: '1', name: 'Giày thể thao' },
        { _id: '2', name: 'Áo thun' },
        { _id: '3', name: 'Quần jean' },
        { _id: '4', name: 'Phụ kiện' }
    ])
    const updateForm = (e: any) => {
        setFormData((prev: any) => ({
            ...formData,
            [e.target.name]: e.target.value
        }))
    }


    // Handle variants
    const addVariant = () => {
        setFormData((prev: any) => ({
            ...prev,
            variants: [
                ...prev.variants,
                {
                    sku: '',
                    color: '',
                    size: '',
                    stock: '',
                    price: '',
                    discountPrice: ''
                }
            ]
        }));
    };

    const removeVariant = (index: any) => {
        setFormData((prev: any) => ({
            ...prev,
            variants: prev.variants.filter((temp: any, i: any) => i !== index)
        }));
    };

    function removeImage(idx: any): void {
        setFormData((prev: any) => ({
            ...prev,
            images: prev.images.filter((temp: any, i: any) => i !== idx)
        }));
    }

    function handleImageUpload(e: any) {
        const files = e.target.files;
        if (!files) return;

        Array.from(files).forEach((file: any) => {
            if (!file.type.startsWith("image/")) return;
            if (file.size > 5 * 1024 * 1024) return; // 5MB

            const url = URL.createObjectURL(file);

            setFormData((prev: any) => ({
                ...prev,
                images: [
                    ...prev.images,
                    { file, preview: url }
                ],
            }));
        });
    }



    return (
        <div className='pb-20' id='addpro'>
            {/* Title */}
            <h1 className='text-text-tilte font-semibold text-3xl mb-4'>Add New Product</h1>
            {/* Thong tin co ban */}
            <div className='flex flex-col gap-5'>
                <h2 className="text-lg font-semibold text-gray-700">
                    Common information<span className="text-red-500">*</span>
                </h2>                <div className="flex flex-col gap-5">
                    <div className='flex flex-col gap-2'>
                        <Label htmlFor="name" className="text-text-l">Name</Label>
                        <Input id="name" onChange={updateForm} name="title" className="text-text-l" placeholder="Enter product name" />
                    </div>
                    <div className='flex flex-col gap-2'    >
                        <Label htmlFor="description" className="text-text-l">Description</Label>
                        <Textarea id="description" onChange={updateForm} name="description" className="text-text-l" placeholder="Enter product description" />
                    </div>
                </div>
                {/* thuong hieu */}
                <div className='flex gap-3'>
                    <div className='flex flex-col gap-2'>
                        <Label htmlFor="brand" className="text-text-l">Brands</Label>
                        <Select
                            name="brand"
                            onValueChange={(value) =>
                                setFormData((prev: any) => ({
                                    ...prev,
                                    brand: value
                                }))
                            }
                        >
                            <SelectTrigger className="w-[180px] text-bg-btn-dynamic">
                                <SelectValue className='text-text-tilte' placeholder="Select a fruit" />
                            </SelectTrigger>
                            <SelectContent className='text-text-tilte' >
                                <SelectGroup className='text-text-tilte' >
                                    <SelectLabel>Fruits</SelectLabel>
                                    <SelectItem className='text-text-tilte' value="apple">Apple</SelectItem>
                                    <SelectItem className='text-text-tilte' value="banana">Banana</SelectItem>
                                    <SelectItem className='text-text-tilte' value="blueberry">Blueberry</SelectItem>
                                    <SelectItem className='text-text-tilte' value="grapes">Grapes</SelectItem>
                                    <SelectItem className='text-text-tilte' value="pineapple">Pineapple</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <Label htmlFor="category" className="text-text-l">Main Categories</Label>
                        <Select name='category' onValueChange={(value) => setFormData((prev: any) => ({ ...prev, category: value }))} >
                            <SelectTrigger className="w-[180px] text-bg-btn-dynamic">
                                <SelectValue placeholder="Select a fruit" />
                            </SelectTrigger>
                            <SelectContent >
                                <SelectGroup>
                                    <SelectLabel>Fruits</SelectLabel>
                                    <SelectItem value="apple">Apple</SelectItem>
                                    <SelectItem value="banana">Banana</SelectItem>
                                    <SelectItem value="blueberry">Blueberry</SelectItem>
                                    <SelectItem value="grapes">Grapes</SelectItem>
                                    <SelectItem value="pineapple">Pineapple</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                {/* sub categories */}
                <div className='flex flex-col gap-3'>
                    <Label className='text-text-tilte'>Sub Categories</Label>
                    <div className='flex gap-3'>
                        {categories.map((ca: any) => (
                            <Button key={ca._id} type='button' onClick={(e) => setFormData(
                                (prev: any) => ({
                                    ...prev, categories: [...prev.categories, ca._id]
                                })
                            )
                            } className='bg-gray-200 text-gray-600 rounded-full font-normal h-7'>{ca.name}</Button>

                        ))}

                    </div>
                </div>
            </div>
            <Separator className=" bg-gray-200 my-10" />

            {/* hinh anh */}
            <div className="border-b pb-6">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">
                    Pictures <span className="text-red-500">*</span>
                </h2>

                <div className="grid grid-cols-4 gap-4 mb-4">
                    {formData.images && formData.images.map((img: any, idx: number) => (
                        <div className="relative group" key={img}>
                            <img src={`${img.preview}`} className="w-full h-32 object-contain rounded-md" />
                            <button
                                type="button"
                                onClick={() => removeImage(idx)}
                                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    ))}


                    <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-blue-500 transition">
                        <Upload className="text-gray-400 mb-2" size={24} />
                        <span className="text-sm text-gray-500">Upload pictures</span>
                        <input name='images' type="file" multiple accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden" />
                    </label>
                </div>
                {/* {errors.images && <p className="text-red-500 text-sm">{errors.images}</p>} */}
            </div>
            <Separator className=" bg-gray-200 my-10" />

            {/* Giá và tồn kho mặc định */}
            <div className='flex gap-3 flex-col'>
                <h2 className="text-lg font-semibold text-gray-700 mb-4">
                    price and stock <span className="text-red-500">*</span>
                </h2>
                <div className='flex gap-3'>
                    <div className='flex flex-col gap-2'>
                        <Label htmlFor="price" className="text-text-l">Price</Label>
                        <Input className='text-text-tilte' onChange={updateForm} name='price' type='number' id='price' />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <Label htmlFor="stock" className="text-text-l">Stock</Label>
                        <Input className='text-text-tilte' onChange={updateForm} type='number' name='stock' id='stock' />

                    </div>
                </div>
            </div>
            <Separator className=" bg-gray-200 my-10" />

            {/* Biến thể */}
            <div className='flex flex-col gap-3'>
                <div className='flex w-full justify-between items-center'>
                    <h2 className="text-lg font-semibold text-gray-700 mb-4 ">
                        Variants <span className="text-red-500">*</span>
                    </h2>
                    <Button
                        name='variants'
                        size={'lg'}
                        type="button"
                        onClick={addVariant}

                        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                    >
                        <Plus size={16} /> Add variants
                    </Button>
                </div>
                <div className="flex gap-3 flex-col">
                    {formData.variants.map((variant: any, idx: any) => (
                        <div key={idx} className='flex gap-3'>
                            <div className='flex gap-3'>
                                <div className='flex flex-col gap-2'>
                                    <Label htmlFor="color" className="text-text-l">Color</Label>
                                    <Input className='text-text-tilte' type='text' name="color" onChange={(e) => updateVariant(idx, 'color', e.target.value)} id='color' />
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <Label htmlFor="size" className="text-text-l">Size</Label>
                                    <Input className='text-text-tilte' type='text' name="size" onChange={(e) => updateVariant(idx, 'size', e.target.value)} id='size' />

                                </div>
                                <div className='flex flex-col gap-2'>
                                    <Label htmlFor="variant-price" className="text-text-l">Price</Label>
                                    <Input className='text-text-tilte' type='number' name="price" onChange={(e) => updateVariant(idx, 'price', e.target.value)} id='variant-price' />

                                </div>
                                <div className='flex flex-col gap-2'>
                                    <Label htmlFor="stock" className="text-text-l">Stock</Label>
                                    <Input className='text-text-tilte' type='number' name="stock" onChange={(e) => updateVariant(idx, 'stock', e.target.value)} id='stock' />
                                </div>
                                <div className='flex flex-col gap-2 items-center'>
                                    <Label htmlFor="stock" className="text-red-600 text-center">*</Label>
                                    <Button
                                        type="button"
                                        onClick={() => removeVariant(idx)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <Trash2 />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* SEO
            <Separator className="my-4 bg-gray-200" /> */}

            {/* Trạng thái */}
            <Separator className=" bg-gray-200 my-10" />
            <div className='flex flex-col gap-1'>
                <h2 className="text-lg font-semibold text-gray-700 mb-4">
                    Tag <span className="text-red-500">*</span>
                </h2>
                <div className='flex gap-1'>
                    <div className='flex gap-1'>
                        <Input
                            onChange={(e) => setFormData((prev: any) => ({ ...prev, isNew: e.target.checked }))}

                            name='isActive' type='checkbox' id='isNew' />
                    </div>
                    <Label htmlFor="isNew" className="text-text-l">New product</Label>
                </div>

            </div>
            {/* Submit buttons */}
            <div className='flex gap-3 justify-end mt-15'>
                <Button size={'lg'} className='bg-background border-2 border-gray-200 hover:bg-foreground text-text-tilte cursor-pointer font-normal'> Cancel</Button>

                <Button onClick={() => console.log(formData)} size={'lg'} className='bg-bg-btn-dynamic hover:bg-btn-hv-bg cursor-pointer'> <Plus size={16} />Create Product</Button>
            </div>
        </div >
    )
}

export default AddProduct
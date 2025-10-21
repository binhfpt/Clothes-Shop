"use client"
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useEffect, useMemo, useState } from 'react'
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
import useFetch from '@/app/hooks/useFetchData'
import toast from 'react-hot-toast'
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




    const updateForm = (e: any) => {
        setFormData((prev: any) => ({
            ...prev,
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
                    {
                        file,        // Lưu File object để upload
                        preview: url // Blob URL để hiển thị preview
                    },
                ],
            }));
        });
    }

    const handleUploadImages = async () => {
        if (!formData?.images || formData.images.length === 0) {
            throw new Error("Chưa chọn ảnh")
        }

        const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
        const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

        if (!CLOUD_NAME || !UPLOAD_PRESET) {
            throw new Error("Missing Cloudinary configuration")
        }

        try {
            const uploadPromises = formData.images.map(async (image: any) => {
                // Skip if already uploaded (preview là Cloudinary URL)
                if (image.preview && image.preview.startsWith("https://res.cloudinary.com")) {
                    return image.preview  //  Return URL string
                }

                // Upload new image
                const formDataForCloud = new FormData()
                formDataForCloud.append("file", image.file)
                formDataForCloud.append("upload_preset", UPLOAD_PRESET)

                const res = await fetch(
                    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
                    { method: "POST", body: formDataForCloud }
                )

                if (!res.ok) {
                    const errorText = await res.text().catch(() => "Unknown error")
                    throw new Error(`Upload failed: ${res.status} - ${errorText}`)
                }

                const data = await res.json()
                return data.secure_url  //  Return URL string
            })

            const uploadedImageUrls = await Promise.all(uploadPromises)  //  Array of strings

            // Update formData
            setFormData((prev: any) => ({
                ...prev,
                images: uploadedImageUrls.map((url) => url)
            }))

            return uploadedImageUrls  // Return [URL1, URL2, ...]
        } catch (error) {
            console.error("Upload error:", error)
            throw error
        }
    }

    const handleCreateProduct = async () => {
        try {
            // Upload ảnh và nhận array URLs
            const imageUrls = await handleUploadImages()

            //  Gửi images là array strings, KHÔNG phải objects
            const productData = {
                title: formData.title,
                slug: formData.slug,
                description: formData.description,
                brand: formData.brand,
                category: formData.category,
                categories: formData.categories,
                images: imageUrls,  //  Array of strings: ["url1", "url2", ...]
                variants: formData.variants,
                price: formData.price,
                discountPrice: formData.discountPrice,
                stock: formData.stock,
                isActive: formData.isActive,
                isNew: formData.isNew,
                seoTitle: formData.seoTitle,
                seoDescription: formData.seoDescription,
            };

            console.log("Sending:", productData)
            console.log("Images:", imageUrls)

            const res = await fetch('/api/product/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            })

            if (res.ok) {
                toast.success('Save successfully!', {
                    duration: 2000,
                    style: {
                        boxShadow: 'none',
                        background: '#a3ffbc',
                    },
                })
            } else {
                const error = await res.json()
                toast.error(error.error || 'Failed to save product', {
                    duration: 2000,
                    style: { boxShadow: 'none', background: '#ff6b6b' }
                })
            }
        } catch (error: any) {
            toast.error(`Error: ${error.message}`, {
                duration: 2000,
                style: { boxShadow: 'none', background: '#ff6b6b' }
            })
        }
    }

    /// Brand
    const { data: brands, loading: loadingBrands, error: errorBrands } = useFetch("/api/brand", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    })

    /// Categori
    const { data: category, loading: loadingCategory, error: errorCategory } = useFetch("/api/get/categories", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    })


    /// subcategoru
    const { data: subcategory, loading: loadingSubcategory, error: errorSubcategory } = useFetch("/api/get/subcategories", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    })


    const categories = useMemo(() => {
        if (!subcategory || !subcategory.categories) return []

        return subcategory.categories.filter(
            (i: any) => i.parent === formData.category
        )
    }, [subcategory, formData.category])


    return (
        <div className='pb-20' id='addpro'>
            {/* Title */}
            <h1 className='text-text-tilte font-semibold text-3xl mb-4'>Add New Product</h1>
            {/* Thong tin co ban */}
            <div className='flex flex-col gap-5'>
                <h2 className="text-lg font-semibold text-gray-700">
                    Common information<span className="text-red-500">*</span>
                </h2>
                <div className="flex flex-col gap-5">
                    <div className='flex flex-col gap-2'>
                        <Label htmlFor="title" className="text-text-l">Title</Label>
                        <Input id="title" onChange={updateForm} name="title" className="text-text-l" placeholder="Enter product name" />
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
                                    <SelectLabel>Brands</SelectLabel>
                                    {!loadingBrands && brands.brands.length > 0 && brands.brands.map((brand: any) => (
                                        <SelectItem key={brand._id} className='text-text-tilte' value={brand._id}>{brand.name}</SelectItem>
                                    ))}

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
                                    <SelectLabel>Main Categories</SelectLabel>
                                    {!loadingCategory && category.categories.length > 0 && category.categories.map((cate: any) => (
                                        <SelectItem key={cate._id} value={cate._id}>{cate.name}</SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                {/* sub categories */}
                <div className='flex flex-col gap-3'>
                    <Label className='text-text-tilte'>Sub Categories</Label>
                    <div className='flex gap-3'>
                        {categories.length > 0 ? (
                            categories.map((ca: any) => (
                                <Button
                                    key={ca._id}
                                    className={`${formData.categories.includes(ca._id)
                                        ? "bg-bg-btn-dynamic text-gray-50"
                                        : "bg-gray-100 text-gray-500"
                                        } hover:bg-btn-hv-bg hover:text-gray-50`}
                                    type="button"
                                    onClick={() =>
                                        setFormData((prev: any) => {
                                            const alreadySelected = prev.categories.includes(ca._id);
                                            return {
                                                ...prev,
                                                categories: alreadySelected
                                                    ? prev.categories.filter((id: any) => id !== ca._id)
                                                    : [...prev.categories, ca._id],
                                            };
                                        })
                                    }
                                >
                                    {ca.name}
                                </Button>

                            ))
                        ) : (
                            <p className='text-sm text-gray-700'>Không có sub category nào</p>
                        )}
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
                        <div className="relative group" key={idx}>
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

                <Button onClick={handleCreateProduct} size={'lg'} className='bg-bg-btn-dynamic hover:bg-btn-hv-bg cursor-pointer'> <Plus size={16} />Create Product</Button>

            </div>
        </div >
    )
}

export default AddProduct
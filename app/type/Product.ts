export type Variant = {
    sku: string
    color?: string
    size?: string
    stock: number
    price: number
    discountPrice?: number
}

export type Product = {
    _id: string
    title: string
    slug: string
    description: string

    brand?: string
    category: string
    categories?: string[]

    images: string[]

    variants: Variant[]

    price: number
    discountPrice?: number

    stock: number

    isActive: boolean
    isNew: boolean

    seoTitle?: string
    seoDescription?: string

    sold?: number
    ratingAvg: number
    ratingCount: number

    createdAt: string
    updatedAt: string
}

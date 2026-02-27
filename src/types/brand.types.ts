export interface BrandProductsResponse {
    success: boolean
    message: string
    data: BrandProductsData
    meta: BrandMeta
}

export interface BrandProductsData {
    products: BrandProduct[]
    brand: BrandInfo
}

export interface BrandProduct {
    id: number
    product_name: string
    product_slug: string
    product_thambnail: string
    selling_price: string
    discount_price: any
    brand_id: number
    category_id: number
    product_qty: string
    product_size: string
    product_color: string
    brand: {
        id: number
        brand_name: string
        brand_slug: string
    }
    category: {
        id: number
        category_name: string
        category_slug: string
    }
}

export interface BrandInfo {
    id: number
    brand_name: string
    brand_slug: string
    brand_image: string
    created_at: string
    updated_at: string
    meta_title: string
    meta_description: string
    meta_keywords: string
}

export interface BrandMeta {
    total: number
    current_loaded: number
    loaded: number
    prev_page: any
    next_page: number
    current_page: number
    last_page: number
    title: string
    description: string
    keywords: string
}

export interface BrandCategoriesResponse {
    success: boolean
    message: string
    data: {
        brand: BrandInfo;
        categories: BrandCategory[];
    }
}

export interface BrandCategory {
    id: number
    category_name: string
    category_slug: string
    category_image?: string
}

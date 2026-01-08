import { ProductData } from "./product.types"

export interface SliderResponse {
  success: boolean
  message: string
  data: SliderData[]
  meta: any[]
}

export interface SliderData {
  id: number
  slider_title: string
  short_title: string
  slider_image: string
  created_at: string
  updated_at?: string
}


export interface BrandGetResponse {
  success: boolean
  message: string
  data: BrandData
  meta: any[]
}

export interface BrandData {
  brands: Brand[]
  letters: string[]
}

export interface Brand {
  id: number
  brand_name: string
  brand_slug: string
  brand_image?: string
  created_at: string
  updated_at?: string
  meta_title: string
  meta_description: string
  meta_keywords: string
}

export interface VendorGetResponse {
  success: boolean
  message: string
  data: VendorGetData[]
  meta: Meta
}

export interface VendorGetData {
  id: number
  name: string
  username: string
  email: string
  email_verified_at: any
  photo: any
  phone: string
  address?: string
  vendor_join: string
  vendor_short_info: any
  role: string
  status: string
  last_seen: string
  google_id: any
  facebook_id: any
  created_at: any
  updated_at: string
}

export interface Meta {
  total: number
  current_loaded: number
  loaded: number
  prev_page: any
  next_page: any
  current_page: number
  last_page: number
}


export interface VendorDetailedResponse {
  success: boolean
  message: string
  data: VendorDetailData
  meta: Meta
}

export interface VendorDetailData {
  products: ProductData[]
  vendor: Vendor
  category_data: CategoryDaum[]
}

export interface Vendor {
  id: number
  name: string
  username: string
  email: string
  email_verified_at: string
  photo: string
  phone: string
  address: string
  vendor_join: string
  vendor_short_info: string
  role: string
  status: string
  last_seen: string
  google_id: any
  facebook_id: any
  created_at: string
  updated_at: string
}

export interface CategoryDaum {
  id: number
  main_category_id: number
  category_name: string
  category_slug: string
  category_image?: string
  created_at: string
  updated_at: string
  meta_title: string
  meta_description: string
  meta_keywords: string
}

export interface Meta {
  total: number
  current_loaded: number
  loaded: number
  prev_page: any
  next_page: any
  current_page: number
  last_page: number
}

export interface SearchProductResponse {
  success: boolean
  message: string
  data: SearchProductData[]
  meta: Meta
}

export interface SearchProductData {
  id: number
  brand_id: number
  brand_name: any
  main_category_id: any
  main_category_name: any
  category_id: number
  category_name: any
  subcategory_id?: number
  subcategory_name: any
  product_name: string
  product_slug: string
  product_code: string
  product_qty: string
  product_tags: string
  product_size: string
  product_color: string
  packing: any
  height: any
  width: any
  length: any
  weight: any
  origin: any
  alt: any
  selling_price: string
  contract_price: any
  discount_price: string
  specification: any
  short_description: string
  long_description: string
  product_thambnail: string
  vendor_id: number
  hot_deals: number
  featured: number
  special_offer?: number
  special_deals?: number
  new_product: any
  category_skip_0: any
  category_skip_4: any
  category_skip_7: any
  meta_title: any
  meta_keyword: any
  meta_description: any
  wholesale: any
  status: number
  created_at: string
  updated_at?: string
}

export interface Meta {
  total: number
  current_loaded: number
  loaded: number
  prev_page: any
  next_page: any
  current_page: number
  last_page: number
}

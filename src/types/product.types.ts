export interface ProductResponse {
  success: boolean
  message: string
  data: ProductData[]
  meta: Meta
}

export interface ProductData {
  id: number
  brand_id: number
  brand_name: any
  main_category_id: number
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
  packing?: string
  height: any
  width: any
  length: any
  weight?: string
  origin?: string
  alt: string
  selling_price: string
  contract_price: any
  discount_price: any
  specification?: string
  short_description: string
  long_description: string
  product_thambnail: string
  vendor_id: any
  hot_deals: any
  featured: any
  special_offer: any
  special_deals: any
  new_product: number
  category_skip_0: any
  category_skip_4: any
  category_skip_7: any
  meta_title?: string
  meta_keyword: string
  meta_description: any
  wholesale: number
  status: number
  created_at: string
  updated_at?: string
  brand: Brand
  category: Category
}

export interface Brand {
  id: number
  brand_name: string
  brand_slug: string
  brand_image: string
  created_at: string
  updated_at?: string
  meta_title: string
  meta_description: string
  meta_keywords: string
}

export interface Category {
  id: number
  main_category_id: number
  category_name: string
  category_slug: string
  category_image?: string;
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
  next_page: number
  current_page: number
  last_page: number
}

export interface RelatedProduct {
  id: number;
  brand_id: number;
  brand_name?: string;
  main_category_id: number;
  main_category_name: string | null;
  category_id: number;
  category_name?: string;
  subcategory_id: number;
  subcategory_name?: string;
  product_name: string;
  product_slug: string;
  product_code: string;
  product_qty: string;
  product_tags?: string;
  product_size?: string;
  product_color?: string;
  packing: string;
  height?: string;
  width?: string;
  length?: string;
  weight?: string;
  origin: string;
  alt: string;
  selling_price: string;
  contract_price: string | null;
  discount_price: string | null;
  specification: string;
  short_description?: string;
  long_description: string;
  product_thambnail: string;
  vendor_id: number | null;
  hot_deals: number | null;
  featured: number | null;
  special_offer?: number;
  special_deals: number | null;
  new_product?: number;
  category_skip_0: number | null;
  category_skip_4: number | null;
  category_skip_7: number | null;
  meta_title?: string;
  meta_keyword: string;
  meta_description?: string;
  wholesale: number;
  status: number;
  created_at: string;
  updated_at: string;
  brand: Brand;
}
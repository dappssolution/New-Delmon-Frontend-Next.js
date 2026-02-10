import { CountryData, EmirateData } from "./checkout.types"
import { Category, ProductData } from "./product.types"

export interface VendorDetailedResponse {
  success: boolean
  message: string
  data: VendorData
  meta: Meta
}

export interface VendorData {
  products: ProductData[]
  vendor: Vendor
  category_data: Category[]
}

export interface Vendor {
  id: number
  name: string
  username: string
  email: string
  email_verified_at: any
  photo: any
  phone: string
  address: string
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


export interface GetCategoryResponse {
  success: boolean
  message: string
  data: CategoryData[]
  meta: CategoryMeta
}

export interface CategoryData {
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

export interface CategoryMeta {
  total: number
  current_loaded: number
  loaded: number
  prev_page: any
  next_page: number
  current_page: number
  last_page: number
}


export interface AllProductGetResponse {
  success: boolean
  message: string
  data: AllProductData[]
  meta?: Meta
}

export interface AllProductData {
  id: number
  brand_id: number
  brand_name: any
  main_category_id: any
  main_category_name: any
  category_id: number
  category_name: any
  subcategory_id: any
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
  discount_price?: string
  specification: any
  short_description: string
  long_description: string
  product_thambnail: string
  vendor_id: number
  hot_deals?: number
  featured: any
  special_offer: any
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


export interface AddProductResponse {
  status: boolean
  message: string
  error?: string
  data: AddProductData
}

export interface AddProductData {
  product_name: string
  product_tags: string
  product_size: string
  product_color: string
  short_description: string
  long_description: string
  selling_price: string
  discount_price: string
  product_code: string
  product_qty: string
  brand_id: string
  category_id: string
  subcategory_id: string
  hot_deals: string
  featured: string
  special_offer: string
  special_deals: string
  vendor_id: number
  product_slug: string
  status: number
  created_at: string
  product_thambnail: string
  updated_at: string
  id: number
}


export interface UpdateProductResponse {
  status: boolean
  message: string
  data: UpdateProductData
}

export interface UpdateProductData {
  id: number
  brand_id: string
  brand_name: any
  main_category_id: any
  main_category_name: any
  category_id: string
  category_name: any
  subcategory_id: string
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
  hot_deals: string
  featured: string
  special_offer: string
  special_deals: string
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
  updated_at: string
}



export interface OrdersGetResponse {
  success: boolean
  message: string
  data: GetOrdersData[]
}

export interface GetOrdersData {
  id: number
  user_id: number
  country_id: number
  emirate_id: number
  name: string
  email: string
  phone: string
  address: AddressDetail | string
  post_code: string
  notes: any
  payment_type: string
  payment_method: string
  transaction_id: any
  currency: string
  amount: number
  tax: number
  shipping: number
  coupon_amount: number
  order_number: any
  invoice_no: string
  order_date: string
  order_month: string
  order_year: string
  confirmed_date: any
  processing_date: any
  picked_date: any
  shipped_date: any
  delivered_date: any
  cancel_date: any
  return_date: any
  return_reason: any
  order_return: string
  status: string
  created_at: string
  updated_at: any
  user: User
}

export interface OrderDetailResponse {
  success: boolean
  message: string
  data: OrderDetailData
}

export interface OrderDetailData {
  order: OrderDetail
  items: Item[]
}

export interface OrderDetail {
  id: number
  user_id: number
  country_id: number
  emirate_id: number
  name: string
  email: string
  phone: string
  address: AddressDetail | string
  post_code: string
  notes: any
  payment_type: string
  payment_method: string
  transaction_id: any
  currency: string
  amount: number
  tax: number
  shipping: number
  coupon_amount: number
  order_number: any
  invoice_no: string
  order_date: string
  order_month: string
  order_year: string
  confirmed_date: any
  processing_date: any
  picked_date: any
  shipped_date: any
  delivered_date: any
  cancel_date: any
  return_date: any
  return_reason: any
  order_return: string
  status: string
  created_at: string
  updated_at: any
  country: CountryData
  emirate: EmirateData
  user: User
}



export interface AddressDetail {
  id: number
  user_id: number
  country_id: number
  emirate_id: number
  first_name: string
  last_name: string | null
  email: string
  phone: string
  address_type: string
  building_details: string
  city: string
  address: string
  post_code: string | null
  longitude: string | null
  latitude: string | null
  created_at: string
  updated_at: string
  country_name?: string
  emirate_name?: string
  country?: {
    id: number
    name: string
    created_at: string
    updated_at: string | null
  }
  emirate?: {
    id: number
    country_id: number
    name: string
    created_at: string
    updated_at: string | null
  }
}

export interface User {
  id: number
  name: string
  username: any
  email: string
  email_verified_at: any
  photo: any
  phone: string
  address: any
  vendor_join: any
  vendor_short_info: any
  role: string
  status: string
  last_seen: string
  google_id: any
  facebook_id: any
  created_at: string
  updated_at: string
}

export interface Item {
  id: number
  order_id: number
  product_id: number
  vendor_id: string
  color: string
  size: string
  qty: string
  price: number
  subtotal: number
  created_at: string
  updated_at: any
  product: Product
}

export interface Product {
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
  discount_price?: string
  specification: any
  short_description: string
  long_description: string
  product_thambnail: string
  vendor_id: number
  hot_deals?: number
  featured?: number
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


export interface UpdateOrderStatusResponse {
  status: boolean
  message: string
  data: UpdateOrderStatusData
}

export interface UpdateOrderStatusData {
  id: number
  user_id: number
  country_id: number
  emirate_id: number
  name: string
  email: string
  phone: string
  address: string
  post_code: string
  notes: any
  payment_type: string
  payment_method: string
  transaction_id: any
  currency: string
  amount: number
  tax: number
  shipping: number
  coupon_amount: number
  order_number: any
  invoice_no: string
  order_date: string
  order_month: string
  order_year: string
  confirmed_date: string
  processing_date: any
  picked_date: any
  shipped_date: any
  delivered_date: any
  cancel_date: any
  return_date: any
  return_reason: any
  order_return: string
  status: string
  created_at: string
  updated_at: string
}


export interface ProfileUpdateResponse {
  status: boolean
  message: string
  data: Vendor
}


export interface GetReturnOrderResponse {
  status: boolean
  message: string
  data: GetReturnOrderData[]
}

export interface GetReturnOrderData {
  id: number
  user_id: number
  country_id: number
  emirate_id: number
  name: string
  email: string
  phone: string
  address: AddressDetail | string
  post_code: string
  notes: any
  payment_type: string
  payment_method: string
  transaction_id: any
  currency: string
  amount: number
  tax: number
  shipping: number
  coupon_amount: number
  order_number: any
  invoice_no: string
  order_date: string
  order_month: string
  order_year: string
  confirmed_date: string
  processing_date: string
  picked_date: string
  shipped_date: string
  delivered_date: string
  cancel_date: string
  return_date: string
  return_reason: string
  order_return: string
  status: string
  created_at: string
  updated_at: string
  vendor_items: VendorItem[]
  user: User
  country: CountryData
  emirate: EmirateData
}

export interface VendorItem {
  id: number
  order_id: number
  product_id: number
  vendor_id: string
  color: string
  size: string
  qty: string
  price: number
  subtotal: number
  created_at: string
  updated_at: any
  product: ProductData
}

export interface DashboardStatsResponse {
  status: boolean
  message: string
  data: DashboardStatsData
  meta: any[]
}

export interface DashboardStatsData {
  total_earnings: string
  today_earnings: string
  month_earnings: string
  year_earnings: string
  today_earnings_percent: string
  month_earnings_percent: string
  year_earnings_percent: string
  total_orders: number
  pending_orders: number
  pending_orders_percent: string
  total_products: number
}

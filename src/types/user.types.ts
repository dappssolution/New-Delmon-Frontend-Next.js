export interface GetProfileResponse {
  success: boolean
  message: string
  data: UserData
}

export interface UserData {
  id: number
  name: string
  username: any
  email: string
  email_verified_at: string
  photo: any
  phone: string
  address: any
  vendor_join: any
  vendor_short_info: any
  role: string
  status: string
  last_seen: any
  google_id: any
  facebook_id: any
  created_at: string
  updated_at: string
  contract_status: "Not Requested" | "Requested" | "Approved"
}


export interface GetUserOrdersResponse {
  status: boolean
  message: string
  data: OrderData[]
}

export interface OrderData {
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


export interface GetOrderDetailsResponse {
  status: boolean
  message: string
  data: OrderDetailsData
}

export interface OrderDetailsData {
  order: Order
  items: Item[]
}

export interface Order {
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
  country?: Country
  emirate?: Emirate
  user: User
}

export interface Country {
  id: number
  name: string
  created_at?: string
  updated_at?: any
}

export interface Emirate {
  id: number
  country_id: number
  name: string
  created_at?: string
  updated_at?: any
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
  email_verified_at: string
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
  vendor_id: any
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
  main_category_id: number
  main_category_name: any
  category_id: number
  category_name: any
  subcategory_id: number
  subcategory_name: any
  product_name: string
  product_slug: string
  product_code: string
  product_qty: string
  product_tags: string
  product_size: string
  product_color: string
  packing: string
  height: any
  width: any
  length: any
  weight: any
  origin: string
  alt: string
  selling_price: string
  contract_price: any
  discount_price: any
  specification: string
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
  meta_title: string
  meta_keyword: string
  meta_description?: string
  wholesale: number
  status: number
  created_at: string
  updated_at: string
}


export interface GetReturnOrdersResponse {
  status: boolean
  message: string
  data: ReturnOrderData[]
}

export interface ReturnOrderData {
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
}

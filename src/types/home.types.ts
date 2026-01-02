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

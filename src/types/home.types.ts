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
export interface ContractRequestPayload {
  name: string
  company_name: string
  email: string
  phone: string
  address: string
}

export interface ContractRequestResponse {
  status: boolean
  message: string
  data: ContractRequestData
}

export interface ContractRequestData {
  user_id: number
  name: string
  company_name: string
  email: string
  phone: string
  address: string
  status: string
  updated_at: string
  created_at: string
  id: number
}
export interface ContractProductResponse {
  status: boolean
  message: string
  data: ContractProductData
}

export interface ContractProductData {
  contract: Contract
  products: ContractProducts
  count: number
}

export interface Contract {
  id: number
  user_id: number
  name: string
  company_name: string
  email: string
  phone: string
  address: string
  status: string
  created_at: string
  updated_at: string
}

export interface ContractProducts {
  current_page: number
  data: Daum[]
  first_page_url: string
  from: number
  last_page: number
  last_page_url: string
  links: Link[]
  next_page_url: any
  path: string
  per_page: number
  prev_page_url: any
  to: number
  total: number
}

export interface Daum {
  contract_item_id: number
  id: number
  product_name: string
  product_slug: string
  product_thambnail: string
  selling_price: string
  discount_price?: string
  brand_id: number
  category_id: number
  product_size: string
  product_color: string
  brand: Brand
  category: Category
}

export interface Brand {
  id: number
  brand_name: string
  brand_slug: string
}

export interface Category {
  id: number
  category_name: string
  category_slug: string
}

export interface Link {
  url?: string
  label: string
  active: boolean
}


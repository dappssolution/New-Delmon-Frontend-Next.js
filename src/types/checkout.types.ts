export interface CountryGetResponse {
  success: boolean
  message: string
  data: CountryData[]
}

export interface CountryData {
  id: number
  name: string
  created_at?: string
  updated_at?: any
}

export interface EmirateGetResponse {
  success: boolean
  message: string
  data: EmirateData[]
}

export interface EmirateData {
  id: number
  country_id: number
  name: string
  created_at?: string
  updated_at?: any
}

export interface OrderCreateResponse {
  status: string
  message: string
  data: OrderData
}

export interface OrderData {
  order_id?: number
  invoice_no?: string
  client_secret?: string
  payment_intent_id?: string
  amount?: number
  currency?: string
}

export interface StripeConfirmResponse {
  status: boolean
  message: string
  data: StripeConfirmData
}

export interface StripeConfirmData {
  order_id: number
}

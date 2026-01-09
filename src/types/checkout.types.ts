export interface DivisionGetResponse {
  success: boolean
  message: string
  data: DivisionData[]
}

export interface DivisionData {
  id: number
  devision_name: string
  created_at: string
  updated_at: any
}

export interface DistrictGetResponse {
  success: boolean
  message: string
  data: DistrictData[]
}

export interface DistrictData {
  id: number
  devision_id: number
  district_name: string
  created_at: string
  updated_at: any
}

export interface StateGetResponse {
  success: boolean
  message: string
  data: StateData[]
}

export interface StateData {
  id: number
  devision_id: number
  district_id: number
  state_name: string
  created_at: string
  updated_at: any
}

export interface OrderCreateResponse {
  status: boolean
  message: string
  data: OrderData
}

export interface OrderData {
  client_secret: string
  payment_intent_id: string
  amount: number
  currency: string
}


export interface StripeConfirmResponse {
  status: boolean
  message: string
  data: StripeConfirmData
}

export interface StripeConfirmData {
  order_id: number
}

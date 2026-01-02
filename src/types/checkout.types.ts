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
  success: boolean
  message: string
  data: OrderData
}

export interface OrderData {
  payment_url: string
}

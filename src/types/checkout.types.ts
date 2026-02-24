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
  status: string | boolean
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
  payment_method: string;
  note?: string;
}

export interface AddressResponse {
  status: boolean;
  message: string;
  data: AddressDetail[];
}

export interface AddressDetail {
  id: number;
  user_id: number;
  country_id: number;
  emirate_id: number;
  first_name: string;
  last_name: string | null;
  email: string;
  phone: string;
  address_type: string;
  building_details: string;
  city: string;
  address: string;
  post_code: string | null;
  longitude: string | null;
  latitude: string | null;
  created_at: string;
  updated_at: string;
  country_name?: string;
  emirate_name?: string;
}

export interface StripeConfirmResponse {
  status: boolean
  message: string
  data: StripeConfirmData
}

export interface StripeConfirmData {
  order_id: number
}

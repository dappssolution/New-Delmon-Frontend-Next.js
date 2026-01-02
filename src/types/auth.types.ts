export interface RegisterResponse {
  status: boolean
  message: string
  token: string
  user: User
}

export interface User {
  name: string
  email: string
  phone: string
  role: string
  status: string
  updated_at: string
  created_at: string
  id: number
}


export interface LoginResponse {
  status: boolean
  message: string
  token: string
  verified: boolean
  role: string
  user: LoginUser
}

export interface LoginUser {
  id: number
  name: string
  username: string
  email: string
  email_verified_at: string
  photo: any
  phone: string
  address: any
  vendor_join: string
  vendor_short_info: any
  role: string
  status: string
  last_seen: any
  google_id: any
  facebook_id: any
  created_at: string
  updated_at: string
}

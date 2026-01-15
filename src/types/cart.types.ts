export interface CartResponse {
  success: boolean;
  message: string;
  data: Cart;
}

export interface UpdateCartResponse {
  success: boolean;
  message: string;
  data: {
    qty: number;
    price: string | number;
    total: number;
  };
}

export interface RemoveCartResponse {
  success: boolean;
  message: string;
  data: any[];
}

export interface Cart {
  cart_items: CartItem[]
  cart_count: number
  cart_total: number
  coupon_name: string
  coupon_discount: number
  discount_amount: number
  delivery_charge: number
  grand_total: number
  currency: string
  tax_percentage: number
  shipping_config: ShippingConfig
}

export interface CartItem {
  id: number;
  product_id: number;
  vendor_id: number | null;
  user_id: number | null;
  session_id: string;
  name: string;
  size: string;
  color: string;
  qty: number;
  price: number;
  total: number;
  img: string;
  created_at: string;
  updated_at: string;
}

export interface ShippingConfig {
  type: string;
  cost: number;
  custom_cost: number;
}


export interface CouponResponse {
  status: boolean
  message: string
  data: CouponData
}

export interface CouponData {
  coupon_name: string
  coupon_discount: number
}

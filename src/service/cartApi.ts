import api from "../lib/axios";
import { CartResponse, UpdateCartResponse, RemoveCartResponse } from "../types/cart.types";

export interface AddToCartPayload {
  qty?: number;
  color?: string;
  size?: string;
}

export const cartApi = {
  async getCart() {
    const res = await api.get<CartResponse>("/cart");
    return res.data.data;
  },

  async addToCart(productId: number, payload?: AddToCartPayload) {
    const res = await api.post<CartResponse>(
      `/cart/add/${productId}`,
      payload
    );
    return res.data.data;
  },

  async updateCartItem(itemId: number, quantity: number) {
    const res = await api.post<UpdateCartResponse>(
      `/cart/update/${itemId}`,
      { qty: quantity }
    );
    return res.data.data;
  },

  async removeFromCart(itemId: number) {
    const res = await api.delete<RemoveCartResponse>(
      `/cart/remove/${itemId}`
    );
    return res.data.data;
  },

  async applyCoupon(couponName: string) {
    const res = await api.post<CartResponse>(
      "/coupon/apply",
      { coupon_name: couponName }
    );
    return res.data;
  },

  async removeCoupon() {
    const res = await api.delete<CartResponse>(
      `/cart/coupon`
    );
    return res.data.data;
  },
};

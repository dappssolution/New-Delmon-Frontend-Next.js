"use client";

import { useEffect, useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { cartApi } from "@/src/service/cartApi";
import { checkoutApi } from "@/src/service/checkoutApi";
import { Cart, CartItem } from "@/src/types/cart.types";
import { DivisionData, DistrictData, StateData } from "@/src/types/checkout.types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<Cart | null>(null);
  const [divisions, setDivisions] = useState<DivisionData[]>([]);
  const [districts, setDistricts] = useState<DistrictData[]>([]);
  const [states, setStates] = useState<StateData[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    division: "",
    state: "",
    district: "",
    zipCode: "",
    additionalAddress: ""
  });
  const [paymentMethod, setPaymentMethod] = useState("tap");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [couponCode, setCouponCode] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setInitialLoading(true);
      const [cartData, divisionsData] = await Promise.all([
        cartApi.getCart(),
        checkoutApi.getDivisions()
      ]);
      setCart(cartData);
      setDivisions(divisionsData);
    } catch (error) {
      console.error("Error fetching initial data:", error);
      toast.error("Failed to load checkout data");
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    if (formData.division) {
      fetchDistricts(Number(formData.division));
    } else {
      setDistricts([]);
      setStates([]);
    }
  }, [formData.division]);

  useEffect(() => {
    if (formData.district) {
      fetchStates(Number(formData.district));
    } else {
      setStates([]);
    }
  }, [formData.district]);

  const fetchDistricts = async (divisionId: number) => {
    try {
      const data = await checkoutApi.getDistricts(divisionId);
      setDistricts(data);
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  };

  const fetchStates = async (districtId: number) => {
    try {
      const data = await checkoutApi.getStates(districtId);
      setStates(data);
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newState = { ...prev, [name]: value };
      if (name === "division") {
        newState.district = "";
        newState.state = "";
      } else if (name === "district") {
        newState.state = "";
      }
      return newState;
    });
  };

  const updateQuantity = async (id: number, delta: number) => {
    if (!cart) return;
    const item = cart.cart_items.find((i: CartItem) => i.id === id);
    if (!item) return;

    const newQty = item.qty + delta;
    if (newQty < 1) return;

    try {
      await cartApi.updateCartItem(id, newQty);
      const updatedCart = await cartApi.getCart();
      setCart(updatedCart);
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Failed to update quantity");
    }
  };

  const handleRemoveItem = async (id: number) => {
    try {
      await cartApi.removeFromCart(id);
      const updatedCart = await cartApi.getCart();
      setCart(updatedCart);
      toast.success("Item removed from cart");
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Failed to remove item");
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode) {
      toast.error("Please enter a coupon code");
      return;
    }

    setCouponLoading(true);
    try {
      const response = await cartApi.applyCoupon(couponCode);
      if (response.success) {
        setCart(response.data);
        toast.success(response.message || "Coupon applied successfully!");
        setCouponCode("");
      } else {
        toast.error(response.message || "Failed to apply coupon");
      }
    } catch (error: any) {
      console.error("Error applying coupon:", error);
      toast.error(error.response?.data?.message || "Invalid coupon code");
    } finally {
      setCouponLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!formData.name || !formData.phone || !formData.email || !formData.address) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        shipping_name: formData.name,
        shipping_phone: formData.phone,
        shipping_email: formData.email,
        shipping_address: formData.address,
        division_id: formData.division ? Number(formData.division) : undefined,
        district_id: formData.district ? Number(formData.district) : undefined,
        state_id: formData.state ? Number(formData.state) : undefined,
        post_code: formData.zipCode,
        payment_method: paymentMethod
      };

      const response = await checkoutApi.placeOrder(payload);
      if (response.success) {
        toast.success("Order placed successfully!");
        // router.push(`/order-success?order_id=${response.data.order_id}`);
      } else {
        toast.error(response.message || "Failed to place order");
      }
    } catch (error: any) {
      console.error("Error placing order:", error);
      toast.error(error.response?.data?.message || "Something went wrong while placing the order");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!cart || cart.cart_items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <button
          onClick={() => router.push("/")}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-gray-600">
          <span>Delmon</span>
          <span className="mx-2">›</span>
          <span>Home</span>
          <span className="mx-2">›</span>
          <span>Cart</span>
          <span className="mx-2">›</span>
          <span className="text-gray-900 font-medium">Check Out</span>
        </div>

        {/* Page Title */}
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Check Out</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Section - Cart Items & Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cart Items */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="space-y-4">
                {cart.cart_items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 pb-4 border-b border-gray-200 last:border-0">
                    {/* Product Image */}
                    <div className="w-20 h-20 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                      {item.img ? (
                        <img
                          src={item.img.startsWith('http') ? item.img : `${process.env.NEXT_PUBLIC_IMAGE_BASE}/${item.img}`}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded"></div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 text-sm mb-2">
                        {item.name}
                      </h3>
                      <div className="flex items-center gap-4 text-xs text-gray-600">
                        {item.size && (
                          <div>
                            <span className="font-medium">Size</span>
                            <p className="text-gray-900">{item.size}</p>
                          </div>
                        )}
                        {item.color && (
                          <div>
                            <span className="font-medium">Color</span>
                            <p className="text-gray-900">{item.color}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center border border-gray-300 rounded-md h-8">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-8 h-full hover:bg-gray-50 flex items-center justify-center text-gray-600 disabled:opacity-50"
                        disabled={item.qty <= 1}
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-sm font-medium">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-8 h-full hover:bg-gray-50 flex items-center justify-center text-gray-600"
                      >
                        +
                      </button>
                    </div>

                    {/* Price */}
                    <div className="w-20 text-right font-semibold text-gray-900 whitespace-nowrap">
                      AED {item.total}
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-2 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors text-gray-400"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Address Form */}
            <div className="bg-white rounded-lg border-2 border-blue-500 p-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-900">Address</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Name *"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    required
                  />
                </div>

                <div>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone *"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    required
                  />
                </div>

                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email *"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    required
                  />
                </div>

                <div>
                  <input
                    type="text"
                    name="address"
                    placeholder="Address *"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    required
                  />
                </div>

                <div>
                  <select
                    name="division"
                    value={formData.division}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 bg-white"
                  >
                    <option value="">Division</option>
                    {divisions.map((div) => (
                      <option key={div.id} value={div.id}>
                        {div.devision_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    disabled={!formData.division}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 bg-white disabled:bg-gray-50"
                  >
                    <option value="">District</option>
                    {districts.map((dist) => (
                      <option key={dist.id} value={dist.id}>
                        {dist.district_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    disabled={!formData.district}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 bg-white disabled:bg-gray-50"
                  >
                    <option value="">State</option>
                    {states.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.state_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <input
                    type="text"
                    name="zipCode"
                    placeholder="Zip Code"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  />
                </div>

                <div className="md:col-span-2">
                  <textarea
                    name="additionalAddress"
                    placeholder="Additional Address *"
                    value={formData.additionalAddress}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-gray-900"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-900">Payment</h2>

              <div className="space-y-3 mb-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="tap"
                    checked={paymentMethod === "tap"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-gray-900 font-medium">TAP</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="Cash On Delivery"
                    checked={paymentMethod === "Cash On Delivery"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-gray-900 font-medium">Cash On Delivery</span>
                </label>
              </div>

              {/* Payment Icons */}
              <div className="flex items-center gap-4">
                <div className="text-blue-600 font-bold text-xl">PayPal</div>
                <div className="text-teal-500 font-bold text-xl">zapper</div>
                <div className="text-blue-900 font-bold text-xl">VISA</div>
                <div className="flex gap-1">
                  <div className="w-6 h-6 rounded-full bg-red-500"></div>
                  <div className="w-6 h-6 rounded-full bg-orange-500 -ml-2"></div>
                </div>
              </div>

              {/* Place Order Button - Mobile */}
              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="lg:hidden w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Place Order"
                )}
              </button>
            </div>
          </div>

          {/* Right Section - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-100 rounded-lg p-6 sticky top-8">
              {/* Coupon Section */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Have a coupon?</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-gray-900"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    disabled={couponLoading}
                    className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-black transition-colors disabled:opacity-50 flex items-center justify-center min-w-[80px]"
                  >
                    {couponLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Apply"}
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-gray-700">
                  <span>Sub Total</span>
                  <span className="font-semibold">AED {cart.cart_total}</span>
                </div>

                {cart.discount_amount && cart.discount_amount > 0 && (
                  <div className="flex justify-between text-gray-700">
                    <span>Discount</span>
                    <span className="font-semibold text-green-600">-AED {cart.discount_amount}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-700">
                  <span>Tax</span>
                  <span className="font-semibold">{cart.tax_percentage}%</span>
                </div>

                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span className="font-semibold">AED {cart.shipping_config.cost}</span>
                </div>

                <div className="border-t border-gray-300 pt-4">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Grand Total</span>
                    <span>AED {cart.cart_total + (cart.cart_total * cart.tax_percentage / 100) + cart.shipping_config.cost - (cart.discount_amount || 0)}</span>
                  </div>
                </div>
              </div>

              {/* Place Order Button - Desktop */}
              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="hidden lg:flex w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Place Order"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Trash2, Loader2, CreditCard, Lock } from "lucide-react";
import { checkoutApi } from "@/src/service/checkoutApi";
import { CountryData, EmirateData } from "@/src/types/checkout.types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/src/hooks/useRedux";
import { RootState } from "@/src/redux/store";
import { fetchCart, updateCartItem, removeFromCart, applyCoupon } from "@/src/redux/cart/cartThunk";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { resetCart } from "@/src/redux/cart/cartSlice";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY || "");

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#1f2937",
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#9ca3af",
      },
      iconColor: "#6b7280",
    },
    invalid: {
      color: "#ef4444",
      iconColor: "#ef4444",
    },
  },
  hidePostalCode: true,
};

// Debounce hook
function useDebounce<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedFunction = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  ) as T;

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedFunction;
}

function CheckoutForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const stripe = useStripe();
  const elements = useElements();

  const { cart, loading: cartLoading } = useAppSelector((state: RootState) => state.cart);
  const [emirates, setEmirates] = useState<EmirateData[]>([]);

  const [localQuantities, setLocalQuantities] = useState<Record<number, number>>({});
  const [updatingItems, setUpdatingItems] = useState<Set<number>>(new Set());

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    emirate: "",
    note: "",
    address_type: "home",
    building_details: "",
    city: ""
  });
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [couponCode, setCouponCode] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);
  const [cardComplete, setCardComplete] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (cart?.cart_items) {
      const quantities: Record<number, number> = {};
      cart.cart_items.forEach(item => {
        quantities[item.id] = item.qty;
      });
      setLocalQuantities(quantities);
    }
  }, [cart?.cart_items]);

  const fetchInitialData = async () => {
    try {
      setInitialLoading(true);
      const emiratesData = await checkoutApi.getEmirates();
      await dispatch(fetchCart());
      setEmirates(emiratesData);
    } catch (error) {
      console.error("Error fetching initial data:", error);
    } finally {
      setInitialLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Debounced API call
  const debouncedUpdateCart = useDebounce(async (itemId: number, quantity: number) => {
    setUpdatingItems(prev => new Set(prev).add(itemId));
    await dispatch(updateCartItem({ itemId, quantity }));
    setUpdatingItems(prev => {
      const next = new Set(prev);
      next.delete(itemId);
      return next;
    });
  }, 500);

  const updateQuantity = (id: number, delta: number) => {
    const currentQty = localQuantities[id] || 1;
    const newQuantity = Math.max(1, currentQty + delta);

    setLocalQuantities(prev => ({
      ...prev,
      [id]: newQuantity
    }));

    debouncedUpdateCart(id, newQuantity);
  };

  const handleRemoveItem = async (id: number) => {
    const res = await dispatch(removeFromCart(id));
    if (removeFromCart.fulfilled.match(res)) {
      toast.success("Item removed from cart");
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode) {
      toast.error("Please enter a coupon code");
      return;
    }

    setCouponLoading(true);
    const res = await dispatch(applyCoupon(couponCode));
    setCouponLoading(false);

    if (applyCoupon.fulfilled.match(res)) {
      toast.success("Coupon applied successfully!");
      setCouponCode("");
    }
  };

  const handleCardChange = (event: any) => {
    setCardComplete(event.complete);
    if (event.error) {
      setCardError(event.error.message);
    } else {
      setCardError(null);
    }
  };

  const handlePlaceOrder = async () => {
    if (!formData.name || !formData.phone || !formData.email || !formData.address) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (paymentMethod === "stripe") {
      if (!stripe || !elements) {
        toast.error("Stripe is not loaded. Please refresh and try again.");
        return;
      }

      if (!cardComplete) {
        toast.error("Please complete your card details");
        return;
      }
    }

    setLoading(true);
    try {
      const selectedEmirate = emirates.find(e => String(e.id) === formData.emirate);

      const payload = {
        shipping_name: formData.name,
        shipping_phone: formData.phone,
        shipping_email: formData.email,
        shipping_address: formData.address,
        country_id: selectedEmirate?.country_id || 0,
        emirate_id: Number(formData.emirate),
        address_type: formData.address_type,
        building_details: formData.building_details,
        city: formData.city,
        payment_method: paymentMethod,
        note: formData.note
      };

      const response = await checkoutApi.placeOrder(payload);

      if (response.status !== "success") {
        toast.error(response.message || "Failed to place order");
        return;
      }

      if (paymentMethod === "stripe" && response.data.client_secret) {
        const cardElement = elements?.getElement(CardElement);

        if (!cardElement) {
          toast.error("Card element not found");
          return;
        }

        const { error, paymentIntent } = await stripe!.confirmCardPayment(
          response.data.client_secret,
          {
            payment_method: {
              card: cardElement,
              billing_details: {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
              },
            },
          }
        );

        if (error) {
          toast.error(error.message || "Payment failed");
          return;
        }


        if (paymentIntent?.status === "succeeded") {
          const confirmResponse = await checkoutApi.confirmStripePayment(paymentIntent.id);

          if (confirmResponse.status) {
            toast.success("Payment successful! Order placed.");
            dispatch(resetCart());
            router.push(`/order-success?order_id=${confirmResponse.data?.order_id}`);
          } else {
            toast.success("Payment successful! Your order is being processed.");
            dispatch(resetCart());
            router.push("/account/orders");
          }
        } else {
          toast.error("Payment was not completed. Please try again.");
        }
      } else if (paymentMethod === "cash") {
        toast.success("Order placed successfully!");
        dispatch(resetCart());
        router.push(`/order-success?order_id=${response.data?.order_id}`);
      }
    } catch (error: any) {
      console.error("Error placing order:", error);
      toast.error(error.response?.data?.error || error.response?.data?.message || "Something went wrong while placing the order");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
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
                  <div key={item.id} className="flex flex-col sm:flex-row sm:items-center gap-4 pb-4 border-b border-gray-200 last:border-0 relative">
                    {/* Product Image & Info Group */}
                    <div className="flex items-start gap-4 flex-1 w-full sm:w-auto">
                      <div className="w-20 h-20 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                        {item.img ? (
                          <img
                            src={item.img.startsWith('http') ? item.img : `${process.env.NEXT_PUBLIC_IMAGE_BASE}/${item.img}`}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-linear-to-br from-yellow-400 to-orange-500 rounded"></div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0 pt-1">
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="font-medium text-gray-900 text-sm mb-2 truncate">
                            {item.name}
                          </h3>
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="sm:hidden p-1 -mt-1 -mr-1 text-gray-400 hover:text-red-500"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-600">
                          {item.size && (
                            <div className="flex gap-1">
                              <span className="font-medium">Size:</span>
                              <p className="text-gray-900">{item.size}</p>
                            </div>
                          )}
                          {item.color && (
                            <div className="flex gap-1">
                              <span className="font-medium">Color:</span>
                              <p className="text-gray-900">{item.color}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Quantity Controls & Price */}
                    <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pl-24 sm:pl-0">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center border border-gray-300 rounded-md h-8 text-gray-900">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-8 h-full hover:bg-gray-50 flex items-center justify-center text-gray-600 disabled:opacity-50"
                            disabled={(localQuantities[item.id] || item.qty) <= 1}
                          >
                            -
                          </button>
                          <span className="w-8 text-center text-sm font-medium">
                            {localQuantities[item.id] ?? item.qty}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-8 h-full hover:bg-gray-50 flex items-center justify-center text-gray-600"
                          >
                            +
                          </button>
                        </div>
                        {updatingItems.has(item.id) && (
                          <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                        )}
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="w-20 text-right font-semibold text-gray-900 whitespace-nowrap">
                          AED {(item.price * (localQuantities[item.id] || item.qty)).toFixed(2)}
                        </div>

                        {/* Desktop Delete Button */}
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="hidden sm:block p-2 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors text-gray-400"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Address Form */}
            <div className="bg-white rounded-lg border-2 border-blue-500 p-6">
              <h2 className="text-lg font-semibold mb-6 text-gray-900">Delivery Details</h2>

              {/* Address Type Buttons */}
              <div className="mb-6">
                <label className="text-sm font-medium text-gray-700 mb-3 block">Address Type *</label>
                <div className="flex gap-3">
                  {['home', 'office', 'other'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, address_type: type }))}
                      className={`px-6 py-2 rounded-full border text-sm font-medium transition-all ${formData.address_type === type
                        ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                        : 'bg-white border-gray-300 text-gray-600 hover:border-blue-500 hover:text-blue-600'
                        }`}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

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

                <div className="md:col-span-2">
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
                  <select
                    name="emirate"
                    value={formData.emirate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 bg-white"
                    required
                  >
                    <option value="">Select Emirate *</option>
                    {emirates.map((emirate) => (
                      <option key={emirate.id} value={emirate.id}>
                        {emirate.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <input
                    type="text"
                    name="city"
                    placeholder="City *"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <input
                    type="text"
                    name="building_details"
                    placeholder="Building Name, Floor, etc. *"
                    value={formData.building_details}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <input
                    type="text"
                    name="address"
                    placeholder="Street Address *"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    required
                  />
                </div>

                

                <div className="md:col-span-2">
                  <textarea
                    name="note"
                    placeholder="Order Notes (Optional)"
                    value={formData.note}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-gray-900"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-900">Payment</h2>

              <div className="mb-6">
                <div className="mb-6 space-y-3">
                  {/* Cash on Delivery Option */}
                  <div
                    className={`flex items-center gap-3 p-4 rounded-lg border transition-all cursor-pointer ${paymentMethod === 'cash' ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500' : 'bg-white border-gray-200 hover:border-gray-300'}`}
                    onClick={() => setPaymentMethod('cash')}
                  >
                    <div className={`p-2 rounded-md border shadow-sm ${paymentMethod === 'cash' ? 'bg-blue-600 border-blue-600' : 'bg-gray-50 border-gray-100'}`}>
                      <CreditCard className={`w-6 h-6 ${paymentMethod === 'cash' ? 'text-white' : 'text-gray-400'}`} />
                    </div>
                    <div>
                      <h3 className="text-gray-900 font-semibold text-sm">Cash on Delivery</h3>
                      <p className="text-xs text-gray-500">Pay when you receive your order</p>
                    </div>
                    <div className={`ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cash' ? 'border-blue-600' : 'border-gray-300'}`}>
                      {paymentMethod === 'cash' && <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />}
                    </div>
                  </div>

                  {/* Stripe Option */}
                  <div
                    className={`flex items-center gap-3 p-4 rounded-lg border transition-all cursor-pointer ${paymentMethod === 'stripe' ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500' : 'bg-white border-gray-200 hover:border-gray-300'}`}
                    onClick={() => setPaymentMethod('stripe')}
                  >
                    <div className={`p-2 rounded-md border shadow-sm ${paymentMethod === 'stripe' ? 'bg-blue-600 border-blue-600' : 'bg-gray-50 border-gray-100'}`}>
                      <CreditCard className={`w-6 h-6 ${paymentMethod === 'stripe' ? 'text-white' : 'text-gray-400'}`} />
                    </div>
                    <div>
                      <h3 className="text-gray-900 font-semibold text-sm">Credit/Debit Card</h3>
                      <p className="text-xs text-gray-500">Secure payment via Stripe</p>
                    </div>
                    <div className={`ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'stripe' ? 'border-blue-600' : 'border-gray-300'}`}>
                      {paymentMethod === 'stripe' && <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />}
                    </div>
                  </div>

                  {paymentMethod === "stripe" && (
                    <div className="p-4 border border-blue-500 rounded-lg bg-white mt-2">
                      <div className="flex items-center gap-2 mb-4">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/1200px-Visa_Inc._logo.svg.png" alt="Visa" className="h-4 object-contain" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" alt="Mastercard" className="h-4 object-contain" />
                      </div>
                      <div className={`p-4 border ${cardError ? 'border-red-300' : 'border-gray-300'} rounded-lg bg-white transition-colors focus-within:border-blue-500 ring-1 focus-within:ring-blue-500/20 ring-transparent`}>
                        <CardElement options={CARD_ELEMENT_OPTIONS} onChange={handleCardChange} />
                      </div>
                      {cardError && (
                        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                          <span className="w-1 h-1 rounded-full bg-red-600"></span>
                          {cardError}
                        </p>
                      )}
                      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                        <Lock className="w-3 h-3" />
                        <span>Your transaction is secured with 256-bit SSL encryption</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Place Order Button - Mobile */}
              <button
                onClick={handlePlaceOrder}
                disabled={loading || (paymentMethod === "stripe" && (!stripe || !elements))}
                className="lg:hidden w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    {paymentMethod === "stripe" && <Lock className="w-4 h-4" />}
                    {paymentMethod === "stripe" ? "Pay Now" : "Place Order"}
                  </>
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
                  <span className="font-semibold">AED {cart.cart_total.toFixed(2)}</span>
                </div>



                {cart.coupon_discount && cart.coupon_discount > 0 && (
                  <div className="flex justify-between text-gray-700">
                    <span>Coupon ({cart.coupon_name})</span>
                    <span className="font-semibold text-green-600">{cart.coupon_discount}%</span>
                  </div>
                )}

                {cart.discount_amount && cart.discount_amount > 0 && (
                  <div className="flex justify-between text-gray-700">
                    <span>Discount</span>
                    <span className="font-semibold text-green-600">-AED {cart.discount_amount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-end text-gray-700">
                  <span className="text-xs italic text-gray-500">(All VAT amounts are included)</span>
                </div>

                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span className="font-semibold">
                    {(() => {
                      const selectedEmirate = emirates.find(e => String(e.id) === formData.emirate);
                      const isDubai = selectedEmirate?.name.toLowerCase() === "dubai";
                      const subtotal = cart.cart_total;

                      if (isDubai || subtotal >= 300) return "FREE";
                      return `AED 35.00`;
                    })()}
                  </span>
                </div>

                <div className="border-t border-gray-300 pt-4">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Grand Total</span>
                    <span>
                      AED {(() => {
                        const selectedEmirate = emirates.find(e => String(e.id) === formData.emirate);
                        const isDubai = selectedEmirate?.name.toLowerCase() === "dubai";
                        const subtotal = cart.cart_total;
                        const shipping = (isDubai || subtotal >= 300) ? 0 : 35;
                        const tax = 0; // Tax removed from calculation
                        const discounts = (cart.discount_amount || 0); // coupon_discount removed from calculation

                        return (subtotal + tax + shipping - discounts).toFixed(2);
                      })()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Place Order Button - Desktop */}
              <button
                onClick={handlePlaceOrder}
                disabled={loading || (paymentMethod === "stripe" && (!stripe || !elements))}
                className="hidden lg:flex w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    {paymentMethod === "stripe" && <Lock className="w-4 h-4" />}
                    {paymentMethod === "stripe" ? "Pay Now" : "Place Order"}
                  </>
                )}
              </button>

              {paymentMethod === "stripe" && (
                <p className="mt-3 text-xs text-center text-gray-500 flex items-center justify-center gap-1">
                  <Lock className="w-3 h-3" />
                  Your payment is secure and encrypted
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Wrapper component with Elements provider
export default function Checkout() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}
"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Trash2, Loader2, CreditCard, Lock } from "lucide-react";
import { checkoutApi } from "@/src/service/checkoutApi";
import { DivisionData, DistrictData, StateData } from "@/src/types/checkout.types";
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
  const [divisions, setDivisions] = useState<DivisionData[]>([]);
  const [districts, setDistricts] = useState<DistrictData[]>([]);
  const [states, setStates] = useState<StateData[]>([]);

  const [localQuantities, setLocalQuantities] = useState<Record<number, number>>({});
  const [updatingItems, setUpdatingItems] = useState<Set<number>>(new Set());

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
  const [paymentMethod, setPaymentMethod] = useState("stripe");
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
      const divisionsData = await checkoutApi.getDivisions();
      await dispatch(fetchCart());
      setDivisions(divisionsData);
    } catch (error) {
      console.error("Error fetching initial data:", error);
      // toast.error("Failed to load checkout data");
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

      if (!response.status) {
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

              <div className="mb-6">
                <div className="flex items-center gap-3 p-4 rounded-t-lg border border-gray-200 bg-blue-50/50 border-b-0">
                  <div className="p-2 bg-white rounded-md border border-gray-100 shadow-sm">
                    <CreditCard className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-gray-900 font-semibold text-sm">Credit/Debit Card</h3>
                    <p className="text-xs text-gray-500">Secure payment via Stripe</p>
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/1200px-Visa_Inc._logo.svg.png" alt="Visa" className="h-6 object-contain" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" alt="Mastercard" className="h-6 object-contain" />
                  </div>
                </div>

                <div className="p-4 border border-gray-200 rounded-b-lg bg-white">
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
                      const selectedDistrict = districts.find(d => String(d.id) === formData.district);
                      const isDubai = selectedDistrict?.district_name.toLowerCase() === "dubai";
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
                        const selectedDistrict = districts.find(d => String(d.id) === formData.district);
                        const isDubai = selectedDistrict?.district_name.toLowerCase() === "dubai";
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
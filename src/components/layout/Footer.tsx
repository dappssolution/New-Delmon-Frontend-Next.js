"use client";

import React from "react";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/src/hooks/useRedux";
import { RootState } from "@/src/redux/store";
import { logout } from "@/src/redux/auth/authSlice";
import { resetCart } from "@/src/redux/cart/cartSlice";
import { resetWishlist } from "@/src/redux/wishlist/wishlistSlice";
import { useRouter } from "next/navigation";

const Footer = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { token } = useAppSelector((state: RootState) => state.auth);

  const handleVendorAuth = (e: React.MouseEvent, path: string) => {
    if (token) {
      e.preventDefault();
      dispatch(logout());
      dispatch(resetCart());
      dispatch(resetWishlist());
      router.push(path);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(resetCart());
    dispatch(resetWishlist());
    router.push("/login");
  };

  return (
    <footer className="w-full">
      {/* Main Footer - Green Background */}
      <div className="bg-[#0d6838] text-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 md:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {/* Company Info Column */}
            <div className="col-span-1">
              {/* Logo */}
              <div className="mb-6">
                <div className="w-44 h-16 rounded-md flex items-center justify-center">
                  <Image
                    src="/delmon white.png"
                    alt="Delmon"
                    width={170}
                    height={60}
                    priority
                  />
                </div>
              </div>

              <p className="text-white text-sm leading-relaxed mb-6">
                In <span className="font-semibold">Newdelmon</span>, We are a
                locally owned and operated business committed to providing our
                customers with top-quality products If you have any suggestions
                or feedback, please feel free to contact us.
              </p>

              <div className="space-y-2 text-sm">
                <p className="text-white">
                  Dubai, United Arab Emirates
                </p>
                <p className="text-white">
                  Tel: +971 42 88 1400
                </p>
                <p className="text-white">Email: info@newdelmonstationery.com</p>
              </div>
            </div>

            {/* Useful Links Column */}
            <div>
              <h3 className="text-white text-lg font-semibold mb-4 md:mb-6">
                Useful Links
              </h3>
              <ul className="space-y-2 md:space-y-3">
                <li>
                  <Link
                    href="/about-us"
                    className="text-white text-sm hover:text-gray-200 transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-and-conditions"
                    className="text-white text-sm hover:text-gray-200 transition-colors"
                  >
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-white text-sm hover:text-gray-200 transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/support-center"
                    className="text-white text-sm hover:text-gray-200 transition-colors"
                  >
                    Support Center
                  </Link>
                </li>
                <li>
                  <Link
                    href="/careers"
                    className="text-white text-sm hover:text-gray-200 transition-colors"
                  >
                    Careers
                  </Link>
                </li>
              </ul>
            </div>

            {/* My Account Column */}
            <div>
              <h3 className="text-white text-lg font-semibold mb-4 md:mb-6">
                My Account
              </h3>
              <ul className="space-y-2 md:space-y-3">
                <li>
                  {
                    token ? <button onClick={handleLogout}
                    className="text-white text-sm hover:text-gray-200 transition-colors"
                    >Logout</button> : <Link
                    href="/login"
                    className="text-white text-sm hover:text-gray-200 transition-colors"
                  >
                    Login
                  </Link>
                  }
                </li>
                <li>
                  <Link
                    href="/account/orders"
                    className="text-white text-sm hover:text-gray-200 transition-colors"
                  >
                    Order History
                  </Link>
                </li>
                <li>
                  <Link
                    href="/wishlist"
                    className="text-white text-sm hover:text-gray-200 transition-colors"
                  >
                    My Wishlist
                  </Link>
                </li>
                <li>
                  <Link
                    href="/account/track-orders"
                    className="text-white text-sm hover:text-gray-200 transition-colors"
                  >
                    Track Order
                  </Link>
                </li>
                <li>
                  <Link
                    href="/account/details"
                    className="text-white text-sm hover:text-gray-200 transition-colors"
                  >
                    Shipping Details
                  </Link>
                </li>
              </ul>
            </div>

            {/* Seller Zone Column */}
            <div>
              <h3 className="text-white text-lg font-semibold mb-4 md:mb-6">
                Seller Zone
              </h3>
              <ul className="space-y-2 md:space-y-3">
                <li>
                  <Link
                    href="/register?role=vendor"
                    onClick={(e) => handleVendorAuth(e, "/register?role=vendor")}
                    className="text-white text-sm hover:text-gray-200 transition-colors"
                  >
                    Become a Vendor
                  </Link>
                </li>
                <li>
                  <Link
                    href="/login?role=vendor"
                    onClick={(e) => handleVendorAuth(e, "/login?role=vendor")}
                    className="text-white text-sm hover:text-gray-200 transition-colors"
                  >
                    Login to Vendor Panel
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contract/request"
                    className="text-white text-sm hover:text-gray-200 transition-colors"
                  >
                    Contract Panel
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contract/products"
                    className="text-white text-sm hover:text-gray-200 transition-colors"
                  >
                    See Contract Products
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer - White Background */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-4 md:py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-600 text-xs sm:text-sm text-center sm:text-left">
              2005-2024, ©All Right Reserved. Powered by: Newdelmon Wholesalers Co.LLC
            </p>

            {/* Social Media Icons */}
            <div className="flex items-center gap-4">
              <a
                href="https://www.facebook.com/NewDelmongoodswholesalellc?_rdc=1&_rdr#"
                className="text-[#1877F2] hover:opacity-80 transition-opacity"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-[#1DA1F2] hover:opacity-80 transition-opacity"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/newdelmonwholesalegoodsllc"
                className="text-[#E4405F] hover:opacity-80 transition-opacity"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://youtube.com/@newdelmonllc?si=fLuezjjQSvw0lc9d"
                className="text-[#FF0000] hover:opacity-80 transition-opacity"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
import React from "react";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
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
                  The Atomic Near Kristal, Benguluru, 695581, Karnataka.
                </p>
                <p className="text-white">
                  Tel: +91 471 22334455 / 65 8877 6655
                </p>
                <p className="text-white">Email: contact@chapter.com</p>
              </div>
            </div>

            {/* Useful Links Column */}
            <div>
              <h3 className="text-white text-lg font-semibold mb-4 md:mb-6">
                Useful Links
              </h3>
              <ul className="space-y-2 md:space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-white text-sm hover:text-gray-200 transition-colors"
                  >
                    About Us
                  </a>
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
                  <a
                    href="#"
                    className="text-white text-sm hover:text-gray-200 transition-colors"
                  >
                    Support Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white text-sm hover:text-gray-200 transition-colors"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white text-sm hover:text-gray-200 transition-colors"
                  >
                    Contact Us
                  </a>
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
                  <a
                    href="#"
                    className="text-white text-sm hover:text-gray-200 transition-colors"
                  >
                    Login
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white text-sm hover:text-gray-200 transition-colors"
                  >
                    Order History
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white text-sm hover:text-gray-200 transition-colors"
                  >
                    My Wishlist
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white text-sm hover:text-gray-200 transition-colors"
                  >
                    Track Order
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white text-sm hover:text-gray-200 transition-colors"
                  >
                    Shipping Details
                  </a>
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
                    className="text-white text-sm hover:text-gray-200 transition-colors"
                  >
                    Become a Vendor
                  </Link>
                </li>
                <li>
                  <Link
                    href="/login"
                    className="text-white text-sm hover:text-gray-200 transition-colors"
                  >
                    Login to Vendor Panel
                  </Link>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white text-sm hover:text-gray-200 transition-colors"
                  >
                    Login to Contract Panel
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white text-sm hover:text-gray-200 transition-colors"
                  >
                    See Contract Products
                  </a>
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
                href="#"
                className="text-gray-600 hover:text-green-700 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-green-700 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-green-700 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-green-700 transition-colors"
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
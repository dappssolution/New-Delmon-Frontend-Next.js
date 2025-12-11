"use client";

import { useState } from "react";
import {
  Search,
  Scale,
  Heart,
  User,
  ShoppingCart,
  ChevronDown,
  Phone,
  Menu,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const menuItems = [
  { name: "SCHOOL ITEMS", hasDropdown: true },
  { name: "HAND WASH", hasDropdown: false },
  { name: "FIRE PROOF", hasDropdown: false },
  { name: "BRANDS", hasDropdown: true },
  { name: "ART & ARCHITECTURE", hasDropdown: false },
  { name: "ACCESSORIES", hasDropdown: true },
  { name: "EQUIPMENT", hasDropdown: false },
  { name: "ELECTRONICS", hasDropdown: true },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const router = useRouter();

  return (
    <header className="w-full">
      {/* Top Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center justify-between py-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
            
            <div className="flex-shrink-0">
              <div className="w-32 h-10 bg-white rounded-md flex items-center justify-center">
               <Image
                  src="/delmon-logo-only.png"
                  alt="Delmon"
                  width={170}
                  height={60}
                  priority
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2"
              >
                <Search className="w-5 h-5 text-gray-700" />
              </button>
              <button className="relative p-2">
                <ShoppingCart className="w-5 h-5 text-gray-700" />
                <span className="absolute top-0 right-0 bg-green-700 text-white text-[10px] font-medium rounded-full w-4 h-4 flex items-center justify-center">
                  0
                </span>
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          {searchOpen && (
            <div className="lg:hidden pb-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search For Products"
                  className="w-full h-10 px-4 pr-10 bg-white border border-gray-300 rounded-md text-sm placeholder-gray-400"
                />
                <button className="absolute right-0 top-0 h-10 w-10 flex items-center justify-center">
                  <Search className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>
          )}

          {/* Desktop Header */}
          <div className="hidden lg:flex items-center justify-between py-4">
            <div className="flex-shrink-0">
              <div onClick={() => router.push('/')} className="w-48 h-14 bg-white rounded-md flex items-center justify-center border border-gray-200">
                <Image
                  src="/delmon-logo-only.png"
                  alt="Delmon"
                  width={170}
                  height={60}
                  priority
                />
              </div>
            </div>

            <div className="hidden xl:flex items-center gap-3 ml-8">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                <Phone className="w-5 h-5 text-gray-700" />
              </div>
              <div className="flex flex-col">
                <span className="text-gray-900 font-semibold text-base leading-tight">
                  +971 42 88 1400
                </span>
                <span className="text-gray-500 text-xs leading-tight">
                  24/7 Support Center
                </span>
              </div>
            </div>

            <div className="flex-1 max-w-md mx-4 xl:mx-12">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search For Products"
                  className="w-full h-11 px-5 pr-12 bg-white border border-gray-300 rounded-md text-sm placeholder-gray-400"
                />
                <button className="absolute right-0 top-0 h-11 w-11 flex items-center justify-center">
                  <Search className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4 xl:gap-6">
              <button className="hidden xl:flex flex-col items-center gap-1 text-gray-700 hover:text-green-700 min-w-[60px]">
                <Scale className="w-6 h-6" />
                <span className="text-xs font-medium">Compare</span>
              </button>
              <button className="flex flex-col items-center gap-1 text-gray-700 hover:text-green-700 min-w-[60px]">
                <Heart className="w-6 h-6" />
                <span className="text-xs font-medium">Wishlist</span>
              </button>
         <Link href="/account" className="flex flex-col items-center gap-1 text-gray-700 hover:text-green-700 min-w-[60px]">
  <User className="w-6 h-6" />
  <span className="text-xs font-medium">Account</span>
</Link>
              <button className="flex flex-col items-center gap-1 text-gray-700 hover:text-green-700 relative min-w-[60px]">
                <div className="relative">
                  <ShoppingCart className="w-6 h-6" />
                  <span className="absolute -top-2 -right-2 bg-green-700 text-white text-[10px] font-medium rounded-full w-4 h-4 flex items-center justify-center">
                    0
                  </span>
                </div>
                <span className="text-xs font-medium">Cart</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden lg:block bg-[#0d6838]">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex items-center justify-center overflow-x-auto">
            {menuItems.map((item, idx) => (
              <button
                key={idx}
                className="flex items-center gap-1.5 text-white px-3 xl:px-4 py-3.5 text-[13px] font-medium tracking-wide hover:bg-green-800 whitespace-nowrap"
              >
                <span>{item.name}</span>
                {item.hasDropdown && <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200">
          <div className="px-4 py-2">
            {menuItems.map((item, idx) => (
              <button
                key={idx}
                className="w-full flex items-center justify-between py-3 text-gray-900 text-sm font-medium border-b border-gray-100 last:border-0"
              >
                <span>{item.name}</span>
                {item.hasDropdown && <ChevronDown className="w-4 h-4" />}
              </button>
            ))}
            
            <div className="flex items-center gap-4 py-4 border-t border-gray-200 mt-2">
              <button className="flex items-center gap-2 text-gray-700">
                <Scale className="w-5 h-5" />
                <span className="text-sm">Compare</span>
              </button>
              <button className="flex items-center gap-2 text-gray-700">
                <Phone className="w-5 h-5" />
                <span className="text-sm">+971 42 88 1400</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
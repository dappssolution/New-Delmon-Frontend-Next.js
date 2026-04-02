"use client";

import React, { useState } from "react";
import { ChevronRight } from "lucide-react";

const NewsletterBanner = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const subject = "Enquiry from Website";
    const body = `Hello,

My email is: ${email}
I would like to know more about your services.

Thank you.`;

    window.location.href = `mailto:info@newdelmonstationery.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="w-full bg-[#0d6838] relative overflow-hidden my-12 md:my-20">
      {/* Decorative background swashes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-50%] left-[20%] w-full h-[150%] bg-black/5 rounded-full blur-3xl transform rotate-12"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-black/10 rounded-full blur-2xl transform -rotate-12"></div>
      </div>

      <div className="w-full max-w-[1400px] mx-auto flex flex-col lg:flex-row min-h-[400px]">
        
        {/* Left Content Area */}
        <div className="w-full lg:w-[55%] xl:w-[50%] px-6 py-12 md:px-12 lg:py-20 flex flex-col justify-center relative z-10">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
            Join our mailing list to receive future exclusive offers!
          </h2>
          <p className="text-white/80 text-sm md:text-base leading-relaxed mb-8 max-w-lg">
            Stay updated with <span className="font-semibold">Newdelmon Goods Wholesalers LLC</span>. From bulk discounts to special promotions and new product arrivals, get it all delivered straight to your inbox.
          </p>

          <form 
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 sm:gap-0 w-full max-w-lg relative sm:bg-white sm:p-1.5 rounded-lg sm:rounded-full shadow-lg"
          >
            <input
              type="email"
              placeholder="Enter your email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 w-full bg-white sm:bg-transparent px-4 py-3 sm:py-2 text-gray-800 placeholder-gray-400 outline-none rounded-lg sm:rounded-l-full sm:rounded-r-none"
              required
            />

            <button 
              type="submit" 
              className="bg-[#0b5c31] hover:bg-[#094726] sm:bg-[#0d6838] sm:hover:bg-[#0b5c31] text-white font-bold px-6 py-3 rounded-lg sm:rounded-full transition-colors flex items-center justify-center gap-2 group whitespace-nowrap"
            >
              Subscribe
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>

        {/* Right Image Area */}
        <div className="w-full lg:w-[45%] xl:w-[50%] h-[300px] lg:h-auto relative overflow-hidden">
          <div className="absolute inset-0 hidden lg:block z-10 pointer-events-none">
            <svg 
              className="absolute h-full w-32 left-0 top-0 text-[#0d6838]" 
              preserveAspectRatio="none" 
              viewBox="0 0 100 100" 
              fill="currentColor"
            >
              <path d="M0,0 L100,0 C50,50 100,100 0,100 Z" />
            </svg>
          </div>
          
          <img 
            src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=80" 
            alt="Business Office Workspace" 
            className="w-full h-full object-cover"
          />
        </div>

      </div>
    </div>
  );
};

export default NewsletterBanner;
"use client";

import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { Star } from "lucide-react";

const reviews = [
  {
    id: 1,
    name: "Ahmed Mohammed",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    text: "Excellent service and high quality office supplies. Have been relying on Delmon for years for all stationary needs. Delivery is always on time.",
    rating: 5,
    time: "2 days ago",
  },
  {
    id: 2,
    name: "Sarah Jones",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    text: "Very professional team and a great variety of products. Everything from paper to ink cartridges was delivered perfectly packaged.",
    rating: 5,
    time: "1 week ago",
  },
  {
    id: 3,
    name: "Tariq Ali",
    image: "https://randomuser.me/api/portraits/men/85.jpg",
    text: "Top-notch customer support. I had an issue with my order and they resolved it immediately without any hassle. Highly recommended!",
    rating: 5,
    time: "2 weeks ago",
  },
  {
    id: 4,
    name: "Emma Watson",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    text: "Competitive pricing and massive inventory. It's my go-to place for stocking up the office every month.",
    rating: 5,
    time: "1 month ago",
  },
  {
    id: 5,
    name: "Khalid Rahman",
    image: "https://randomuser.me/api/portraits/men/22.jpg",
    text: "Best B2B provider for stationary in the region. Their platform is super easy to use, making reordering a breeze.",
    rating: 5,
    time: "2 months ago",
  },
  {
    id: 6,
    name: "Fatima Al Mansoori",
    image: "https://randomuser.me/api/portraits/women/23.jpg",
    text: "Amazing quality and quick delivery! The team at Delmon always ensures that our office never runs out of essential supplies.",
    rating: 5,
    time: "3 months ago",
  }
];

export default function GoogleReviews() {
  const swiperRef = useRef<any>(null);

  // Google G Logo SVG
  const GoogleLogo = () => (
    <svg width="100%" height="100%" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );

  return (
    <section className="py-12 bg-white overflow-hidden border-t border-gray-100">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-white w-14 h-14 p-2.5 rounded-2xl shadow-sm border border-gray-200 flex items-center justify-center shrink-0">
              <GoogleLogo />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">
                Excellent
              </h2>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="fill-current w-4 h-4 md:w-5 md:h-5 text-amber-500" />
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-600">
                  Based on <strong>450+</strong> reviews on Google
                </span>
              </div>
            </div>
          </div>
          <a href="https://google.com" target="_blank" rel="noopener noreferrer" className="inline-flex w-full md:w-auto justify-center md:justify-start bg-white hover:bg-gray-50 text-sm font-bold text-blue-600 border border-gray-200 px-5 py-2.5 rounded-xl items-center transition-colors shadow-sm">
            Review us on Google
            <svg className="w-4 h-4 ml-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>

        {/* Swiper Slider */}
        <div className="relative -mx-4 sm:mx-0 px-4 sm:px-0">
          <Swiper
            modules={[Autoplay]}
            spaceBetween={20}
            slidesPerView={1.1}
            loop={true}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 20 },
              1024: { slidesPerView: 3, spaceBetween: 24 },
              1280: { slidesPerView: 4, spaceBetween: 24 },
            }}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            className="pb-2"
          >
            {reviews.map((review) => (
              <SwiperSlide key={review.id} className="h-auto">
                <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100 h-full flex flex-col transition-shadow hover:shadow-md cursor-grab active:cursor-grabbing group">
                  
                  {/* Reviewer Info & Rating */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <img src={review.image} alt={review.name} loading="lazy" className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border border-gray-100 shadow-sm" />
                      <div>
                        <h3 className="text-sm font-bold text-gray-900 leading-tight">{review.name}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">{review.time}</p>
                      </div>
                    </div>
                    {/* Tiny Google Icon Top Right */}
                    <div className="w-5 h-5 shrink-0 opacity-80 group-hover:scale-110 transition-transform">
                      <GoogleLogo />
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="flex text-amber-500 mb-3">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="fill-current w-4 h-4 text-amber-500" />
                    ))}
                  </div>

                  {/* Review Text */}
                  <p className="text-sm text-gray-700 leading-relaxed flex-1 line-clamp-4">
                    "{review.text}"
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}

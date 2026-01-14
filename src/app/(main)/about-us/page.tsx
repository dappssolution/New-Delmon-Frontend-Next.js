import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Check, MapPin, Phone, Mail, MessageSquare } from "lucide-react";
import Button from "@/src/components/common/Button";

export const metadata: Metadata = {
    title: "About Us | Delmon",
    description: "Learn more about Delmon - your trusted destination for quality products, curated collections, and a seamless shopping experience.",
};

export default function AboutUsPage() {
    return (
        <div className="bg-white min-h-screen pb-10">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Breadcrumb */}
                <nav className="text-sm text-gray-500 mb-8">
                    <Link href="/" className="hover:text-green-600 transition-colors">
                        Delmon
                    </Link>{" "}
                    &gt;{" "}
                    <Link href="/" className="hover:text-green-600 transition-colors">
                        Home
                    </Link>{" "}
                    &gt; <span className="text-gray-900 font-medium">About Us</span>
                </nav>

                {/* Hero Section */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20 bg-gray-50 rounded-3xl p-8 lg:p-12">
                    <div className="max-w-xl">
                        <h1 className="text-4xl font-bold text-gray-900 mb-6">
                            About Our Store
                        </h1>
                        <p className="text-gray-600 mb-8 leading-relaxed">
                            We're more than an online store - we're your{" "}
                            <span className="font-semibold text-green-600">trusted</span>{" "}
                            destination for quality products, curated collections, and a
                            seamless shopping experience. From everyday essentials to special
                            finds, we bring you products you can rely upon more.
                        </p>

                        <div className="flex flex-wrap gap-4 mb-10">
                            <Link href='/' className="bg-green-700!  hover:bg-green-800! text-white rounded-full px-8 py-2">
                                Shop Now
                            </Link>
                            <Link
                                href='/'
                                className="rounded-full px-8 border-gray-300 border text-black hover:bg-gray-50 py-2"
                            >
                                Explore Categories
                            </Link>
                        </div>

                        <div className="grid grid-cols-3 gap-8">
                            <div className="flex flex-col">
                                <span className="text-3xl font-bold text-gray-900">98%</span>
                                <span className="text-xs text-gray-500 mt-1">
                                    Happy Customers
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-3xl font-bold text-gray-900">50k+</span>
                                <span className="text-xs text-gray-500 mt-1">
                                    Orders Delivered
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-3xl font-bold text-gray-900">500+</span>
                                <span className="text-xs text-gray-500 mt-1">
                                    Quality Products
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="relative h-[400px] w-full rounded-2xl overflow-hidden shadow-lg">
                        <Image
                            src="/about-image-1.jpeg"
                            alt="About Our Store"
                            fill
                            className="object-cover"
                        />
                    </div>
                </section>

                {/* Smart Shopping Section */}
                <section className="bg-gray-50 rounded-3xl p-8 lg:p-12 mb-20">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="relative h-[350px] w-full rounded-2xl overflow-hidden shadow-lg order-2 lg:order-1">
                            <Image
                                src="/about-image-2.jpeg"
                                alt="Smart Shopping"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="order-1 lg:order-2">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                Build for Smart Shopping
                            </h2>
                            <p className="text-gray-600 mb-8 leading-relaxed">
                                Our platform connects customers with carefully selected{" "}
                                <span className="font-semibold text-green-600">products</span>{" "}
                                from trusted brands and vendors. We focus on a quality,
                                affordability, and fast delivery - so shopping stays simple and
                                enjoyable.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex items-center gap-2">
                                    <Check className="w-5 h-5 text-green-600 shrink-0" />
                                    <span className="text-sm font-medium text-gray-700">
                                        Curated & verified products
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Check className="w-5 h-5 text-green-600 shrink-0" />
                                    <span className="text-sm font-medium text-gray-700">
                                        Secure Payments
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Check className="w-5 h-5 text-green-600 shrink-0" />
                                    <span className="text-sm font-medium text-gray-700">
                                        Fast & reliable delivery
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Check className="w-5 h-5 text-green-600 shrink-0" />
                                    <span className="text-sm font-medium text-gray-700">
                                        Easy return & support
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Why Choose Us */}
                <section className="mb-20 bg-gray-50 rounded-3xl p-8 lg:p-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8">
                        Why Choose Us
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left Column */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 bg-gray-100/50 p-4 rounded-lg">
                                <div className="w-6 h-6 rounded flex items-center justify-center">
                                    <Check className="w-5 h-5 text-green-600" />
                                </div>
                                <span className="text-gray-700 font-medium">Premium quality products</span>
                            </div>
                            <div className="flex items-center gap-3 bg-gray-100/50 p-4 rounded-lg">
                                <div className="w-6 h-6 rounded flex items-center justify-center">
                                    <Check className="w-5 h-5 text-green-600" />
                                </div>
                                <span className="text-gray-700 font-medium">Trusted brands & vendors</span>
                            </div>
                            <div className="flex items-center gap-3 bg-gray-100/50 p-4 rounded-lg">
                                <div className="w-6 h-6 rounded flex items-center justify-center">
                                    <Check className="w-5 h-5 text-green-600" />
                                </div>
                                <span className="text-gray-700 font-medium">Safe & secure checkout</span>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 bg-gray-100/50 p-4 rounded-lg">
                                <div className="w-6 h-6 rounded flex items-center justify-center">
                                    <Check className="w-5 h-5 text-green-600" />
                                </div>
                                <span className="text-gray-700 font-medium">Transparent pricing</span>
                            </div>
                            <div className="flex items-center gap-3 bg-gray-100/50 p-4 rounded-lg">
                                <div className="w-6 h-6 rounded flex items-center justify-center">
                                    <Check className="w-5 h-5 text-green-600" />
                                </div>
                                <span className="text-gray-700 font-medium">Quick order processing</span>
                            </div>
                            <div className="flex items-center gap-3 bg-gray-100/50 p-4 rounded-lg">
                                <div className="w-6 h-6 rounded flex items-center justify-center">
                                    <Check className="w-5 h-5 text-green-600" />
                                </div>
                                <span className="text-gray-700 font-medium">Customer-first support</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Meet Our Team */}
                <section className="mb-20 bg-gray-50 rounded-3xl p-8 lg:p-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-12 text-center">
                        Meet Our Team
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center justify-center mb-10 max-w-4xl mx-auto">
                        <div className="text-center md:col-span-2 lg:col-span-2 flex flex-col items-center">
                            <p className="text-gray-500 mb-8 text-center max-w-2xl">
                                Get to know the dedicated people behind our store who ensure a seamless shopping experience from start to finish
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap justify-center items-end gap-8 max-w-5xl mx-auto">
                        <div className="group text-center w-full md:w-[280px]">
                            <div className="relative w-full h-80 mb-4 rounded-xl overflow-hidden bg-gray-100">
                                <Image
                                    src="/about-image-3.jpeg"
                                    alt="Founder & CEO"
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                            <h3 className="font-bold text-lg text-gray-900">Founder & CEO</h3>
                        </div>
                        <div className="group text-center w-full md:w-[240px]">
                            <div className="relative w-full h-64 mb-4 rounded-xl overflow-hidden bg-gray-100">
                                <Image
                                    src="/about-image-4.jpeg"
                                    alt="Marketing"
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                            <h3 className="font-bold text-lg text-gray-900">Marketing</h3>
                        </div>
                        <div className="group text-center w-full md:w-[240px]">
                            <div className="relative w-full h-64 mb-4 rounded-xl overflow-hidden bg-gray-100">
                                <Image
                                    src="/about-image-5.jpeg"
                                    alt="Sales"
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                            <h3 className="font-bold text-lg text-gray-900">Sales</h3>
                        </div>
                    </div>
                </section>

                {/* Our Promise */}
                <section className="mb-20">
                    <div className="bg-gray-50 rounded-3xl p-12 text-center max-w-4xl mx-auto">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            Our Promise to You
                        </h2>
                        <p className="text-gray-600 text-sm leading-relaxed max-w-2xl mx-auto">
                            We are committed to delivering quality, value, and trust in every
                            order. From browsing to delivery, we ensure smooth and reliable
                            experience
                        </p>
                    </div>
                </section>

                {/* Get in Touch */}
                <section className="max-w-5xl mx-auto text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Get in Touch
                    </h2>
                    <p className="text-gray-500 text-sm mb-12 max-w-2xl mx-auto">
                        Have questions about our products or services? Our team is here to assist you with anything you need. Reach out to us through any of the channels below.
                    </p>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 h-[300px] w-full rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                            <iframe
                                title="Delmon Location"
                                src="https://www.google.com/maps?q=RTA%20Customer%20Happiness%20Center%20Umm%20Ramool%20Rashidiya&output=embed"
                                className="w-full h-full border-0"
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </div>


                        <div className="flex flex-col justify-center space-y-6 text-left">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center shrink-0">
                                    <MapPin className="w-5 h-5 text-gray-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-900 font-medium">Near RTA Customer Happiness Center, Umm Ramool, Rashidiya</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center shrink-0">
                                    <Phone className="w-5 h-5 text-gray-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-900 font-medium">+971 42 88 1400</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center shrink-0">
                                    <Mail className="w-5 h-5 text-gray-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-900 font-medium">info@newdelmonstationery.com</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center shrink-0">
                                    <MessageSquare className="w-5 h-5 text-gray-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-900 font-medium">+971 55 861 7340</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

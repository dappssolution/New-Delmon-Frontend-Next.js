"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/src/hooks/useRedux';
import { updateVendorProfile } from '@/src/redux/vendor/vendorThunk';
import { Upload, User, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { fetchUserProfile } from '@/src/redux/auth/authThunk';

export default function VendorProfilePage() {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);
    const { profileLoading, error } = useAppSelector((state) => state.vendor);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        username: '',
        address: '',
        vendor_join: '',
        vendor_short_info: '',
    });
    const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
    const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!user) {
            dispatch(fetchUserProfile());
        }
    }, [dispatch, user]);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                username: (user as any).username || '',
                address: (user as any).address || '',
                vendor_join: (user as any).vendor_join || '',
                vendor_short_info: (user as any).vendor_short_info || '',
            });
            if ((user as any).photo) {
                const photoUrl = (user as any).photo.startsWith('http')
                    ? (user as any).photo
                    : `${process.env.NEXT_PUBLIC_IMAGE_BASE}/upload/vendor_images/${(user as any).photo}`;
                setPreviewPhoto(photoUrl);
            }
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedPhoto(file);
            setPreviewPhoto(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const data = new FormData();
        data.append('name', formData.name);
        data.append('email', formData.email);
        data.append('phone', formData.phone);
        data.append('username', formData.username);
        data.append('address', formData.address);
        data.append('vendor_join', formData.vendor_join);
        data.append('vendor_short_info', formData.vendor_short_info);

        if (selectedPhoto) {
            data.append('photo', selectedPhoto);
        }

        await dispatch(updateVendorProfile(data));
        dispatch(fetchUserProfile());
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="max-w-full mx-auto">
            <div className="bg-white rounded-2xl border border-green-700 shadow-sm p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Profile Card */}
                    <div className="lg:col-span-1">
                        <div className="border border-green-700 rounded-xl p-6">
                            {/* Profile Image */}
                            <div className="flex justify-center mb-4 relative group">
                                <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                                    {previewPhoto ? (
                                        <Image
                                            src={previewPhoto}
                                            alt="Profile Preview"
                                            width={96}
                                            height={96}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <User className="w-12 h-12 text-gray-400" />
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={triggerFileInput}
                                    className="absolute bottom-0 right-1/2 translate-x-12 p-1.5 bg-[#0d6838] text-white rounded-full hover:bg-green-800 transition-colors shadow-sm"
                                >
                                    <Upload className="w-3 h-3" />
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    className="hidden"
                                />
                            </div>

                            {/* Vendor Info */}
                            <div className="text-center mb-6">
                                <h3 className="text-base font-semibold text-gray-900 mb-1">
                                    {formData.name || 'Vendor Name'}
                                </h3>
                                <p className="text-sm text-gray-600">{formData.email}</p>
                            </div>

                            {/* Social LinksPlaceholder - Data source to be added later if available in API */}
                            <div className="space-y-3 border-t border-gray-200 pt-4">
                                <div className="flex items-center justify-between py-2">
                                    <span className="text-sm font-medium text-gray-700">Website</span>
                                    <span className="text-sm text-gray-600">http://example.com</span>
                                </div>
                                <div className="flex items-center justify-between py-2">
                                    <span className="text-sm font-medium text-gray-700">Twitter</span>
                                    <span className="text-sm text-gray-600">@vendor</span>
                                </div>
                                <div className="flex items-center justify-between py-2">
                                    <span className="text-sm font-medium text-gray-700">Instagram</span>
                                    <span className="text-sm text-gray-600">@vendor</span>
                                </div>
                                <div className="flex items-center justify-between py-2">
                                    <span className="text-sm font-medium text-gray-700">Facebook</span>
                                    <span className="text-sm text-gray-600">@vendor</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* FORM */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* INPUT FIELD TEMPLATE */}
              {[
                ["username", "User name"],
                ["name", "Shop name"],
                ["phone", "Phone"],
                ["address", "Address"],
              ].map(([key, label]) => (
                <div key={key} className="grid sm:grid-cols-3 gap-4 items-center">
                  <label className="text-sm font-medium text-gray-900">
                    {label}
                  </label>
                  <input
                    type="text"
                    name={key}
                    value={(formData as any)[key]}
                    onChange={handleChange}
                    className="sm:col-span-2 w-full px-4 py-2.5 border border-green-700 rounded-lg text-sm bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#0d6838]"
                  />
                </div>
              ))}

              {/* EMAIL */}
              <div className="grid sm:grid-cols-3 gap-4 items-center">
                <label className="text-sm font-medium text-gray-900">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="sm:col-span-2 w-full px-4 py-2.5 border border-green-700 rounded-lg text-sm bg-gray-50 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#0d6838]"
                />
              </div>

              {/* VENDOR JOIN */}
              <div className="grid sm:grid-cols-3 gap-4 items-center">
                <label className="text-sm font-medium text-gray-900">
                  Vendor join
                </label>
                <select
                  name="vendor_join"
                  value={formData.vendor_join}
                  onChange={handleChange}
                  className="sm:col-span-2 w-full px-4 py-2.5 border border-green-700 rounded-lg text-sm bg-white text-gray-900 focus:ring-2 focus:ring-[#0d6838]"
                >
                  <option value="">Select Year</option>
                  {Array.from({ length: 15 }, (_, i) => {
                    const year = new Date().getFullYear() - i;
                    return <option key={year} value={year}>{year}</option>;
                  })}
                </select>
              </div>

              {/* VENDOR INFO */}
              <div className="grid sm:grid-cols-3 gap-4 items-start">
                <label className="text-sm font-medium text-gray-900 pt-2">
                  Vendor info
                </label>
                <textarea
                  name="vendor_short_info"
                  value={formData.vendor_short_info}
                  onChange={handleChange}
                  rows={3}
                  className="sm:col-span-2 w-full px-4 py-2.5 border border-green-700 rounded-lg text-sm bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#0d6838] resize-none"
                />
              </div>

              {/* SUBMIT */}
              <div className="grid sm:grid-cols-3 gap-4 pt-4">
                <div />
                <button
                  type="submit"
                  disabled={profileLoading}
                  className="sm:col-span-2 px-6 py-2.5 bg-[#0d6838] text-white rounded-lg flex items-center gap-2"
                >
                  {profileLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Save Changes
                </button>
              </div>
            </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

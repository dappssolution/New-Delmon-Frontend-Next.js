"use client";

import { AppDispatch, RootState } from '@/src/redux/store';
import { clearUserMessage } from '@/src/redux/user/userSlice';
import { updateUserPassword } from '@/src/redux/user/userThunk';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Eye, EyeOff } from "lucide-react";

export default function ChangePasswordPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, successMessage } = useSelector((state: RootState) => state.user);

  const [formData, setFormData] = useState({
    oldpassword: "",
    newpassword: "",
    newpassword_confirmation: ""
  });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    return () => {
      dispatch(clearUserMessage());
    };
  }, [dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(updateUserPassword(formData));
    setFormData({
      oldpassword: "",
      newpassword: "",
      newpassword_confirmation: ""
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Change Password</h2>
      </div>

      {successMessage && (
        <div className="p-3 bg-green-50 text-green-700 text-sm rounded-md border border-green-200">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 max-w-3xl text-gray-900">
        <div className="relative">
          <label htmlFor="oldpassword" className="block text-sm font-medium text-gray-700 mb-2">
            Old Password*
          </label>
          <div className="relative">
            <input
              type={showOldPassword ? "text" : "password"}
              id="oldpassword"
              name="oldpassword"
              value={formData.oldpassword}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-600 transition-colors pr-12"
            />
            <button
              type="button"
              onClick={() => setShowOldPassword(!showOldPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              {showOldPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="relative">
          <label htmlFor="newpassword" className="block text-sm font-medium text-gray-700 mb-2">
            New Password*
          </label>
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              id="newpassword"
              name="newpassword"
              value={formData.newpassword}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-600 transition-colors pr-12"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="relative">
          <label htmlFor="newpassword_confirmation" className="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password*
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="newpassword_confirmation"
              name="newpassword_confirmation"
              value={formData.newpassword_confirmation}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-600 transition-colors pr-12"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-green-700 text-white font-medium px-8 py-3 rounded-full hover:bg-green-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : "Save Change"}
          </button>
        </div>
      </form>
    </div>
  );
}
"use client";

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from "@/src/redux/store";
import FormInput from "@/src/components/common/FormInput";
import Button from "@/src/components/common/Button";
import { updateUserPassword } from "@/src/redux/user/userThunk";
import { clearUserMessage } from "@/src/redux/user/userSlice";

export default function ChangePasswordPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, successMessage } = useSelector((state: RootState) => state.user);

  const [formData, setFormData] = useState({
    current_password: "",
    password: "",
    password_confirmation: ""
  });

  // Clear messages on unmount
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
  };

  return (
    <div className="space-y-6 max-w-lg">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Change Password</h2>
        <p className="text-gray-500 text-sm mt-1">Ensure your account is using a long, random password to stay secure.</p>
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

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput
          name="current_password"
          type="password"
          label="Current Password"
          placeholder="Enter current password"
          value={formData.current_password}
          onChange={handleChange}
          required
        />
        <FormInput
          name="password"
          type="password"
          label="New Password"
          placeholder="Enter new password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <FormInput
          name="password_confirmation"
          type="password"
          label="Confirm Password"
          placeholder="Confirm new password"
          value={formData.password_confirmation}
          onChange={handleChange}
          required
        />

        <div className="pt-2">
          <Button loading={loading} type="submit">
            Update Password
          </Button>
        </div>
      </form>
    </div>
  );
}

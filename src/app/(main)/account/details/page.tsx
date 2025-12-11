"use client";

import { useEffect } from "react";
import { RootState, AppDispatch } from "@/src/redux/store";
import { useSelector, useDispatch } from "react-redux";
import FormInput from "@/src/components/common/FormInput";
import Button from "@/src/components/common/Button";
import { fetchUserProfile } from "@/src/redux/user/userThunk";

export default function AccountDetailsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { profile, loading } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const fetchProfile = async () => {
      await dispatch(fetchUserProfile());
    }
    fetchProfile();
  }, [dispatch]);

  /* 
     Using key={profile?.id} to force re-render inputs when profile loads, 
     ensuring defaultValue is populated correctly.
  */
  const key = profile ? profile.id : "loading";

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Account Details</h2>
        <p className="text-gray-500 text-sm mt-1">Manage your profile information.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4" key={key}>
        <FormInput
          name="username"
          label="User Name"
          defaultValue={profile?.username}
          disabled={loading}
        />
        <FormInput
          name="name"
          label="Full Name"
          placeholder="Enter your full name"
          defaultValue={profile?.name}
          disabled={loading}
        />
        <FormInput
          name="email"
          label="Email Address"
          type="email"
          defaultValue={profile?.email}
          disabled
          className="bg-gray-50"
        />
        <FormInput
          name="phone"
          label="Phone Number"
          type="tel"
          defaultValue={profile?.phone}
          disabled={loading}
        />
        <div className="md:col-span-2">
          <FormInput
            name="address"
            label="Address"
            placeholder="Enter your address"
            defaultValue={profile?.address}
            disabled={loading}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Profile Picture
          </label>
          <input
            type="file"
            className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-black file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
            disabled={loading}
          />
        </div>
      </div>

      <div className="pt-4">
        <Button loading={loading}>
          Save Changes
        </Button>
      </div>
    </div>
  );
}

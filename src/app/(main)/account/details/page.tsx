"use client";

import { fetchUserProfile, updateUserProfile } from "@/src/redux/user/userThunk";
import { AppDispatch, RootState } from "@/src/redux/store";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";
import { clearUserMessage } from "@/src/redux/user/userSlice";

export default function AccountDetailsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { profile, loading, successMessage, error } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const fetchProfile = async () => {
      await dispatch(fetchUserProfile());
    };
    fetchProfile();
  }, [dispatch]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearUserMessage());
    }
    if (error) {
      toast.error(error);
      dispatch(clearUserMessage());
    }
  }, [successMessage, error, dispatch]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    // Create a new FormData to ensure correct keys for API
    const apiFormData = new FormData();
    apiFormData.append("username", formData.get("username") as string);
    apiFormData.append("name", formData.get("fullname") as string);
    apiFormData.append("phone", formData.get("phone") as string);
    apiFormData.append("address", formData.get("address") as string);
    if (profile?.email) {
  apiFormData.append("email", profile.email);
}


    const photoFile = formData.get("photo");
    if (photoFile && (photoFile as File).size > 0) {
      apiFormData.append("photo", photoFile);
    }

    dispatch(updateUserProfile(apiFormData));
  };

  const key = profile ? profile.id : "loading";

  return (
    <div className="space-y-6">
      {/* ✅ Corrected heading */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Account Details
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Update your personal information and contact details
        </p>
      </div>

      <form className="space-y-5 max-w-3xl text-gray-900" key={key} onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              User Name *
            </label>
            <input
              type="text"
              id="username"
              name="username"
              defaultValue={profile?.username}
              disabled={loading}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-600 transition-colors disabled:bg-gray-50"
            />
          </div>

          <div>
            <label
              htmlFor="fullname"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Full Name *
            </label>
            <input
              type="text"
              id="fullname"
              name="fullname"
              defaultValue={profile?.name}
              disabled={loading}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-600 transition-colors disabled:bg-gray-50"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            defaultValue={profile?.email}
            disabled
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Phone Number *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            defaultValue={profile?.phone}
            disabled={loading}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-600 transition-colors disabled:bg-gray-50"
          />
        </div>

        <div>
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Address *
          </label>
          <textarea
            id="address"
            name="address"
            rows={3}
            defaultValue={profile?.address}
            disabled={loading}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-600 transition-colors disabled:bg-gray-50 resize-none"
          />
        </div>

        <div>
          <label
            htmlFor="photo"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Profile Photo
          </label>
          <input
            type="file"
            id="photo"
            name="photo"
            disabled={loading}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100 disabled:bg-gray-50"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-green-700 text-white font-medium px-8 py-3 rounded-lg hover:bg-green-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

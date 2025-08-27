"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getProfile, updateProfile } from "@/redux/slice/userSlice";

export default function UpdateProfileCard() {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.user);

 
  const [activeTab, setActiveTab] = useState("account");

  
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState(null);

 
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
    }
  }, [user]);

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("phone", phone);
    if (avatar) {
      formData.append("avatar", avatar);
    }
    dispatch(updateProfile(formData));
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    
    console.log("Password Change Request:", { currentPassword, newPassword });
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-6">
      
      <div className="flex border-b mb-6 space-x-6">
        <button
          onClick={() => setActiveTab("account")}
          className={`pb-2 text-sm font-medium ${
            activeTab === "account"
              ? "border-b-2 border-teal-500 text-teal-600"
              : "text-gray-500"
          }`}
        >
          Account
        </button>
        <button
          onClick={() => setActiveTab("security")}
          className={`pb-2 text-sm font-medium ${
            activeTab === "security"
              ? "border-b-2 border-teal-500 text-teal-600"
              : "text-gray-500"
          }`}
        >
          Security
        </button>
      </div>

     
      {activeTab === "account" && (
        <div className="flex space-x-8">
          
          <div className="flex-1">
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                />
              </div>

      
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="text"
                  value={user?.email || ""}
                  disabled
                  className="mt-1 block w-full rounded-md border border-gray-200 bg-gray-100 px-3 py-2 sm:text-sm"
                />
              </div>

           
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                />
              </div>

              
              <button
                type="submit"
                className="mt-4 bg-teal-600 text-white px-4 py-2 rounded-md shadow hover:bg-teal-700"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Profile"}
              </button>
            </form>
          </div>

          
          <div className="flex flex-col items-center space-y-3">
            <span className="text-sm font-medium text-gray-700">
              Your Profile Picture
            </span>
            <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer relative">
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => setAvatar(e.target.files[0])}
              />
              {avatar ? (
                <img
                  src={URL.createObjectURL(avatar)}
                  alt="preview"
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <p className="text-gray-400 text-sm">Upload your photo</p>
              )}
            </div>
            {user?.avatar?.secure_url && !avatar && (
              <img
                src={user.avatar.secure_url}
                alt="current avatar"
                className="w-20 h-20 rounded-full border"
              />
            )}
          </div>
        </div>
      )}

      
      {activeTab === "security" && (
        <div className="max-w-md">
          <form onSubmit={handleChangePassword} className="space-y-4">
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
              />
            </div>

           
            <div>
              <label className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
              />
            </div>

            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
              />
            </div>

            <button
              type="submit"
              className="mt-4 bg-teal-600 text-white px-4 py-2 rounded-md shadow hover:bg-teal-700"
            >
              Change Password
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

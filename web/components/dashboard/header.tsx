"use client";

import Link from "next/link";
import { Plane, LogOut, Settings, User, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/lib/api/dashboard";
import { tokenStorage } from "@/lib/token-storage";
import { getProfileImage } from "@/lib/utils/url-utils";
import { useState, useEffect } from "react";

export function DashboardHeader() {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const { data: profile, isLoading, error } = useQuery({
    queryKey: ["profile"],
    queryFn: () => dashboardApi.getProfile(),
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Load profile image when profile data is fetched
  useEffect(() => {
    if (profile) {
      const storedImage = getProfileImage(`profile_image_${profile.id}`);
      if (storedImage) {
        setProfileImage(storedImage);
      }
    }
  }, [profile]);

  const handleLogout = () => {
    // Clear tokens
    tokenStorage.clearTokens();
    router.push("/auth/login");
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl">
          <div className="w-8 h-8 bg-linear-to-br from-[#2A8C9D] to-[#1D7A89] rounded-lg flex items-center justify-center">
            <Plane className="w-5 h-5 text-white" />
          </div>
          <span className="text-[#180D39]">SkyMail</span>
        </Link>

        {/* Right Section */}
        <div className="flex items-center gap-6">
          {/* Welcome Message */}
          <div>
            <p className="text-sm text-gray-500">Welcome back,</p>
            <p className="text-sm font-semibold text-[#180D39]">
              {isLoading ? "Loading..." : error ? "User" : profile?.company_name || "User"}
            </p>
          </div>

          {/* User Menu with Avatar */}
          <div className="flex items-center gap-3 relative">
            {/* Settings */}
            <Link
              href="/dashboard/settings"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Settings"
            >
              <Settings className="w-5 h-5 text-gray-600" />
            </Link>

            {/* Profile Avatar with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center justify-center rounded-full hover:ring-2 hover:ring-teal-400 transition-all shadow-md shrink-0 w-10 h-10"
                title={profile?.company_name || "Profile"}
              >
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt={profile?.company_name || "Profile"}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 bg-linear-to-br from-teal-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {isLoading ? "..." : profile?.company_name?.charAt(0)?.toUpperCase() || "C"}
                  </div>
                )}
              </button>

              {/* Dropdown Menu */}
              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                  <Link
                    href="/dashboard/profile"
                    onClick={() => setShowMenu(false)}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition-colors"
                  >
                    <User className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-700">My Profile</span>
                  </Link>
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      handleLogout();
                    }}
                    className="w-full text-left flex items-center gap-3 px-4 py-2 hover:bg-red-50 transition-colors border-t border-gray-200"
                  >
                    <LogOut className="w-4 h-4 text-red-600" />
                    <span className="text-sm text-red-600">Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

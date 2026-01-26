"use client";

import { DashboardHeader } from "@/components/dashboard/header";
import { Sidebar } from "@/components/dashboard/sidebar";
import { ProfileEditor } from "@/components/profile/profile-editor";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <div className="flex">
        <Sidebar />

        <main className="flex-1">
          <div className="p-6 lg:p-8">
            <div className="mb-8">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-[#2A8C9D] hover:text-[#1D7A89] mb-4"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Overview
              </Link>
              <h1 className="text-3xl font-bold text-[#180D39]">My Profile</h1>
              <p className="text-gray-600 mt-2">Manage your company information</p>
            </div>

            <ProfileEditor />
          </div>
        </main>
      </div>
    </div>
  );
}


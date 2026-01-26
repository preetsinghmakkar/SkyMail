"use client";

import { DashboardHeader } from "@/components/dashboard/header";
import { Sidebar } from "@/components/dashboard/sidebar";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
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
              <h1 className="text-3xl font-bold text-[#180D39]">Settings</h1>
              <p className="text-gray-600 mt-2">Manage your account and preferences</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
              <h2 className="text-2xl font-bold text-[#180D39] mb-4">Settings Coming Soon</h2>
              <p className="text-gray-600 mb-6">
                Manage your profile, security settings, integrations, and preferences.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

"use client";

import { DashboardHeader } from "@/components/dashboard/header";
import { Sidebar } from "@/components/dashboard/sidebar";
import { DashboardStats } from "@/components/dashboard/stats";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { RecentCampaigns } from "@/components/dashboard/recent-campaigns";
import { TemplatesSection } from "@/components/dashboard/templates-section";
import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/lib/api/dashboard";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: () => dashboardApi.getProfile(),
  });

  const { data: campaigns, isLoading: campaignsLoading } = useQuery({
    queryKey: ["campaigns"],
    queryFn: () => dashboardApi.getCampaigns(100, 0),
  });

  const { data: templates, isLoading: templatesLoading } = useQuery({
    queryKey: ["templates"],
    queryFn: () => dashboardApi.getTemplates(100, 1),
  });

  const sentCampaigns = campaigns?.campaigns.filter((c) => c.status === "sent").length || 0;
  const isLoading = profileLoading || campaignsLoading || templatesLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#2A8C9D] animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <div className="flex">
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1">
          <div className="p-6 lg:p-8">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-[#180D39] mb-2">Welcome back!</h1>
              <p className="text-gray-600">
                Here's an overview of your newsletter campaigns and subscribers.
              </p>
            </div>

            {/* Stats */}
            <DashboardStats
              subscribers={profile?.subscriber_count || 0}
              totalCampaigns={campaigns?.total || 0}
              sentCampaigns={sentCampaigns}
              templates={templates?.total || 0}
            />

            {/* Quick Actions */}
            <QuickActions />

            {/* Recent Data */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RecentCampaigns />
              <TemplatesSection />
            </div>

            {/* Premium Banner */}
            {!profile?.is_premium && (
              <div className="mt-8 bg-gradient-to-r from-[#2A8C9D] to-[#1D7A89] rounded-xl p-6 text-white">
                <h3 className="text-xl font-bold mb-2">Upgrade to Premium</h3>
                <p className="text-white/90 mb-4">
                  Get unlimited subscribers, advanced analytics, and priority support.
                </p>
                <button className="bg-white text-[#2A8C9D] px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Upgrade Now
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

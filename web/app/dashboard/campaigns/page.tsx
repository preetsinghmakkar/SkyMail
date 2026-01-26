"use client";

import { DashboardHeader } from "@/components/dashboard/header";
import { Sidebar } from "@/components/dashboard/sidebar";
import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import apiClient from "@/lib/api-client";

interface Campaign {
  id: string;
  name: string;
  subject: string;
  status: string;
  scheduled_for?: string;
  sent_at?: string;
  created_at: string;
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await apiClient.get("/api/campaigns");
        
        // Handle different response formats
        let campaignsList: Campaign[] = [];
        
        if (response.data && Array.isArray(response.data.campaigns)) {
          campaignsList = response.data.campaigns;
        } else if (response.data && Array.isArray(response.data)) {
          campaignsList = response.data;
        } else if (Array.isArray(response.data)) {
          campaignsList = response.data;
        }
        
        setCampaigns(campaignsList);
      } catch (error) {
        console.error("Failed to fetch campaigns:", error);
        setCampaigns([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
      draft: { bg: "bg-gray-100", text: "text-gray-700", label: "Draft" },
      scheduled: { bg: "bg-blue-100", text: "text-blue-700", label: "Scheduled" },
      sending: { bg: "bg-yellow-100", text: "text-yellow-700", label: "Sending" },
      sent: { bg: "bg-green-100", text: "text-green-700", label: "Sent" },
      cancelled: { bg: "bg-red-100", text: "text-red-700", label: "Cancelled" },
    };

    const config = statusConfig[status] || statusConfig.draft;
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

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
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-[#180D39]">Campaigns</h1>
                  <p className="text-gray-600 mt-2">Create and manage your email campaigns</p>
                </div>
                <Link href="/dashboard/campaigns/create">
                  <button className="bg-[#2A8C9D] hover:bg-[#1D7A89] text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Create Campaign
                  </button>
                </Link>
              </div>
            </div>

            {isLoading ? (
              <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
                <div className="text-gray-500">Loading campaigns...</div>
              </div>
            ) : campaigns.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
                <h2 className="text-2xl font-bold text-[#180D39] mb-4">No Campaigns Yet</h2>
                <p className="text-gray-600 mb-6">
                  Create your first campaign to start sending targeted emails.
                </p>
                <Link href="/dashboard/campaigns/create">
                  <button className="bg-[#2A8C9D] hover:bg-[#1D7A89] text-white px-6 py-2 rounded-lg font-medium inline-flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Create Campaign
                  </button>
                </Link>
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left py-4 px-6 font-bold text-[#180D39]">Name</th>
                        <th className="text-left py-4 px-6 font-bold text-[#180D39]">Subject</th>
                        <th className="text-left py-4 px-6 font-bold text-[#180D39]">Status</th>
                        <th className="text-left py-4 px-6 font-bold text-[#180D39]">Created</th>
                        <th className="text-left py-4 px-6 font-bold text-[#180D39]">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {campaigns.map((campaign, index) => (
                        <tr
                          key={campaign.id}
                          className={index !== campaigns.length - 1 ? "border-b border-gray-100" : ""}
                        >
                          <td className="py-4 px-6 text-[#180D39] font-medium">{campaign.name}</td>
                          <td className="py-4 px-6 text-gray-600 truncate max-w-xs">{campaign.subject}</td>
                          <td className="py-4 px-6">{getStatusBadge(campaign.status)}</td>
                          <td className="py-4 px-6 text-gray-600 text-sm">{formatDate(campaign.created_at)}</td>
                          <td className="py-4 px-6">
                            <Link href={`/dashboard/campaigns/${campaign.id}`}>
                              <button className="text-[#2A8C9D] hover:text-[#1D7A89] font-medium">
                                View
                              </button>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

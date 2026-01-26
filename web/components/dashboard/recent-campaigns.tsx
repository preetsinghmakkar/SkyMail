"use client";

import Link from "next/link";
import { Clock, Send, AlertCircle, CheckCircle, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/lib/api/dashboard";
import { Loader2 } from "lucide-react";

export function RecentCampaigns() {
  const { data, isLoading } = useQuery({
    queryKey: ["campaigns"],
    queryFn: () => dashboardApi.getCampaigns(5, 0),
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Clock className="w-4 h-4 text-blue-600" />;
      case "sent":
        return <Send className="w-4 h-4 text-green-600" />;
      case "draft":
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case "sending":
        return <CheckCircle className="w-4 h-4 text-purple-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "sent":
        return "bg-green-50 text-green-700 border-green-200";
      case "draft":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "sending":
        return "bg-purple-50 text-purple-700 border-purple-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[#180D39]">Recent Campaigns</h2>
        <Link
          href="/dashboard/campaigns"
          className="text-[#2A8C9D] hover:text-[#1D7A89] font-medium flex items-center gap-1"
        >
          View All <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 text-[#2A8C9D] animate-spin" />
        </div>
      ) : data && data.campaigns && data.campaigns.length > 0 ? (
        <div className="space-y-3">
          {data.campaigns.map((campaign) => (
            <Link
              key={campaign.id}
              href={`/dashboard/campaigns/${campaign.id}`}
              className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-200"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="p-2 bg-[#2A8C9D]/10 rounded-lg">
                  {getStatusIcon(campaign.status)}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-[#180D39]">{campaign.name}</h3>
                  <p className="text-sm text-gray-500">{formatDate(campaign.created_at)}</p>
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                  campaign.status
                )}`}
              >
                {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 mb-4">No campaigns yet</p>
          <Link
            href="/dashboard/campaigns"
            className="text-[#2A8C9D] hover:text-[#1D7A89] font-medium"
          >
            Create your first campaign →
          </Link>
        </div>
      )}
    </div>
  );
}

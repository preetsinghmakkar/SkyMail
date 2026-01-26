"use client";

import { useState, useEffect } from "react";
import { DashboardHeader } from "@/components/dashboard/header";
import { Sidebar } from "@/components/dashboard/sidebar";
import { ArrowLeft, Calendar, AlertCircle } from "lucide-react";
import Link from "next/link";
import apiClient from "@/lib/api-client";
import { useParams } from "next/navigation";

interface Campaign {
  id: string;
  name: string;
  subject: string;
  template_id: string;
  status: string;
  constants_values: Record<string, string>;
  scheduled_for: string;
  sent_at?: string;
  created_at: string;
  send_timezone?: string;
}

interface Template {
  id: string;
  name: string;
  constants: string[];
}

export default function CampaignDetailsPage() {
  const params = useParams();
  const campaignId = params.id as string;

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [template, setTemplate] = useState<Template | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCampaignData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch campaign details
        const campaignResponse = await apiClient.get(`/api/campaigns/${campaignId}`);
        setCampaign(campaignResponse.data);

        // Fetch template details
        if (campaignResponse.data.template_id) {
          try {
            const templateResponse = await apiClient.get(
              `/api/newsletters/templates/${campaignResponse.data.template_id}`
            );
            setTemplate(templateResponse.data);
          } catch (err) {
            console.error("Failed to fetch template:", err);
          }
        }
      } catch (err: any) {
        console.error("Failed to fetch campaign:", err);
        setError(err.response?.data?.detail || "Failed to load campaign details");
      } finally {
        setIsLoading(false);
      }
    };

    if (campaignId) {
      fetchCampaignData();
    }
  }, [campaignId]);

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
      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6 lg:p-8">
            <div className="text-center py-12">
              <div className="text-gray-500">Loading campaign details...</div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6 lg:p-8">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-red-900">Failed to load campaign</h3>
                <p className="text-red-700 mt-1">{error || "Campaign not found"}</p>
              </div>
            </div>
            <div className="mt-4">
              <Link
                href="/dashboard/campaigns"
                className="text-[#2A8C9D] hover:text-[#1D7A89] font-medium"
              >
                Back to Campaigns
              </Link>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <div className="flex">
        <Sidebar />

        <main className="flex-1">
          <div className="p-6 lg:p-8">
            <div className="mb-8">
              <Link
                href="/dashboard/campaigns"
                className="flex items-center gap-2 text-[#2A8C9D] hover:text-[#1D7A89] mb-4"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Campaigns
              </Link>
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-[#180D39]">{campaign.name}</h1>
                  <p className="text-gray-600 mt-2">Campaign ID: {campaign.id}</p>
                </div>
                <div>{getStatusBadge(campaign.status)}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Campaign Details Card */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h2 className="text-xl font-bold text-[#180D39] mb-6">Campaign Details</h2>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Template</p>
                      <p className="font-medium text-[#180D39]">{template?.name || "Unknown"}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 mb-1">Status</p>
                      <p className="font-medium text-[#180D39]">{campaign.status}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 mb-1">Email Subject</p>
                      <p className="font-medium text-[#180D39]">{campaign.subject}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 mb-1">Created</p>
                      <p className="font-medium text-[#180D39]">{formatDate(campaign.created_at)}</p>
                    </div>

                    {campaign.scheduled_for && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Scheduled For</p>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-600" />
                          <p className="font-medium text-[#180D39]">
                            {formatDate(campaign.scheduled_for)}
                            {campaign.send_timezone && campaign.send_timezone !== "UTC" && (
                              <span className="text-gray-600"> ({campaign.send_timezone})</span>
                            )}
                          </p>
                        </div>
                      </div>
                    )}

                    {campaign.sent_at && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Sent At</p>
                        <p className="font-medium text-[#180D39]">{formatDate(campaign.sent_at)}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Constants & Values Table */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h2 className="text-xl font-bold text-[#180D39] mb-6">Template Constants</h2>

                  {Object.keys(campaign.constants_values).length === 0 ? (
                    <p className="text-gray-600">No constants defined for this campaign</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b-2 border-gray-200">
                            <th className="text-left py-3 px-4 font-bold text-[#180D39]">Variable</th>
                            <th className="text-left py-3 px-4 font-bold text-[#180D39]">Value</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(campaign.constants_values).map(([key, value]) => (
                            <tr key={key} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="py-3 px-4 text-gray-700 font-medium">{key}</td>
                              <td className="py-3 px-4 text-gray-600 break-all">
                                {typeof value === "string" ? value : JSON.stringify(value)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Actions */}
                {campaign.status === "draft" && (
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h2 className="text-xl font-bold text-[#180D39] mb-4">Actions</h2>
                    <div className="flex gap-4">
                      <button className="px-6 py-2 bg-[#2A8C9D] text-white rounded-lg hover:bg-[#1D7A89]">
                        Schedule Campaign
                      </button>
                      <button className="px-6 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50">
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar Info */}
              <div className="space-y-6">
                {/* Status Card */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="font-bold text-[#180D39] mb-4">Status</h3>
                  <div className="text-center">
                    {getStatusBadge(campaign.status)}
                    <p className="text-sm text-gray-600 mt-4">
                      {campaign.status === "draft" &&
                        "This campaign is saved but not yet scheduled."}
                      {campaign.status === "scheduled" &&
                        "This campaign is scheduled and will be sent at the specified time."}
                      {campaign.status === "sending" &&
                        "This campaign is currently being sent."}
                      {campaign.status === "sent" &&
                        "This campaign has been successfully sent."}
                      {campaign.status === "cancelled" &&
                        "This campaign was cancelled."}
                    </p>
                  </div>
                </div>

                {/* Template Constants Summary */}
                {template && (
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="font-bold text-[#180D39] mb-4">Constants</h3>
                    <div className="space-y-2">
                      {template.constants.map((constant) => (
                        <div key={constant} className="text-sm">
                          <p className="text-gray-600">{constant}</p>
                          <p className="font-medium text-[#180D39] break-all">
                            {campaign.constants_values[constant] || "—"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

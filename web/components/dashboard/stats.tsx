"use client";

import { Mail, Users, TrendingUp, CheckCircle } from "lucide-react";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down";
}

function StatCard({ icon, label, value, change, trend }: StatCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium mb-2">{label}</p>
          <p className="text-3xl font-bold text-[#180D39] mb-2">{value}</p>
          {change && (
            <p className={`text-sm ${trend === "up" ? "text-green-600" : "text-gray-500"}`}>
              {trend === "up" ? "↑" : ""} {change}
            </p>
          )}
        </div>
        <div className="p-3 bg-[#2A8C9D]/10 rounded-lg text-[#2A8C9D]">{icon}</div>
      </div>
    </div>
  );
}

interface DashboardStatsProps {
  subscribers: number;
  totalCampaigns: number;
  sentCampaigns: number;
  templates: number;
}

export function DashboardStats({
  subscribers,
  totalCampaigns,
  sentCampaigns,
  templates,
}: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        icon={<Users className="w-6 h-6" />}
        label="Total Subscribers"
        value={subscribers}
      />
      <StatCard
        icon={<Mail className="w-6 h-6" />}
        label="Total Campaigns"
        value={totalCampaigns}
      />
      <StatCard
        icon={<CheckCircle className="w-6 h-6" />}
        label="Campaigns Sent"
        value={sentCampaigns}
      />
      <StatCard
        icon={<TrendingUp className="w-6 h-6" />}
        label="Templates"
        value={templates}
      />
    </div>
  );
}

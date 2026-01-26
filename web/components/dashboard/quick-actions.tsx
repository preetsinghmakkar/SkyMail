"use client";

import Link from "next/link";
import { Mail, FileText, Users, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuickActionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  color: "teal" | "blue" | "purple" | "green";
}

function QuickActionCard({ icon, title, description, href, color }: QuickActionProps) {
  const bgColors = {
    teal: "bg-[#2A8C9D]/10 text-[#2A8C9D]",
    blue: "bg-blue-500/10 text-blue-600",
    purple: "bg-purple-500/10 text-purple-600",
    green: "bg-green-500/10 text-green-600",
  };

  return (
    <Link href={href}>
      <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all hover:border-[#2A8C9D]/30">
        <div className={`p-3 rounded-lg w-fit mb-4 ${bgColors[color]}`}>{icon}</div>
        <h3 className="font-bold text-[#180D39] mb-2">{title}</h3>
        <p className="text-sm text-gray-500 mb-4">{description}</p>
        <span className="text-[#2A8C9D] font-medium text-sm hover:underline">Get Started →</span>
      </div>
    </Link>
  );
}

export function QuickActions() {
  const actions = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Create Campaign",
      description: "Send newsletters to your subscribers",
      href: "/dashboard/campaigns/new",
      color: "teal" as const,
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Design Template",
      description: "Create beautiful email templates",
      href: "/dashboard/templates/new",
      color: "blue" as const,
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Manage Subscribers",
      description: "View and manage your subscriber list",
      href: "/dashboard/subscribers",
      color: "purple" as const,
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Upgrade Plan",
      description: "Unlock unlimited subscribers and features",
      href: "/dashboard/billing",
      color: "green" as const,
    },
  ];

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-[#180D39] mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action) => (
          <QuickActionCard key={action.title} {...action} />
        ))}
      </div>
    </div>
  );
}

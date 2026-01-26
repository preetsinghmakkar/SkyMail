"use client";

import Link from "next/link";
import { FileText, Eye, ArrowRight, AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/lib/api/dashboard";
import { Loader2 } from "lucide-react";

export function TemplatesSection() {
  const { data, isLoading } = useQuery({
    queryKey: ["templates"],
    queryFn: () => dashboardApi.getTemplates(5, 1),
  });

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
        <h2 className="text-xl font-bold text-[#180D39]">Newsletter Templates</h2>
        <Link
          href="/dashboard/templates"
          className="text-[#2A8C9D] hover:text-[#1D7A89] font-medium flex items-center gap-1"
        >
          View All <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 text-[#2A8C9D] animate-spin" />
        </div>
      ) : data && data.templates && data.templates.length > 0 ? (
        <div className="space-y-3">
          {data.templates.map((template) => (
            <Link
              key={template.id}
              href={`/dashboard/templates/${template.id}`}
              className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-200"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="p-2 bg-[#2A8C9D]/10 rounded-lg">
                  <FileText className="w-4 h-4 text-[#2A8C9D]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-[#180D39]">{template.name}</h3>
                  <p className="text-sm text-gray-500">Subject: {template.subject}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {template.is_active && (
                  <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-medium border border-green-200 rounded-full">
                    Active
                  </span>
                )}
                <Eye className="w-4 h-4 text-gray-400" />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 mb-4">No templates yet</p>
          <Link
            href="/dashboard/templates"
            className="text-[#2A8C9D] hover:text-[#1D7A89] font-medium"
          >
            Create your first template →
          </Link>
        </div>
      )}
    </div>
  );
}

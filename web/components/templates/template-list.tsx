"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { templatesApi } from "@/lib/api/templates";
import { Loader2, Trash2, Edit, Eye } from "lucide-react";
import { useState } from "react";

interface TemplateListProps {
  onEdit?: (templateId: string) => void;
  onView?: (templateId: string) => void;
}

export function TemplateList({
  onEdit,
  onView,
}: TemplateListProps) {
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState("");

  const { data: templatesData, isLoading } = useQuery({
    queryKey: ["templates"],
    queryFn: () => templatesApi.listTemplates(1, 20),
  });

  const deleteTemplateMutation = useMutation({
    mutationFn: (templateId: string) => templatesApi.deleteTemplate(templateId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      setErrorMessage("");
    },
    onError: (error: any) => {
      setErrorMessage(
        error.response?.data?.detail || "Failed to delete template"
      );
    },
  });

  const handleDelete = (templateId: string) => {
    if (confirm("Are you sure you want to delete this template?")) {
      deleteTemplateMutation.mutate(templateId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="animate-spin text-teal-600" size={32} />
      </div>
    );
  }

  if (!templatesData || !templatesData.items || templatesData.items.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No Templates Yet
        </h3>
        <p className="text-gray-600">
          Create your first newsletter template to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {errorMessage}
        </div>
      )}

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templatesData.items.map((template) => (
          <div
            key={template.id}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            {/* Template Header */}
            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-900 truncate">
                {template.name}
              </h3>
              <p className="text-sm text-gray-600 truncate mt-1">
                {template.subject}
              </p>
            </div>

            {/* Status Badge */}
            <div className="mb-4">
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                  template.is_active
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {template.is_active ? "Active" : "Inactive"}
              </span>
            </div>

            {/* Metadata */}
            <div className="text-xs text-gray-500 mb-4">
              Updated {new Date(template.updated_at).toLocaleDateString("en-IN")}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => onView && onView(template.id)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-teal-300 text-teal-600 rounded-lg hover:bg-teal-50 transition-colors text-sm font-medium"
              >
                <Eye className="w-4 h-4" />
                View
              </button>
              <button
                onClick={() => onEdit && onEdit(template.id)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => handleDelete(template.id)}
                disabled={deleteTemplateMutation.isPending}
                className="flex items-center justify-center px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Info */}
      {templatesData.total > 0 && (
        <div className="text-sm text-gray-600 text-center">
          Showing {templatesData.items.length} of {templatesData.total} templates
        </div>
      )}
    </div>
  );
}

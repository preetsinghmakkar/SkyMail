"use client";

import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { templatesApi } from "@/lib/api/templates";
import {
  Loader2,
  AlertCircle,
  CheckCircle,
  Edit3,
  Eye,
  Upload,
  X,
  Zap,
} from "lucide-react";
import { extractTemplateVariables, renderTemplate } from "@/lib/utils";

interface TemplateEditorProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function TemplateEditor({ onSuccess, onCancel }: TemplateEditorProps) {
  const [templateName, setTemplateName] = useState("");
  const [templateSubject, setTemplateSubject] = useState("");
  const [htmlContent, setHtmlContent] = useState("");
  const [textContent, setTextContent] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewMode, setPreviewMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [previewData, setPreviewData] = useState<Record<string, string>>({});

  // Auto-extract variables from HTML and subject
  const extractedVariables = extractTemplateVariables(htmlContent);
  const extractedSubjectVariables = extractTemplateVariables(templateSubject);
  const allVariables = [
    ...new Set([...extractedVariables, ...extractedSubjectVariables]),
  ].sort();

  // Initialize preview data when variables change
  useEffect(() => {
    const newPreviewData: Record<string, string> = {};
    allVariables.forEach((variable) => {
      if (!previewData[variable]) {
        // Generate sample values based on variable names
        const sampleValues: Record<string, string> = {
          customer_name: "Preet",
          company_name: "OpenCall",
          first_name: "Preet",
          last_name: "Makkar",
          email: "preet@opencall.io",
          phone: "+1-234-567-8900",
          website: "https://opencall.io",
          month: "January",
          year: "2026",
          feature_1: "Advanced Analytics",
          feature_2: "Real-time Collaboration",
          news_link: "https://opencall.io/news",
          support_email: "support@opencall.io",
        };

        newPreviewData[variable] =
          sampleValues[variable] || `${variable}_sample_value`;
      } else {
        newPreviewData[variable] = previewData[variable];
      }
    });
    setPreviewData(newPreviewData);
  }, [allVariables]);

  // Render preview with sample data
  const renderedSubject = renderTemplate(templateSubject, previewData);
  const renderedHtml = renderTemplate(htmlContent, previewData);

  const mutation = useMutation({
    mutationFn: async () => {
      // Validate form
      if (!templateName.trim()) {
        throw new Error("Template name is required");
      }
      if (!templateSubject.trim()) {
        throw new Error("Template subject is required");
      }
      if (!htmlContent.trim()) {
        throw new Error("HTML content is required");
      }

      // Validate that we have variables or confirm to proceed without them
      if (allVariables.length === 0) {
        const confirmed = window.confirm(
          "No variables found in template. Continue without variables?"
        );
        if (!confirmed) {
          throw new Error("Template requires variables");
        }
      }

      // Create FormData
      const formData = new FormData();
      formData.append("name", templateName.trim());
      formData.append("subject", templateSubject.trim());
      formData.append("html_content", htmlContent.trim());

      if (textContent.trim()) {
        formData.append("text_content", textContent.trim());
      }

      // Store auto-extracted variables (NOT preview data, NOT manual input)
      formData.append("variables", JSON.stringify(allVariables));

      // Append files
      selectedFiles.forEach((file) => {
        formData.append("files", file);
      });

      return await templatesApi.createTemplate(formData);
    },
    onSuccess: () => {
      setSuccessMessage("Template created successfully!");
      setErrorMessage("");
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 1500);
    },
    onError: (error: any) => {
      setErrorMessage(
        error.message || error.response?.data?.detail || "Failed to create template"
      );
      setSuccessMessage("");
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setSelectedFiles(Array.from(files));
      setErrorMessage("");
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const handlePreviewDataChange = (variable: string, value: string) => {
    setPreviewData((prev) => ({
      ...prev,
      [variable]: value,
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Create New Template</h2>
        <button
          onClick={() => setPreviewMode(!previewMode)}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          {previewMode ? (
            <>
              <Edit3 className="w-4 h-4" />
              Edit Mode
            </>
          ) : (
            <>
              <Eye className="w-4 h-4" />
              Preview
            </>
          )}
        </button>
      </div>

      {previewMode ? (
        // ====== PREVIEW MODE ======
        <div className="space-y-6">
          {/* Template Info Preview */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {templateName || "Untitled"}
              </h2>
              <p className="text-gray-600 mt-1">Subject: {renderedSubject}</p>
            </div>
          </div>

          {/* Sample Data Input */}
          {allVariables.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-600" />
                Preview Sample Data
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Enter sample values to preview how the template looks with actual
                data. These values are NOT saved.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {allVariables.map((variable) => (
                  <div key={variable}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {variable}
                    </label>
                    <input
                      type="text"
                      value={previewData[variable] || ""}
                      onChange={(e) =>
                        handlePreviewDataChange(variable, e.target.value)
                      }
                      placeholder={`Enter ${variable}...`}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* HTML Preview Rendered */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Rendered Preview
            </h3>
            <p className="text-sm text-gray-600">
              This is how the email will look when sent (with variable values replaced).
            </p>
            <div className="border border-gray-200 rounded-lg p-6 bg-white max-h-96 overflow-y-auto">
              <div
                dangerouslySetInnerHTML={{ __html: renderedHtml }}
                className="prose prose-sm max-w-none text-gray-800"
              />
            </div>
          </div>

          {/* Template Source */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Template Source (HTML)
            </h3>
            <p className="text-sm text-gray-600">
              This is the template stored in the database. Variables like{" "}
              <code className="bg-gray-100 px-2 py-1 rounded text-red-600">
                {`{{customer_name}}`}
              </code>{" "}
              will be replaced at send-time.
            </p>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs font-mono max-h-96 overflow-y-auto">
              <code>{htmlContent}</code>
            </pre>
          </div>

          {/* Text Version */}
          {textContent && (
            <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Plain Text Version
              </h3>
              <pre className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-sm overflow-x-auto whitespace-pre-wrap">
                {textContent}
              </pre>
            </div>
          )}

          {/* Auto-extracted Variables */}
          {allVariables.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Auto-Extracted Variables
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                These variables were automatically found in your template. They will
                be stored in the database.
              </p>
              <div className="flex flex-wrap gap-2">
                {allVariables.map((variable) => (
                  <span
                    key={variable}
                    className="px-3 py-1 bg-green-100 border border-green-300 text-green-700 rounded-lg text-sm font-mono"
                  >
                    {`{{${variable}}}`}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        // ====== EDIT MODE ======
        <div className="space-y-6">
          {/* Template Info Section */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Template Information
            </h3>

            {/* Template Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Template Name *
              </label>
              <input
                type="text"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="e.g., Welcome Email, Monthly Newsletter"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
              />
            </div>

            {/* Email Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Subject *
              </label>
              <input
                type="text"
                value={templateSubject}
                onChange={(e) => setTemplateSubject(e.target.value)}
                placeholder="e.g., Welcome to {{company_name}}, {{customer_name}}!"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
              />
              <p className="text-xs text-gray-500 mt-2">
                Use {`{{variable_name}}`} for dynamic content. Variables will be
                auto-extracted.
              </p>
            </div>
          </div>

          {/* Content Section */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Template Content</h3>

            {/* HTML Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                HTML Content *
              </label>
              <textarea
                value={htmlContent}
                onChange={(e) => setHtmlContent(e.target.value)}
                placeholder={`<p>Hi {{customer_name}},</p>\n<p>Thank you for joining {{company_name}}!</p>`}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition font-mono text-sm"
                rows={12}
              />
              <p className="text-xs text-gray-500 mt-2">
                Use {`{{variable_name}}`} syntax for placeholders. Variables will be
                auto-extracted.
              </p>
            </div>

            {/* Text Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Plain Text Content (Optional)
              </label>
              <textarea
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="Plain text version for email clients that don't support HTML..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
                rows={8}
              />
            </div>
          </div>

          {/* Assets Section */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Images & Assets
            </h3>

            <label
              htmlFor="file-upload"
              className="flex items-center gap-3 px-4 py-3 border-2 border-dashed border-teal-300 rounded-lg cursor-pointer hover:bg-teal-50 transition-colors"
            >
              <Upload className="w-5 h-5 text-teal-600" />
              <div>
                <p className="text-sm font-medium text-teal-600">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF (Max 5MB)
                </p>
              </div>
              <input
                id="file-upload"
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                accept="image/*"
              />
            </label>

            {selectedFiles.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Selected Files ({selectedFiles.length})
                </h4>
                <div className="space-y-2">
                  {selectedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 bg-teal-100 rounded flex items-center justify-center shrink-0">
                          <Upload className="w-5 h-5 text-teal-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {(file.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveFile(index)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Messages */}
      {errorMessage && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          <AlertCircle size={20} className="shrink-0" />
          <p>{errorMessage}</p>
        </div>
      )}

      {successMessage && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg p-4 text-green-700">
          <CheckCircle size={20} className="shrink-0" />
          <p>{successMessage}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending}
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
        >
          {mutation.isPending && (
            <Loader2 className="animate-spin" size={18} />
          )}
          {mutation.isPending ? "Publishing..." : "Publish Template"}
        </button>
        <button
          onClick={onCancel}
          disabled={mutation.isPending}
          className="px-6 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

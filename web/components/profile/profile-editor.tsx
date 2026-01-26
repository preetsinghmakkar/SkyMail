"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { billing, UpdateProfileRequest } from "@/lib/api/billing";
import { Loader2, AlertCircle, CheckCircle, Check, Upload, X } from "lucide-react";
import { extractDomainName, ensureFullUrl, storeProfileImage, getProfileImage, deleteProfileImage } from "@/lib/utils/url-utils";
import { fileToBase64, validateImageFile, compressImage } from "@/lib/utils/image-utils";

export function ProfileEditor() {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    company_name: "",
    website_url: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch current profile
  const { data: profile, isLoading, isError, error } = useQuery({
    queryKey: ["profile"],
    queryFn: () => billing.getProfile(),
  });

  // Load profile data and image when profile is fetched
  useEffect(() => {
    if (profile) {
      setFormData({
        company_name: profile.company_name || "",
        website_url: profile.website_url || "",
      });
      // Load stored profile image
      const storedImage = getProfileImage(`profile_image_${profile.id}`);
      if (storedImage) {
        setProfileImage(storedImage);
      }
    }
  }, [profile]);

  // Update profile mutation
  const updateProfileMutation = useMutation<typeof billing.updateProfile extends (...args: any[]) => Promise<infer R> ? R : never, Error, UpdateProfileRequest>({
    mutationFn: (data: UpdateProfileRequest) => billing.updateProfile(data),
    onSuccess: () => {
      setSuccessMessage("Profile updated successfully!");
      setErrorMessage("");
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      setTimeout(() => setSuccessMessage(""), 3000);
    },
    onError: (error: any) => {
      setErrorMessage(
        error.response?.data?.detail || "Failed to update profile"
      );
      setSuccessMessage("");
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrorMessage("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // If image was changed, save it to localStorage
    if (imagePreview && imagePreview !== profileImage && profile) {
      storeProfileImage(`profile_image_${profile.id}`, imagePreview);
      setProfileImage(imagePreview);
    }

    // At least company_name is required (for brand identity)
    if (!formData.company_name.trim()) {
      setErrorMessage("Company name is required");
      return;
    }

    // Only send the fields that have values
    const updateData: any = {};
    updateData.company_name = formData.company_name.trim();
    
    if (formData.website_url.trim()) {
      updateData.website_url = ensureFullUrl(formData.website_url.trim());
    }

    updateProfileMutation.mutate(updateData);
  };

  const handleCancel = () => {
    // Reset form to original values from profile
    if (profile) {
      setFormData({
        company_name: profile.company_name || "",
        website_url: profile.website_url || "",
      });
    }
    // Reset image preview - discard any unsaved image changes
    setImagePreview(null);
    setIsEditing(false);
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      setErrorMessage(validation.error || "Invalid file");
      return;
    }

    try {
      setIsUploadingImage(true);
      setErrorMessage("");

      // Convert to base64
      let imageData = await fileToBase64(file);

      // Compress image
      imageData = await compressImage(imageData, 500, 500);

      // IMPORTANT: Only update preview, don't persist to localStorage yet
      // The image will be saved when user clicks "Save Changes"
      setImagePreview(imageData);

      setSuccessMessage("Image selected. Click 'Save Changes' to confirm.");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setErrorMessage("Failed to upload image. Please try again.");
    } finally {
      setIsUploadingImage(false);
      // Reset input
      e.target.value = "";
    }
  };

  const handleRemoveImage = () => {
    if (!profile) return;
    deleteProfileImage(`profile_image_${profile.id}`);
    setProfileImage(null);
    setImagePreview(null);
    setSuccessMessage("Profile picture removed successfully!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="animate-spin text-teal-600" size={32} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 max-w-md">
          <AlertCircle size={20} className="flex-shrink-0" />
          <p>{error?.message || "Failed to load profile. Please try again."}</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-3 bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-700 max-w-md">
          <AlertCircle size={20} className="flex-shrink-0" />
          <p>Profile data not available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Header Card */}
      <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-lg border border-teal-200 p-8">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-6">
            {/* Profile Picture / Avatar */}
            {profileImage || imagePreview ? (
              <div className="relative w-24 h-24 rounded-full overflow-hidden shadow-lg border-4 border-white">
                <img
                  src={imagePreview || profileImage || ""}
                  alt={profile?.company_name}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-24 h-24 bg-gradient-to-br from-teal-600 to-blue-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                {profile?.company_name?.charAt(0)?.toUpperCase() || "C"}
              </div>
            )}
            
            {/* Profile Info */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{profile?.company_name || "Company Name"}</h1>
                {profile?.is_verified && (
                  <div className="flex items-center justify-center w-6 h-6 bg-green-500 rounded-full" title="Verified">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
              <p className="text-gray-600">{profile?.email}</p>
              <div className="flex items-center gap-4 mt-3">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                  profile?.is_premium
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-700"
                }`}>
                  {profile?.is_premium ? "✨ Premium" : "Free Plan"}
                </span>
              </div>
            </div>
          </div>
          
          {!isEditing && (
            <button
              onClick={() => {
                setIsEditing(true);
                // Populate form data when entering edit mode
                setFormData({
                  company_name: profile?.company_name || "",
                  website_url: profile?.website_url || "",
                });
              }}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Profile Details Card */}
      {!isEditing && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Profile Information</h2>
          
          <div className="space-y-6">
            {/* Company Name */}
            <div>
              <label className="text-sm font-medium text-gray-600">Company Name</label>
              <p className="text-lg font-semibold text-gray-900 mt-1">{profile?.company_name || "—"}</p>
            </div>

            {/* Website URL - Full Width */}
            <div>
          
              {profile?.website_url ? (
                <a
                  href={ensureFullUrl(profile.website_url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={profile.website_url}
                  className="inline-flex items-center gap-2 px-4 py-3 mt-2 bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-200 rounded-lg hover:border-teal-400 hover:shadow-md transition-all duration-200"
                >
                  <span className="text-teal-600 font-semibold hover:text-teal-700">{extractDomainName(profile.website_url)}</span>
                  <svg className="w-4 h-4 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              ) : (
                <p className="text-sm text-gray-400 mt-2 py-3">Not provided</p>
              )}
            </div>

            {/* Other Details in Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
              {/* Email */}
              <div>
                <label className="text-sm font-medium text-gray-600">Email Address</label>
                <p className="text-lg font-semibold text-gray-900 mt-1">{profile?.email || "—"}</p>
              </div>

              {/* Verification Status */}
              <div>
                <label className="text-sm font-medium text-gray-600">Account Status</label>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${
                    profile?.is_verified
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {profile?.is_verified ? (
                      <>
                        <Check className="w-4 h-4" />
                        Verified
                      </>
                    ) : (
                      "Pending Verification"
                    )}
                  </span>
                </div>
              </div>

              {/* Plan Info */}
              <div>
                <label className="text-sm font-medium text-gray-600">Subscription Tier</label>
                <p className="text-lg font-semibold text-gray-900 mt-1">{profile?.subscription_tier?.charAt(0).toUpperCase()}{profile?.subscription_tier?.slice(1) || "free"}</p>
              </div>

              {/* Premium Status */}
              {profile?.is_premium && profile?.subscription_end_date && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Subscription Expires</label>
                  <p className="text-lg font-semibold text-gray-900 mt-1">
                    {new Date(profile.subscription_end_date).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Form */}
      {isEditing && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Edit Profile Information</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Picture Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Profile Picture
              </label>
              
              {/* Image Preview */}
              <div className="mb-4 flex items-center gap-4">
                {imagePreview || profileImage ? (
                  <div className="relative">
                    <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-teal-200">
                      <img
                        src={imagePreview || profileImage || ""}
                        alt="Profile preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      disabled={isUploadingImage}
                      className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 disabled:opacity-50"
                      title="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                    <span className="text-3xl">
                      {profile?.company_name?.charAt(0)?.toUpperCase() || "C"}
                    </span>
                  </div>
                )}
              </div>

              {/* Upload Input */}
              <div className="flex items-center gap-3">
                <label
                  htmlFor="image_upload"
                  className="flex items-center gap-2 px-4 py-2 bg-teal-50 border border-teal-300 text-teal-700 rounded-lg cursor-pointer hover:bg-teal-100 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {isUploadingImage ? "Uploading..." : "Choose Image"}
                  </span>
                </label>
                <input
                  id="image_upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploadingImage}
                  className="hidden"
                />
              </div>
              <p className="mt-2 text-xs text-gray-500">
                JPG, PNG, GIF, or WebP • Max 5MB • Recommended: 500x500px
              </p>
            </div>

            {/* Company Name */}
            <div>
              <label htmlFor="company_name" className="block text-sm font-medium text-gray-700 mb-2">
                Company Name *
              </label>
              <input
                id="company_name"
                type="text"
                name="company_name"
                value={formData.company_name}
                onChange={handleInputChange}
                placeholder="Your company name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
              />
            </div>

            {/* Website URL */}
            <div>
              <label htmlFor="website_url" className="block text-sm font-medium text-gray-700 mb-2">
                Website URL (Optional)
              </label>
              <input
                id="website_url"
                type="url"
                name="website_url"
                value={formData.website_url}
                onChange={handleInputChange}
                placeholder="https://yourcompany.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
              />
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                <AlertCircle size={20} className="flex-shrink-0" />
                <p>{errorMessage}</p>
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg p-4 text-green-700">
                <CheckCircle size={20} className="flex-shrink-0" />
                <p>{successMessage}</p>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                type="submit"
                disabled={updateProfileMutation.isPending}
                className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                {updateProfileMutation.isPending && (
                  <Loader2 className="animate-spin" size={18} />
                )}
                {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={updateProfileMutation.isPending}
                className="px-6 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

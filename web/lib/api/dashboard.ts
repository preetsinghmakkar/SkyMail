import apiClient from "@/lib/api-client";

export interface CampaignResponse {
  id: string;
  name: string;
  status: "draft" | "scheduled" | "sending" | "sent" | "cancelled";
  scheduled_for: string;
  created_at: string;
}

export interface CampaignsListResponse {
  total: number;
  page: number;
  page_size: number;
  campaigns: CampaignResponse[];
}

export interface TemplateResponse {
  id: string;
  name: string;
  subject: string;
  is_active: boolean;
  created_at: string;
}

export interface TemplatesListResponse {
  status: string;
  templates: TemplateResponse[];
  total: number;
  page: number;
  limit: number;
}

export interface CompanyProfileResponse {
  id: string;
  username: string;
  email: string;
  company_name: string;
  website_url?: string;
  profile_image_key?: string;
  is_verified: boolean;
  is_premium: boolean;
  subscription_tier: string;
  subscription_end_date?: string;
  max_subscribers: number;
  subscriber_count: number;
  created_at: string;
}

export interface CampaignStatusResponse {
  campaign_id: string;
  status: string;
  sent_count: number;
  failed_count: number;
  total_recipients: number;
  success_rate: number;
}

export const dashboardApi = {
  getProfile: async (): Promise<CompanyProfileResponse> => {
    try {
      const response = await apiClient.get("/api/auth/me");
      
      // Check if response exists
      if (!response) {
        throw new Error("No response from server");
      }
      
      // Axios response structure: response.data contains the actual data
      const profileData = response.data;
      
      // Validate that we have essential data
      if (!profileData || typeof profileData !== 'object') {
        throw new Error("Invalid profile data format");
      }
      
      // Ensure all required fields exist with defaults
      const profile: CompanyProfileResponse = {
        id: profileData.id || '',
        username: profileData.username || '',
        email: profileData.email || '',
        company_name: profileData.company_name || '',
        website_url: profileData.website_url || undefined,
        profile_image_key: profileData.profile_image_key || undefined,
        is_verified: profileData.is_verified ?? false,
        is_premium: profileData.is_premium ?? false,
        subscription_tier: profileData.subscription_tier || 'free',
        subscription_end_date: profileData.subscription_end_date || undefined,
        max_subscribers: profileData.max_subscribers || 250,
        subscriber_count: profileData.subscriber_count || 0,
        created_at: profileData.created_at || new Date().toISOString(),
      };
      
      return profile;
    } catch (error: any) {
      console.error("Error fetching profile:", error);
      
      // Provide more detailed error information
      if (error.response?.status === 401) {
        throw new Error("Unauthorized - please login again");
      }
      if (error.response?.status === 404) {
        throw new Error("Profile not found");
      }
      
      throw error;
    }
  },

  getCampaigns: async (limit: number = 10, skip: number = 0): Promise<CampaignsListResponse> => {
    const response = await apiClient.get<CampaignsListResponse>("/api/campaigns", {
      params: { limit, skip },
    });
    return response.data;
  },

  getTemplates: async (limit: number = 10, page: number = 1): Promise<TemplatesListResponse> => {
    const response = await apiClient.get<TemplatesListResponse>("/api/newsletters/templates", {
      params: { limit, page },
    });
    return response.data;
  },

  getCampaignStatus: async (campaignId: string): Promise<CampaignStatusResponse> => {
    const response = await apiClient.get<CampaignStatusResponse>(`/campaigns/${campaignId}/status`);
    return response.data;
  },
};

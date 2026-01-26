import apiClient from "@/lib/api-client";

export interface CreateOrderResponse {
  status: string;
  order_id: string;
  key_id: string;
  amount: number;
  currency: string;
  company_id: string;
}

export interface VerifyPaymentRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface VerifyPaymentResponse {
  status: string;
  message: string;
  company_id: string;
  subscription_tier: string;
  subscription_end_date: string;
}

export interface PaymentHistoryItem {
  id: string;
  order_id: string;
  payment_id: string;
  amount: number;
  currency: string;
  plan: string;
  status: string;
  created_at: string;
  validity_start: string;
  validity_end: string;
}

export interface PaymentHistoryResponse {
  status: string;
  payments: PaymentHistoryItem[];
}

export interface SubscriptionStatusResponse {
  company_id: string;
  subscription_tier: string;
  is_premium: boolean;
  subscription_end_date?: string;
  max_subscribers?: number;
  current_subscribers: number;
  email?: string;
  company_name?: string;
}

export interface UpdateProfileRequest {
  company_name?: string;
  website_url?: string;
}

export interface ProfileResponse {
  id: string;
  username?: string;
  email: string;
  company_name: string;
  website_url?: string;
  profile_image_key?: string;
  is_verified: boolean;
  is_premium: boolean;
  subscription_tier: string;
  subscription_end_date?: string;
  max_subscribers?: number;
  subscriber_count?: number;
}

export const billing = {
  createOrder: async (data: { planType?: string; amount?: number }): Promise<CreateOrderResponse> => {
    const response = await apiClient.post<CreateOrderResponse>("/api/billing/create-order", {
      plan: "premium"
    });
    return response.data;
  },

  verifyPayment: async (data: VerifyPaymentRequest): Promise<VerifyPaymentResponse> => {
    const response = await apiClient.post<VerifyPaymentResponse>(
      "/api/billing/verify-payment",
      data
    );
    return response.data;
  },

  getPaymentHistory: async (): Promise<PaymentHistoryResponse> => {
    const response = await apiClient.get<PaymentHistoryResponse>("/api/billing/payment-history");
    return response.data;
  },

  getSubscriptionStatus: async (): Promise<SubscriptionStatusResponse> => {
    const response = await apiClient.get<SubscriptionStatusResponse>(
      "/api/billing/subscription-status"
    );
    return response.data;
  },

  updateProfile: async (data: UpdateProfileRequest): Promise<ProfileResponse> => {
    const response = await apiClient.put<ProfileResponse>("/api/auth/profile", data);
    return response.data;
  },

  getProfile: async (): Promise<ProfileResponse> => {
    const response = await apiClient.get<ProfileResponse>("/api/auth/profile");
    // Ensure we always return a non-undefined value
    if (!response.data) {
      throw new Error("Profile data not found in response");
    }
    return response.data;
  },
};

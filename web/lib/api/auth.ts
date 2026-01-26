import apiClient from "@/lib/api-client";

// Types matching backend schemas
export interface CompanyLoginRequest {
  email: string;
  password: string;
}

export interface CompanyRegisterRequest {
  username: string;
  email: string;
  password: string;
  company_name: string;
  website_url?: string;
}

export interface VerifyOTPRequest {
  email: string;
  otp: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  new_password: string;
}

export interface CompanyBaseResponse {
  id: string;
  username: string;
  email: string;
  company_name: string;
  website_url?: string;
  is_verified: boolean;
  is_premium: boolean;
  subscription_tier: string;
  max_subscribers: number;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface LoginResponse {
  message: string;
  company: CompanyBaseResponse;
  tokens: TokenResponse;
}

export interface CompanyRegisterResponse {
  message: string;
  email: string;
  description: string;
}

export interface VerifyOTPResponse {
  message: string;
  company?: CompanyBaseResponse;
  tokens?: TokenResponse;
}

export const authApi = {
  login: async (data: CompanyLoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>("/api/auth/login", data);
    return response.data;
  },
verifyOtp: async (data: VerifyOTPRequest): Promise<VerifyOTPResponse> => {
    const response = await apiClient.post<VerifyOTPResponse>("/api/auth/verify-otp", data);
    return response.data;
  },

  resendOtp: async (email: string): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>(`/api/auth/resend-otp?email=${encodeURIComponent(email)}`);
    return response.data;
  },

  
  register: async (data: CompanyRegisterRequest): Promise<CompanyRegisterResponse> => {
    const response = await apiClient.post<CompanyRegisterResponse>("/api/auth/register", data);
    return response.data;
  },

  forgotPassword: async (data: ForgotPasswordRequest): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>("/api/auth/forgot-password", data);
    return response.data;
  },

  resetPassword: async (data: ResetPasswordRequest): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>("/api/auth/reset-password", data);
    return response.data;
  },

  // Add other auth methods here later (refresh token, etc.)
};

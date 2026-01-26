"use client";

import Link from "next/link";
import { Plane, Mail, Lock, Building2, User, Globe, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { authApi, CompanyRegisterRequest } from "@/lib/api/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<CompanyRegisterRequest>({
    company_name: "",
    username: "",
    email: "",
    website_url: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);

  const { mutate: register, isPending } = useMutation({
    mutationFn: (data: CompanyRegisterRequest) => authApi.register(data),
    onSuccess: (data) => {
      // Redirect to OTP verification page
      router.push(`/auth/verify-otp?email=${encodeURIComponent(data.email)}`);
    },
    onError: (err: any) => {
      setError(err.response?.data?.detail || "Registration failed. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    register(formData);
  };

  const handleInputChange = (field: keyof CompanyRegisterRequest, value: string) => {
     setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen w-full flex">
      {/* Left Side - Brand & Visuals */}
      <div className="hidden lg:flex w-1/2 bg-[#2A8C9D] relative overflow-hidden flex-col justify-between p-12 text-white">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#2A8E9E]/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#1D7A89]/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2 font-bold text-2xl">
            <div className="w-10 h-10 bg-gradient-to-br from-[#2A8E9E] to-[#1D7A89] rounded-xl flex items-center justify-center shadow-lg shadow-[#2A8E9E]/20">
              <Plane className="w-6 h-6 text-white" />
            </div>
            <span>SkyMail</span>
          </Link>
        </div>

        <div className="relative z-10 max-w-lg">
          <h1 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
            Join thousands of companies scaling their newsletters.
          </h1>
          <div className="space-y-6">
            <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="p-2 bg-[#2A8E9E]/20 rounded-lg text-[#2A8E9E]">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Enterprise Ready</h3>
                <p className="text-gray-400 text-sm mt-1">Advanced features for teams of all sizes.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="p-2 bg-[#2A8E9E]/20 rounded-lg text-[#2A8E9E]">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Global Infrastructure</h3>
                <p className="text-gray-400 text-sm mt-1">Reliable delivery to inboxes worldwide.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-sm text-gray-500">
          © 2024 SkyMail Inc. All rights reserved.
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="w-full lg:w-1/2 bg-white dark:bg-[#0F1115] flex flex-col justify-center items-center p-6 sm:p-12 relative overflow-y-auto">
        <div className="w-full max-w-md space-y-8 my-auto">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <Link href="/" className="flex items-center gap-2 font-bold text-2xl">
              <div className="w-10 h-10 bg-gradient-to-br from-[#2A8E9E] to-[#1D7A89] rounded-xl flex items-center justify-center">
                <Plane className="w-6 h-6 text-white" />
              </div>
              <span className="text-[#180D39] dark:text-white">SkyMail</span>
            </Link>
          </div>

          <div className="text-center lg:text-left space-y-2">
            <h2 className="text-3xl font-bold text-[#180D39] dark:text-white tracking-tight">
              Create your account
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Start your 14-day free trial. No credit card required.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="company">Company Name</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="company"
                      type="text"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-[#1D1E20] border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2A8E9E]/20 focus:border-[#2A8E9E] transition-all text-gray-900 dark:text-white"
                      placeholder="Acme Inc."
                      required
                      value={formData.company_name}
                      onChange={(e) => handleInputChange("company_name", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="username">Username</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="username"
                      type="text"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-[#1D1E20] border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2A8E9E]/20 focus:border-[#2A8E9E] transition-all text-gray-900 dark:text-white"
                      placeholder="acme_admin"
                      required
                      value={formData.username}
                      onChange={(e) => handleInputChange("username", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="email">Work Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-[#1D1E20] border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2A8E9E]/20 focus:border-[#2A8E9E] transition-all text-gray-900 dark:text-white"
                    placeholder="name@company.com"
                    required
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="website">Website (Optional)</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="website"
                    type="url"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-[#1D1E20] border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2A8E9E]/20 focus:border-[#2A8E9E] transition-all text-gray-900 dark:text-white"
                    placeholder="https://acme.com"
                    value={formData.website_url || ""}
                    onChange={(e) => handleInputChange("website_url", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="password">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="password"
                    type="password"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-[#1D1E20] border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2A8E9E]/20 focus:border-[#2A8E9E] transition-all text-gray-900 dark:text-white"
                    placeholder="Create a strong password"
                    required
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                  />
                </div>
                <p className="text-xs text-gray-500">Must be at least 8 characters</p>
              </div>
            </div>

            <Button 
              className="w-full bg-[#180D39] hover:bg-[#180D39]/90 text-white py-6 text-base rounded-xl shadow-lg shadow-[#180D39]/20 transition-transform active:scale-[0.98] mt-2"
              disabled={isPending}
            >
              {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Account"}
            </Button>
          </form>

          <div className="pt-6 text-center text-sm">
            <span className="text-gray-500 dark:text-gray-400">
              Already have an account?{" "}
            </span>
            <Link
              href="/auth/login"
              className="font-semibold text-[#2A8E9E] hover:text-[#1D7A89] transition-colors inline-flex items-center gap-1 group"
            >
              Sign in
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

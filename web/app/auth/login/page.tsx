"use client";

import Link from "next/link";
import { Plane, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { authApi, CompanyLoginRequest } from "@/lib/api/auth";
import { tokenStorage } from "@/lib/token-storage";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<CompanyLoginRequest>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);

  const { mutate: login, isPending } = useMutation({
    mutationFn: (data: CompanyLoginRequest) => authApi.login(data),
    onSuccess: (data) => {
      // Store tokens in both localStorage and cookies
      tokenStorage.setTokens(data.tokens.access_token, data.tokens.refresh_token);
      
      // Small delay to ensure tokens are set before redirect
      setTimeout(() => {
        router.push("/dashboard");
      }, 100);
    },
    onError: (err: any) => {
      setError(err.response?.data?.detail || "Invalid email or password");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    login(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
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
            Welcome back to your campaign command center.
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            "SkyMail has revolutionized how we connect with our subscribers. The analytics are game-changing."
          </p>
          <div className="mt-8 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 border border-gray-600"></div>
            <div>
              <p className="font-semibold text-white">Alex Chen</p>
              <p className="text-sm text-gray-400">Marketing Director, TechFlow</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-sm text-gray-500">
          © 2024 SkyMail Inc. All rights reserved.
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 bg-white dark:bg-[#0F1115] flex flex-col justify-center items-center p-6 sm:p-12 relative">
        <div className="w-full max-w-md space-y-8">
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
              Sign in to your account
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Enter your details below to access your dashboard
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="email">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    placeholder="name@company.com"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-[#1D1E20] border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2A8E9E]/20 focus:border-[#2A8E9E] transition-all text-gray-900 dark:text-white placeholder:text-gray-400"
                    required
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="password">Password</label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm font-medium text-[#2A8E9E] hover:text-[#1D7A89] transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-[#1D1E20] border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2A8E9E]/20 focus:border-[#2A8E9E] transition-all text-gray-900 dark:text-white placeholder:text-gray-400"
                    required
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <Button 
              className="w-full bg-[#180D39] hover:bg-[#180D39]/90 text-white py-6 text-base rounded-xl shadow-lg shadow-[#180D39]/20 transition-transform active:scale-[0.98]"
              disabled={isPending}
            >
              {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
            </Button>
          </form>

          <div className="pt-6 text-center text-sm">
            <span className="text-gray-500 dark:text-gray-400">
              Don't have an account?{" "}
            </span>
            <Link
              href="/auth/register"
              className="font-semibold text-[#2A8E9E] hover:text-[#1D7A89] transition-colors inline-flex items-center gap-1 group"
            >
              Get started
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

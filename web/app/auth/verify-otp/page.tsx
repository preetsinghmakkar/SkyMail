"use client";

import Link from "next/link";
import { Plane, Lock, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { authApi, VerifyOTPRequest } from "@/lib/api/auth";

function VerifyOTPContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [resendSuccess, setResendSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!email) {
      router.push("/auth/register");
    }
  }, [email, router]);

  const { mutate: verify, isPending: isVerifying } = useMutation({
    mutationFn: (data: VerifyOTPRequest) => authApi.verifyOtp(data),
    onSuccess: (data) => {
      if (data.tokens) {
        localStorage.setItem("access_token", data.tokens.access_token);
        localStorage.setItem("refresh_token", data.tokens.refresh_token);
        router.push("/dashboard");
      } else {
        // Should not happen if verification is successful returning tokens
        router.push("/auth/login");
      }
    },
    onError: (err: any) => {
      setError(err.response?.data?.detail || "Invalid OTP. Please try again.");
    },
  });

  const { mutate: resend, isPending: isResending } = useMutation({
    mutationFn: (email: string) => authApi.resendOtp(email),
    onSuccess: () => {
      setResendSuccess("A new OTP has been sent to your email.");
      setTimeout(() => setResendSuccess(null), 5000);
    },
    onError: (err: any) => {
      setError(err.response?.data?.detail || "Failed to resend OTP.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setError(null);
    verify({ email, otp });
  };

  const handleResend = () => {
    if (!email) return;
    setError(null);
    setResendSuccess(null);
    resend(email);
  };

  if (!email) return null;

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
            Verify your email address to continue.
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            "We take security seriously. Verifying your email helps us protect your account and ensure deliverability."
          </p>
        </div>

        <div className="relative z-10 text-sm text-gray-500">
          © 2024 SkyMail Inc. All rights reserved.
        </div>
      </div>

      {/* Right Side - Form */}
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
              Check your inbox
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              We've sent a 6-digit code to <span className="font-semibold text-[#180D39] dark:text-gray-300">{email}</span>
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm text-center">
                {error}
              </div>
            )}
            
            {resendSuccess && (
              <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-sm flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                {resendSuccess}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="otp">Verification Code</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="otp"
                  type="text"
                  maxLength={6}
                  placeholder="123456"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-[#1D1E20] border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2A8E9E]/20 focus:border-[#2A8E9E] transition-all text-gray-900 dark:text-white placeholder:text-gray-400 text-center text-2xl tracking-[0.5em] font-mono"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                />
              </div>
            </div>

            <Button 
              className="w-full bg-[#180D39] hover:bg-[#180D39]/90 text-white py-6 text-base rounded-xl shadow-lg shadow-[#180D39]/20 transition-transform active:scale-[0.98]"
              disabled={isVerifying || otp.length !== 6}
            >
              {isVerifying ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify Account"}
            </Button>
          </form>

          <div className="pt-6 text-center text-sm">
            <span className="text-gray-500 dark:text-gray-400">
              Didn't receive the code?{" "}
            </span>
            <button
              onClick={handleResend}
              disabled={isResending}
              className="font-semibold text-[#2A8E9E] hover:text-[#1D7A89] transition-colors inline-flex items-center gap-1 group disabled:opacity-50"
            >
              {isResending ? <Loader2 className="w-3 h-3 animate-spin"/> : "Resend"}
            </button>
          </div>
          
          <div className="text-center">
            <Link
              href="/auth/register"
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              Start with a different email
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyOTPPage() {
  return (
    <Suspense>
      <VerifyOTPContent />
    </Suspense>
  );
}

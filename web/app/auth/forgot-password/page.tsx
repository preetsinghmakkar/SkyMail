"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plane, ArrowLeft, Mail, Lock, KeyRound, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/lib/api/auth";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<'request' | 'reset'>('request');
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");

  const requestMutation = useMutation({
    mutationFn: (email: string) => authApi.forgotPassword({ email }),
    onSuccess: () => {
      setStep('reset');
      setError("");
    },
    onError: (err: any) => {
       setError(err.response?.data?.detail || "Failed to send reset email. Please try again.");
    }
  });

  const resetMutation = useMutation({
    mutationFn: () => authApi.resetPassword({ email, otp, new_password: newPassword }),
    onSuccess: () => {
      // Could show a success toast here if we had one
      router.push('/auth/login');
    },
    onError: (err: any) => {
      setError(err.response?.data?.detail || "Failed to reset password. Check your OTP and try again.");
    }
  });

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    requestMutation.mutate(email);
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || !newPassword) return;
    resetMutation.mutate();
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
            Don't worry, we've got you covered.
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            "It happens to the best of us. We'll help you get back to managing your campaigns in no time."
          </p>
        </div>

        <div className="relative z-10 text-sm text-gray-500">
          © 2024 SkyMail Inc. All rights reserved.
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 lg:p-24 bg-white relative">
        <div className="absolute top-8 left-8 lg:hidden">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-[#0F172A]">
            <div className="w-8 h-8 bg-[#2A8E9E] rounded-lg flex items-center justify-center">
              <Plane className="w-5 h-5 text-white" />
            </div>
            <span>SkyMail</span>
          </Link>
        </div>

        <div className="max-w-md w-full mx-auto">
          {step === 'request' ? (
            <>
              <div className="mb-10">
                <Link 
                  href="/auth/login" 
                  className="inline-flex items-center text-sm text-gray-500 hover:text-[#0F172A] mb-6 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to login
                </Link>
                <h2 className="text-3xl font-bold text-[#0F172A] mb-3">Reset your password</h2>
                <p className="text-gray-500">
                  Enter your email address and we'll send you an OTP to reset your password.
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleRequestSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={requestMutation.isPending}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2A8E9E]/20 focus:border-[#2A8E9E] transition-all outline-none text-[#0F172A] disabled:opacity-50"
                      placeholder="name@company.com"
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={requestMutation.isPending}
                  className="w-full h-12 bg-[#0F172A] hover:bg-[#0F172A]/90 text-white font-medium rounded-xl transition-all"
                >
                  {requestMutation.isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Send OTP"
                  )}
                </Button>
              </form>
            </>
          ) : (
            <>
              <div className="mb-10">
                 <button 
                  onClick={() => setStep('request')}
                  className="inline-flex items-center text-sm text-gray-500 hover:text-[#0F172A] mb-6 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Change email
                </button>
               <h2 className="text-2xl font-bold text-[#0F172A] mb-3">Create new password</h2>
               <p className="text-gray-500 mb-8">
                 Please enter the OTP sent to <span className="font-medium text-[#0F172A]">{email}</span> and set your new password.
               </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm">
                  {error}
                </div>
              )}

               <form onSubmit={handleResetSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="otp" className="text-sm font-medium text-gray-700">
                    OTP Code
                  </label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="otp"
                      type="text"
                      required
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      disabled={resetMutation.isPending}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2A8E9E]/20 focus:border-[#2A8E9E] transition-all outline-none text-[#0F172A] tracking-widest disabled:opacity-50"
                      placeholder="123456"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="new-password" className="text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="new-password"
                      type="password"
                      required
                      minLength={8}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      disabled={resetMutation.isPending}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2A8E9E]/20 focus:border-[#2A8E9E] transition-all outline-none text-[#0F172A] disabled:opacity-50"
                      placeholder="Min 8 characters"
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={resetMutation.isPending}
                  className="w-full h-12 bg-[#0F172A] hover:bg-[#0F172A]/90 text-white font-medium rounded-xl transition-all"
                >
                  {resetMutation.isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </form>
               
               <p className="mt-8 text-center text-sm text-gray-500">
                 Didn't receive the OTP? <button onClick={() => requestMutation.mutate(email)} disabled={requestMutation.isPending} className="text-[#2A8E9E] font-medium hover:underline disabled:opacity-50 disabled:no-underline">Resend</button>
               </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

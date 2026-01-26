"use client";

import { Check, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#1D1E20]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center space-y-6 mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#180D39] dark:text-white">
            Pick your plan
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300">Start free, scale as you grow</p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Free Plan */}
          <div className="p-8 rounded-2xl bg-[#E9F3F4] dark:bg-[#2A8E9E]/10 border border-[#2A8E9E]/20 hover:border-[#2A8E9E]/50 transition-all duration-300 hover:shadow-lg">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-[#180D39] dark:text-white">Free</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-[#180D39] dark:text-white">₹0</span>
                <span className="text-gray-700 dark:text-gray-300">/month</span>
              </div>
              <div className="space-y-4">
              {[
                "Up to 1,000 subscribers",
                "Basic email templates",
                "Email support",
                "Simple analytics",
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-[#2A8E9E] flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {feature}
                  </span>
                </div>
              ))}
              </div>
              <Button className="w-full bg-[#2A8E9E] hover:bg-[#1D7A89] text-white shadow-md shadow-black/5 mt-6" asChild>
                <a href="/auth/login">Get Started</a>
              </Button>
            </div>
          </div>

          {/* Premium Plan */}
          <div className="p-8 rounded-2xl bg-gradient-to-br from-[#2A8E9E] to-[#1D7A89] text-white relative overflow-hidden hover:shadow-xl transition-all duration-300">
            <div className="absolute -right-12 -top-12 w-24 h-24 bg-white/10 rounded-full opacity-20"></div>
            <div className="relative z-10 space-y-6">
              <div className="inline-block px-3 py-1 rounded-full bg-white/20 border border-white/30 text-sm font-medium mb-4">
                Most Popular
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium</h3>
              <div className="flex items-baseline gap-2 mb-8">
                <IndianRupee className="w-6 h-6" />
                <span className="text-4xl font-bold">500</span>
                <span className="opacity-90">/month</span>
              </div>
              <div className="space-y-4">
                {[
                  "Unlimited subscribers",
                  "Advanced analytics",
                  "Priority email support",
                  "Custom branding",
                  "API access",
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <Check className="w-5 h-5 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              <Button className="w-full bg-[#180D39] text-white hover:bg-[#180D39]/90 transition-colors shadow-md shadow-black/10 mt-8 font-medium" asChild>
                <a href="/auth/login">Get Started</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { Check, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PricingSection() {
  return (
    <section
      id="pricing"
      className="relative py-24 px-4 sm:px-6 lg:px-8 bg-(--surface-pricing) dark:bg-[#0B1220]"
    >
      <div className="absolute inset-x-0 top-0 z-0 h-28 sm:h-36 pointer-events-none bg-[linear-gradient(to_bottom,var(--surface-dev)_0%,transparent_100%)] dark:hidden" />

      <div className="relative max-w-5xl mx-auto">
        <div className="text-center space-y-6 mb-20">
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-(--text-heading) dark:text-white">
            Pick your plan
          </h2>
          <p className="text-lg text-(--text-body) dark:text-gray-400">Start free, scale as you grow</p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Free Plan */}
          <div className="p-8 rounded-2xl bg-white dark:bg-white/3 border border-black/5 dark:border-white/10 hover:border-[#0F766E]/40 transition-all duration-300 hover:shadow-lg">
            <div className="space-y-6">
              <h3 className="font-heading text-xl font-semibold text-(--text-heading) dark:text-white">Free</h3>
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-4xl font-semibold text-(--text-heading) dark:text-white">₹0</span>
                <span className="text-(--text-body) dark:text-gray-400">/month</span>
              </div>
              <div className="space-y-4">
              {[
                "Up to 250 subscribers",
                "HTML email templates",
                "Email support",
                "Delivery tracking",
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-[#0F766E] dark:text-[#2dd4bf] shrink-0" />
                  <span className="text-(--text-body) dark:text-gray-400">
                    {feature}
                  </span>
                </div>
              ))}
              </div>
              <Button className="w-full mt-6" asChild>
                <a href="/auth/login">Get Started</a>
              </Button>
            </div>
          </div>

          {/* Premium Plan */}
          <div className="p-8 rounded-2xl bg-[#0F766E] text-white relative overflow-hidden hover:shadow-xl transition-all duration-300">
            <div className="relative z-10 space-y-6">
              <div className="inline-block px-3 py-1 rounded-full bg-white/15 border border-white/25 text-sm font-medium mb-4">
                Most Popular
              </div>
              <h3 className="font-heading text-xl font-semibold mb-2">Premium</h3>
              <div className="flex items-baseline gap-2 mb-8">
                <IndianRupee className="w-6 h-6" />
                <span className="font-mono text-4xl font-semibold">500</span>
                <span className="opacity-90">/month</span>
              </div>
              <div className="space-y-4">
                {[
                  "Unlimited subscribers",
                  "Detailed delivery reports",
                  "Priority email support",
                  "Template versioning",
                  "API access",
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <Check className="w-5 h-5 shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              <Button
                className="w-full mt-8 bg-white text-[#0F766E] hover:bg-white/90 shadow-md shadow-black/10"
                asChild
              >
                <a href="/auth/login">Get Started</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

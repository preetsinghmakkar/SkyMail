"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Plane, TrendingUp, Users, Mail } from "lucide-react";

export function HeroSection() {
  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#E9F3F4] to-white dark:from-[#180D39] dark:to-[#1D1E20]">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <div>

            {/* Heading */}
            <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6 text-[#180D39] dark:text-white">
              Send Newsletters at <span className="bg-gradient-to-r from-[#2A8E9E] to-[#1D7A89] bg-clip-text text-transparent">Scale.</span>
            </h1>

            {/* Description */}
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
              Power your communication with high-performance infrastructure. Schedule, send, and track newsletters with powerful analytics tools.
            </p>

            {/* Buttons */}
            <div className="flex gap-4 mb-12 flex-wrap">
              <Button size="lg" className="bg-[#2A8E9E] hover:bg-[#1D7A89] text-white group" asChild>
                <Link href="/auth/register" className="inline-flex items-center">
                  Get Started
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="border-[#2A8E9E] text-[#2A8E9E] hover:bg-[#E9F3F4] dark:hover:bg-[#2A8E9E]/10" asChild>
                <Link href="#learn-more">Learn more</Link>
              </Button>
            </div>

            {/* Trust Section removed */}
          </div>

          {/* Right Column - Campaign Dashboard Card */}
          <div className="relative">
            <div className="bg-gradient-to-br from-[#2A8E9E]/20 to-[#2A8E9E]/5 dark:from-[#2A8E9E]/20 dark:to-[#2A8E9E]/5 rounded-2xl p-8 backdrop-blur-sm border border-[#2A8E9E]/20 dark:border-[#2A8E9E]/30">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-[#2A8E9E] rounded-full flex items-center justify-center text-white">
                    <Plane className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-semibold text-[#180D39] dark:text-white">Campaign Dashboard</span>
                </div>

                {/* Main Stats Card */}
                <div className="bg-white dark:bg-[#1D1E20] rounded-lg p-4 space-y-3">
                  <div className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide">Active Campaign</div>
                  <div className="text-3xl font-bold text-[#180D39] dark:text-white">2.4M</div>
                  <div className="text-sm text-gray-700 dark:text-gray-300">subscribers reached</div>

                  {/* Stats Grid */}
                  <div className="pt-2 border-t border-[#2A8E9E]/20 dark:border-[#2A8E9E]/20 space-y-2">
                    <div className="flex justify-between text-xs items-center">
                      <span className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <TrendingUp className="w-4 h-4 text-[#2A8E9E]" />
                        Open Rate
                      </span>
                      <span className="font-semibold text-[#180D39] dark:text-white">38%</span>
                    </div>
                    <div className="flex justify-between text-xs items-center">
                      <span className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <Mail className="w-4 h-4 text-[#2A8E9E]" />
                        Sent
                      </span>
                      <span className="font-semibold text-[#180D39] dark:text-white">1.2M</span>
                    </div>
                    <div className="flex justify-between text-xs items-center">
                      <span className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <Users className="w-4 h-4 text-[#2A8E9E]" />
                        Subscribers
                      </span>
                      <span className="font-semibold text-[#180D39] dark:text-white">5.1K</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button className="w-full bg-[#2A8E9E] hover:bg-[#1D7A89] text-white py-2 rounded-lg text-sm font-semibold mt-4 transition-colors">
                    View Campaign
                  </button>
                </div>

                {/* Footer */}
                <div className="text-xs text-gray-600 dark:text-gray-400 text-center">
                  ⚡ Real-time analytics | 📊 Performance tracking
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

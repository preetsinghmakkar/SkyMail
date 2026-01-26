"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#E9F3F4] to-white dark:from-[#180D39] dark:to-[#1D1E20]">
      <div className="max-w-4xl mx-auto text-center space-y-10">
        <div className="space-y-6">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#180D39] dark:text-white leading-tight">
            Ready to level up your communication?
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Join 50,000+ companies who rely on SkyMail for their business-critical
            newsletters. Sign up today and get started for free.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
          <Button
            size="lg"
            className="bg-[#2A8E9E] hover:bg-[#1D7A89] text-white group"
            asChild
          >
            <Link href="/auth/register" className="inline-flex items-center">
              Get Free Access
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-[#2A8E9E] text-[#2A8E9E] hover:bg-[#E9F3F4] dark:border-white/30 dark:text-white dark:hover:bg-white/10"
            asChild
          >
            <Link href="#learn-more">Learn More</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-(--surface-cta) dark:bg-[#0B1220]">
      <div className="absolute inset-x-0 top-0 z-0 h-28 sm:h-36 pointer-events-none bg-[linear-gradient(to_bottom,var(--surface-faq)_0%,transparent_100%)] dark:hidden" />

      <div className="relative max-w-4xl mx-auto text-center space-y-10">
        <div className="space-y-6">
          <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-(--text-heading) dark:text-white leading-tight">
            Ready to send your first campaign?
          </h2>
          <p className="text-lg text-(--text-body) dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Create a free account, schedule a send, and watch it go out
            through AWS SES.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
          <Button size="lg" className="group" asChild>
            <Link href="/auth/register" className="inline-flex items-center">
              Start Free
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="#developers">See the API</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

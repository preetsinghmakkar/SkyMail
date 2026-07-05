import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { HeroBackground } from "@/components/landing/hero-background";

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden bg-[#0B1520] min-h-[640px] sm:min-h-[720px] lg:min-h-[820px] flex items-center pt-32 pb-24 sm:pb-32 px-4 sm:px-6 lg:px-8">
      <HeroBackground />

      {/*
        Readability scrim. Below `lg` the text column spans almost the full
        width, so a uniform wash keeps it legible everywhere. At `lg`+ there's
        real room beside the text, so we switch to a left-to-right fade that
        leaves most of the artwork crisp and clear on the right.
      */}
      <div className="absolute inset-0 -z-10 bg-black/55 lg:hidden" />
      <div className="absolute inset-0 -z-10 hidden lg:block bg-[linear-gradient(to_right,rgba(11,21,32,0.82)_0%,rgba(11,21,32,0.45)_28%,rgba(11,21,32,0)_55%)]" />

      {/* Seamless hand-off into the section below — no visible cut */}
      <div
        className="absolute inset-x-0 bottom-0 -z-10 h-40 sm:h-56 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(11,21,32,0) 0%, rgba(247,251,252,0.65) 70%, var(--surface-features) 100%)",
        }}
      />

      <div className="relative max-w-6xl mx-auto w-full">
        <div className="max-w-2xl">
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.1] tracking-tight text-white mb-6">
            Send newsletters that actually{" "}
            <span className="text-[#2dd4bf]">scale.</span>
          </h1>

          <p className="text-base sm:text-lg text-gray-300 leading-relaxed mb-10 max-w-xl">
            Built with FastAPI, Redis, Celery and AWS SES to deliver millions
            of emails reliably. Schedule campaigns, manage subscribers and
            automate newsletters from one platform.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Button size="lg" className="group" asChild>
              <Link href="/auth/register" className="inline-flex items-center">
                Start Sending
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/30"
              asChild
            >
              <Link href="#">View Docs</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

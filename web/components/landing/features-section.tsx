"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import { useInView } from "@/lib/hooks/use-in-view";
import { SplitHeading } from "@/components/landing/split-heading";
import { Sparkles, Mail, Send, Check } from "lucide-react";

function BentoCard({
  index,
  className,
  children,
}: {
  index: number;
  className?: string;
  children: ReactNode;
}) {
  const { ref, inView } = useInView<HTMLDivElement>(0.2);

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-white/3 p-6 flex flex-col transition-all duration-700 ease-out hover:border-[#0F766E]/30 hover:shadow-lg",
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        className
      )}
      style={{ transitionDelay: `${index * 90}ms` }}
    >
      {children}
    </div>
  );
}

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="relative py-24 px-4 sm:px-6 lg:px-8 bg-(--surface-features) dark:bg-[#0B1220]"
    >
      <div className="absolute inset-x-0 top-0 z-0 h-28 sm:h-36 pointer-events-none bg-[linear-gradient(to_bottom,var(--surface-how)_0%,transparent_100%)] dark:hidden" />

      <div className="relative max-w-5xl mx-auto">
        <div className="relative max-w-2xl mb-16">
          <div className="absolute -inset-x-10 -top-14 -bottom-10 -z-10 bg-dots-faint dark:hidden mask-[radial-gradient(ellipse_60%_100%_at_0%_0%,black,transparent)]" />
          <div className="absolute -left-16 -top-20 -z-10 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(20,184,166,0.08),transparent_70%)] dark:hidden" />

          <Mail
            className="hidden sm:block absolute -top-8 right-10 w-8 h-8 text-[#0F766E]/5 dark:text-white/5 animate-float-slow"
            aria-hidden="true"
          />
          <Send
            className="hidden sm:block absolute top-20 right-0 w-6 h-6 text-[#0F766E]/5 dark:text-white/5 animate-float-slower"
            aria-hidden="true"
          />

          <div className="inline-flex items-center gap-1.5 mb-5 px-3 py-1 rounded-full bg-[#0F766E]/8 border border-[#0F766E]/15 dark:bg-white/5 dark:border-white/10">
            <Sparkles className="w-3 h-3 text-[#0F766E] dark:text-[#2dd4bf]" />
            <span className="font-mono text-xs font-medium tracking-wide uppercase text-[#0F766E] dark:text-[#2dd4bf]">
              What&apos;s Actually Inside
            </span>
          </div>

          <SplitHeading
            text="Real infrastructure, not a feature checklist."
            accentWord="infrastructure"
            className="font-heading text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-(--text-heading) dark:text-white mb-5"
          />

          <p className="text-(--text-body) dark:text-gray-400 text-lg leading-relaxed">
            Every panel below is a real part of the product — scheduling,
            delivery tracking, subscriber management, templates, and the API
            behind all of it.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 lg:auto-rows-[minmax(160px,auto)] gap-6">
          {/* Campaign Scheduling — large card */}
          <BentoCard index={0} className="lg:col-span-4 lg:row-span-2">
            <h3 className="font-heading text-lg font-semibold text-(--text-heading) dark:text-white mb-2">
              Campaign Scheduling
            </h3>
            <p className="text-(--text-body) dark:text-gray-400 text-sm leading-relaxed mb-6 max-w-sm">
              Schedule a campaign for a future time and timezone. A Celery
              Beat job checks every minute for what&apos;s due and queues it —
              database state drives the send, not a timer in your browser.
            </p>

            <div className="mt-auto rounded-xl border border-black/5 dark:border-white/10 bg-(--surface-features) dark:bg-[#0B1220] p-5">
              <div className="flex items-center gap-2 mb-4 font-mono text-xs">
                {["Mon", "Tue", "Wed"].map((day) => (
                  <span
                    key={day}
                    className={cn(
                      "px-2.5 py-1 rounded-md",
                      day === "Wed"
                        ? "bg-[#0F766E] text-white"
                        : "bg-black/5 dark:bg-white/10 text-(--text-body) dark:text-gray-400"
                    )}
                  >
                    {day}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-3 font-mono text-xs text-(--text-body) dark:text-gray-400 mb-4">
                <span>09:00 AM</span>
                <span className="text-black/20 dark:text-white/20">·</span>
                <span>UTC</span>
              </div>
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="flex items-center justify-center w-4 h-4 rounded-full bg-[#22C55E]/15 text-[#22C55E]">
                  <Check className="w-2.5 h-2.5" />
                </span>
                <span className="text-[#22C55E] font-medium">Scheduled</span>
              </div>
            </div>
          </BentoCard>

          {/* Delivery Tracking */}
          <BentoCard index={1} className="lg:col-span-2">
            <h3 className="font-heading text-base font-semibold text-(--text-heading) dark:text-white mb-2">
              Delivery Tracking
            </h3>
            <p className="text-(--text-body) dark:text-gray-400 text-sm leading-relaxed mb-5">
              Every send is logged per recipient via its AWS SES message ID —
              sent, failed, or bounced.
            </p>

            <div className="mt-auto space-y-2.5">
              {[
                { label: "Sent", value: 92, color: "#0F766E" },
                { label: "Failed", value: 5, color: "#F59E0B" },
                { label: "Bounced", value: 3, color: "#EF4444" },
              ].map((row) => (
                <div key={row.label} className="flex items-center gap-2">
                  <span className="w-14 shrink-0 font-mono text-[11px] text-(--text-body) dark:text-gray-400">
                    {row.label}
                  </span>
                  <div className="flex-1 h-1.5 rounded-full bg-black/5 dark:bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${row.value}%`, backgroundColor: row.color }}
                    />
                  </div>
                </div>
              ))}
              <p className="font-mono text-[10px] text-(--text-body)/70 dark:text-gray-500 pt-1">
                Example campaign, not aggregate data
              </p>
            </div>
          </BentoCard>

          {/* REST API */}
          <BentoCard index={2} className="lg:col-span-2">
            <h3 className="font-heading text-base font-semibold text-(--text-heading) dark:text-white mb-2">
              REST API
            </h3>
            <p className="text-(--text-body) dark:text-gray-400 text-sm leading-relaxed mb-5">
              Every dashboard action is a FastAPI endpoint underneath — create,
              schedule, and cancel campaigns from your own backend.
            </p>

            <div className="mt-auto rounded-xl border border-black/5 dark:border-white/10 bg-(--surface-features) dark:bg-[#0B1220] p-4 font-mono text-xs space-y-1.5">
              <div className="text-(--text-body) dark:text-gray-400">
                <span className="text-[#0F766E] dark:text-[#2dd4bf]">POST</span>{" "}
                /api/campaigns
              </div>
              <div className="text-(--text-body)/70 dark:text-gray-500">
                {"{ \"status\": \"draft\" }"}
              </div>
            </div>
          </BentoCard>

          {/* Subscriber Widget */}
          <BentoCard index={3} className="lg:col-span-3">
            <h3 className="font-heading text-base font-semibold text-(--text-heading) dark:text-white mb-2">
              Embeddable Subscriber Widget
            </h3>
            <p className="text-(--text-body) dark:text-gray-400 text-sm leading-relaxed mb-5">
              Drop a subscribe form on your own site. Origin is validated
              against your company&apos;s registered website before anyone joins.
            </p>

            <div className="mt-auto rounded-xl border border-black/5 dark:border-white/10 bg-(--surface-features) dark:bg-[#0B1220] p-4 flex items-center gap-2">
              <div className="flex-1 h-8 rounded-md border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 flex items-center px-3 font-mono text-[11px] text-(--text-body)/70 dark:text-gray-500">
                you@company.com
              </div>
              <span className="h-8 px-3 rounded-md bg-[#0F766E] text-white text-[11px] font-mono flex items-center">
                Subscribe
              </span>
            </div>
          </BentoCard>

          {/* Templates */}
          <BentoCard index={4} className="lg:col-span-3">
            <h3 className="font-heading text-base font-semibold text-(--text-heading) dark:text-white mb-2">
              Reusable Templates
            </h3>
            <p className="text-(--text-body) dark:text-gray-400 text-sm leading-relaxed mb-5">
              HTML templates with named variables and file uploads for
              assets, with every edit kept as a version.
            </p>

            <div className="mt-auto rounded-xl border border-black/5 dark:border-white/10 bg-(--surface-features) dark:bg-[#0B1220] p-4 font-mono text-xs text-(--text-body) dark:text-gray-400">
              Hi{" "}
              <span className="px-1.5 py-0.5 rounded bg-[#0F766E]/10 text-[#0F766E] dark:text-[#2dd4bf]">
                {"{{first_name}}"}
              </span>
              ,
            </div>
          </BentoCard>
        </div>
      </div>
    </section>
  );
}

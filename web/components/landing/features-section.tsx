"use client";

import { Rocket, Brain, BarChart3 } from "lucide-react";

const features = [
  {
    icon: Rocket,
    title: "Inbox-First Delivery",
    description:
      "Emails that actually arrive — not disappear. Our enterprise-grade sending infrastructure is built to maximize inbox placement, not spam folders. Warm-up, throttling, and reputation safeguards are handled automatically.",
    highlight: "Higher open rates without fighting email providers.",
  },
  {
    icon: Brain,
    title: "Smart Campaign Automation",
    description:
      "Send the right email at the right moment — automatically. Design customer journeys using behavior-based triggers, time delays, and conditional logic — no cron jobs, no glue code.",
    useCases: [
      "Welcome flows",
      "Re-engagement campaigns",
      "Transactional follow-ups",
    ],
  },
  {
    icon: BarChart3,
    title: "Actionable Analytics",
    description:
      "Know exactly what’s working — and what isn’t. Track opens, clicks, bounces, and conversions in real time. Segment performance by campaign, user, or timeframe to make smarter decisions faster.",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#1D1E20]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center space-y-6 mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#180D39] dark:text-white">
            Scale your communication without complexity.
          </h2>
          <p className="text-gray-700 dark:text-gray-300 text-lg max-w-3xl mx-auto leading-relaxed">
            Our enterprise-grade infrastructure ensures your newsletters land in
            the inbox, not the spam folder.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="p-8 rounded-xl bg-[#E9F3F4] dark:bg-[#2A8E9E]/10 border border-[#2A8E9E]/20 hover:border-[#2A8E9E]/50 hover:bg-[#E9F3F4]/80 dark:hover:bg-[#2A8E9E]/20 hover:shadow-lg transition-all duration-300 cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-lg bg-[#2A8E9E]/20 flex items-center justify-center mb-4 group-hover:bg-[#2A8E9E]/30 transition-colors">
                  <Icon className="w-6 h-6 text-[#2A8E9E]" />
                </div>
                <h3 className="text-lg font-semibold text-[#180D39] dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-4">
                  {feature.description}
                </p>
                {feature.highlight && (
                  <p className="text-sm text-[#2A8E9E] font-medium italic">
                    Why this matters: {feature.highlight}
                  </p>
                )}
                {feature.useCases && (
                  <div className="mt-4 pt-4 border-t border-[#2A8E9E]/20">
                    <p className="text-xs font-semibold text-[#180D39] dark:text-white mb-2">Use cases:</p>
                    <ul className="space-y-1">
                      {feature.useCases.map((useCase) => (
                        <li key={useCase} className="text-xs text-gray-700 dark:text-gray-300 flex items-center gap-2">
                          <span className="w-1 h-1 bg-[#2A8E9E] rounded-full"></span>
                          {useCase}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

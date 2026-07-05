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
      "Know exactly what's working — and what isn't. Track opens, clicks, bounces, and conversions in real time. Segment performance by campaign, user, or timeframe to make smarter decisions faster.",
  },
];

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="py-24 px-4 sm:px-6 lg:px-8 bg-(--surface-features) dark:bg-[#0B1220]"
    >
      <div className="max-w-5xl mx-auto">
        <div className="max-w-2xl mb-20">
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-(--text-heading) dark:text-white mb-5">
            Scale your communication without complexity.
          </h2>
          <p className="text-(--text-body) dark:text-gray-400 text-lg leading-relaxed">
            Enterprise-grade infrastructure that ensures your newsletters land
            in the inbox, not the spam folder.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-x-12 gap-y-14">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className={`${idx > 0 ? "md:pl-12 md:border-l md:border-black/10 dark:md:border-white/10" : ""}`}
              >
                <Icon
                  className="w-5 h-5 text-[#0F766E] dark:text-[#2dd4bf] mb-5"
                  strokeWidth={1.75}
                />
                <h3 className="font-heading text-lg font-semibold text-(--text-heading) dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-(--text-body) dark:text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
                {feature.highlight && (
                  <p className="mt-4 text-sm text-[#0F766E] dark:text-[#2dd4bf] font-medium">
                    {feature.highlight}
                  </p>
                )}
                {feature.useCases && (
                  <ul className="mt-4 space-y-1.5">
                    {feature.useCases.map((useCase) => (
                      <li
                        key={useCase}
                        className="text-xs text-(--text-body) dark:text-gray-400 flex items-center gap-2"
                      >
                        <span className="w-1 h-1 bg-(--brand-accent) rounded-full" />
                        {useCase}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

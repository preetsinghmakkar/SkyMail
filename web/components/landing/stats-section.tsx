"use client";

import { Send, TrendingUp, Zap } from "lucide-react";

export function StatsSection() {
  const stats = [
    {
      icon: Send,
      number: "50M+",
      label: "Emails Delivered",
      description: "Reaching over 10,000 brands across our customer base globally.",
    },
    {
      icon: TrendingUp,
      number: "38%",
      label: "Avg Open Rate",
      description:
        "Industry-leading inbox placement ensures your emails reach inboxes, not spam folders.",
    },
    {
      icon: Zap,
      number: "99.9%",
      label: "Uptime",
      description: "Enterprise-grade infrastructure built for reliability and scale.",
    },
  ];

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-(--surface-stats) dark:bg-[#0B1220]">
      <div className="absolute inset-x-0 top-0 z-0 h-28 sm:h-36 pointer-events-none bg-[linear-gradient(to_bottom,var(--surface-features)_0%,transparent_100%)] dark:hidden" />

      <div className="relative max-w-6xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-(--text-heading) dark:text-white">
            Trusted by leading teams
          </h2>
          <p className="text-lg text-(--text-body) dark:text-gray-400 max-w-2xl mx-auto">
            Built with enterprise reliability and scale
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="relative group">
                <div className="relative p-8 rounded-2xl bg-white dark:bg-white/3 border border-black/5 dark:border-white/10 group-hover:border-[#0F766E]/40 transition-all duration-300 space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-[#0F766E]/10 flex items-center justify-center group-hover:bg-[#0F766E]/20 transition-colors duration-300">
                    <Icon className="w-6 h-6 text-[#0F766E] dark:text-[#2dd4bf]" />
                  </div>
                  <div>
                    <div className="font-mono text-4xl sm:text-5xl font-semibold text-[#0F766E] dark:text-[#2dd4bf] mb-2">
                      {stat.number}
                    </div>
                    <h3 className="font-heading text-lg font-semibold text-(--text-heading) dark:text-white mb-3">
                      {stat.label}
                    </h3>
                    <p className="text-(--text-body) dark:text-gray-400 text-sm leading-relaxed">
                      {stat.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

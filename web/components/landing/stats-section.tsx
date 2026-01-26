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
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#1D1E20]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#180D39] dark:text-white">
            Trusted by leading teams
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            Built with enterprise reliability and scale
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-[#2A8E9E]/10 to-[#2A8E9E]/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative p-8 rounded-2xl bg-[#E9F3F4] dark:bg-[#2A8E9E]/10 border border-[#2A8E9E]/20 group-hover:border-[#2A8E9E]/50 transition-all duration-300 space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-[#2A8E9E]/20 flex items-center justify-center group-hover:bg-[#2A8E9E]/30 transition-colors duration-300">
                    <Icon className="w-6 h-6 text-[#2A8E9E]" />
                  </div>
                  <div>
                    <div className="text-4xl sm:text-5xl font-bold text-[#2A8E9E] mb-2">{stat.number}</div>
                    <h3 className="text-lg font-semibold text-[#180D39] dark:text-white mb-3">{stat.label}</h3>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{stat.description}</p>
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

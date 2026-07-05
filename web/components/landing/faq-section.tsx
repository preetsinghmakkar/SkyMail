"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const faqs = [
  {
    question: "What email provider does SkyMail use?",
    answer:
      "Amazon SES. Every campaign is sent in batches through SES, with automatic retries if a batch fails to send.",
  },
  {
    question: "How does scheduling actually work?",
    answer:
      "You schedule a campaign for a specific UTC time. A Celery Beat job checks every minute for campaigns that are due and queues them for sending — it's database state driving execution, not a timer sitting in your browser tab.",
  },
  {
    question: "Can I track delivery?",
    answer:
      "Yes. Every recipient's send attempt is logged as sent, failed, or bounced, tied to its AWS SES message ID, and a campaign's status shows the totals. There's no open or click tracking today — just delivery status.",
  },
  {
    question: "Do you support automated drip sequences or triggers?",
    answer:
      "Not yet. SkyMail currently supports one-time scheduled campaigns. Welcome emails, delay-based triggers, and multi-step automation aren't built — we'd rather say that plainly than pretend otherwise.",
  },
  {
    question: "Is there a free plan?",
    answer:
      "Yes — up to 1,000 subscribers on the free tier, no credit card required to start.",
  },
  {
    question: "Can I customize email templates?",
    answer:
      "Yes. Templates support named variables filled in per campaign, file uploads for assets, and every edit is kept as a version.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-(--surface-faq) dark:bg-[#0B1220]">
      <div className="absolute inset-x-0 top-0 z-0 h-28 sm:h-36 pointer-events-none bg-[linear-gradient(to_bottom,var(--surface-pricing)_0%,transparent_100%)] dark:hidden" />

      <div className="relative max-w-3xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-(--text-heading) dark:text-white mb-4">
            Common questions.
          </h2>
          <p className="text-lg text-(--text-body) dark:text-gray-400">
            Straight answers, including where SkyMail falls short today.
          </p>
        </div>

        <div className="divide-y divide-black/5 dark:divide-white/10 border-y border-black/5 dark:border-white/10">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={faq.question}>
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 py-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-heading font-medium text-(--text-heading) dark:text-white">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 shrink-0 text-(--text-body) dark:text-gray-400 transition-transform duration-300",
                      isOpen && "rotate-180"
                    )}
                  />
                </button>
                <div
                  className={cn(
                    "grid transition-all duration-300 ease-out",
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="text-(--text-body) dark:text-gray-400 text-sm leading-relaxed pb-5 max-w-xl">
                      {faq.answer}
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

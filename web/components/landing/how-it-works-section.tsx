"use client";

import { cn } from "@/lib/utils/cn";
import { useInView } from "@/lib/hooks/use-in-view";
import { SplitHeading } from "@/components/landing/split-heading";

const steps = [
  {
    title: "Create a campaign",
    description:
      "Write a subject line and pick one of your HTML templates. The campaign starts as a draft.",
  },
  {
    title: "Fill in the details",
    description:
      "Set the template's variables and confirm the subscriber list it goes out to.",
  },
  {
    title: "Schedule it",
    description:
      "Pick a send time and timezone. The campaign's status flips from draft to scheduled.",
  },
  {
    title: "Celery Beat picks it up",
    description:
      "A scheduler task checks every minute for campaigns that are due, and queues them for sending.",
  },
  {
    title: "AWS SES delivers",
    description:
      "Emails go out in batches through Amazon SES, with automatic retries if a batch fails.",
  },
  {
    title: "Delivery is logged",
    description:
      "Every recipient's send attempt is recorded — sent, failed, or bounced — for that campaign.",
  },
];

function Step({
  index,
  title,
  description,
  isLast,
}: {
  index: number;
  title: string;
  description: string;
  isLast: boolean;
}) {
  const { ref, inView } = useInView<HTMLLIElement>(0.4);

  return (
    <li ref={ref} className="relative pl-14 pb-12 last:pb-0">
      {!isLast && (
        <>
          <span className="absolute left-4 top-9 bottom-0 w-px bg-black/10 dark:bg-white/10" />
          <span
            className={cn(
              "absolute left-4 top-9 bottom-0 w-px origin-top bg-[#0F766E] transition-transform duration-700 ease-out",
              inView ? "scale-y-100" : "scale-y-0"
            )}
          />
        </>
      )}

      <span
        className={cn(
          "absolute left-0 top-0 flex h-9 w-9 items-center justify-center rounded-full border font-mono text-xs font-medium transition-colors duration-500",
          inView
            ? "border-[#0F766E] bg-[#0F766E] text-white"
            : "border-black/15 dark:border-white/15 bg-white dark:bg-[#0F172A] text-(--text-body) dark:text-gray-400"
        )}
      >
        {index + 1}
      </span>

      <div
        className={cn(
          "transition-all duration-700 ease-out",
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
        )}
      >
        <h3 className="font-heading text-lg font-semibold text-(--text-heading) dark:text-white mb-1.5">
          {title}
        </h3>
        <p className="text-(--text-body) dark:text-gray-400 text-sm leading-relaxed max-w-md">
          {description}
        </p>
      </div>
    </li>
  );
}

export function HowItWorksSection() {
  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-(--surface-how) dark:bg-[#0B1220]">

      <div className="relative max-w-5xl mx-auto">
        <div className="max-w-2xl mb-16">
          <div className="inline-flex items-center gap-1.5 mb-5 px-3 py-1 rounded-full bg-[#0F766E]/8 border border-[#0F766E]/15 dark:bg-white/5 dark:border-white/10">
            <span className="font-mono text-xs font-medium tracking-wide uppercase text-[#0F766E] dark:text-[#2dd4bf]">
              The Pipeline
            </span>
          </div>

          <SplitHeading
            text="How SkyMail works."
            accentWord="works"
            className="font-heading text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-(--text-heading) dark:text-white mb-5"
          />

          <p className="text-(--text-body) dark:text-gray-400 text-lg leading-relaxed">
            From draft to inbox — this is the real pipeline behind every
            campaign, not a marketing diagram.
          </p>
        </div>

        <ol className="max-w-lg">
          {steps.map((step, i) => (
            <Step
              key={step.title}
              index={i}
              title={step.title}
              description={step.description}
              isLast={i === steps.length - 1}
            />
          ))}
        </ol>
      </div>
    </section>
  );
}

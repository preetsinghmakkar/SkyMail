"use client";

import { SplitHeading } from "@/components/landing/split-heading";

const stack = ["FastAPI", "PostgreSQL", "Redis", "Celery", "AWS SES", "JWT Auth"];

// Mirrors the real POST /api/campaigns contract (see app/modules/campaign/schemas.py):
// campaigns are created in "draft" status and scheduled separately.
const requestExample = `curl -X POST /api/campaigns \\
  -H "Authorization: Bearer $TOKEN" \\
  -d '{
    "name": "March Product Update",
    "template_id": "b7e4-...",
    "constants_values": { "first_name": "Alex" },
    "scheduled_for": "2026-03-01T09:00:00Z"
  }'`;

const responseExample = `{
  "id": "c9f1-...",
  "status": "draft"
}`;

export function DeveloperSection() {
  return (
    <section
      id="developers"
      className="relative py-24 px-4 sm:px-6 lg:px-8 bg-(--surface-dev) dark:bg-[#0B1220]"
    >
      <div className="absolute inset-x-0 top-0 z-0 h-28 sm:h-36 pointer-events-none bg-[linear-gradient(to_bottom,var(--surface-features)_0%,transparent_100%)] dark:hidden" />

      <div className="relative max-w-4xl mx-auto">
        <div className="max-w-2xl mb-10">
          <div className="inline-flex items-center gap-1.5 mb-5 px-3 py-1 rounded-full bg-[#0F766E]/8 border border-[#0F766E]/15 dark:bg-white/5 dark:border-white/10">
            <span className="font-mono text-xs font-medium tracking-wide uppercase text-[#0F766E] dark:text-[#2dd4bf]">
              Developer Experience
            </span>
          </div>

          <SplitHeading
            text="Built on tools you already trust."
            accentWord="trust"
            className="font-heading text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-(--text-heading) dark:text-white mb-5"
          />

          <p className="text-(--text-body) dark:text-gray-400 text-lg leading-relaxed">
            No proprietary black box — a straightforward REST API sits on top
            of FastAPI, Postgres, Redis, Celery and AWS SES.
          </p>
        </div>

        {/* Real request/response shape for POST /api/campaigns */}
        <div className="rounded-xl border border-black/10 dark:border-white/10 bg-[#0F172A] shadow-xl overflow-hidden">
          <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/10">
            <span className="h-2.5 w-2.5 rounded-full bg-[#EF4444]/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#F59E0B]/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#22C55E]/70" />
          </div>

          <pre className="p-6 font-mono text-[13px] leading-relaxed text-gray-300 overflow-x-auto">
            <span className="text-[#2dd4bf]">$</span> {requestExample}
            {"\n\n"}
            <span className="text-[#22C55E]">201 Created</span>
            {"\n"}
            {responseExample}
          </pre>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {stack.map((item) => (
            <span
              key={item}
              className="font-mono text-xs px-3 py-1.5 rounded-full border border-black/10 dark:border-white/10 text-(--text-body) dark:text-gray-400"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

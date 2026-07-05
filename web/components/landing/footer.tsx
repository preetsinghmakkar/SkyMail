"use client";

import Link from "next/link";

export function Footer() {
  const links = {
    Solutions: [
      { label: "Bulk Email", href: "#" },
      { label: "Transactional", href: "#" },
      { label: "API Access", href: "#" },
      { label: "Automation", href: "#" },
    ],
    Company: [
      { label: "About", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Customers", href: "#" },
      { label: "Careers", href: "#" },
    ],
    Support: [
      { label: "Documentation", href: "#" },
      { label: "Changelog", href: "#" },
      { label: "Support Portal", href: "#" },
      { label: "Pricing", href: "#pricing" },
    ],
  };

  return (
    <footer className="relative overflow-hidden bg-(--surface-footer) text-white">
      {/* Blend down from the CTA section instead of a hard cut */}
      <div className="absolute inset-x-0 top-0 z-0 h-20 pointer-events-none bg-[linear-gradient(to_bottom,var(--surface-cta)_0%,transparent_100%)]" />
      {/* Subtle grid texture so the dark footer doesn't read as a flat void */}
      <div className="absolute inset-0 z-0 bg-grid-faint mask-[radial-gradient(ellipse_at_top,black,transparent_75%)]" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-5 gap-10 mb-16">
          {/* Brand */}
          <div className="col-span-1">
            <Link href="/" className="font-heading font-semibold text-lg text-white">
              SkyMail
            </Link>
            <p className="text-sm text-gray-400 mt-4">
              The simple way to reach your audience at scale.
            </p>
          </div>

          {/* Links */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h3 className="font-heading font-semibold text-white mb-6">
                {category}
              </h3>
              <ul className="space-y-3">
                {items.map((item, idx) => (
                  <li key={`${category}-${item.label}-${idx}`}>
                    <Link
                      href={item.href}
                      className="text-sm text-gray-400 hover:text-[#2dd4bf] transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-sm text-gray-400">
            © 2026 SkyMail Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="#"
              className="text-sm text-gray-400 hover:text-[#2dd4bf] transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-sm text-gray-400 hover:text-[#2dd4bf] transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

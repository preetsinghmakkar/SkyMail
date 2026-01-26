"use client";

import Link from "next/link";
import { Plane } from "lucide-react";

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
      { label: "Pricing", href: "#" },
    ],
  };

  return (
    <footer className="border-t border-[#2A8E9E]/20 dark:border-[#2A8E9E]/20 bg-white dark:bg-[#1D1E20]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-5 gap-10 mb-16">
          {/* Brand */}
          <div className="col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-[#2A8E9E] to-[#1D7A89] rounded-lg flex items-center justify-center">
                <Plane className="w-5 h-5 text-white" />
              </div>
              <span className="text-[#180D39] dark:text-white">SkyMail</span>
            </Link>
            <p className="text-sm text-gray-700 dark:text-gray-400">
              The simple way to reach your audience at scale.
            </p>
          </div>

          {/* Links */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h3 className="font-semibold text-[#180D39] dark:text-white mb-6">
                {category}
              </h3>
              <ul className="space-y-3">
                {items.map((item, idx) => (
                  <li key={`${category}-${item.label}-${idx}`}>
                    <Link
                      href={item.href}
                      className="text-sm text-gray-700 hover:text-[#2A8E9E] dark:text-gray-400 dark:hover:text-[#2A8E9E] transition-colors"
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
        <div className="border-t border-[#2A8E9E]/20 dark:border-[#2A8E9E]/20 pt-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-sm text-gray-700 dark:text-gray-400">
            © 2026 SkyMail Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="#"
              className="text-sm text-gray-700 hover:text-[#2A8E9E] dark:text-gray-400 dark:hover:text-[#2A8E9E] transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-sm text-gray-700 hover:text-[#2A8E9E] dark:text-gray-400 dark:hover:text-[#2A8E9E] transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

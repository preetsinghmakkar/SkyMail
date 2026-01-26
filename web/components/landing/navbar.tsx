"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plane, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils/cn";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: "Products", href: "#products" },
    { label: "Pricing", href: "#pricing" },
    { label: "Resources", href: "#resources" },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 mx-auto px-4 py-4 sm:px-6 lg:px-8",
        "bg-white/60 backdrop-blur-xl border border-white/40 dark:bg-[#180D39]/40 dark:border-white/10",
        "m-4 rounded-2xl sm:rounded-full max-w-5xl ml-auto mr-auto left-0 right-0"
      )}
    >
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="w-8 h-8 bg-gradient-to-br from-[#2A8E9E] to-[#1D7A89] rounded-lg flex items-center justify-center">
            <Plane className="w-5 h-5 text-white" />
          </div>
          <span className="hidden sm:inline text-[#180D39] dark:text-white">
            SkyMail
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-10">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-base font-medium text-gray-700 hover:text-[#2A8E9E] dark:text-gray-300 dark:hover:text-[#2A8E9E] transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Button variant="ghost" size="default" className="text-[#180D39] hover:text-[#2A8E9E] text-base" asChild>
            <Link href="/auth/login">Login</Link>
          </Button>
          <Button size="default" className="bg-[#2A8E9E] hover:bg-[#1D7A89] text-white text-base px-5" asChild>
            <Link href="/auth/register">Get Started</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 hover:bg-[#E9F3F4] dark:hover:bg-[#2A8E9E]/20 rounded-lg transition-colors"
        >
          {isOpen ? (
            <X className="w-5 h-5 text-[#180D39] dark:text-white" />
          ) : (
            <Menu className="w-5 h-5 text-[#180D39] dark:text-white" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-[#2A8E9E]/20 dark:border-gray-800">
          <div className="flex flex-col gap-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 text-base font-medium text-gray-700 hover:text-[#2A8E9E] dark:text-gray-300 dark:hover:text-[#2A8E9E] transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-2">
              <Button variant="outline" size="default" className="w-full border-[#2A8E9E] text-[#2A8E9E] hover:bg-[#E9F3F4] text-base" asChild>
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button size="default" className="w-full bg-[#2A8E9E] hover:bg-[#1D7A89] text-white text-base" asChild>
                <Link href="/auth/register">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

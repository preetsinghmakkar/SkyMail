"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils/cn";
import { GithubIcon } from "@/components/landing/github-icon";

const GITHUB_URL = "https://github.com/preetsinghmakkar/SkyMail";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { label: "Features", href: "#features" },
    { label: "Docs", href: "#developers" },
    { label: "Pricing", href: "#pricing" },
  ];

  return (
    // Positioning shell: full-bleed and aligns its child with flex. On
    // mobile only the hamburger renders, which reads best pinned to the
    // top-right corner (`justify-end`); at `md`+, the full nav pill is
    // centered instead (`justify-center`). Using flex for alignment (not
    // `left-0 right-0` + `mx-auto` on the pill itself) also sidesteps a
    // browser inconsistency with centering a fit-content-width element.
    <div
      className={cn(
        "fixed top-0 left-0 right-0 z-50 flex justify-end md:justify-center transition-all duration-300",
        scrolled ? "p-3" : "p-4"
      )}
    >
      <nav
        className={cn(
          // Collapsed (hamburger only), the pill hugs its content. Open on
          // mobile, it needs to expand into a real menu panel instead of
          // staying icon-sized — md+ always hugs content since the full
          // inline nav there doesn't use this open/closed state at all.
          isOpen ? "w-[calc(100vw-2rem)]" : "w-fit",
          "md:w-fit px-3 sm:px-6 lg:px-8 transition-all duration-300",
          scrolled ? "py-2.5" : "py-4",
          scrolled
            ? "bg-white/90 backdrop-blur-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] dark:bg-[#0B1520]/85"
            : "bg-white/70 backdrop-blur-xl dark:bg-[#0F172A]/60",
          "border border-black/5 dark:border-white/10 rounded-2xl sm:rounded-full"
        )}
      >
        {/*
          A single flex row, right-anchored with `justify-end`. That
          alignment works the same whether there are four visible children
          (desktop: nav links + Github + auth buttons) or one (mobile: just
          the hamburger).
        */}
        <div className="flex items-center justify-end gap-8 md:gap-10">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8 md:gap-10">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-base font-medium text-[#475569] hover:text-[#0F766E] dark:text-gray-300 dark:hover:text-[#2dd4bf] transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-base font-medium text-[#475569] hover:text-[#0F766E] dark:text-gray-300 dark:hover:text-[#2dd4bf] transition-colors"
            >
              <GithubIcon className="w-4 h-4" />
              Github
            </a>
          </div>

          {/* Auth Buttons (desktop) */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="ghost"
              size={scrolled ? "sm" : "default"}
              className="text-base transition-all"
              asChild
            >
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button
              size={scrolled ? "sm" : "default"}
              className="text-base px-5 transition-all"
              asChild
            >
              <Link href="/auth/register">Start Free</Link>
            </Button>
          </div>

          {/* Hamburger (mobile only) */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
          >
            {isOpen ? (
              <X className="w-5 h-5 text-[#0F172A] dark:text-white" />
            ) : (
              <Menu className="w-5 h-5 text-[#0F172A] dark:text-white" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-black/5 dark:border-white/10">
            <div className="flex flex-col gap-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-3 py-2 text-base font-medium text-[#475569] hover:text-[#0F766E] dark:text-gray-300 dark:hover:text-[#2dd4bf] transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 text-base font-medium text-[#475569] hover:text-[#0F766E] dark:text-gray-300 dark:hover:text-[#2dd4bf] transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <GithubIcon className="w-4 h-4" />
                Github
              </a>
              <div className="flex flex-col gap-2 pt-2">
                <Button variant="outline" size="default" className="w-full text-base" asChild>
                  <Link href="/auth/login">Login</Link>
                </Button>
                <Button size="default" className="w-full text-base" asChild>
                  <Link href="/auth/register">Start Free</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}

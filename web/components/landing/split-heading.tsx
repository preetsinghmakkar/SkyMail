"use client";

import { cn } from "@/lib/utils/cn";
import { useInView } from "@/lib/hooks/use-in-view";

interface SplitHeadingProps {
  text: string;
  accentWord?: string;
  className?: string;
}

export function SplitHeading({ text, accentWord, className }: SplitHeadingProps) {
  const { ref, inView } = useInView<HTMLHeadingElement>(0.3);
  const words = text.split(" ");
  const cleanAccent = accentWord?.replace(/[.,]/g, "");

  return (
    <h2 ref={ref} className={className}>
      {words.map((word, i) => {
        const clean = word.replace(/[.,]/g, "");
        const isAccent = cleanAccent && clean === cleanAccent;

        return (
          <span key={i} className="inline-block overflow-hidden align-bottom mr-[0.28em]">
            <span
              className={cn(
                "inline-block transition-[transform,opacity] duration-700 ease-out",
                inView ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
              )}
              style={{ transitionDelay: `${i * 70}ms` }}
            >
              {isAccent ? (
                <span className="text-[#0F766E] bg-[linear-gradient(#0F766E,#0F766E)] bg-no-repeat bg-[position:0_100%] bg-[length:0%_2px] pb-0.5 transition-[background-size] duration-300 hover:bg-[length:100%_2px]">
                  {word}
                </span>
              ) : (
                word
              )}
            </span>
          </span>
        );
      })}
    </h2>
  );
}

"use client";

import { useRef } from "react";
import Image from "next/image";

/**
 * Single flattened painting, so true multi-plane parallax (separate mountain /
 * tree / foreground depths) isn't available — this approximates "alive"
 * motion with an ambient Ken Burns drift plus a whole-image mouse parallax.
 */
export function HeroBackground() {
  const layerRef = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = layerRef.current;
    if (!el) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    const maxShift = 10;
    el.style.setProperty("--parallax-x", `${(-relX * maxShift).toFixed(2)}px`);
    el.style.setProperty("--parallax-y", `${(-relY * maxShift).toFixed(2)}px`);
  }

  function handleMouseLeave() {
    layerRef.current?.style.setProperty("--parallax-x", "0px");
    layerRef.current?.style.setProperty("--parallax-y", "0px");
  }

  return (
    <div
      className="absolute inset-0 -z-20 overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={layerRef}
        className="absolute inset-0 transition-transform duration-300 ease-out will-change-transform"
        style={{
          transform:
            "translate3d(var(--parallax-x, 0px), var(--parallax-y, 0px), 0)",
        }}
      >
        <div className="absolute [inset:-4%] animate-hero-drift">
          <Image
            src="/hero_skymail.png"
            alt=""
            fill
            priority
            quality={95}
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}

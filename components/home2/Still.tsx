"use client";

import Image from "next/image";
import type { Frame } from "./frames";

// O fotogramă care umple cutia părintelui (cutia dă mărimea și proporția). Imaginile Mux vin deja la lățimea cerută.
export function Still({
  frame,
  width,
  sizes,
  priority = false,
  eager = false,
  className = "",
}: {
  frame: Omit<Frame, "project">;
  width: number;
  sizes: string;
  priority?: boolean;
  eager?: boolean;
  className?: string;
}) {
  return (
    <Image
      src={frame.src(width)}
      alt={frame.alt}
      fill
      sizes={sizes}
      priority={priority}
      loading={priority ? undefined : eager ? "eager" : "lazy"}
      unoptimized={frame.remote}
      draggable={false}
      className={`object-cover ${className}`}
    />
  );
}

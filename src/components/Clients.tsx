"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import * as icons from "simple-icons";
import type { SimpleIcon } from "simple-icons";
import { CLIENTS, CLIENTS_HEADING, ClientData } from "@/src/data/clients";
import { DragMarquee } from "@/src/components/ui/DragMarquee";
import { cn } from "@/src/lib/cn";

export function Clients() {

  // Prepare differently shifted rows so repeats never perfectly align vertically
  const ROW_1 = [...CLIENTS];
  const ROW_2 = [...CLIENTS];
  // Shift row 2 by a significant amount (e.g., halfway)
  const shiftAmount = Math.floor(CLIENTS.length / 2);
  for (let i = 0; i < shiftAmount; i++) {
    ROW_2.push(ROW_2.shift() as ClientData);
  }

  return (
    <section
      id="clients"
      data-tone="light"
      className="relative isolate overflow-x-clip bg-white flex flex-col justify-center border-y border-grey-100 min-h-[60svh] py-[var(--section-y)]"
      
    >
      <div className="mx-auto w-full max-w-[1240px] flex flex-col justify-center h-full">
        {/* Header — Centred. */}
        <div className="text-center mb-8 md:mb-12 w-full shrink-0 px-[clamp(16px,4vw,48px)]">
          <h2 className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 leading-normal flex-wrap">
            <span
              className="font-display italic uppercase text-maroon-900"
              style={{
                fontSize: "clamp(2rem, 6vw, 4.5rem)",
                letterSpacing: "0.02em",
                fontWeight: 600,
              }}
            >
              {CLIENTS_HEADING.part1}
            </span>
            <span
              className="font-sans font-medium text-text-dark"
              style={{
                fontSize: "clamp(2rem, 6vw, 4.5rem)",
              }}
            >
              {CLIENTS_HEADING.part2}
            </span>
          </h2>
        </div>

        {/* Marquee Rows */}
        <div className="w-[105%] -ml-[2.5%] flex flex-col border-y border-grey-100 bg-grey-100 gap-px">
          {/* Row 1 */}
          <div className="w-full bg-white relative">
            <DragMarquee speed={35} gap={0} className="w-full">
              {ROW_1.map((c, i) => (
                <ClientTile key={`row1-${c.slug}-${i}`} client={c} />
              ))}
            </DragMarquee>
          </div>
          {/* Row 2 */}
          <div className="w-full bg-white relative">
            <DragMarquee speed={28} direction="right" gap={0} className="w-full">
              {ROW_2.map((c, i) => (
                <ClientTile key={`row2-${c.slug}-${i}`} client={c} />
              ))}
            </DragMarquee>
          </div>
        </div>
      </div>
    </section>
  );
}

function ClientTile({ client }: { client: ClientData }) {
  const [imageError, setImageError] = useState(false);

  let iconWrapper: SimpleIcon | null = null;
  if (client.placeholder) {
    const iconKey = "si" + client.slug.charAt(0).toUpperCase() + client.slug.slice(1);
    // Use type assertion conservatively just for indexing the module
    iconWrapper = (icons as Record<string, SimpleIcon>)[iconKey] || null;
  }

  return (
    <div
      className={cn(
        "group shrink-0 flex items-center justify-center bg-white",
        "w-[170px] h-[100px] md:w-[clamp(200px,22vw,320px)] md:h-[clamp(110px,16svh,170px)]",
        "border-r border-grey-100"
      )}
    >
      <div className="w-[70%] h-[60%] flex items-center justify-center transition-transform duration-500 ease-out group-hover:scale-110">
        {client.logoUrl && !imageError ? (
          <div className="relative w-full h-full">
            <Image
              src={client.logoUrl}
              alt={client.name}
              fill
              className="object-contain transition-transform duration-500 ease-out"
              sizes="(max-width: 768px) 170px, 320px"
              onError={() => setImageError(true)}
            />
          </div>
        ) : iconWrapper ? (
          <svg
            viewBox="0 0 24 24"
            fill={`#${iconWrapper.hex}`}
            className="w-full h-full object-contain transition-transform duration-500 ease-out drop-shadow-sm"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label={client.name}
          >
            <title>{iconWrapper.title}</title>
            <path d={iconWrapper.path} />
          </svg>
        ) : (
          <span className="text-[14px] md:text-[16px] font-sans font-bold text-maroon-900 text-center leading-tight">
            {client.name}
          </span>
        )}
      </div>
    </div>
  );
}

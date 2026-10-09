import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { EVENTS } from "@/src/data/events";
import { EventCard } from "@/src/components/events/EventCard";
import { ArrowLeft } from "lucide-react";

export function generateStaticParams() {
  return EVENTS.map((event) => ({ slug: event.slug }));
}

// simple heuristic for hindi characters
function isHindi(text: string) {
  return /[\u0900-\u097F]/.test(text);
}

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = EVENTS.find((e) => e.slug === slug);

  if (!event) {
    notFound();
  }

  // 3 related stories: pick adjacent events
  const index = EVENTS.findIndex((e) => e.slug === slug);
  const related = [];
  for (let i = 1; i <= 3; i++) {
    related.push(EVENTS[(index + i) % EVENTS.length]);
  }

  const isHi = isHindi(event.fullText);

  return (
    <main className="bg-white min-h-screen pt-24 pb-16 lg:pt-32 lg:pb-24 flex flex-col">
      <div className="max-w-[800px] mx-auto w-full px-5 sm:px-8 mt-6">
        <Link href="/#events" className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-grey-mid uppercase transition-colors hover:text-accent mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to events
        </Link>
        
        <div className="flex items-center gap-3 mb-6">
           <span className="bg-maroon-950 text-white px-3 py-1.5 rounded-sm text-[11px] uppercase tracking-wider font-semibold">
              {event.date}
           </span>
           <span className="text-accent text-[11px] font-bold tracking-[0.1em] uppercase">
              {event.kicker}
           </span>
        </div>

        <h1 className="display text-3xl md:text-5xl font-semibold leading-[1.1] text-grey-dark mb-10" style={{ fontFamily: "'Newsreader', serif" }}>
          {event.headline}
        </h1>
      </div>

      <div className="w-full max-w-[1024px] mx-auto px-5 sm:px-8 mb-12">
        <div className="relative aspect-[16/9] w-full rounded-sm overflow-hidden bg-grey-soft">
          <Image
            src={event.image}
            alt={event.imageAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </div>

      <div className="max-w-[800px] mx-auto w-full px-5 sm:px-8">
        <div 
          className="prose prose-lg max-w-none text-grey-dark"
          style={{
            fontFamily: isHi ? "var(--font-display)" : "var(--font-sans)",
            lineHeight: "1.7"
          }}
          lang={isHi ? "hi" : "en"}
        >
          <p className="text-[17px] md:text-[19px] whitespace-pre-wrap">{event.fullText}</p>
        </div>
        
        {event.dateUncertain && (
          <p className="text-sm text-grey-mid mt-8 italic border-t border-grey-soft pt-4">
            * Note: The exact date was not stated in the original event caption.
          </p>
        )}
      </div>

      <div className="max-w-[1320px] mx-auto w-full px-5 sm:px-8 mt-24 border-t border-grey-soft pt-16">
        <h2 className="display text-2xl font-semibold text-grey-dark mb-8" style={{ fontFamily: "'Newsreader', serif" }}>
          Related Stories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
{related.map((rel) => (
              <EventCard key={rel.slug} event={rel} />
            ))}
        </div>
      </div>
    </main>
  );
}

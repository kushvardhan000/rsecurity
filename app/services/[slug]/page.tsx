import { notFound } from "next/navigation";
import { PageHeader } from "@/src/components/ui/PageHeader";
import { FEATURED_SERVICES, ALSO_SERVICES, type FeaturedService } from "@/src/data/services";
import Image from "next/image";
import Link from "next/link";

export async function generateStaticParams() {
  return [...FEATURED_SERVICES, ...ALSO_SERVICES].map((service) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = [...FEATURED_SERVICES, ...ALSO_SERVICES].find((s) => s.slug === slug);
  
  if (!service) {
    return { title: "Service Not Found" };
  }

  const featured = service as FeaturedService;
  const description = 'short' in featured ? featured.short : `${service.title} services by Ranchi Security`;

  return {
    title: `${service.title} | Ranchi Security`,
    description,
  };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = [...FEATURED_SERVICES, ...ALSO_SERVICES].find((s) => s.slug === slug);

  if (!service) {
    notFound();
  }

  const isFeatured = FEATURED_SERVICES.some((s) => s.slug === slug);
  const featured = service as FeaturedService;

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Services", href: "/services" },
          { label: service.title },
        ]}
        title={service.title}
        subtitle={isFeatured && 'short' in featured ? featured.short : undefined}
      />
      <main className="flex-1 bg-white">
        {isFeatured && 'image' in featured && 'long' in featured && (
          <section className="py-[var(--section-y)]">
            <div className="mx-auto max-w-[1240px] px-[clamp(16px,4vw,48px)]">
              <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
                <div className="relative aspect-[4/3] rounded-sm overflow-hidden bg-[var(--color-grey-soft)]">
                  <Image
                    src={featured.image}
                    alt={featured.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <div className="prose prose-lg max-w-none text-[var(--color-grey-dark)]" style={{ fontFamily: "var(--font-sans)", lineHeight: "1.8" }}>
                  <p className="text-[17px] md:text-[19px] leading-relaxed">{featured.long}</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {!isFeatured && (
          <section className="py-[var(--section-y)]">
            <div className="mx-auto max-w-[1240px] px-[clamp(16px,4vw,48px)] text-center max-w-3xl mx-auto">
              <p className="text-[var(--color-grey-dark)] text-base md:text-lg leading-relaxed">
                {service.title} services are available. Please contact us for detailed information and customised solutions.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center h-12 px-6 rounded-sm bg-[var(--color-accent)] text-white font-bold tracking-widest uppercase text-[12px] hover:bg-[var(--color-accent-hover)] transition-colors"
                >
                  Request a Quote
                </Link>
                <Link
                  href={`tel:+91${service.title.includes("Industrial") ? "6512280191" : "9234012013"}`}
                  className="inline-flex items-center justify-center h-12 px-6 rounded-sm border border-[var(--color-grey-soft)] bg-white text-[var(--color-grey-dark)] font-bold tracking-widest uppercase text-[12px] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors"
                >
                  Call Us
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Related Services */}
        <section className="py-[var(--section-y)] bg-[var(--color-paper)]" aria-labelledby="related-services">
          <div className="mx-auto max-w-[1240px] px-[clamp(16px,4vw,48px)]">
            <h2 id="related-services" className="font-serif text-3xl md:text-4xl font-medium text-[var(--color-grey-dark)] mb-10 text-center">
              Other Services
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...FEATURED_SERVICES, ...ALSO_SERVICES]
                .filter((s) => s.slug !== slug)
                .map((s) => (
                  <Link
                    key={s.slug}
                    href={`/services/${s.slug}`}
                    className="group bg-white border border-[var(--color-grey-soft)] rounded-sm p-6 hover:border-[var(--color-accent)] hover:shadow-soft transition-all"
                  >
                    <h3 className="font-medium text-[var(--color-grey-dark)] group-hover:text-[var(--color-accent)] transition-colors">
                      {s.title}
                    </h3>
                  </Link>
                ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
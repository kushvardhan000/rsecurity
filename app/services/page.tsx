import { PageHeader } from "@/src/components/ui/PageHeader";
import { Services } from "@/src/components/services/Services";
import { FEATURED_SERVICES, ALSO_SERVICES } from "@/src/data/services";
import Link from "next/link";

export const metadata = {
  title: "Security Services | Industrial, Mining, Escort, Institutional, Event Security",
  description: "Professional security services across Jharkhand, Bihar & Odisha. Industrial, Mining, Escort, Institutional and Event security by ex-servicemen led teams.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Services" }]}
        title="Our Services"
        subtitle="Disciplined protection for every sector — backed by certified training and ex-servicemen leadership."
      />
      <main className="flex-1">
        <Services />
        <section className="py-[var(--section-y)] bg-white" aria-labelledby="also-services">
          <div className="mx-auto max-w-[1240px] px-[clamp(16px,4vw,48px)]">
            <h2 id="also-services" className="font-serif text-3xl md:text-4xl font-medium text-[var(--color-grey-dark)] mb-10 text-center">
              Also Available
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {ALSO_SERVICES.map((service) => (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  className="group bg-white border border-[var(--color-grey-soft)] rounded-sm p-6 hover:border-[var(--color-accent)] hover:shadow-soft transition-all"
                >
                  <h3 className="font-medium text-[var(--color-grey-dark)] group-hover:text-[var(--color-accent)] transition-colors">
                    {service.title}
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
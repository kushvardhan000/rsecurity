import { PageHeader } from "@/src/components/ui/PageHeader";
import { ABOUT } from "@/src/data/about";
import { Stats } from "@/src/components/hero/Stats";
import { Achievements } from "@/src/components/achievements/Achievements";
import { Membership } from "@/src/components/membership/Membership";

export const metadata = {
  title: "About Ranchi Security | Ex-Servicemen Led Security & Training",
  description: "Founded in 1995 by ex-servicemen, Ranchi Security is one of Jharkhand's pioneering private security companies delivering protection through quality training, innovation and strict compliance.",
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "About" }]}
        title="About Ranchi Security"
        subtitle="Built by soldiers. Driven by skill."
      />
      <main className="flex-1">
        <section className="py-[var(--section-y)] bg-white">
          <div className="mx-auto max-w-[1240px] px-[clamp(16px,4vw,48px)]">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
              <div>
                <p className="text-[var(--color-grey-dark)] text-base md:text-lg leading-relaxed mb-6">
                  {ABOUT.body}
                </p>
                <ul className="space-y-3" role="list">
                  {ABOUT.credentials.map((cred, i) => (
                    <li key={i} className="flex items-center gap-3 text-[var(--color-grey-dark)]">
                      <span className="w-1.5 h-1.5 bg-[var(--color-accent)] rounded-full shrink-0" />
                      <span>{cred}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative aspect-[4/5] lg:aspect-[3/4] rounded-sm overflow-hidden bg-[var(--color-grey-soft)]">
                <img
                  src={ABOUT.images.landscape}
                  alt={ABOUT.images.landscapeAlt}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <Stats />

        <section className="py-[var(--section-y)] bg-[var(--color-paper)]" aria-labelledby="group-heading">
          <div className="mx-auto max-w-[1240px] px-[clamp(16px,4vw,48px)]">
            <h2 id="group-heading" className="font-serif text-3xl md:text-4xl font-medium text-[var(--color-grey-dark)] mb-10 text-center">
              {ABOUT.groupTitle}
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {ABOUT.organisations.map((org, i) => (
                <article key={i} className="bg-white p-6 rounded-sm border border-[var(--color-grey-soft)] hover:shadow-soft transition-shadow">
                  <h3 className="font-medium text-[var(--color-grey-dark)] mb-1">{org.name}</h3>
                  <p className="text-[var(--color-grey-mid)] text-sm">{org.note}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <Achievements />
        <Membership />
      </main>
    </>
  );
}
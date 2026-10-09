import { PageHeader } from "@/src/components/ui/PageHeader";
import { CTA } from "@/src/components/cta/CTA";
import { SITE } from "@/src/data/site";

export const metadata = {
  title: "Contact Us | Ranchi Security",
  description: "Get in touch with Ranchi Security for security services, training programmes, manpower solutions or career opportunities. We respond within one business day.",
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Contact" }]}
        title="Contact Us"
        subtitle="Tell us about your requirement. We respond within one business day."
      />
      <main className="flex-1">
        <section className="py-[var(--section-y)] bg-white">
          <div className="mx-auto max-w-[1240px] px-[clamp(16px,4vw,48px)]">
            <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 max-w-4xl mx-auto">
              <div className="lg:col-span-2">
                <h3 className="font-semibold text-[var(--color-grey-dark)] text-lg mb-4">Office Address</h3>
                <address className="not-italic text-[var(--color-grey-dark)] leading-relaxed space-y-2">
                  <p>{SITE.contact.address}</p>
                  <p className="text-[var(--color-grey-mid)]">Jharkhand, India — 834001</p>
                </address>
              </div>
              <div>
                <h3 className="font-semibold text-[var(--color-grey-dark)] text-lg mb-4">Quick Contact</h3>
                <ul className="space-y-3">
                  <li>
                    <a href={`tel:+91${SITE.contact.phone.split(",")[0].replace(/\D/g, "").replace(/^0/, "")}`} className="flex items-center gap-3 text-[var(--color-grey-dark)] hover:text-[var(--color-accent)] transition-colors">
                      <span className="grid h-10 w-10 place-items-center rounded-sm bg-[var(--color-grey-soft)] text-[var(--color-accent)] shrink-0">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                      </span>
                      <span>{SITE.contact.phone.split(",")[0].trim()}</span>
                    </a>
                  </li>
                  <li>
                    <a href={`mailto:${SITE.contact.email}`} className="flex items-center gap-3 text-[var(--color-grey-dark)] hover:text-[var(--color-accent)] transition-colors">
                      <span className="grid h-10 w-10 place-items-center rounded-sm bg-[var(--color-grey-soft)] text-[var(--color-accent)] shrink-0">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      </span>
                      <span>{SITE.contact.email}</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <CTA />
      </main>
    </>
  );
}
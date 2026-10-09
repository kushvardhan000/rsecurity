import { PageHeader } from "@/src/components/ui/PageHeader";

export const metadata = {
  title: "Privacy Policy | Ranchi Security",
  description: "Ranchi Security's privacy policy covering data collection, usage, and protection for website visitors and clients.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Privacy Policy" }]}
        title="Privacy Policy"
        subtitle="How we collect, use and protect your personal information."
      />
      <main className="flex-1 bg-white">
        <section className="py-[var(--section-y)]">
          <div className="mx-auto max-w-[800px] px-[clamp(16px,4vw,48px)] prose prose-lg max-w-none text-[var(--color-grey-dark)]" style={{ fontFamily: "var(--font-sans)", lineHeight: "1.8" }}>
            <p className="text-[17px] leading-relaxed mb-6"><strong>Last updated:</strong> October 2026</p>

            <h2 className="font-semibold text-[var(--color-grey-dark)] text-xl mb-3 mt-8">1. Information We Collect</h2>
            <p className="text-[17px] leading-relaxed mb-6">We collect information you provide directly to us, such as when you fill out a contact form, request a quote, apply for a career, or communicate with us. This may include your name, phone number, email address, company name, and message content.</p>

            <h2 className="font-semibold text-[var(--color-grey-dark)] text-xl mb-3 mt-8">2. How We Use Your Information</h2>
            <p className="text-[17px] leading-relaxed mb-6">We use the information we collect to respond to your enquiries, provide quotes, process job applications, send relevant updates, and improve our services. We do not sell your personal information to third parties.</p>

            <h2 className="font-semibold text-[var(--color-grey-dark)] text-xl mb-3 mt-8">3. Data Retention</h2>
            <p className="text-[17px] leading-relaxed mb-6">We retain your information only as long as necessary to fulfil the purposes outlined in this policy, unless a longer retention period is required or permitted by law.</p>

            <h2 className="font-semibold text-[var(--color-grey-dark)] text-xl mb-3 mt-8">4. Data Security</h2>
            <p className="text-[17px] leading-relaxed mb-6">We implement appropriate technical and organisational measures to protect your personal information against unauthorised access, alteration, disclosure or destruction.</p>

            <h2 className="font-semibold text-[var(--color-grey-dark)] text-xl mb-3 mt-8">5. Your Rights</h2>
            <p className="text-[17px] leading-relaxed mb-6">You have the right to access, correct, or delete your personal information. You may also object to or restrict processing. To exercise these rights, contact us at security.rsp@gmail.com.</p>

            <h2 className="font-semibold text-[var(--color-grey-dark)] text-xl mb-3 mt-8">6. Third-Party Links</h2>
            <p className="text-[17px] leading-relaxed mb-6">Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of those sites.</p>

            <h2 className="font-semibold text-[var(--color-grey-dark)] text-xl mb-3 mt-8">7. Changes to This Policy</h2>
            <p className="text-[17px] leading-relaxed mb-6">We may update this policy from time to time. The updated version will be posted on this page with a revised date.</p>

            <h2 className="font-semibold text-[var(--color-grey-dark)] text-xl mb-3 mt-8">8. Contact Us</h2>
            <p className="text-[17px] leading-relaxed mb-6">If you have questions about this Privacy Policy, please contact us at:</p>
            <address className="not-italic text-[17px] leading-relaxed">
              <p>Ranchi Security Pvt. Ltd.</p>
              <p>301, Girdhar Plaza, Opp Gaushala, Harmu Bypass Road, Ranchi-834001</p>
              <p>Email: security.rsp@gmail.com</p>
              <p>Phone: 0651-2280191</p>
            </address>
          </div>
        </section>
      </main>
    </>
  );
}
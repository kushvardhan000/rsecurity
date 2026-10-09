import { PageHeader } from "@/src/components/ui/PageHeader";

export const metadata = {
  title: "Terms & Conditions | Ranchi Security",
  description: "Ranchi Security's terms and conditions governing the use of our website and services.",
};

export default function TermsAndConditionsPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Terms & Conditions" }]}
        title="Terms & Conditions"
        subtitle="Please read these terms carefully before using our website or services."
      />
      <main className="flex-1 bg-white">
        <section className="py-[var(--section-y)]">
          <div className="mx-auto max-w-[800px] px-[clamp(16px,4vw,48px)] prose prose-lg max-w-none text-[var(--color-grey-dark)]" style={{ fontFamily: "var(--font-sans)", lineHeight: "1.8" }}>
            {/* Legal review note - this is a template, not legal advice */}
            {/* TODO: Have legal counsel review before publishing */}
            <p className="text-[17px] leading-relaxed mb-6"><strong>Last updated:</strong> October 2026</p>

            <h2 className="font-semibold text-[var(--color-grey-dark)] text-xl mb-3 mt-8">1. Acceptance of Terms</h2>
            <p className="text-[17px] leading-relaxed mb-6">By accessing and using this website and our services, you accept and agree to be bound by these Terms and Conditions. If you do not agree, please do not use our website or services.</p>

            <h2 className="font-semibold text-[var(--color-grey-dark)] text-xl mb-3 mt-8">2. Services</h2>
            <p className="text-[17px] leading-relaxed mb-6">Ranchi Security Pvt. Ltd. provides private security, skill training and manpower services. Specific terms for each service engagement are governed by separate service agreements or contracts.</p>

            <h2 className="font-semibold text-[var(--color-grey-dark)] text-xl mb-3 mt-8">3. Enquiries and Quotes</h2>
            <p className="text-[17px] leading-relaxed mb-6">Submitting an enquiry or quote request does not constitute a contract. Quotes are valid for 30 days unless otherwise stated and are subject to site assessment and final agreement.</p>

            <h2 className="font-semibold text-[var(--color-grey-dark)] text-xl mb-3 mt-8">4. Training and Certification</h2>
            <p className="text-[17px] leading-relaxed mb-6">Training programmes are conducted as per MEPSC/Skill India guidelines. Certification is awarded upon successful completion of assessments. We reserve the right to modify course schedules, content, and fees with prior notice.</p>

            <h2 className="font-semibold text-[var(--color-grey-dark)] text-xl mb-3 mt-8">5. Intellectual Property</h2>
            <p className="text-[17px] leading-relaxed mb-6">All content on this website, including text, graphics, logos, images, and software, is the property of Ranchi Security Pvt. Ltd. or its licensors and is protected by copyright laws. Unauthorised use is prohibited.</p>

            <h2 className="font-semibold text-[var(--color-grey-dark)] text-xl mb-3 mt-8">6. Limitation of Liability</h2>
            <p className="text-[17px] leading-relaxed mb-6">To the maximum extent permitted by law, Ranchi Security Pvt. Ltd. shall not be liable for any indirect, incidental, special, consequential or punitive damages arising out of or relating to your use of our website or services.</p>

            <h2 className="font-semibold text-[var(--color-grey-dark)] text-xl mb-3 mt-8">7. Indemnification</h2>
            <p className="text-[17px] leading-relaxed mb-6">You agree to indemnify and hold harmless Ranchi Security Pvt. Ltd., its directors, employees and agents from any claims, damages, losses or expenses arising from your use of the website or breach of these terms.</p>

            <h2 className="font-semibold text-[var(--color-grey-dark)] text-xl mb-3 mt-8">8. Governing Law</h2>
            <p className="text-[17px] leading-relaxed mb-6">These terms shall be governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts at Ranchi, Jharkhand.</p>

            <h2 className="font-semibold text-[var(--color-grey-dark)] text-xl mb-3 mt-8">9. Changes to Terms</h2>
            <p className="text-[17px] leading-relaxed mb-6">We may modify these terms at any time. Continued use of the website after changes constitutes acceptance of the new terms.</p>

            <h2 className="font-semibold text-[var(--color-grey-dark)] text-xl mb-3 mt-8">10. Contact Us</h2>
            <p className="text-[17px] leading-relaxed mb-6">For questions about these Terms & Conditions, contact:</p>
            <address className="not-italic text-[17px] leading-relaxed">
              <p>Ranchi Security Pvt. Ltd.</p>
              <p>301, Girdhar Plaza, Opp Gaushala, Harmu Bypass Road, Ranchi-834001</p>
              <p>Email: security.rsp@gmail.com</p>
              <p>Phone: 0651-2280191</p>
            </address>

            <hr className="my-8 border-[var(--color-grey-soft)]" />
            <p className="text-sm text-[var(--color-grey-mid)] italic">
              <strong>Note:</strong> This document is a standard template for website terms and conditions. 
              It has not been reviewed by legal counsel. Ranchi Security Pvt. Ltd. should have this document 
              reviewed by a qualified legal professional before relying on it for legal purposes.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
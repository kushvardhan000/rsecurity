"use client";

import { useState } from "react";
import { PageHeader } from "@/src/components/ui/PageHeader";
import { SITE } from "@/src/data/site";
import { cn } from "@/src/lib/cn";
import { Loader2, Check, Mail, FileText } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

type FormStatus = "idle" | "submitting" | "success" | "error";

type FormData = {
  name: string;
  phone: string;
  email: string;
  role: string;
  message: string;
  _honey: string;
};

const initialFormData: FormData = {
  name: "",
  phone: "",
  email: "",
  role: "",
  message: "",
  _honey: "",
};

const ROLE_OPTIONS = [
  { value: "security-guard", label: "Security Guard" },
  { value: "security-supervisor", label: "Security Supervisor" },
  { value: "trainer", label: "Trainer / Instructor" },
  { value: "office-staff", label: "Office / Admin Staff" },
  { value: "driver", label: "Driver" },
  { value: "other", label: "Other" },
];

export function CareersClient() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validate = (data: FormData): Partial<FormData> => {
    const errs: Partial<FormData> = {};
    if (!data.name.trim()) errs.name = "Name is required";
    if (!data.phone.trim()) errs.phone = "Phone is required";
    else if (!/^[\d\s\-+]{10,}$/.test(data.phone)) errs.phone = "Enter a valid phone number";
    if (!data.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errs.email = "Enter a valid email";
    if (!data.role) errs.role = "Select a role";
    if (!data.message.trim()) errs.message = "Message is required";
    else if (data.message.trim().length < 20) errs.message = "At least 20 characters";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(formData);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    if (formData._honey) return;
    setErrors({});
    setStatus("submitting");

    await new Promise((r) => setTimeout(r, 1500));

    setStatus("success");
    setFormData(initialFormData);
    setTimeout(() => setStatus("idle"), 5000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Careers" }]}
        title="Careers"
        subtitle="Build a disciplined career in security, training and manpower services. We value integrity, skill and commitment."
      />
      <main className="flex-1 bg-white">
        <section className="py-[var(--section-y)]">
          <div className="mx-auto max-w-[1240px] px-[clamp(16px,4vw,48px)]">
            <div className="grid lg:grid-cols-3 gap-10 lg:gap-16">
              <div className="lg:col-span-2 space-y-8">
                <div className="prose prose-lg max-w-none text-[var(--color-grey-dark)]" style={{ fontFamily: "var(--font-sans)", lineHeight: "1.8" }}>
                  <p className="text-[17px] md:text-[19px] leading-relaxed mb-6">
                    Ranchi Security is always looking for disciplined, skilled individuals to join our growing team. 
                    As an ex-servicemen led organisation, we offer structured career paths in security operations, 
                    skill training, and manpower services across Jharkhand, Bihar and Odisha.
                  </p>
                  <h3 className="font-semibold text-[var(--color-grey-dark)] text-lg mb-3">Current Openings</h3>
                  <ul className="space-y-3 list-disc list-inside">
                    <li>Security Guards (Freshers & Experienced)</li>
                    <li>Security Supervisors (Ex-Servicemen preferred)</li>
                    <li>Training Instructors (Certified)</li>
                    <li>Office & Administrative Staff</li>
                    <li>Drivers (Valid License)</li>
                  </ul>
                  <p className="text-[17px] md:text-[19px] leading-relaxed mt-6">
                    We provide comprehensive training, certification support, and clear progression pathways. 
                    All selected candidates undergo our certified training programme before deployment.
                  </p>
                </div>

                <div className="bg-[var(--color-paper)] border border-[var(--color-grey-soft)] rounded-sm p-6 lg:p-8">
                  <h3 className="font-semibold text-[var(--color-grey-dark)] text-lg mb-4">Direct Application</h3>
                  <p className="text-[var(--color-grey-mid)] text-sm mb-4">
                    Send your updated CV directly to our recruitment team:
                  </p>
                  <a
                    href={`mailto:${SITE.contact.email}?subject=Job Application - ${formData.role || "General"}&body=Name: %0D%0APhone: %0D%0AEmail: %0D%0ARole Applied For: %0D%0ACover Letter: %0D%0A`}
                    className="inline-flex items-center gap-2 h-11 px-5 rounded-sm bg-[var(--color-accent)] text-white font-semibold tracking-wider uppercase text-[12px] hover:bg-[var(--color-accent-hover)] transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    security.rsp@gmail.com
                  </a>
                </div>
              </div>

              <div>
                <div className="sticky top-24">
                  <div className="bg-white border border-[var(--color-grey-soft)] rounded-sm p-6 lg:p-8">
                    <h3 className="font-semibold text-[var(--color-grey-dark)] text-lg mb-6">Apply Online</h3>
                    
                    <AnimatePresence mode="wait">
                      {status === "success" ? (
                        <motion.div
                          key="success"
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -15 }}
                          transition={{ duration: 0.4, ease: EASE }}
                          className="text-center py-10"
                        >
                          <div className="grid h-16 w-16 place-items-center rounded-full bg-[#10b981] mb-5 shadow-sm text-white mx-auto">
                            <Check className="w-8 h-8" />
                          </div>
                          <h4 className="font-serif text-xl font-medium text-[var(--color-grey-dark)] mb-2">Application Received</h4>
                          <p className="text-[var(--color-grey-mid)]">We&apos;ll review your application and contact you if shortlisted.</p>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="form"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="w-full"
                        >
                          <form onSubmit={handleSubmit} className="space-y-5">
                          <div>
                            <label htmlFor="name" className="block text-[11px] font-bold tracking-widest uppercase text-[var(--color-grey-dark)] mb-2">
                              Full Name
                            </label>
                            <input
                              type="text"
                              id="name"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              className={cn(
                                "w-full h-11 rounded-sm border px-3 text-[15px] bg-white text-[var(--color-grey-dark)] placeholder-[var(--color-grey-mid)] transition-colors focus:outline-none focus:ring-1 focus:ring-[#A6192E] focus:border-[#A6192E]",
                                errors.name ? "border-[#A6192E]" : "border-[var(--color-grey-soft)] hover:border-gray-300"
                              )}
                              placeholder="Your full name"
                              disabled={status === "submitting"}
                            />
                            {errors.name && <p className="mt-1 text-xs text-[#A6192E]">{errors.name}</p>}
                          </div>

                          <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                              <label htmlFor="phone" className="block text-[11px] font-bold tracking-widest uppercase text-[var(--color-grey-dark)] mb-2">
                                Phone
                              </label>
                              <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className={cn(
                                  "w-full h-11 rounded-sm border px-3 text-[15px] bg-white text-[var(--color-grey-dark)] placeholder-[var(--color-grey-mid)] transition-colors focus:outline-none focus:ring-1 focus:ring-[#A6192E] focus:border-[#A6192E]",
                                  errors.phone ? "border-[#A6192E]" : "border-[var(--color-grey-soft)] hover:border-gray-300"
                                )}
                                placeholder="10-digit mobile"
                                disabled={status === "submitting"}
                              />
                              {errors.phone && <p className="mt-1 text-xs text-[#A6192E]">{errors.phone}</p>}
                            </div>

                            <div>
                              <label htmlFor="email" className="block text-[11px] font-bold tracking-widest uppercase text-[var(--color-grey-dark)] mb-2">
                                Email
                              </label>
                              <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={cn(
                                  "w-full h-11 rounded-sm border px-3 text-[15px] bg-white text-[var(--color-grey-dark)] placeholder-[var(--color-grey-mid)] transition-colors focus:outline-none focus:ring-1 focus:ring-[#A6192E] focus:border-[#A6192E]",
                                  errors.email ? "border-[#A6192E]" : "border-[var(--color-grey-soft)] hover:border-gray-300"
                                )}
                                placeholder="your@email.com"
                                disabled={status === "submitting"}
                              />
                              {errors.email && <p className="mt-1 text-xs text-[#A6192E]">{errors.email}</p>}
                            </div>
                          </div>

                          <div>
                            <label htmlFor="role" className="block text-[11px] font-bold tracking-widest uppercase text-[var(--color-grey-dark)] mb-2">
                              Role Applied For
                            </label>
                            <select
                              id="role"
                              name="role"
                              value={formData.role}
                              onChange={handleChange}
                              className={cn(
                                "w-full h-11 rounded-sm border px-3 text-[15px] bg-white text-[var(--color-grey-dark)] transition-colors focus:outline-none focus:ring-1 focus:ring-[#A6192E] focus:border-[#A6192E] appearance-none",
                                !formData.role && "text-[var(--color-grey-mid)]",
                                errors.role ? "border-[#A6192E]" : "border-[var(--color-grey-soft)] hover:border-gray-300"
                              )}
                              disabled={status === "submitting"}
                            >
                              <option value="" disabled>Select a role</option>
                              {ROLE_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value} className="text-[var(--color-grey-dark)]">
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                            {errors.role && <p className="mt-1 text-xs text-[#A6192E]">{errors.role}</p>}
                          </div>

                          <div>
                            <label htmlFor="message" className="block text-[11px] font-bold tracking-widest uppercase text-[var(--color-grey-dark)] mb-2">
                              Cover Letter / Experience
                            </label>
                            <textarea
                              id="message"
                              name="message"
                              value={formData.message}
                              onChange={handleChange}
                              rows={4}
                              className={cn(
                                "w-full min-h-[112px] resize-y rounded-sm border px-3 py-2.5 text-[15px] bg-white text-[var(--color-grey-dark)] placeholder-[var(--color-grey-mid)] transition-colors focus:outline-none focus:ring-1 focus:ring-[#A6192E] focus:border-[#A6192E] mb-4",
                                errors.message ? "border-[#A6192E]" : "border-[var(--color-grey-soft)] hover:border-gray-300"
                              )}
                              placeholder="Briefly describe your experience and why you want to join us..."
                              disabled={status === "submitting"}
                            />
                            {errors.message && <p className="mt-1 text-xs text-[#A6192E]">{errors.message}</p>}
                          </div>

                          <input type="text" name="_honey" value={formData._honey} onChange={handleChange} style={{ display: "none" }} aria-hidden="true" tabIndex={-1} />

                          <button
                            type="submit"
                            disabled={status === "submitting"}
                            className="w-full h-12 rounded-sm bg-[var(--color-accent)] text-white font-bold tracking-widest uppercase text-[12px] hover:bg-[var(--color-accent-hover)] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#A6192E] disabled:opacity-75 disabled:cursor-wait flex items-center justify-center"
                          >
                            {status === "submitting" ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <FileText className="w-4 h-4 mr-2" />}
                            {status === "submitting" ? "Submitting..." : "Submit Application"}
                          </button>
                        </form></motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
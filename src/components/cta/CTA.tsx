"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Phone, Mail, MapPin, Check, Loader2, MessageCircle } from "lucide-react";
import { SITE } from "@/src/data/site";
import { cn } from "@/src/lib/cn";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const PHONE_NUMBERS = SITE.contact.phone.split(",").map((n) => n.trim());

const telHref = (number: string) =>
  `tel:+91${number.replace(/\D/g, "").replace(/^0/, "")}`;

const gmailHref = (email: string) =>
  `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`;

const mapsHref = (address: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

type ServiceOption = { value: string; label: string };

const SERVICE_OPTIONS: ServiceOption[] = [
  { value: "industrial", label: "Industrial Security" },
  { value: "mining", label: "Mining Security" },
  { value: "escort", label: "Escort Security" },
  { value: "institutional", label: "Institutional Security" },
  { value: "event", label: "Event Security" },
  { value: "other", label: "Other" },
];

type FormStatus = "idle" | "submitting" | "success" | "error";

type FormData = {
  name: string;
  phone: string;
  service: string;
  message: string;
  _honey: string;
};

const initialFormData: FormData = {
  name: "",
  phone: "",
  service: "",
  message: "",
  _honey: "",
};

export function CTA() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validate = (data: FormData): Partial<FormData> => {
    const errs: Partial<FormData> = {};
    if (!data.name.trim()) errs.name = "Name is required";
    if (!data.phone.trim()) errs.phone = "Phone is required";
    else if (!/^[\d\s\-+]{10,}$/.test(data.phone)) errs.phone = "Enter a valid phone number";
    if (!data.service) errs.service = "Select a service";
    if (!data.message.trim()) errs.message = "Message is required";
    else if (data.message.trim().length < 10) errs.message = "At least 10 characters";
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

    // Simulated submit API request
    await new Promise((r) => setTimeout(r, 1200));

    setStatus("success");
    setFormData(initialFormData);

    // Reset back to form after 2.5 seconds
    setTimeout(() => {
      setStatus("idle");
    }, 2500);
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
    <section id="contact" data-tone="light" className="relative isolate bg-[#FAF8F5] py-16 md:py-24">
      <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="relative flex flex-col lg:flex-row rounded-xl shadow-xl bg-white border border-neutral-200 overflow-hidden">
          
          {/* LEFT (45% on desktop): Maroon Details Panel */}
          <div className="relative w-full lg:w-[45%] flex flex-col justify-between bg-gradient-to-br from-[#4A0404] via-[#380202] to-[#220002] text-white p-6 sm:p-8 lg:p-10">
            {/* Subtle background overlay */}
            <div
              className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-15 grayscale"
              style={{
                backgroundImage: "url('/cta/guard-entrance.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center 20%",
              }}
            />

            <div className="relative z-10 flex flex-col gap-6 sm:gap-8">
              <div>
                <span className="flex items-center gap-2 text-[11px] font-mono font-bold tracking-widest uppercase text-rose-300 mb-3">
                  <span className="w-1.5 h-1.5 bg-[#A6192E] rounded-xs shrink-0" />
                  Direct Consultation
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl leading-tight font-medium tracking-tight mb-3">
                  Let&apos;s secure what <span className="italic text-rose-300">matters.</span>
                </h2>
                <div className="text-white/80 text-xs sm:text-sm leading-relaxed max-w-sm">
                  <p>Tell us about your facility, event, or personnel requirements.</p>
                  <p className="mt-0.5">We respond within one business day.</p>
                </div>
              </div>

              {/* Contact Info Stack */}
              <div className="flex flex-col gap-4 text-xs sm:text-sm">
                {/* Inline Phone Numbers separated by commas */}
                <div className="flex items-start gap-3">
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-white/10 text-rose-200 border border-white/10 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 font-mono text-white/90 leading-relaxed pt-1">
                    {PHONE_NUMBERS.map((n, idx) => (
                      <span key={n} className="inline-flex items-center">
                        <a
                          href={telHref(n)}
                          className="hover:text-rose-200 hover:underline transition-colors cursor-pointer"
                          title={`Call ${n}`}
                        >
                          {n}
                        </a>
                        {idx < PHONE_NUMBERS.length - 1 && (
                          <span className="text-white/40 ml-1">,</span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Email (Gmail direct web compose link) */}
                <div className="flex items-center gap-3">
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-white/10 text-rose-200 border border-white/10">
                    <Mail className="w-4 h-4" />
                  </div>
                  <a
                    href={gmailHref(SITE.contact.email)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/90 hover:text-rose-200 hover:underline transition-colors truncate"
                    title="Compose email on Gmail"
                  >
                    {SITE.contact.email}
                  </a>
                </div>

                {/* Address (Google Maps location search) */}
                <div className="flex items-start gap-3">
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-white/10 text-rose-200 border border-white/10 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <a
                    href={mapsHref(SITE.contact.address)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/90 text-xs sm:text-[13px] leading-relaxed hover:text-rose-200 hover:underline transition-colors"
                    title="View location on Google Maps"
                  >
                    {SITE.contact.address}
                  </a>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-6 mt-6 border-t border-white/10 text-[11px] font-mono text-white/50 uppercase tracking-widest">
              Standard Support: 24/7 Field Operations
            </div>
          </div>

          {/* RIGHT (55% on desktop): Expanded Form Area */}
          <div className="w-full lg:w-[55%] flex flex-col justify-center bg-white p-6 sm:p-8 lg:p-10 border-t border-neutral-200 lg:border-t-0 lg:border-l">
            {/* Quick Action Buttons for Mobile Screen */}
            <div className="flex sm:hidden gap-2.5 mb-6 w-full">
              <a
                href={telHref(PHONE_NUMBERS[0])}
                className="flex-1 h-11 flex items-center justify-center gap-2 rounded-md bg-[#4A0404] text-white font-semibold tracking-wider uppercase text-xs hover:bg-[#340202] transition-colors"
                aria-label="Call Now"
              >
                <Phone className="w-3.5 h-3.5" />
                Call Now
              </a>
              <a
                href={`https://wa.me/+91${PHONE_NUMBERS[0].replace(/\D/g, "").replace(/^0/, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 h-11 flex items-center justify-center gap-2 rounded-md border border-neutral-300 bg-white text-neutral-700 font-semibold tracking-wider uppercase text-xs hover:border-[#800020] hover:text-[#800020] transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                WhatsApp
              </a>
            </div>

            <AnimatePresence mode="wait">
              {status === "success" ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className="flex flex-col items-center justify-center min-h-[380px] text-center p-6"
                >
                  <div className="grid h-16 w-16 place-items-center rounded-full bg-emerald-600 mb-4 shadow-md text-white">
                    <Check className="w-8 h-8" strokeWidth={3} />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-neutral-900 mb-2">
                    Thank You!
                  </h3>
                  <p className="text-neutral-600 text-sm max-w-sm leading-relaxed mb-4">
                    Your request has been successfully dispatched. Our team will get in touch with you shortly.
                  </p>
                  <span className="text-xs font-mono text-neutral-400">
                    Reloading form in 2 seconds...
                  </span>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col gap-4 sm:gap-5"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-[11px] font-bold tracking-widest uppercase text-neutral-700 mb-1.5">
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={cn(
                          "w-full h-11 rounded-md border px-3 text-sm bg-white text-neutral-800 placeholder-neutral-400 transition-colors focus:outline-none focus:ring-1 focus:ring-[#800020] focus:border-[#800020]",
                          errors.name ? "border-[#800020]" : "border-neutral-300 hover:border-neutral-400"
                        )}
                        placeholder="John Doe"
                        disabled={status === "submitting"}
                      />
                      {errors.name && <p className="mt-1 text-xs text-[#800020] font-medium">{errors.name}</p>}
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-[11px] font-bold tracking-widest uppercase text-neutral-700 mb-1.5">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={cn(
                          "w-full h-11 rounded-md border px-3 text-sm bg-white text-neutral-800 placeholder-neutral-400 transition-colors focus:outline-none focus:ring-1 focus:ring-[#800020] focus:border-[#800020]",
                          errors.phone ? "border-[#800020]" : "border-neutral-300 hover:border-neutral-400"
                        )}
                        placeholder="10-digit mobile"
                        disabled={status === "submitting"}
                      />
                      {errors.phone && <p className="mt-1 text-xs text-[#800020] font-medium">{errors.phone}</p>}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="service" className="block text-[11px] font-bold tracking-widest uppercase text-neutral-700 mb-1.5">
                      Service Requirement
                    </label>
                    <div className="relative">
                      <select
                        id="service"
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        className={cn(
                          "w-full h-11 rounded-md border px-3 text-sm bg-white text-neutral-800 transition-colors focus:outline-none focus:ring-1 focus:ring-[#800020] focus:border-[#800020] cursor-pointer",
                          !formData.service && "text-neutral-400",
                          errors.service ? "border-[#800020]" : "border-neutral-300 hover:border-neutral-400"
                        )}
                        disabled={status === "submitting"}
                      >
                        <option value="" disabled>Select a required service</option>
                        {SERVICE_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value} className="text-neutral-800">
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.service && <p className="mt-1 text-xs text-[#800020] font-medium">{errors.service}</p>}
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-[11px] font-bold tracking-widest uppercase text-neutral-700 mb-1.5">
                      Requirement Details
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={3}
                      className={cn(
                        "w-full min-h-[105px] resize-y rounded-md border px-3 py-2 text-sm bg-white text-neutral-800 placeholder-neutral-400 transition-colors focus:outline-none focus:ring-1 focus:ring-[#800020] focus:border-[#800020]",
                        errors.message ? "border-[#800020]" : "border-neutral-300 hover:border-neutral-400"
                      )}
                      placeholder="Briefly describe your site, shift timing, or deployment scale..."
                      disabled={status === "submitting"}
                    />
                    {errors.message && <p className="mt-1 text-xs text-[#800020] font-medium">{errors.message}</p>}
                  </div>

                  <input type="text" name="_honey" value={formData._honey} onChange={handleChange} className="hidden" aria-hidden="true" tabIndex={-1} />

                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="w-full h-12 rounded-md bg-[#800020] text-white font-bold tracking-widest uppercase text-xs hover:bg-[#600018] active:scale-[0.99] transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#800020] disabled:opacity-70 disabled:cursor-wait flex items-center justify-center shadow-sm cursor-pointer"
                  >
                    {status === "submitting" ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        <span>Sending Request...</span>
                      </>
                    ) : (
                      "Request a Call Back"
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
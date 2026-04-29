import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Check } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import SectionReveal from "@/components/SectionReveal";
import Seo from "@/components/Seo";
import { breadcrumb, organizationSchema } from "@/lib/seoSchemas";
import { sanitizeFormFields, submitForm } from "@/lib/submitForm";
import { toast } from "sonner";

const ContactPage = () => {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;

    const form = formRef.current;
    if (!form) return;

    const formData = new FormData(form);
    const rawFields = Object.fromEntries(
      Array.from(formData.entries()).map(([key, value]) => [key, String(value).trim()]),
    ) as Record<string, string>;

    // Honeypot
    if (rawFields.website) return;

    const nameVal = rawFields.name ?? "";
    const emailVal = rawFields.email ?? "";

    if (!nameVal || !emailVal) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
      toast.error("Please enter a valid email address");
      return;
    }

    const fields = sanitizeFormFields({
      ...rawFields,
      message: rawFields.message || "General enquiry",
    });
    delete fields.website;

    setSending(true);
    try {
      await submitForm({ formName: "Contact Us", fields });
      form.reset();
      setSubmitted(true);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <PageTransition>
      <Seo
        title="Contact Luxtile Installations | Tile & Slab Quotes Johannesburg"
        description="Contact Luxtile Installations in Johannesburg for premium large format tile installation quotes, site visits and project consultations across South Africa."
        keywords="tile installer contact Johannesburg, request tile installation quote, slab installation consultation Gauteng"
        jsonLd={[organizationSchema, breadcrumb([{ name: 'Home', path: '/' }, { name: 'Contact', path: '/contact' }])]}
      />
      <section className="pt-40 pb-28 section-padding min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Left — Info */}
          <SectionReveal>
            <p className="label-caps mb-4">Begin Your Journey</p>
            <h1 className="heading-display text-foreground mb-6">
              Ready to Transform
              <br />
              Your Space?
            </h1>
            <p className="text-muted-foreground mb-12 max-w-md">
              Our consultants are ready to help you select the perfect slab for your vision. Fill in your details
              and we'll craft a tailored recommendation.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <MapPin size={20} className="text-accent mt-1 shrink-0" />
                <div>
                  <p className="font-medium text-sm">Location</p>
                  <p className="text-muted-foreground text-sm">Johannesburg, Gauteng, South Africa</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone size={20} className="text-accent mt-1 shrink-0" />
                <div>
                  <p className="font-medium text-sm">Phone</p>
                  <p className="text-muted-foreground text-sm">+27 83 605 5551</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Mail size={20} className="text-accent mt-1 shrink-0" />
                <div>
                  <p className="font-medium text-sm">Email</p>
                  <p className="text-muted-foreground text-sm">Sales@luxtile.co.za</p>
                </div>
              </div>
            </div>

            <div className="mt-16 inline-flex items-center gap-3 border border-accent/30 px-8 py-4">
              <span className="font-display text-3xl text-accent">10+</span>
              <span className="text-muted-foreground text-sm tracking-[0.1em] uppercase">Years of Excellence</span>
            </div>
          </SectionReveal>

          {/* Right — Simple quote form */}
          <SectionReveal delay={0.2}>
            <div className="bg-secondary/40 border border-border/40 p-6 md:p-12">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16"
                >
                  <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
                    <Check size={32} className="text-accent" />
                  </div>
                  <p className="font-display text-3xl mb-3">Thank You</p>
                  <p className="text-muted-foreground max-w-xs mx-auto">
                    Thanks, we've received your enquiry. We'll be in touch within 24–48 hours.
                  </p>
                </motion.div>
              ) : (
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                  {/* Honeypot */}
                  <input
                    type="text"
                    name="website"
                    autoComplete="off"
                    tabIndex={-1}
                    className="absolute opacity-0 h-0 w-0 pointer-events-none"
                    aria-hidden="true"
                  />

                  <div>
                    <h3 className="font-display text-xl mb-1">Request a Quote</h3>
                    <p className="text-muted-foreground text-sm">Tell us about your project and we'll get back to you.</p>
                  </div>

                  <div>
                    <label className="label-caps block mb-2">Name</label>
                    <input
                      required
                      type="text"
                      name="name"
                      maxLength={100}
                      className="w-full border-b border-border bg-transparent py-3 outline-none focus:border-accent transition-colors"
                    />
                  </div>
                  <div>
                    <label className="label-caps block mb-2">Email</label>
                    <input
                      required
                      type="email"
                      name="email"
                      maxLength={255}
                      className="w-full border-b border-border bg-transparent py-3 outline-none focus:border-accent transition-colors"
                    />
                  </div>
                  <div>
                    <label className="label-caps block mb-2">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      maxLength={20}
                      className="w-full border-b border-border bg-transparent py-3 outline-none focus:border-accent transition-colors"
                    />
                  </div>
                  <div>
                    <label className="label-caps block mb-2">Delivery Location</label>
                    <input
                      type="text"
                      name="deliveryLocation"
                      maxLength={100}
                      className="w-full border-b border-border bg-transparent py-3 outline-none focus:border-accent transition-colors"
                      placeholder="City / Province"
                    />
                  </div>
                  <div>
                    <label className="label-caps block mb-2">Message</label>
                    <textarea
                      name="message"
                      maxLength={1000}
                      rows={3}
                      className="w-full border-b border-border bg-transparent py-3 outline-none focus:border-accent transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={sending}
                    className={`w-full bg-accent text-accent-foreground py-4 text-sm tracking-[0.15em] uppercase font-medium gold-shine mt-4 transition-all ${
                      sending ? "opacity-70 cursor-not-allowed" : "hover:tracking-[0.19em]"
                    }`}
                  >
                    {sending ? "Sending…" : "Submit Request"}
                  </button>
                </form>
              )}
            </div>
          </SectionReveal>
        </div>
      </section>
    </PageTransition>
  );
};

export default ContactPage;

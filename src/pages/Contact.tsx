import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Phone, Mail, ChevronRight, ChevronLeft, Check, Upload, X } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import SectionReveal from "@/components/SectionReveal";
import { Progress } from "@/components/ui/progress";
import { submitForm } from "@/lib/submitForm";
import { toast } from "sonner";

const STEPS = ["Project Type", "Style", "Inspiration", "Budget", "Details"];

const PROJECT_TYPES = [
  { id: "kitchen", label: "Kitchen", icon: "🍳" },
  { id: "bathroom", label: "Bathroom", icon: "🛁" },
  { id: "feature-wall", label: "Feature Wall", icon: "🧱" },
  { id: "custom", label: "Custom", icon: "✨" },
];

const STYLES = [
  { id: "minimal", label: "Minimal", desc: "Clean lines, understated elegance" },
  { id: "luxury", label: "Luxury", desc: "Rich textures, opulent finishes" },
  { id: "bold", label: "Bold", desc: "Dramatic contrasts, statement pieces" },
  { id: "natural", label: "Natural", desc: "Organic tones, earthy warmth" },
];

const BUDGETS = [
  { id: "under-50k", label: "Under R50k", desc: "Essential elegance" },
  { id: "50k-150k", label: "R50k – R150k", desc: "Premium selections" },
  { id: "150k-plus", label: "R150k+", desc: "Bespoke luxury" },
];

const stepVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
};

const ContactPage = () => {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [honeypot, setHoneypot] = useState("");

  const [projectType, setProjectType] = useState("");
  const [style, setStyle] = useState("");
  const [budget, setBudget] = useState("");
  const [fileName, setFileName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const progress = ((step + 1) / STEPS.length) * 100;

  const canNext = () => {
    if (step === 0) return !!projectType;
    if (step === 1) return !!style;
    if (step === 2) return true; // optional
    if (step === 3) return !!budget;
    if (step === 4) return name.trim() && email.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    return false;
  };

  const next = async () => {
    if (!canNext() || sending) return;
    if (step === 4) {
      // Honeypot
      if (honeypot) return;

      setSending(true);
      try {
        const messageParts = [
          `Project: ${projectType}`,
          `Style: ${style}`,
          `Budget: ${budget}`,
          fileName ? `Inspiration: ${fileName}` : '',
        ].filter(Boolean).join(', ');

        const fields: Record<string, string> = {
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          message: messageParts,
          projectType,
          style,
          budget,
          inspiration: fileName || '',
        };
        Object.keys(fields).forEach(k => { if (!fields[k]) delete fields[k]; });

        await submitForm({ formName: 'Contact Us', fields });
        setSubmitted(true);
      } catch {
        toast.error('Something went wrong. Please try again.');
      } finally {
        setSending(false);
      }
      return;
    }
    setDir(1);
    setStep((s) => s + 1);
  };

  const prev = () => {
    setDir(-1);
    setStep((s) => Math.max(0, s - 1));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFileName(file.name);
  };

  const removeFile = () => setFileName("");

  return (
    <PageTransition>
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
              Our consultants are ready to help you select the perfect slab for your vision. Complete our brief
              consultation form and we'll craft a tailored recommendation.
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

          {/* Right — Multi-step form */}
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
                <>
                  {/* Honeypot */}
                  <input type="text" name="website" value={honeypot} onChange={e => setHoneypot(e.target.value)} autoComplete="off" tabIndex={-1} className="absolute opacity-0 h-0 w-0 pointer-events-none" aria-hidden="true" />

                  {/* Progress */}
                  <div className="mb-8">
                    <div className="flex justify-between items-center mb-3">
                      <span className="label-caps text-xs">
                        Step {step + 1} of {STEPS.length}
                      </span>
                      <span className="text-xs text-muted-foreground">{STEPS[step]}</span>
                    </div>
                    <Progress value={progress} className="h-1 bg-border/40 [&>div]:bg-accent" />
                  </div>

                  {/* Step content */}
                  <div className="relative overflow-hidden min-h-[320px]">
                    <AnimatePresence mode="wait" custom={dir}>
                      <motion.div
                        key={step}
                        custom={dir}
                        variants={stepVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="w-full"
                      >
                        {/* Step 0: Project Type */}
                        {step === 0 && (
                          <div>
                            <h3 className="font-display text-xl mb-2">What are you designing?</h3>
                            <p className="text-muted-foreground text-sm mb-8">Select the space you're transforming.</p>
                            <div className="grid grid-cols-2 gap-4">
                              {PROJECT_TYPES.map((t) => (
                                <button
                                  key={t.id}
                                  type="button"
                                  onClick={() => setProjectType(t.id)}
                                  className={`border p-6 text-left transition-all duration-300 hover:border-accent/60 group ${
                                    projectType === t.id
                                      ? "border-accent bg-accent/5"
                                      : "border-border/60 bg-transparent"
                                  }`}
                                >
                                  <span className="text-2xl block mb-2">{t.icon}</span>
                                  <span
                                    className={`text-sm font-medium tracking-wide ${
                                      projectType === t.id ? "text-accent" : "text-foreground"
                                    }`}
                                  >
                                    {t.label}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Step 1: Style */}
                        {step === 1 && (
                          <div>
                            <h3 className="font-display text-xl mb-2">Select your style</h3>
                            <p className="text-muted-foreground text-sm mb-8">What aesthetic speaks to you?</p>
                            <div className="space-y-3">
                              {STYLES.map((s) => (
                                <button
                                  key={s.id}
                                  type="button"
                                  onClick={() => setStyle(s.id)}
                                  className={`w-full border p-5 text-left transition-all duration-300 hover:border-accent/60 flex items-center justify-between ${
                                    style === s.id ? "border-accent bg-accent/5" : "border-border/60 bg-transparent"
                                  }`}
                                >
                                  <div>
                                    <span
                                      className={`text-sm font-medium tracking-wide block ${
                                        style === s.id ? "text-accent" : "text-foreground"
                                      }`}
                                    >
                                      {s.label}
                                    </span>
                                    <span className="text-xs text-muted-foreground">{s.desc}</span>
                                  </div>
                                  {style === s.id && <Check size={16} className="text-accent shrink-0" />}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Step 2: Inspiration Upload */}
                        {step === 2 && (
                          <div>
                            <h3 className="font-display text-xl mb-2">Share your inspiration</h3>
                            <p className="text-muted-foreground text-sm mb-8">
                              Upload a mood board, photo, or reference image. This step is optional.
                            </p>
                            {fileName ? (
                              <div className="border border-accent/40 bg-accent/5 p-6 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <Upload size={18} className="text-accent" />
                                  <span className="text-sm text-foreground truncate max-w-[200px]">{fileName}</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={removeFile}
                                  className="text-muted-foreground hover:text-foreground transition-colors"
                                >
                                  <X size={16} />
                                </button>
                              </div>
                            ) : (
                              <label className="border-2 border-dashed border-border/60 hover:border-accent/40 transition-colors p-12 flex flex-col items-center justify-center cursor-pointer group">
                                <Upload
                                  size={28}
                                  className="text-muted-foreground group-hover:text-accent transition-colors mb-3"
                                />
                                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                                  Click to upload an image
                                </span>
                                <span className="text-xs text-muted-foreground/60 mt-1">PNG, JPG up to 10MB</span>
                                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                              </label>
                            )}
                          </div>
                        )}

                        {/* Step 3: Budget */}
                        {step === 3 && (
                          <div>
                            <h3 className="font-display text-xl mb-2">What's your budget range?</h3>
                            <p className="text-muted-foreground text-sm mb-8">
                              This helps us recommend the right collections for you.
                            </p>
                            <div className="space-y-3">
                              {BUDGETS.map((b) => (
                                <button
                                  key={b.id}
                                  type="button"
                                  onClick={() => setBudget(b.id)}
                                  className={`w-full border p-5 text-left transition-all duration-300 hover:border-accent/60 flex items-center justify-between ${
                                    budget === b.id ? "border-accent bg-accent/5" : "border-border/60 bg-transparent"
                                  }`}
                                >
                                  <div>
                                    <span
                                      className={`text-sm font-medium tracking-wide block ${
                                        budget === b.id ? "text-accent" : "text-foreground"
                                      }`}
                                    >
                                      {b.label}
                                    </span>
                                    <span className="text-xs text-muted-foreground">{b.desc}</span>
                                  </div>
                                  {budget === b.id && <Check size={16} className="text-accent shrink-0" />}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Step 4: Contact Details */}
                        {step === 4 && (
                          <div>
                            <h3 className="font-display text-xl mb-2">Your details</h3>
                            <p className="text-muted-foreground text-sm mb-8">
                              Almost there — tell us how to reach you.
                            </p>
                            <div className="space-y-5">
                              <div>
                                <label className="label-caps block mb-2">Name *</label>
                                <input
                                  required
                                  type="text"
                                  maxLength={100}
                                  value={name}
                                  onChange={(e) => setName(e.target.value)}
                                  className="w-full border-b border-border bg-transparent py-3 outline-none focus:border-accent transition-colors"
                                  placeholder="Your full name"
                                />
                              </div>
                              <div>
                                <label className="label-caps block mb-2">Email *</label>
                                <input
                                  required
                                  type="email"
                                  maxLength={255}
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                  className="w-full border-b border-border bg-transparent py-3 outline-none focus:border-accent transition-colors"
                                  placeholder="you@example.com"
                                />
                              </div>
                              <div>
                                <label className="label-caps block mb-2">Phone</label>
                                <input
                                  type="tel"
                                  maxLength={20}
                                  value={phone}
                                  onChange={(e) => setPhone(e.target.value)}
                                  className="w-full border-b border-border bg-transparent py-3 outline-none focus:border-accent transition-colors"
                                  placeholder="+27 ..."
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Navigation */}
                  <div className="flex items-center justify-between mt-8 pt-6 border-t border-border/30">
                    {step > 0 ? (
                      <button
                        type="button"
                        onClick={prev}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <ChevronLeft size={16} />
                        Back
                      </button>
                    ) : (
                      <div />
                    )}
                    <button
                      type="button"
                      onClick={next}
                      disabled={!canNext() || sending}
                      className={`flex items-center gap-2 px-8 py-3 text-sm tracking-[0.12em] uppercase font-medium transition-all gold-shine ${
                        canNext() && !sending
                          ? "bg-accent text-accent-foreground hover:tracking-[0.16em]"
                          : "bg-muted text-muted-foreground cursor-not-allowed"
                      }`}
                    >
                      {step === 4 ? (sending ? "Sending…" : "Submit") : "Continue"}
                      {step < 4 && <ChevronRight size={16} />}
                    </button>
                  </div>
                </>
              )}
            </div>
          </SectionReveal>
        </div>
      </section>
    </PageTransition>
  );
};

export default ContactPage;

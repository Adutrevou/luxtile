import { useState } from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import SectionReveal from '@/components/SectionReveal';

const ContactPage = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <PageTransition>
      <section className="pt-40 pb-28 section-padding">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Left */}
          <SectionReveal>
            <p className="label-caps mb-4">Get In Touch</p>
            <h1 className="heading-display text-foreground mb-6">Ready to Transform Your Space?</h1>
            <p className="text-muted-foreground mb-12 max-w-md">
              Our consultants are ready to help you select the perfect slab for your vision. Request a quote or reach out directly.
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
                  <p className="text-muted-foreground text-sm">info@luxtileinstallations.co.za</p>
                </div>
              </div>
            </div>

            <div className="mt-16 inline-flex items-center gap-3 border border-accent/30 px-8 py-4">
              <span className="font-display text-3xl text-accent">10+</span>
              <span className="text-muted-foreground text-sm tracking-[0.1em] uppercase">Years of Excellence</span>
            </div>
          </SectionReveal>

          {/* Right - Form */}
          <SectionReveal delay={0.2}>
            {submitted ? (
              <div className="bg-secondary p-16 text-center">
                <p className="font-display text-2xl mb-2">Thank You</p>
                <p className="text-muted-foreground">We'll be in touch shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="label-caps block mb-2">Name</label>
                  <input required type="text" maxLength={100} className="w-full border-b border-border bg-transparent py-3 outline-none focus:border-accent transition-colors" />
                </div>
                <div>
                  <label className="label-caps block mb-2">Email</label>
                  <input required type="email" maxLength={255} className="w-full border-b border-border bg-transparent py-3 outline-none focus:border-accent transition-colors" />
                </div>
                <div>
                  <label className="label-caps block mb-2">Phone</label>
                  <input type="tel" maxLength={20} className="w-full border-b border-border bg-transparent py-3 outline-none focus:border-accent transition-colors" />
                </div>
                <div>
                  <label className="label-caps block mb-2">Project Type</label>
                  <select className="w-full border-b border-border bg-transparent py-3 outline-none focus:border-accent transition-colors">
                    <option value="">Select</option>
                    <option>Residential</option>
                    <option>Commercial</option>
                    <option>Hospitality</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="label-caps block mb-2">Quantity / Interest</label>
                  <input type="text" maxLength={100} className="w-full border-b border-border bg-transparent py-3 outline-none focus:border-accent transition-colors" placeholder="e.g., 50m² Calacatta for kitchen" />
                </div>
                <div>
                  <label className="label-caps block mb-2">Message</label>
                  <textarea required maxLength={1000} rows={4} className="w-full border-b border-border bg-transparent py-3 outline-none focus:border-accent transition-colors resize-none" />
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" id="purchase-contact" className="accent-accent" />
                  <label htmlFor="purchase-contact" className="text-sm text-muted-foreground">Interested in direct purchase</label>
                </div>
                <button
                  type="submit"
                  className="w-full bg-accent text-accent-foreground py-4 text-sm tracking-[0.15em] uppercase font-medium gold-shine transition-all hover:tracking-[0.19em]"
                >
                  Request a Quote
                </button>
              </form>
            )}
          </SectionReveal>
        </div>
      </section>
    </PageTransition>
  );
};

export default ContactPage;

import { Shield, Maximize2, Truck, Users } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import SectionReveal from "@/components/SectionReveal";

const cards = [
  {
    icon: Shield,
    title: "Premium Quality",
    desc: "Every slab is rigorously tested to meet international standards for hardness, absorption, and aesthetics.",
  },
  {
    icon: Maximize2,
    title: "Large Format Slabs",
    desc: "Offering sizes up to 1600×3200mm for seamless, grout-minimal installations.",
  },
  {
    icon: Truck,
    title: "Nationwide Delivery",
    desc: "Specialist handling and delivery ensures your slabs arrive intact and on schedule.",
  },
  {
    icon: Users,
    title: "Expert Guidance",
    desc: "Our specialists help you choose the perfect tile for your vision, budget, and project type.",
  },
];

const DifferencePage = () => (
  <PageTransition>
    <section className="min-h-screen bg-surface-dark text-surface-dark-foreground pt-40 pb-28 section-padding">
      <SectionReveal>
        <p className="label-caps mb-4">Why Choose Us</p>
        <h1 className="heading-display text-surface-dark-foreground mb-6">Why Choose Luxtile Installations</h1>
        <p className="text-surface-dark-foreground/60 max-w-xl mb-20">
          We don't just supply stone. We deliver confidence in every slab.
        </p>
      </SectionReveal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((card, i) => (
          <SectionReveal key={card.title} delay={i * 0.15}>
            <div className="bg-surface-dark p-8 md:p-16 group">
              <card.icon size={32} className="text-accent mb-8" strokeWidth={1} />
              <h3 className="font-display text-2xl text-surface-dark-foreground mb-4">{card.title}</h3>
              <p className="text-surface-dark-foreground/50 leading-relaxed">{card.desc}</p>
            </div>
          </SectionReveal>
        ))}
      </div>

      <SectionReveal className="mt-20 text-center">
        <div className="inline-flex items-center gap-3 border border-accent/30 px-8 py-4">
          <span className="font-display text-3xl text-accent">10+</span>
          <span className="text-surface-dark-foreground/60 text-sm tracking-[0.1em] uppercase">
            Years of Excellence
          </span>
        </div>
      </SectionReveal>
    </section>
  </PageTransition>
);

export default DifferencePage;

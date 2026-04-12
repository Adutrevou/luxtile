import { useState } from "react";
import SmoothImage from "@/components/SmoothImage";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import SectionReveal from "@/components/SectionReveal";
import QuoteModal from "@/components/QuoteModal";
import heroImg from "@/assets/hero-calacatta.jpg";
import slabNero from "@/assets/slab-nero.jpg";
import { useFeaturedProducts } from "@/hooks/useProducts";
import inspKitchen from "@/assets/insp-kitchen.jpg";
import inspLiving from "@/assets/insp-living.jpg";
import inspLobby from "@/assets/insp-lobby.jpg";

const Index = () => {
  const [quoteOpen, setQuoteOpen] = useState(false);
  const { data: featured = [], isError: featErr, refetch: featRefetch } = useFeaturedProducts();

  return (
    <PageTransition>
      {/* Hero */}
      <section className="relative h-screen min-h-[100svh] flex items-center justify-center overflow-hidden">
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <img src={heroImg} alt="Luxury Calacatta marble porcelain interior" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-foreground/30" />
        </motion.div>
        <div className="relative z-10 text-center text-primary-foreground section-padding max-w-4xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="label-caps mb-6 !text-primary-foreground/80"
          >
            Premium Large Format Slabs
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="heading-display text-primary-foreground mb-4"
          >
            Luxtile Installations
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-xl md:text-2xl text-primary-foreground/80 italic mb-4"
          >
            Where Stone Meets Perfection
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-primary-foreground/70 text-sm md:text-base max-w-xl mx-auto mb-10 font-body"
          >
            Extraordinary porcelain slab tiles crafted for spaces that demand nothing less than exceptional.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={() => setQuoteOpen(true)}
              className="bg-accent text-accent-foreground px-10 py-5 text-base tracking-[0.15em] uppercase font-semibold gold-shine transition-all hover:tracking-[0.19em] shadow-lg"
            >
              Request a Quote
            </button>
            <Link
              to="/collections"
              className="border border-primary-foreground/40 text-primary-foreground px-8 py-4 text-sm tracking-[0.15em] uppercase font-medium hover:bg-primary-foreground/10 transition-all hover:tracking-[0.19em]"
            >
              Explore Collections
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="section-padding py-28">
        <SectionReveal>
          <p className="label-caps mb-4">Signature Collections</p>
          <h2 className="heading-section text-foreground mb-16">Curated Excellence</h2>
        </SectionReveal>
        {featured.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1">
            {featured.map((col, i) => {
              const coverImg = col.images[col.cover_index] || col.images[0] || "";
              return (
                <SectionReveal key={col.id} delay={i * 0.15}>
                  <Link to="/collections" className="group block relative overflow-hidden aspect-[3/4]">
                    {coverImg ? (
                      <SmoothImage
                        src={coverImg}
                        alt={col.name}
                        className="w-full h-full object-cover transition-transform duration-1000 ease-in-out group-hover:scale-[1.02]"
                        loading={i < 3 ? 'eager' : 'lazy'}
                      />
                    ) : (
                      <div className="w-full h-full bg-muted" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <p className="text-primary-foreground font-display text-xl mb-1">{col.name}</p>
                      <p className="text-primary-foreground/60 text-sm max-h-0 opacity-0 group-hover:max-h-24 group-hover:opacity-100 transition-all duration-700 ease-in-out overflow-hidden">
                        {col.description}
                      </p>
                    </div>
                  </Link>
                </SectionReveal>
              );
            })}
          </div>
        ) : featErr ? (
          <div className="text-center py-12 text-muted-foreground cursor-pointer" onClick={() => featRefetch()}>
            Something went wrong — tap to retry
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">Loading collections...</div>
        )}
        <SectionReveal className="mt-12 text-center">
          <Link
            to="/collections"
            className="inline-flex items-center gap-2 text-accent text-sm tracking-[0.1em] uppercase font-medium hover:gap-4 transition-all"
          >
            View All Collections <ArrowRight size={16} />
          </Link>
        </SectionReveal>
      </section>

      {/* Sales Teaser */}
      <section className="bg-surface-dark text-surface-dark-foreground">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="aspect-square lg:aspect-auto overflow-hidden">
            <img src={slabNero} alt="Nero Marquina slab" className="w-full h-full object-cover" loading="lazy" />
          </div>
          <SectionReveal className="section-padding py-20 lg:py-28 flex flex-col justify-center">
            <p className="label-caps mb-4">Now Available Direct</p>
            <h2 className="heading-section text-surface-dark-foreground mb-6">Acquire Excellence</h2>
            <p className="text-surface-dark-foreground/60 mb-10 max-w-md">
              Move beyond inspiration, secure your slabs today for flawless execution. Now available direct for South
              Africa's most ambitious projects.
            </p>
            <Link
              to="/sales"
              className="inline-block bg-accent text-accent-foreground px-8 py-4 text-sm tracking-[0.15em] uppercase font-medium gold-shine transition-all hover:tracking-[0.19em] self-start"
            >
              Explore Direct Sales
            </Link>
          </SectionReveal>
        </div>
      </section>

      {/* Difference Teaser */}
      <section className="section-padding py-28">
        <SectionReveal>
          <p className="label-caps mb-4">Why Luxtile</p>
          <h2 className="heading-section text-foreground mb-16">The Difference</h2>
        </SectionReveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { title: "Premium Quality", desc: "Every slab rigorously tested to meet international standards." },
            { title: "Large Format", desc: "Sizes up to 1200×2400mm for seamless installations." },
            { title: "Expert Guidance", desc: "Specialists to help you choose the perfect tile for your vision." },
          ].map((item, i) => (
            <SectionReveal key={item.title} delay={i * 0.15} className="border-l border-border pl-8">
              <h3 className="font-display text-xl mb-3">{item.title}</h3>
              <p className="text-muted-foreground text-sm">{item.desc}</p>
            </SectionReveal>
          ))}
        </div>
        <SectionReveal className="mt-12 text-center">
          <Link
            to="/why-us"
            className="inline-flex items-center gap-2 text-accent text-sm tracking-[0.1em] uppercase font-medium hover:gap-4 transition-all"
          >
            Learn More <ArrowRight size={16} />
          </Link>
        </SectionReveal>
      </section>

      {/* Inspiration Teaser */}
      <section className="section-padding py-28 bg-secondary">
        <SectionReveal>
          <p className="label-caps mb-4">Inspiration</p>
          <h2 className="heading-section text-foreground mb-16">Spaces Transformed</h2>
        </SectionReveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
          {[inspKitchen, inspLiving, inspLobby].map((img, i) => (
            <SectionReveal key={i} delay={i * 0.1}>
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={img}
                  alt="Inspiration"
                  className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-1000 ease-in-out"
                  loading="lazy"
                />
              </div>
            </SectionReveal>
          ))}
        </div>
        <SectionReveal className="mt-12 text-center">
          <Link
            to="/inspiration"
            className="inline-flex items-center gap-2 text-accent text-sm tracking-[0.1em] uppercase font-medium hover:gap-4 transition-all"
          >
            View Gallery <ArrowRight size={16} />
          </Link>
        </SectionReveal>
      </section>

      <QuoteModal open={quoteOpen} onClose={() => setQuoteOpen(false)} />
    </PageTransition>
  );
};

export default Index;

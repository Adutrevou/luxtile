import { useState } from 'react';
import { Check } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import SectionReveal from '@/components/SectionReveal';
import QuoteModal from '@/components/QuoteModal';
import { collections } from '@/lib/collections';

import dektonLogo from '@/assets/dekton-logo.png';
import dektonMoone from '@/assets/dekton-moone.png';
import dektonLucid from '@/assets/dekton-lucid.png';
import dektonReverie from '@/assets/dekton-reverie.png';
import dektonSomnia from '@/assets/dekton-somnia.png';

const benefits = [
  'Competitive direct pricing',
  'No middlemen',
  'Fast-track quotes',
  'Bulk project discounts available',
  'Samples on request',
  'Specialist delivery nationwide',
];

const dektonProducts = [
  {
    name: 'Moone',
    finish: 'Smooth Matte',
    thicknesses: '4 | 8 | 12 | 20mm',
    size: '3200 x 1440mm',
    image: dektonMoone,
  },
  {
    name: 'Lucid',
    finish: 'Polished Gloss',
    thicknesses: '4 | 8 | 12 | 20mm',
    size: '3200 x 1440mm',
    image: dektonLucid,
  },
  {
    name: 'Reverie',
    finish: 'Velvet',
    thicknesses: '4 | 8 | 12 | 20mm',
    size: '3200 x 1440mm',
    image: dektonReverie,
  },
  {
    name: 'Somnia',
    finish: 'Smooth Matte',
    thicknesses: '4 | 8 | 12 | 20mm',
    size: '3200 x 1440mm',
    image: dektonSomnia,
  },
];

const SalesPage = () => {
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState('');
  const bestSellers = [collections[0], collections[3], collections[4]];

  return (
    <PageTransition>
      {/* Hero */}
      <section className="pt-40 pb-20 section-padding">
        <SectionReveal>
          <p className="label-caps mb-4">Direct Sales</p>
          <h1 className="heading-display text-foreground mb-6">Acquire Excellence</h1>
          <p className="text-muted-foreground max-w-2xl text-lg mb-12">
            We're expanding to make our exceptional collections accessible directly to you — architects, designers, builders, and discerning homeowners — with seamless quoting, nationwide supply, and expert support.
          </p>
        </SectionReveal>

        {/* Benefits */}
        <SectionReveal className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((b, i) => (
              <div key={i} className="flex items-start gap-3 border-l border-accent pl-6 py-2">
                <Check size={16} className="text-accent mt-0.5 shrink-0" />
                <span className="text-sm">{b}</span>
              </div>
            ))}
          </div>
        </SectionReveal>
      </section>

      {/* Best Sellers */}
      <section className="section-padding pb-28">
        <SectionReveal>
          <p className="label-caps mb-4">Featured</p>
          <h2 className="heading-section text-foreground mb-16">Best Sellers</h2>
        </SectionReveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
          {bestSellers.map((col, i) => (
            <SectionReveal key={col.id} delay={i * 0.15}>
              <div className="group relative overflow-hidden aspect-[3/4]">
                <img src={col.image} alt={col.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h3 className="text-primary-foreground font-display text-2xl mb-2">{col.name}</h3>
                  <p className="text-primary-foreground/60 text-sm mb-4">{col.description}</p>
                  <button
                    onClick={() => { setSelectedCollection(col.name); setQuoteOpen(true); }}
                    className="bg-accent text-accent-foreground px-6 py-3 text-xs tracking-[0.15em] uppercase font-medium gold-shine"
                  >
                    Request Quote
                  </button>
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>
      </section>

      {/* Dekton Brand Section */}
      <section className="section-padding py-28 bg-background">
        <SectionReveal>
          <div className="flex items-center gap-6 mb-4">
            <p className="label-caps">Premium Partner</p>
          </div>
          <div className="flex items-center gap-6 mb-6">
            <img src={dektonLogo} alt="Dekton" className="h-8 md:h-10 object-contain" />
          </div>
          <p className="text-muted-foreground max-w-2xl mb-16">
            Ultra-compact surfaces engineered for unmatched durability and striking beauty. Available in large-format slabs up to 3200 × 1440mm.
          </p>
        </SectionReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-[2px] bg-border">
          {dektonProducts.map((product, i) => (
            <SectionReveal key={product.name} delay={i * 0.1}>
              <div className="bg-background overflow-hidden">
                <div className="aspect-[16/9] overflow-hidden">
                  <img
                    src={product.image}
                    alt={`Dekton ${product.name}`}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.02]"
                    loading="lazy"
                  />
                </div>
                <div className="p-8">
                  <h3 className="font-display text-xl mb-2">{product.name}</h3>
                  <div className="space-y-1 text-sm text-muted-foreground mb-4">
                    <p>{product.finish}</p>
                    <p>{product.thicknesses}</p>
                    <p>{product.size}</p>
                  </div>
                  <button
                    onClick={() => { setSelectedCollection(`Dekton ${product.name}`); setQuoteOpen(true); }}
                    className="bg-accent text-accent-foreground px-6 py-3 text-xs tracking-[0.15em] uppercase font-medium gold-shine transition-all hover:tracking-[0.19em]"
                  >
                    Request Quote
                  </button>
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-surface-dark text-surface-dark-foreground section-padding py-28 text-center">
        <SectionReveal>
          <p className="label-caps mb-4">Trusted by Leading South African Projects</p>
          <h2 className="heading-section text-surface-dark-foreground mb-6">Move Beyond Inspiration</h2>
          <p className="text-surface-dark-foreground/60 max-w-lg mx-auto mb-10">
            Secure your slabs today for flawless execution. Our team is ready to provide bulk quotes, samples, and expert guidance.
          </p>
          <button
            onClick={() => setQuoteOpen(true)}
            className="bg-accent text-accent-foreground px-10 py-4 text-sm tracking-[0.15em] uppercase font-medium gold-shine transition-all hover:tracking-[0.19em]"
          >
            Request a Quote for Purchase
          </button>
        </SectionReveal>
      </section>

      <QuoteModal open={quoteOpen} onClose={() => setQuoteOpen(false)} collectionName={selectedCollection} showSalesFields />
    </PageTransition>
  );
};

export default SalesPage;

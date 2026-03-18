import { useState } from 'react';
import { Check } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import SectionReveal from '@/components/SectionReveal';
import QuoteModal from '@/components/QuoteModal';
import { collections } from '@/lib/collections';

const benefits = [
  'Competitive direct pricing',
  'No middlemen',
  'Fast-track quotes',
  'Bulk project discounts available',
  'Samples on request',
  'Specialist delivery nationwide',
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

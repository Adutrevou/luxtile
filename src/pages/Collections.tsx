import { useState } from 'react';
import PageTransition from '@/components/PageTransition';
import SectionReveal from '@/components/SectionReveal';
import QuoteModal from '@/components/QuoteModal';
import { collections, categories } from '@/lib/collections';

const CollectionsPage = () => {
  const [filter, setFilter] = useState('All');
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState('');

  const filtered = filter === 'All' ? collections : collections.filter(c => c.category === filter);

  const openQuote = (name: string) => {
    setSelectedCollection(name);
    setQuoteOpen(true);
  };

  return (
    <PageTransition>
      <section className="pt-32 pb-20 section-padding">
        <SectionReveal>
          <p className="label-caps mb-4">Our Range</p>
          <h1 className="heading-display text-foreground mb-6">Signature Collections</h1>
          <p className="text-muted-foreground max-w-xl mb-16">
            Each collection is a testament to precision engineering and timeless design.
          </p>
        </SectionReveal>

        {/* Filter Bar */}
        <SectionReveal className="mb-12">
          <div className="flex flex-wrap gap-6">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`text-sm tracking-[0.1em] uppercase transition-all pb-1 ${
                  filter === cat
                    ? 'text-foreground border-b-2 border-accent'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </SectionReveal>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[2px] bg-border">
          {filtered.length === 0 ? (
            <div className="col-span-full bg-background py-20 text-center">
              <p className="text-muted-foreground">No collections found in this category.</p>
            </div>
          ) : filtered.map((col, i) => (
            <SectionReveal key={col.id} delay={i * 0.1}>
              <div className="bg-background group relative overflow-hidden">
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={col.image}
                    alt={col.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                    loading="lazy"
                  />
                </div>
                <div className="p-8">
                  <h3 className="font-display text-xl mb-2">{col.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{col.description}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {col.sizes.map(s => (
                      <span key={s} className="text-xs text-muted-foreground border border-border px-2 py-1">{s}</span>
                    ))}
                  </div>
                  <button
                    onClick={() => openQuote(col.name)}
                    className="bg-accent text-accent-foreground px-6 py-3 text-xs tracking-[0.15em] uppercase font-medium gold-shine transition-all hover:tracking-[0.19em]"
                  >
                    Request Specification
                  </button>
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>
      </section>

      <QuoteModal open={quoteOpen} onClose={() => setQuoteOpen(false)} collectionName={selectedCollection} />
    </PageTransition>
  );
};

export default CollectionsPage;

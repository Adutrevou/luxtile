import { useState } from 'react';
import { Check } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import SectionReveal from '@/components/SectionReveal';
import QuoteModal from '@/components/QuoteModal';
import ProductCard from '@/components/ProductCard';
import { collections } from '@/lib/collections';
import { useQuoteBasket } from '@/context/QuoteBasketContext';
import { useProductsBySection } from '@/hooks/useProducts';

const CollectionsPage = () => {
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState('');
  const { addItem, isInBasket } = useQuoteBasket();
  const { data: adminProducts = [] } = useProductsBySection('Collection');

  const openQuote = (name: string) => {
    setSelectedCollection(name);
    setQuoteOpen(true);
  };

  const handleAddToBasket = (col: typeof collections[0]) => {
    addItem({
      id: col.id,
      name: col.name,
      image: col.image,
      category: col.category,
    });
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

        {/* Static Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((col, i) => {
            const inBasket = isInBasket(col.id);
            return (
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
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleAddToBasket(col)}
                        disabled={inBasket}
                        className={`flex items-center gap-2 px-6 py-3 text-xs tracking-[0.15em] uppercase font-medium transition-all ${
                          inBasket
                            ? 'bg-accent/20 text-accent cursor-default'
                            : 'border border-border text-foreground hover:border-accent hover:text-accent'
                        }`}
                      >
                        {inBasket ? <><Check size={14} /> Added</> : 'Add to Quote'}
                      </button>
                      <button
                        onClick={() => openQuote(col.name)}
                        className="bg-accent text-accent-foreground px-6 py-3 text-xs tracking-[0.15em] uppercase font-medium gold-shine transition-all hover:tracking-[0.19em]"
                      >
                        Request Specification
                      </button>
                    </div>
                  </div>
                </div>
              </SectionReveal>
            );
          })}
        </div>

        {/* Admin-Managed Collection Products */}
        {adminProducts.length > 0 && (
          <div className="mt-16">
            <SectionReveal>
              <h2 className="heading-section text-foreground mb-12">More Collections</h2>
            </SectionReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {adminProducts.map((product, i) => (
                <SectionReveal key={product.id} delay={i * 0.1}>
                  <ProductCard product={product} onRequestQuote={openQuote} />
                </SectionReveal>
              ))}
            </div>
          </div>
        )}
      </section>

      <QuoteModal open={quoteOpen} onClose={() => setQuoteOpen(false)} collectionName={selectedCollection} />
    </PageTransition>
  );
};

export default CollectionsPage;

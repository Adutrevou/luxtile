import { useState } from 'react';
import { Check } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import SectionReveal from '@/components/SectionReveal';
import QuoteModal from '@/components/QuoteModal';
import ProductCardSkeleton from '@/components/ProductCardSkeleton';
import { useQuoteBasket } from '@/context/QuoteBasketContext';
import { useProductsBySection, Product } from '@/hooks/useProducts';

const CollectionsPage = () => {
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState('');
  const { addItem, isInBasket } = useQuoteBasket();
  const { data: products = [], isLoading, isError, refetch } = useProductsBySection('Collection');

  const openQuote = (name: string) => {
    setSelectedCollection(name);
    setQuoteOpen(true);
  };

  const handleAddToBasket = (p: Product) => {
    addItem({
      id: p.id,
      name: p.name,
      image: p.images[p.cover_index] || '',
      category: p.category,
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

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : isError ? (
          <p className="text-muted-foreground text-center py-20 cursor-pointer" onClick={() => refetch()}>Something went wrong — tap to retry</p>
        ) : products.length === 0 ? (
          <p className="text-muted-foreground text-center py-20">No collections available yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((col, i) => {
              const inBasket = isInBasket(col.id);
              const coverImg = col.images[col.cover_index] || col.images[0] || '';
              return (
                <SectionReveal key={col.id} delay={i * 0.1}>
                  <div className="bg-background group relative overflow-hidden">
                    <div className="aspect-[3/4] overflow-hidden">
                      {coverImg ? (
                        <img
                          src={coverImg}
                          alt={col.name}
                          className="w-full h-full object-cover transition-transform duration-1000 ease-in-out group-hover:scale-[1.02]"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">No Image</div>
                      )}
                    </div>
                    <div className="p-8">
                      <h3 className="font-display text-xl mb-2">{col.name}</h3>
                      <p className="text-muted-foreground text-sm mb-0 max-h-0 opacity-0 group-hover:max-h-24 group-hover:opacity-100 group-hover:mb-4 transition-all duration-700 ease-in-out overflow-hidden leading-relaxed">{col.description}</p>
                      {col.sizes.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-6">
                          {col.sizes.map(s => (
                            <span key={s} className="text-xs text-muted-foreground border border-border px-2 py-1">{s}</span>
                          ))}
                        </div>
                      )}
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
        )}
      </section>

      <QuoteModal open={quoteOpen} onClose={() => setQuoteOpen(false)} collectionName={selectedCollection} />
    </PageTransition>
  );
};

export default CollectionsPage;

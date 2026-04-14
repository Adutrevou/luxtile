import { useState, useCallback } from 'react';
import SmoothImage from '@/components/SmoothImage';
import PageTransition from '@/components/PageTransition';
import SectionReveal from '@/components/SectionReveal';
import QuoteModal from '@/components/QuoteModal';
import ProductCardSkeleton from '@/components/ProductCardSkeleton';
import ProductQuoteControls from '@/components/ProductQuoteControls';
import { useProductsBySection } from '@/hooks/useProducts';
import { useRealtimeSubscription } from '@/hooks/useRealtimeSubscription';

const CollectionsPage = () => {
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState('');
  const { data: products = [], isLoading, isError, refetch } = useProductsBySection('Collection');

  useRealtimeSubscription('products', [['products']]);

  const openQuote = useCallback((name: string) => {
    setSelectedCollection(name);
    setQuoteOpen(true);
  }, []);

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
              const coverImg = col.images[col.cover_index] || col.images[0] || '';
              return (
                <SectionReveal key={col.id} delay={i * 0.1}>
                  <div className="bg-background group relative overflow-hidden h-full flex flex-col">
                    <div className="aspect-[3/4] overflow-hidden shrink-0">
                      {coverImg ? (
                        <SmoothImage
                          src={coverImg}
                          alt={col.name}
                          className="w-full h-full object-cover transition-transform duration-1000 ease-in-out group-hover:scale-[1.02]"
                          loading={i < 3 ? 'eager' : 'lazy'}
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">No Image</div>
                      )}
                    </div>
                    <div className="p-8 flex flex-col flex-1">
                      <h3 className="font-display text-xl mb-2">{col.name}</h3>
                      <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{col.description}</p>
                      {col.sizes.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-6">
                          {col.sizes.map((s) => (
                            <span key={s} className="text-xs text-muted-foreground border border-border px-2 py-1">{s}</span>
                          ))}
                        </div>
                      )}
                      <ProductQuoteControls
                        product={col}
                        onRequestQuote={() => openQuote(col.name)}
                        requestQuoteLabel="Request Specification"
                      />
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

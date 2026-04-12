import { memo, useState, useCallback } from 'react';
import SmoothImage from '@/components/SmoothImage';
import { Check as CheckIcon } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import SectionReveal from '@/components/SectionReveal';
import QuoteModal from '@/components/QuoteModal';
import { useQuoteBasket } from '@/context/QuoteBasketContext';
import { useProductsBySection, Product } from '@/hooks/useProducts';
import { usePartners } from '@/hooks/usePartners';
import { useRealtimeSubscription } from '@/hooks/useRealtimeSubscription';

const benefits = [
  'Competitive direct pricing',
  'Fast-track quotes',
  'Bulk project discounts available',
  'Specialist delivery nationwide',
];

/* ── Extracted card components (stable across renders) ── */

const ProductOverlayCard = memo(({ product, index, onAdd, onQuote, inBasket }: {
  product: Product; index: number; onAdd: (p: Product) => void; onQuote: (name: string) => void; inBasket: boolean;
}) => {
  const coverImg = product.images[product.cover_index] || product.images[0] || '';
  return (
    <SectionReveal delay={index * 0.15}>
      <div className="group relative overflow-hidden aspect-[3/4]">
        {coverImg ? (
          <SmoothImage src={coverImg} alt={product.name} className="w-full h-full object-cover transition-transform duration-1000 ease-in-out group-hover:scale-[1.02]" loading={index < 3 ? 'eager' : 'lazy'} />
        ) : (
          <div className="w-full h-full bg-muted" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <h3 className="text-primary-foreground font-display text-xl md:text-2xl mb-2">{product.name}</h3>
          <p className="text-primary-foreground/60 text-sm mb-4 line-clamp-3">{product.description}</p>
          <div className="flex flex-wrap items-end gap-3">
            <button onClick={() => onAdd(product)} disabled={inBasket} className={`px-5 py-3 text-xs tracking-[0.15em] uppercase font-medium transition-all flex items-center gap-2 ${inBasket ? 'bg-accent/30 text-accent-foreground cursor-default' : 'border border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10'}`}>
              {inBasket ? <><CheckIcon size={14} /> Added</> : 'Add to Quote'}
            </button>
            <button onClick={() => onQuote(product.name)} className="bg-accent text-accent-foreground px-5 py-3 text-xs tracking-[0.15em] uppercase font-medium gold-shine">
              Request Quote
            </button>
          </div>
        </div>
      </div>
    </SectionReveal>
  );
});
ProductOverlayCard.displayName = 'ProductOverlayCard';

const PartnerProductCard = memo(({ product, index, onAdd, onQuote, inBasket }: {
  product: Product; index: number; onAdd: (p: Product) => void; onQuote: (name: string) => void; inBasket: boolean;
}) => {
  const coverImg = product.images[product.cover_index] || product.images[0] || '';
  return (
    <div className="bg-background overflow-hidden h-full flex flex-col group">
      <div className="aspect-[16/9] overflow-hidden">
        {coverImg ? (
          <SmoothImage src={coverImg} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.02]" />
        ) : (
          <div className="w-full h-full bg-muted" />
        )}
      </div>
      <div className="p-6 md:p-8 flex flex-col flex-1">
        <h3 className="font-display text-lg md:text-xl mb-2">{product.name}</h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-4">{product.description}</p>
        {product.sizes.length > 0 && <p className="text-sm text-muted-foreground mb-4">{product.sizes.join(' · ')}</p>}
        <div className="flex flex-wrap items-end gap-3 mt-auto">
          <button onClick={() => onAdd(product)} disabled={inBasket} className={`px-5 py-3 text-xs tracking-[0.15em] uppercase font-medium transition-all flex items-center gap-2 ${inBasket ? 'bg-accent/20 text-accent cursor-default' : 'border border-border text-foreground hover:border-accent hover:text-accent'}`}>
            {inBasket ? <><CheckIcon size={14} /> Added</> : 'Add to Quote'}
          </button>
          <button onClick={() => onQuote(product.name)} className="bg-accent text-accent-foreground px-5 py-3 text-xs tracking-[0.15em] uppercase font-medium gold-shine transition-all hover:tracking-[0.19em]">
            Request Quote
          </button>
        </div>
      </div>
    </div>
  );
});
PartnerProductCard.displayName = 'PartnerProductCard';

const PartnerInlineCard = memo(({ product, index, inBasket, coverImg, handleAdd, openQuote }: {
  product: Product; index: number; inBasket: boolean; coverImg: string; handleAdd: (p: Product) => void; openQuote: (name: string) => void;
}) => (
  <SectionReveal delay={index * 0.1}>
    <div className="bg-background overflow-hidden h-full flex flex-col group">
      <div className="aspect-[16/9] overflow-hidden">
        {coverImg ? (
          <img src={coverImg} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.02]" loading="lazy" />
        ) : (
          <div className="w-full h-full bg-muted" />
        )}
      </div>
      <div className="p-6 md:p-8 flex flex-col flex-1">
        <h3 className="font-display text-lg md:text-xl mb-2">{product.name}</h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-4">{product.description}</p>
        {product.sizes.length > 0 && <p className="text-sm text-muted-foreground mb-4">{product.sizes.join(' · ')}</p>}
        <div className="flex flex-wrap items-end gap-3 mt-auto">
          <button onClick={() => handleAdd(product)} disabled={inBasket} className={`px-5 py-3 text-xs tracking-[0.15em] uppercase font-medium transition-all flex items-center gap-2 ${inBasket ? 'bg-accent/20 text-accent cursor-default' : 'border border-border text-foreground hover:border-accent hover:text-accent'}`}>
            {inBasket ? <><CheckIcon size={14} /> Added</> : 'Add to Quote'}
          </button>
          <button onClick={() => openQuote(product.name)} className="bg-accent text-accent-foreground px-5 py-3 text-xs tracking-[0.15em] uppercase font-medium gold-shine transition-all hover:tracking-[0.19em]">
            Request Quote
          </button>
        </div>
      </div>
    </div>
  </SectionReveal>
));
PartnerInlineCard.displayName = 'PartnerInlineCard';

/* ── Partner section (isolated data fetching) ── */

const PartnerSection = memo(({ partner, openQuote, handleAdd, isInBasket }: {
  partner: { id: string; name: string; logo_url: string | null; display_section_value: string; description: string };
  openQuote: (name: string) => void;
  handleAdd: (p: Product) => void;
  isInBasket: (id: string) => boolean;
}) => {
  const { data: products = [], isError, refetch } = useProductsBySection(partner.display_section_value);

  if (products.length === 0 && !isError) return null;

  return (
    <section className="section-padding py-28 bg-secondary">
      <SectionReveal>
        <div className="flex items-center gap-6 mb-4">
          <p className="label-caps">Premium Partner</p>
        </div>
        {partner.logo_url ? (
          <div className="flex items-center gap-6 mb-6">
            <img src={partner.logo_url} alt={partner.name} className="h-10 md:h-14 object-contain" />
          </div>
        ) : (
          <h2 className="heading-section text-foreground mb-6">{partner.name}</h2>
        )}
        {partner.description && <p className="text-muted-foreground max-w-2xl mb-16">{partner.description}</p>}
      </SectionReveal>

      {isError ? (
        <p className="text-muted-foreground text-center py-12 cursor-pointer" onClick={() => refetch()}>Something went wrong — tap to retry</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[2px] bg-border auto-rows-fr">
          {products.map((product, i) => {
            const inBasket = isInBasket(product.id);
            const coverImg = product.images[product.cover_index] || product.images[0] || '';
            return (
              <PartnerInlineCard key={product.id} product={product} index={i} inBasket={inBasket} coverImg={coverImg} handleAdd={handleAdd} openQuote={openQuote} />
            );
          })}
        </div>
      )}
    </section>
  );
});
PartnerSection.displayName = 'PartnerSection';

/* ── Main page ── */

const SalesPage = () => {
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState('');
  const { addItem, isInBasket } = useQuoteBasket();

  const { data: bestSellers = [], isError: bsErr, refetch: bsRefetch } = useProductsBySection('Best Sellers');
  const { data: saleProducts = [], isError: spErr, refetch: spRefetch } = useProductsBySection('On Sale');
  const { data: partners = [] } = usePartners();

  const openQuote = useCallback((name: string) => {
    setSelectedCollection(name);
    setQuoteOpen(true);
  }, []);

  const handleAdd = useCallback((p: Product) => {
    addItem({ id: p.id, name: p.name, image: p.images[p.cover_index] || '', category: p.category });
  }, [addItem]);

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

        <SectionReveal className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((b, i) => (
              <div key={i} className="flex items-start gap-3 border-l border-accent pl-6 py-2">
                <CheckIcon size={16} className="text-accent mt-0.5 shrink-0" />
                <span className="text-sm">{b}</span>
              </div>
            ))}
          </div>
        </SectionReveal>
      </section>

      {/* Best Sellers */}
      {(bestSellers.length > 0 || bsErr) && (
        <section className="section-padding pb-28">
          <SectionReveal>
            <p className="label-caps mb-4">Featured</p>
            <h2 className="heading-section text-foreground mb-16">Best Sellers</h2>
          </SectionReveal>
          {bsErr ? (
            <p className="text-muted-foreground text-center py-12 cursor-pointer" onClick={() => bsRefetch()}>Something went wrong — tap to retry</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1">
              {bestSellers.map((product, i) => (
                <ProductOverlayCard key={product.id} product={product} index={i} onAdd={handleAdd} onQuote={openQuote} inBasket={isInBasket(product.id)} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* On Sale Products */}
      {(saleProducts.length > 0 || spErr) && (
        <section className="section-padding pb-28">
          <SectionReveal>
            <p className="label-caps mb-4">Limited Time</p>
            <h2 className="heading-section text-foreground mb-16">On Sale</h2>
          </SectionReveal>
          {spErr ? (
            <p className="text-muted-foreground text-center py-12 cursor-pointer" onClick={() => spRefetch()}>Something went wrong — tap to retry</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {saleProducts.map((product, i) => (
                <SectionReveal key={product.id} delay={i * 0.1}>
                  <PartnerProductCard product={product} index={i} onAdd={handleAdd} onQuote={openQuote} inBasket={isInBasket(product.id)} />
                </SectionReveal>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Dynamic Partner Sections */}
      {partners.map((partner) => (
        <PartnerSection key={partner.id} partner={partner} openQuote={openQuote} handleAdd={handleAdd} isInBasket={isInBasket} />
      ))}

      {/* CTA */}
      <section className="bg-surface-dark text-surface-dark-foreground section-padding py-28 text-center">
        <SectionReveal>
          <p className="label-caps mb-4">Trusted by Leading South African Projects</p>
          <h2 className="heading-section text-surface-dark-foreground mb-6">Move Beyond Inspiration</h2>
          <p className="text-surface-dark-foreground/60 max-w-lg mx-auto mb-10">
            Secure your slabs today for flawless execution. Our team is ready to provide bulk quotes, samples, and expert guidance.
          </p>
          <button onClick={() => setQuoteOpen(true)} className="bg-accent text-accent-foreground px-10 py-4 text-sm tracking-[0.15em] uppercase font-medium gold-shine transition-all hover:tracking-[0.19em]">
            Request a Quote for Purchase
          </button>
        </SectionReveal>
      </section>

      <QuoteModal open={quoteOpen} onClose={() => setQuoteOpen(false)} collectionName={selectedCollection} showSalesFields />
    </PageTransition>
  );
};

export default SalesPage;

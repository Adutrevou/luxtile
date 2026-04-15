import { memo, useState, useCallback } from 'react';
import SmoothImage from '@/components/SmoothImage';
import PageTransition from '@/components/PageTransition';
import SectionReveal from '@/components/SectionReveal';
import QuoteModal from '@/components/QuoteModal';
import ProductQuoteControls from '@/components/ProductQuoteControls';
import { useProductsBySection, Product } from '@/hooks/useProducts';
import { usePartners } from '@/hooks/usePartners';
import { useRealtimeSubscription } from '@/hooks/useRealtimeSubscription';
import { Check as CheckIcon } from 'lucide-react';

const benefits = [
  'Competitive direct pricing',
  'Fast-track quotes',
  'Bulk project discounts available',
  'Specialist delivery nationwide',
];

const ProductOverlayCard = memo(({ product, index, onQuote }: {
  product: Product; index: number; onQuote: (name: string) => void;
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
          <ProductQuoteControls
            product={product}
            variant="light"
            onRequestQuote={() => onQuote(product.name)}
          />
        </div>
      </div>
    </SectionReveal>
  );
});
ProductOverlayCard.displayName = 'ProductOverlayCard';

const PartnerProductCard = memo(({ product, index, onQuote }: {
  product: Product; index: number; onQuote: (name: string) => void;
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
        <p className="text-sm text-muted-foreground mb-4">{product.description}</p>
        {product.sizes.length > 0 && <p className="text-sm text-muted-foreground mb-4">{product.sizes.join(' · ')}</p>}
        <div className="mt-auto">
          <ProductQuoteControls product={product} onRequestQuote={() => onQuote(product.name)} />
        </div>
      </div>
    </div>
  );
});
PartnerProductCard.displayName = 'PartnerProductCard';

const PartnerSection = memo(({ partner, openQuote }: {
  partner: { id: string; name: string; logo_url: string | null; display_section_value: string; description: string };
  openQuote: (name: string) => void;
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
          {products.map((product, i) => (
            <PartnerProductCard key={product.id} product={product} index={i} onQuote={openQuote} />
          ))}
        </div>
      )}
    </section>
  );
});
PartnerSection.displayName = 'PartnerSection';

const SalesPage = () => {
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState('');
  const [brandFilter, setBrandFilter] = useState<string | null>(null);

  useRealtimeSubscription('products', [['products']]);
  useRealtimeSubscription('partners', [['partners']]);

  const { data: bestSellers = [], isError: bsErr, refetch: bsRefetch } = useProductsBySection('Best Sellers');
  const { data: saleProducts = [], isError: spErr, refetch: spRefetch } = useProductsBySection('On Sale');
  const { data: partners = [] } = usePartners();

  const openQuote = useCallback((name: string) => {
    setSelectedCollection(name);
    setQuoteOpen(true);
  }, []);

  const showBestSellers = !brandFilter && (bestSellers.length > 0 || bsErr);
  const showOnSale = !brandFilter && (saleProducts.length > 0 || spErr);
  const filteredPartners = brandFilter
    ? partners.filter((p) => p.id === brandFilter)
    : partners;

  return (
    <PageTransition>
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

        {partners.length > 0 && (
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setBrandFilter(null)}
              className={`px-5 py-2 text-xs tracking-[0.15em] uppercase font-medium border transition-colors ${
                brandFilter === null
                  ? 'bg-foreground text-background border-foreground'
                  : 'bg-transparent text-foreground border-border hover:border-foreground'
              }`}
            >
              All Brands
            </button>
            {partners.map((p) => (
              <button
                key={p.id}
                onClick={() => setBrandFilter(brandFilter === p.id ? null : p.id)}
                className={`px-5 py-2 text-xs tracking-[0.15em] uppercase font-medium border transition-colors ${
                  brandFilter === p.id
                    ? 'bg-foreground text-background border-foreground'
                    : 'bg-transparent text-foreground border-border hover:border-foreground'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        )}
      </section>

      {showBestSellers && (
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
                <div key={product.id} className="group relative overflow-hidden aspect-[3/4]">
                  {(product.images[product.cover_index] || product.images[0]) ? (
                    <SmoothImage src={product.images[product.cover_index] || product.images[0]} alt={product.name} className="w-full h-full object-cover" loading={i < 3 ? 'eager' : 'lazy'} />
                  ) : (
                    <div className="w-full h-full bg-muted" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <h3 className="text-primary-foreground font-display text-xl md:text-2xl mb-2">{product.name}</h3>
                    <p className="text-primary-foreground/60 text-sm mb-4 line-clamp-3">{product.description}</p>
                    <ProductQuoteControls product={product} variant="light" onRequestQuote={() => openQuote(product.name)} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {showOnSale && (
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
                <PartnerProductCard key={product.id} product={product} index={i} onQuote={openQuote} />
              ))}
            </div>
          )}
        </section>
      )}

      {filteredPartners.map((partner) => (
        <PartnerSection key={partner.id} partner={partner} openQuote={openQuote} />
      ))}

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

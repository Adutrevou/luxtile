import { memo } from 'react';
import { Check } from 'lucide-react';
import { useQuoteBasket } from '@/context/QuoteBasketContext';
import type { Product } from '@/hooks/useProducts';

interface ProductCardProps {
  product: Product;
  onRequestQuote?: (name: string) => void;
}

const ProductCard = ({ product, onRequestQuote }: ProductCardProps) => {
  const { addItem, isInBasket } = useQuoteBasket();
  const inBasket = isInBasket(product.id);
  const coverImage = product.images[product.cover_index] || product.images[0] || '';

  const handleAdd = () => {
    addItem({
      id: product.id,
      name: product.name,
      image: coverImage,
      category: product.category,
    });
  };

  return (
    <div className="bg-background group relative overflow-hidden">
      <div className="aspect-[3/4] overflow-hidden">
        {coverImage ? (
          <img
            src={coverImage}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <span className="text-muted-foreground text-sm">No Image</span>
          </div>
        )}
      </div>
      <div className="p-8">
        <h3 className="font-display text-xl mb-1">{product.name}</h3>
        {product.price != null && (
          <p className="text-accent font-medium mb-2">R{product.price.toLocaleString()}</p>
        )}
        <p className="text-muted-foreground text-sm mb-0 max-h-0 opacity-0 group-hover:max-h-24 group-hover:opacity-100 group-hover:mb-4 transition-all duration-500 ease-out overflow-hidden leading-relaxed">{product.description}</p>
        {product.sizes.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {product.sizes.map((s) => (
              <span key={s} className="text-xs text-muted-foreground border border-border px-2 py-1">{s}</span>
            ))}
          </div>
        )}
        <div className="flex gap-3">
          <button
            onClick={handleAdd}
            disabled={inBasket}
            className={`flex items-center gap-2 px-6 py-3 text-xs tracking-[0.15em] uppercase font-medium transition-all ${
              inBasket
                ? 'bg-accent/20 text-accent cursor-default'
                : 'border border-border text-foreground hover:border-accent hover:text-accent'
            }`}
          >
            {inBasket ? <><Check size={14} /> Added</> : 'Add to Quote'}
          </button>
          {onRequestQuote && (
            <button
              onClick={() => onRequestQuote(product.name)}
              className="bg-accent text-accent-foreground px-6 py-3 text-xs tracking-[0.15em] uppercase font-medium gold-shine transition-all hover:tracking-[0.19em]"
            >
              Request Quote
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(ProductCard);

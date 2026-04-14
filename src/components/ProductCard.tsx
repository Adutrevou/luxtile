import { memo } from 'react';
import SmoothImage from '@/components/SmoothImage';
import ProductQuoteControls from '@/components/ProductQuoteControls';
import type { Product } from '@/hooks/useProducts';

interface ProductCardProps {
  product: Product;
  onRequestQuote?: (name: string) => void;
}

const ProductCard = ({ product, onRequestQuote }: ProductCardProps) => {
  const coverImage = product.images[product.cover_index] || product.images[0] || '';

  return (
    <div className="bg-background group relative overflow-hidden h-full flex flex-col">
      <div className="aspect-[3/4] overflow-hidden shrink-0">
        {coverImage ? (
          <SmoothImage
            src={coverImage}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-1000 ease-in-out group-hover:scale-[1.02]"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <span className="text-muted-foreground text-sm">No Image</span>
          </div>
        )}
      </div>
      <div className="p-8 flex flex-col flex-1">
        <h3 className="font-display text-xl mb-1">{product.name}</h3>
        {product.price != null && (
          <p className="text-accent font-medium mb-2">R{product.price.toLocaleString()}</p>
        )}
        <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{product.description}</p>
        {product.sizes.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {product.sizes.map((s) => (
              <span key={s} className="text-xs text-muted-foreground border border-border px-2 py-1">{s}</span>
            ))}
          </div>
        )}
        <div className="mt-auto">
          <ProductQuoteControls
            product={product}
            onRequestQuote={onRequestQuote ? () => onRequestQuote(product.name) : undefined}
          />
        </div>
      </div>
    </div>
  );
};

export default memo(ProductCard);

import { memo, useState, useCallback } from 'react';
import { Check, Minus, Plus } from 'lucide-react';
import { useQuoteBasket } from '@/context/QuoteBasketContext';
import { useOptionSetItems } from '@/hooks/useOptionSets';
import type { Product } from '@/hooks/useProducts';

interface ProductQuoteControlsProps {
  product: Product;
  variant?: 'light' | 'dark'; // light = white text (overlay cards), dark = default
  className?: string;
}

const ProductQuoteControls = ({ product, variant = 'dark', className = '' }: ProductQuoteControlsProps) => {
  const { addItem, isInBasket } = useQuoteBasket();
  const optionSetId = (product as any).option_set_id as string | null;
  const items = useOptionSetItems(optionSetId);
  const hasOptions = items.length > 0;

  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  const compositeId = hasOptions ? `${product.id}-${selectedSize}` : product.id;
  const inBasket = isInBasket(compositeId);
  const canAdd = hasOptions ? !!selectedSize && !inBasket : !inBasket;

  const coverImage = product.images[product.cover_index] || product.images[0] || '';

  const handleAdd = useCallback(() => {
    if (!canAdd) return;
    addItem({
      id: compositeId,
      productId: product.id,
      name: product.name,
      image: coverImage,
      category: product.category,
      sizeThickness: selectedSize || undefined,
      quantity,
    });
    // Reset after adding
    setSelectedSize('');
    setQuantity(1);
  }, [canAdd, compositeId, product, coverImage, selectedSize, quantity, addItem]);

  const isLight = variant === 'light';
  const selectCls = isLight
    ? 'bg-transparent border border-primary-foreground/30 text-primary-foreground py-2.5 px-3 text-xs outline-none'
    : 'bg-transparent border border-border text-foreground py-2.5 px-3 text-xs outline-none focus:border-accent transition-colors';
  const qtyBtnCls = isLight
    ? 'w-8 h-8 flex items-center justify-center border border-primary-foreground/30 text-primary-foreground/70 hover:text-primary-foreground transition-colors'
    : 'w-8 h-8 flex items-center justify-center border border-border text-muted-foreground hover:text-foreground hover:border-accent transition-colors';
  const qtyTextCls = isLight ? 'text-primary-foreground text-sm w-8 text-center' : 'text-foreground text-sm w-8 text-center';

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Size & Thickness dropdown */}
      {hasOptions && (
        <select
          value={selectedSize}
          onChange={(e) => setSelectedSize(e.target.value)}
          className={`w-full ${selectCls}`}
        >
          <option value="">Select Size & Thickness</option>
          {items.map((item) => (
            <option key={item.id} value={item.label} className="bg-background text-foreground">
              {item.label}
            </option>
          ))}
        </select>
      )}

      {/* Quantity + Add button row */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Quantity controls */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className={qtyBtnCls}
          >
            <Minus size={14} />
          </button>
          <span className={qtyTextCls}>{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            className={qtyBtnCls}
          >
            <Plus size={14} />
          </button>
        </div>

        {/* Add to Quote button */}
        <button
          onClick={handleAdd}
          disabled={!canAdd}
          className={`flex items-center gap-2 px-5 py-3 text-xs tracking-[0.15em] uppercase font-medium transition-all ${
            inBasket
              ? isLight
                ? 'bg-accent/30 text-accent-foreground cursor-default'
                : 'bg-accent/20 text-accent cursor-default'
              : !canAdd
                ? isLight
                  ? 'border border-primary-foreground/20 text-primary-foreground/40 cursor-not-allowed'
                  : 'border border-border/50 text-muted-foreground/50 cursor-not-allowed'
                : isLight
                  ? 'border border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10'
                  : 'border border-border text-foreground hover:border-accent hover:text-accent'
          }`}
        >
          {inBasket ? <><Check size={14} /> Added</> : 'Add to Quote'}
        </button>
      </div>
    </div>
  );
};

export default memo(ProductQuoteControls);

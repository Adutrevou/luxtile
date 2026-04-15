import { memo, useCallback, useMemo, useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { buildQuoteBasketItemId, useQuoteBasket, type QuoteBasketItem } from '@/context/QuoteBasketContext';
import type { Product } from '@/hooks/useProducts';

interface ProductQuoteControlsProps {
  product: Product;
  variant?: 'light' | 'dark';
  className?: string;
  onRequestQuote?: () => void;
  requestQuoteLabel?: string;
}

const ProductQuoteControls = ({
  product,
  variant = 'dark',
  className = '',
  onRequestQuote,
  requestQuoteLabel = 'Request Quote',
}: ProductQuoteControlsProps) => {
  const { addItem, isInBasket } = useQuoteBasket();

  const sizeOptions = useMemo(
    () =>
      (product.sizes ?? [])
        .flatMap((s) => s.split(/\s*\|\s*/))
        .map((s) => s.trim())
        .filter(Boolean),
    [product.sizes],
  );
  const hasOptions = sizeOptions.length > 0;

  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  const compositeId = buildQuoteBasketItemId(product.id, selectedSize);
  const selectionReady = hasOptions ? !!selectedSize : true;
  const selectedAlreadyInBasket = selectionReady ? isInBasket(compositeId) : false;
  const coverImage = product.images[product.cover_index] || product.images[0] || '';

  const buildBasketItem = useCallback((): QuoteBasketItem => ({
    id: compositeId,
    productId: product.id,
    name: product.name,
    image: coverImage,
    category: product.category,
    optionSetId: null,
    sizeThickness: selectedSize || undefined,
    quantity,
  }), [compositeId, product.id, product.name, coverImage, product.category, selectedSize, quantity]);

  const handleAdd = useCallback(() => {
    if (!selectionReady) return;
    addItem(buildBasketItem());
    setQuantity(1);
  }, [selectionReady, addItem, buildBasketItem]);

  const handleRequestQuote = useCallback(() => {
    if (!selectionReady || !onRequestQuote) return;
    addItem(buildBasketItem());
    setQuantity(1);
    onRequestQuote();
  }, [selectionReady, onRequestQuote, addItem, buildBasketItem]);

  const isLight = variant === 'light';
  const selectCls = isLight
    ? 'bg-transparent border border-primary-foreground/30 text-primary-foreground py-2.5 px-3 text-xs outline-none'
    : 'bg-transparent border border-border text-foreground py-2.5 px-3 text-xs outline-none focus:border-accent transition-colors';
  const qtyBtnCls = isLight
    ? 'w-8 h-8 flex items-center justify-center border border-primary-foreground/30 text-primary-foreground/70 hover:text-primary-foreground transition-colors'
    : 'w-8 h-8 flex items-center justify-center border border-border text-muted-foreground hover:text-foreground hover:border-accent transition-colors';
  const qtyTextCls = isLight ? 'text-primary-foreground text-sm w-8 text-center' : 'text-foreground text-sm w-8 text-center';
  const addButtonCls = isLight
    ? 'border border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10'
    : 'border border-border text-foreground hover:border-accent hover:text-accent';
  const disabledAddButtonCls = isLight
    ? 'border border-primary-foreground/20 text-primary-foreground/40 cursor-not-allowed'
    : 'border border-border/50 text-muted-foreground/50 cursor-not-allowed';

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center gap-3 flex-wrap">
        {hasOptions && (
          <select
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
            className={`min-w-[140px] ${selectCls}`}
          >
            <option value="">Select Size</option>
            {sizeOptions.map((size) => (
              <option key={size} value={size} className="bg-background text-foreground">
                {size}
              </option>
            ))}
          </select>
        )}

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

        <button
          type="button"
          onClick={handleAdd}
          disabled={!selectionReady}
          className={`flex items-center gap-2 px-5 py-3 text-xs tracking-[0.15em] uppercase font-medium transition-all ${selectionReady ? addButtonCls : disabledAddButtonCls}`}
        >
          {selectedAlreadyInBasket ? 'Add More' : 'Add to Quote'}
        </button>

        {onRequestQuote && (
          <button
            type="button"
            onClick={handleRequestQuote}
            disabled={!selectionReady}
            className={`bg-accent text-accent-foreground px-5 py-3 text-xs tracking-[0.15em] uppercase font-medium gold-shine transition-all ${selectionReady ? 'hover:tracking-[0.19em]' : 'opacity-60 cursor-not-allowed'}`}
          >
            {requestQuoteLabel}
          </button>
        )}
      </div>
    </div>
  );
};

export default memo(ProductQuoteControls);

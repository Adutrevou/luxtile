import { Minus, Plus, Trash2 } from 'lucide-react';
import type { QuoteBasketItem } from '@/context/QuoteBasketContext';
import { useOptionSetItems } from '@/hooks/useOptionSets';

interface QuoteBasketLineItemProps {
  item: QuoteBasketItem;
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onUpdateSize: (id: string, sizeThickness: string) => void;
}

const QuoteBasketLineItem = ({
  item,
  onRemove,
  onUpdateQuantity,
  onUpdateSize,
}: QuoteBasketLineItemProps) => {
  const sizeOptions = useOptionSetItems(item.optionSetId);
  const hasSizeOptions = sizeOptions.length > 0;

  return (
    <div className="flex items-center gap-3 border border-border p-3">
      <img src={item.image} alt={item.name} className="w-12 h-12 object-cover shrink-0" />

      <div className="flex-1 min-w-0 space-y-2">
        <p className="text-sm font-medium truncate">{item.name}</p>

        {hasSizeOptions ? (
          <select
            value={item.sizeThickness || ''}
            onChange={(e) => onUpdateSize(item.id, e.target.value)}
            className="w-full bg-transparent border border-border text-foreground py-2 px-3 text-xs outline-none focus:border-accent transition-colors"
          >
            <option value="" disabled className="bg-background text-foreground">
              Select Size & Thickness
            </option>
            {sizeOptions.map((option) => (
              <option key={option.id} value={option.label} className="bg-background text-foreground">
                {option.label}
              </option>
            ))}
          </select>
        ) : item.sizeThickness ? (
          <p className="text-xs text-muted-foreground">{item.sizeThickness}</p>
        ) : null}
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
          className="w-7 h-7 flex items-center justify-center border border-border text-muted-foreground hover:text-foreground hover:border-accent transition-colors"
        >
          <Minus size={12} />
        </button>
        <span className="text-sm w-6 text-center">{item.quantity}</span>
        <button
          type="button"
          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
          className="w-7 h-7 flex items-center justify-center border border-border text-muted-foreground hover:text-foreground hover:border-accent transition-colors"
        >
          <Plus size={12} />
        </button>
      </div>

      <button
        type="button"
        onClick={() => onRemove(item.id)}
        className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
        aria-label={`Remove ${item.name}`}
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
};

export default QuoteBasketLineItem;

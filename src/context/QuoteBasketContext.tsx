import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react';

const normalizeSizeThickness = (value?: string) => value?.trim() || '';

export const buildQuoteBasketItemId = (productId: string, sizeThickness?: string) => {
  const normalizedSize = normalizeSizeThickness(sizeThickness);
  return normalizedSize ? `${productId}::${normalizedSize}` : productId;
};

export interface QuoteBasketItem {
  id: string;
  productId: string;
  name: string;
  image: string;
  category: string;
  optionSetId: string | null;
  sizeThickness?: string;
  quantity: number;
}

interface QuoteBasketContextType {
  items: QuoteBasketItem[];
  addItem: (item: QuoteBasketItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateSizeThickness: (id: string, sizeThickness: string) => void;
  clearBasket: () => void;
  isInBasket: (id: string) => boolean;
  openQuoteModal: () => void;
  isQuoteOpen: boolean;
  closeQuoteModal: () => void;
}

const QuoteBasketContext = createContext<QuoteBasketContextType | undefined>(undefined);

export const QuoteBasketProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<QuoteBasketItem[]>([]);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);

  const basketIds = useMemo(() => new Set(items.map((i) => i.id)), [items]);

  const addItem = useCallback((item: QuoteBasketItem) => {
    const normalizedItem: QuoteBasketItem = {
      ...item,
      sizeThickness: normalizeSizeThickness(item.sizeThickness) || undefined,
      id: buildQuoteBasketItemId(item.productId, item.sizeThickness),
    };

    setItems((prev) => {
      const existing = prev.find((i) => i.id === normalizedItem.id);
      if (existing) {
        return prev.map((i) =>
          i.id === normalizedItem.id
            ? { ...i, quantity: i.quantity + normalizedItem.quantity }
            : i
        );
      }
      return [...prev, normalizedItem];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.id !== id));
      return;
    }

    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity } : i)));
  }, []);

  const updateSizeThickness = useCallback((id: string, sizeThickness: string) => {
    const normalizedSize = normalizeSizeThickness(sizeThickness);

    setItems((prev) => {
      const currentItem = prev.find((item) => item.id === id);
      if (!currentItem) return prev;

      const nextId = buildQuoteBasketItemId(currentItem.productId, normalizedSize);
      const updatedItem: QuoteBasketItem = {
        ...currentItem,
        id: nextId,
        sizeThickness: normalizedSize || undefined,
      };

      if (nextId === id) {
        return prev.map((item) => (item.id === id ? updatedItem : item));
      }

      const duplicateItem = prev.find((item) => item.id === nextId && item.id !== id);
      if (duplicateItem) {
        return prev
          .filter((item) => item.id !== id)
          .map((item) =>
            item.id === nextId
              ? { ...item, quantity: item.quantity + currentItem.quantity }
              : item
          );
      }

      return prev.map((item) => (item.id === id ? updatedItem : item));
    });
  }, []);

  const clearBasket = useCallback(() => setItems([]), []);
  const isInBasket = useCallback((id: string) => basketIds.has(id), [basketIds]);
  const openQuoteModal = useCallback(() => setIsQuoteOpen(true), []);
  const closeQuoteModal = useCallback(() => setIsQuoteOpen(false), []);

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      updateQuantity,
      updateSizeThickness,
      clearBasket,
      isInBasket,
      openQuoteModal,
      isQuoteOpen,
      closeQuoteModal,
    }),
    [items, addItem, removeItem, updateQuantity, updateSizeThickness, clearBasket, isInBasket, openQuoteModal, isQuoteOpen, closeQuoteModal]
  );

  return <QuoteBasketContext.Provider value={value}>{children}</QuoteBasketContext.Provider>;
};

export const useQuoteBasket = () => {
  const ctx = useContext(QuoteBasketContext);
  if (!ctx) throw new Error('useQuoteBasket must be used within QuoteBasketProvider');
  return ctx;
};

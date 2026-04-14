import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react';

export interface QuoteBasketItem {
  id: string;          // composite: productId or productId-sizeThickness
  productId: string;
  name: string;
  image: string;
  category: string;
  sizeThickness?: string;
  quantity: number;
}

interface QuoteBasketContextType {
  items: QuoteBasketItem[];
  addItem: (item: QuoteBasketItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
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
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        // Same config → increase quantity
        return prev.map((i) => i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i);
      }
      return [...prev, item];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.id !== id));
    } else {
      setItems((prev) => prev.map((i) => i.id === id ? { ...i, quantity } : i));
    }
  }, []);

  const clearBasket = useCallback(() => setItems([]), []);
  const isInBasket = useCallback((id: string) => basketIds.has(id), [basketIds]);
  const openQuoteModal = useCallback(() => setIsQuoteOpen(true), []);
  const closeQuoteModal = useCallback(() => setIsQuoteOpen(false), []);

  const value = useMemo(
    () => ({ items, addItem, removeItem, updateQuantity, clearBasket, isInBasket, openQuoteModal, isQuoteOpen, closeQuoteModal }),
    [items, addItem, removeItem, updateQuantity, clearBasket, isInBasket, openQuoteModal, isQuoteOpen, closeQuoteModal]
  );

  return (
    <QuoteBasketContext.Provider value={value}>
      {children}
    </QuoteBasketContext.Provider>
  );
};

export const useQuoteBasket = () => {
  const ctx = useContext(QuoteBasketContext);
  if (!ctx) throw new Error('useQuoteBasket must be used within QuoteBasketProvider');
  return ctx;
};

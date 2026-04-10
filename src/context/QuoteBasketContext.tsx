import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export interface QuoteBasketItem {
  id: string;
  name: string;
  image: string;
  category: string;
  estimatedArea?: string;
}

interface QuoteBasketContextType {
  items: QuoteBasketItem[];
  addItem: (item: QuoteBasketItem) => void;
  removeItem: (id: string) => void;
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

  const addItem = useCallback((item: QuoteBasketItem) => {
    setItems((prev) => {
      if (prev.some((i) => i.id === item.id)) return prev;
      return [...prev, item];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const clearBasket = useCallback(() => setItems([]), []);

  const isInBasket = useCallback((id: string) => items.some((i) => i.id === id), [items]);

  const openQuoteModal = useCallback(() => setIsQuoteOpen(true), []);
  const closeQuoteModal = useCallback(() => setIsQuoteOpen(false), []);

  return (
    <QuoteBasketContext.Provider
      value={{ items, addItem, removeItem, clearBasket, isInBasket, openQuoteModal, isQuoteOpen, closeQuoteModal }}
    >
      {children}
    </QuoteBasketContext.Provider>
  );
};

export const useQuoteBasket = () => {
  const ctx = useContext(QuoteBasketContext);
  if (!ctx) throw new Error('useQuoteBasket must be used within QuoteBasketProvider');
  return ctx;
};

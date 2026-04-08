import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { useQuoteBasket } from '@/context/QuoteBasketContext';

const QuoteBasketIndicator = () => {
  const { items, openQuoteModal } = useQuoteBasket();

  return (
    <AnimatePresence>
      {items.length > 0 && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          onClick={openQuoteModal}
          className="fixed bottom-8 right-8 z-50 bg-accent text-accent-foreground w-14 h-14 flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
          aria-label={`Quote basket: ${items.length} items`}
        >
          <ShoppingBag size={20} />
          <span className="absolute -top-1.5 -right-1.5 bg-foreground text-background text-xs w-5 h-5 flex items-center justify-center rounded-full font-medium">
            {items.length}
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default QuoteBasketIndicator;

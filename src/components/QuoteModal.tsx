import { forwardRef, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Minus, Plus } from 'lucide-react';
import { useQuoteBasket } from '@/context/QuoteBasketContext';
import { sanitizeFormFields, submitForm } from '@/lib/submitForm';
import { toast } from 'sonner';

interface QuoteModalProps {
  open: boolean;
  onClose: () => void;
  collectionName?: string;
  showSalesFields?: boolean;
}

const QuoteModal = forwardRef<HTMLDivElement, QuoteModalProps>(
  ({ open, onClose, collectionName }, ref) => {
    const [submitted, setSubmitted] = useState(false);
    const [sending, setSending] = useState(false);
    const { items, removeItem, updateQuantity, clearBasket } = useQuoteBasket();
    const formRef = useRef<HTMLFormElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (sending) return;

      const form = formRef.current;
      if (!form) return;

      const formData = new FormData(form);
      const rawFields = Object.fromEntries(
        Array.from(formData.entries()).map(([key, value]) => [key, String(value).trim()]),
      ) as Record<string, string>;

      if (rawFields.website) return;

      const nameVal = rawFields.name ?? '';
      const emailVal = rawFields.email ?? '';

      if (!nameVal || !emailVal) return;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
        toast.error('Please enter a valid email address');
        return;
      }

      // Build product lines with full detail
      const productLines = items.map((item) => {
        let line = `${item.name}`;
        if (item.sizeThickness) line += ` | Size: ${item.sizeThickness}`;
        line += ` | Qty: ${item.quantity}`;
        return line;
      });

      // Add standalone collection name if present
      if (collectionName && !items.some((item) => item.name === collectionName)) {
        productLines.push(collectionName);
      }

      const generatedMessage = productLines.length
        ? `Products:\n${productLines.join('\n')}`
        : '';

      const fields = sanitizeFormFields({
        ...rawFields,
        message: rawFields.message || generatedMessage || 'Quote request',
        products: productLines.join('; '),
        // Include detailed item breakdown for the email
        itemDetails: items.map((item) => ({
          name: item.name,
          sizeThickness: item.sizeThickness || 'N/A',
          quantity: item.quantity,
          category: item.category,
        })),
      });

      delete fields.website;

      setSending(true);
      try {
        await submitForm({ formName: 'Request a Quote', fields });
        form.reset();
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          clearBasket();
          onClose();
        }, 2500);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
      } finally {
        setSending(false);
      }
    };

    const handleClose = () => {
      onClose();
    };

    const hasStandalone = collectionName && !items.some((i) => i.name === collectionName);

    return (
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-[100]"
              onClick={handleClose}
            />
            <motion.div
              ref={ref}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-background z-[101] overflow-y-auto"
            >
              <div className="p-8 md:p-12">
                <div className="flex items-center justify-between mb-10">
                  <h2 className="font-display text-2xl">Request a Quote</h2>
                  <button onClick={handleClose} className="text-foreground/50 hover:text-foreground transition-colors">
                    <X size={24} />
                  </button>
                </div>

                {submitted ? (
                  <div className="text-center py-20">
                    <p className="font-display text-2xl mb-2">Thank You</p>
                    <p className="text-muted-foreground">Thanks, we've received your enquiry.</p>
                  </div>
                ) : (
                  <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                    {/* Honeypot */}
                    <input type="text" name="website" autoComplete="off" tabIndex={-1} className="absolute opacity-0 h-0 w-0 pointer-events-none" aria-hidden="true" />

                    {/* Cart items */}
                    {(items.length > 0 || hasStandalone) && (
                      <div>
                        <label className="label-caps block mb-3">Your Selections</label>
                        <div className="space-y-2">
                          {items.map((item) => (
                            <div key={item.id} className="flex items-center gap-3 border border-border p-3">
                              <img src={item.image} alt={item.name} className="w-12 h-12 object-cover shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{item.name}</p>
                                {item.sizeThickness && (
                                  <p className="text-xs text-muted-foreground">{item.sizeThickness}</p>
                                )}
                              </div>
                              {/* Quantity controls */}
                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="w-7 h-7 flex items-center justify-center border border-border text-muted-foreground hover:text-foreground hover:border-accent transition-colors"
                                >
                                  <Minus size={12} />
                                </button>
                                <span className="text-sm w-6 text-center">{item.quantity}</span>
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="w-7 h-7 flex items-center justify-center border border-border text-muted-foreground hover:text-foreground hover:border-accent transition-colors"
                                >
                                  <Plus size={12} />
                                </button>
                              </div>
                              <button type="button" onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-destructive transition-colors shrink-0" aria-label={`Remove ${item.name}`}>
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ))}
                          {hasStandalone && (
                            <div className="flex items-center gap-3 border border-border p-3">
                              <div className="flex-1"><p className="text-sm font-medium">{collectionName}</p></div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {!items.length && !hasStandalone && collectionName && (
                      <div>
                        <label className="label-caps block mb-2">Collection</label>
                        <p className="text-foreground font-display text-lg">{collectionName}</p>
                      </div>
                    )}

                    <div>
                      <label className="label-caps block mb-2">Name</label>
                      <input required type="text" name="name" maxLength={100} className="w-full border-b border-border bg-transparent py-3 outline-none focus:border-accent transition-colors" />
                    </div>
                    <div>
                      <label className="label-caps block mb-2">Email</label>
                      <input required type="email" name="email" maxLength={255} className="w-full border-b border-border bg-transparent py-3 outline-none focus:border-accent transition-colors" />
                    </div>
                    <div>
                      <label className="label-caps block mb-2">Phone</label>
                      <input type="tel" name="phone" maxLength={20} className="w-full border-b border-border bg-transparent py-3 outline-none focus:border-accent transition-colors" />
                    </div>
                    <div>
                      <label className="label-caps block mb-2">Delivery Location</label>
                      <input type="text" name="deliveryLocation" maxLength={100} className="w-full border-b border-border bg-transparent py-3 outline-none focus:border-accent transition-colors" placeholder="City / Province" />
                    </div>
                    <div>
                      <label className="label-caps block mb-2">Message</label>
                      <textarea name="message" maxLength={1000} rows={3} className="w-full border-b border-border bg-transparent py-3 outline-none focus:border-accent transition-colors resize-none" />
                    </div>
                    <button
                      type="submit"
                      disabled={sending}
                      className={`w-full bg-accent text-accent-foreground py-4 text-sm tracking-[0.15em] uppercase font-medium gold-shine mt-4 transition-all ${sending ? 'opacity-70 cursor-not-allowed' : 'hover:tracking-[0.19em]'}`}
                    >
                      {sending ? 'Sending…' : `Submit Request${items.length > 1 ? ` (${items.length} items)` : ''}`}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }
);

QuoteModal.displayName = 'QuoteModal';

export default QuoteModal;

import { forwardRef, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2 } from 'lucide-react';
import { useQuoteBasket, type QuoteBasketItem } from '@/context/QuoteBasketContext';
import { submitForm } from '@/lib/submitForm';
import { toast } from 'sonner';

interface QuoteModalProps {
  open: boolean;
  onClose: () => void;
  collectionName?: string;
  showSalesFields?: boolean;
}

const QuoteModal = forwardRef<HTMLDivElement, QuoteModalProps>(
  ({ open, onClose, collectionName, showSalesFields }, ref) => {
    const [submitted, setSubmitted] = useState(false);
    const [sending, setSending] = useState(false);
    const { items, removeItem, clearBasket } = useQuoteBasket();
    const formRef = useRef<HTMLFormElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (sending) return;

      const form = formRef.current;
      if (!form) return;

      // Honeypot check
      const honeypot = (form.elements.namedItem('website') as HTMLInputElement)?.value;
      if (honeypot) return;

      const get = (name: string) => (form.elements.namedItem(name) as HTMLInputElement)?.value?.trim() ?? '';

      const nameVal = get('name');
      const emailVal = get('email');

      if (!nameVal || !emailVal) return;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
        toast.error('Please enter a valid email address');
        return;
      }

      const productNames = items.map(i => i.name).join(', ');

      const fields: Record<string, string> = {
        name: nameVal,
        email: emailVal,
        phone: get('phone'),
        projectType: get('projectType'),
        quantity: get('quantity'),
        deliveryLocation: get('deliveryLocation'),
        message: get('message'),
        purchaseInterest: (form.elements.namedItem('purchase-interest') as HTMLInputElement)?.checked ? 'Yes' : 'No',
        products: productNames || collectionName || '',
      };

      // Remove empty fields
      Object.keys(fields).forEach(k => { if (!fields[k]) delete fields[k]; });

      setSending(true);
      try {
        await submitForm({ formName: 'Request a Quote', fields });
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          clearBasket();
          onClose();
        }, 2500);
      } catch {
        toast.error('Something went wrong. Please try again.');
      } finally {
        setSending(false);
      }
    };

    const handleClose = () => {
      onClose();
    };

    const displayItems: QuoteBasketItem[] = [...items];
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

                    {(displayItems.length > 0 || hasStandalone) && (
                      <div>
                        <label className="label-caps block mb-3">Selected Products</label>
                        <div className="space-y-2">
                          {displayItems.map((item) => (
                            <div key={item.id} className="flex items-center gap-3 border border-border p-3 group">
                              <img src={item.image} alt={item.name} className="w-12 h-12 object-cover shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{item.name}</p>
                                <p className="text-xs text-muted-foreground">{item.category}</p>
                                {item.estimatedArea && <p className="text-xs text-accent">{item.estimatedArea} m²</p>}
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

                    {!displayItems.length && !hasStandalone && collectionName && (
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
                      <label className="label-caps block mb-2">Project Type</label>
                      <select name="projectType" className="w-full border-b border-border bg-transparent py-3 outline-none focus:border-accent transition-colors">
                        <option value="">Select</option>
                        <option>Residential</option>
                        <option>Commercial</option>
                        <option>Hospitality</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="label-caps block mb-2">Quantity (m²)</label>
                      <input type="text" name="quantity" maxLength={20} className="w-full border-b border-border bg-transparent py-3 outline-none focus:border-accent transition-colors" placeholder="Estimated area" />
                    </div>
                    <div>
                      <label className="label-caps block mb-2">Delivery Location</label>
                      <input type="text" name="deliveryLocation" maxLength={100} className="w-full border-b border-border bg-transparent py-3 outline-none focus:border-accent transition-colors" placeholder="City / Province" />
                    </div>
                    <div>
                      <label className="label-caps block mb-2">Message</label>
                      <textarea name="message" maxLength={1000} rows={4} className="w-full border-b border-border bg-transparent py-3 outline-none focus:border-accent transition-colors resize-none" />
                    </div>
                    <div className="flex items-center gap-3">
                      <input type="checkbox" id="purchase-interest" name="purchase-interest" className="accent-accent" />
                      <label htmlFor="purchase-interest" className="text-sm text-muted-foreground">Interested in direct purchase</label>
                    </div>
                    <button
                      type="submit"
                      disabled={sending}
                      className={`w-full bg-accent text-accent-foreground py-4 text-sm tracking-[0.15em] uppercase font-medium gold-shine mt-4 transition-all ${sending ? 'opacity-70 cursor-not-allowed' : 'hover:tracking-[0.19em]'}`}
                    >
                      {sending ? 'Sending…' : `Submit Request${displayItems.length > 1 ? ` (${displayItems.length} Products)` : ''}`}
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

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface QuoteModalProps {
  open: boolean;
  onClose: () => void;
  collectionName?: string;
  showSalesFields?: boolean;
}

const QuoteModal = ({ open, onClose, collectionName, showSalesFields }: QuoteModalProps) => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-background z-[101] overflow-y-auto"
          >
            <div className="p-8 md:p-12">
              <div className="flex items-center justify-between mb-10">
                <h2 className="font-display text-2xl">Request a Quote</h2>
                <button onClick={onClose} className="text-foreground/50 hover:text-foreground transition-colors">
                  <X size={24} />
                </button>
              </div>

              {submitted ? (
                <div className="text-center py-20">
                  <p className="font-display text-2xl mb-2">Thank You</p>
                  <p className="text-muted-foreground">We'll be in touch shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {collectionName && (
                    <div>
                      <label className="label-caps block mb-2">Collection</label>
                      <p className="text-foreground font-display text-lg">{collectionName}</p>
                    </div>
                  )}
                  <div>
                    <label className="label-caps block mb-2">Name</label>
                    <input required type="text" maxLength={100} className="w-full border-b border-border bg-transparent py-3 outline-none focus:border-accent transition-colors" />
                  </div>
                  <div>
                    <label className="label-caps block mb-2">Email</label>
                    <input required type="email" maxLength={255} className="w-full border-b border-border bg-transparent py-3 outline-none focus:border-accent transition-colors" />
                  </div>
                  <div>
                    <label className="label-caps block mb-2">Phone</label>
                    <input type="tel" maxLength={20} className="w-full border-b border-border bg-transparent py-3 outline-none focus:border-accent transition-colors" />
                  </div>
                  <div>
                    <label className="label-caps block mb-2">Project Type</label>
                    <select className="w-full border-b border-border bg-transparent py-3 outline-none focus:border-accent transition-colors">
                      <option value="">Select</option>
                      <option>Residential</option>
                      <option>Commercial</option>
                      <option>Hospitality</option>
                      <option>Other</option>
                    </select>
                  </div>
                  {showSalesFields && (
                    <>
                      <div>
                        <label className="label-caps block mb-2">Quantity (m²)</label>
                        <input type="text" maxLength={20} className="w-full border-b border-border bg-transparent py-3 outline-none focus:border-accent transition-colors" placeholder="Estimated area" />
                      </div>
                      <div>
                        <label className="label-caps block mb-2">Delivery Location</label>
                        <input type="text" maxLength={100} className="w-full border-b border-border bg-transparent py-3 outline-none focus:border-accent transition-colors" placeholder="City / Province" />
                      </div>
                    </>
                  )}
                  <div>
                    <label className="label-caps block mb-2">Message</label>
                    <textarea maxLength={1000} rows={4} className="w-full border-b border-border bg-transparent py-3 outline-none focus:border-accent transition-colors resize-none" />
                  </div>
                  <div className="flex items-center gap-3">
                    <input type="checkbox" id="purchase-interest" className="accent-accent" />
                    <label htmlFor="purchase-interest" className="text-sm text-muted-foreground">Interested in direct purchase</label>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-accent text-accent-foreground py-4 text-sm tracking-[0.15em] uppercase font-medium gold-shine mt-4 transition-all hover:tracking-[0.19em]"
                  >
                    Submit Request
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default QuoteModal;

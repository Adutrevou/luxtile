import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { useProducts, Product } from '@/hooks/useProducts';

interface NavSearchProps {
  useLight?: boolean;
}

const NavSearch = ({ useLight = false }: NavSearchProps) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { data: products = [] } = useProducts();

  const filtered = query.trim().length > 0
    ? products.filter((p) => {
        const q = query.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
        );
      })
    : [];

  const handleOpen = useCallback(() => {
    setOpen(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    setQuery('');
  }, []);

  const handleSelect = useCallback((product: Product) => {
    const section = product.display_section?.[0];
    if (section?.toLowerCase() === 'collection') {
      navigate('/collections');
    } else {
      navigate('/sales');
    }
    handleClose();
  }, [navigate, handleClose]);

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        handleClose();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open, handleClose]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, handleClose]);

  return (
    <div ref={containerRef} className="relative">
      {!open ? (
        <button
          onClick={handleOpen}
          className={`p-2 transition-colors duration-300 ${
            useLight ? 'text-white/70 hover:text-white' : 'text-foreground/70 hover:text-foreground'
          }`}
          aria-label="Search products"
        >
          <Search size={18} />
        </button>
      ) : (
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="w-48 md:w-64 pl-9 pr-3 py-2 text-sm bg-background/90 backdrop-blur border border-border rounded-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-accent transition-colors"
            />
          </div>
          <button onClick={handleClose} className="p-1 text-muted-foreground hover:text-foreground transition-colors" aria-label="Close search">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Results dropdown */}
      {open && query.trim().length > 0 && (
        <div className="absolute top-full right-0 mt-2 w-72 md:w-80 bg-background border border-border shadow-lg rounded-sm max-h-80 overflow-y-auto z-50">
          {filtered.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground text-center">No products found</p>
          ) : (
            filtered.slice(0, 8).map((product) => {
              const img = product.images[product.cover_index] || product.images[0] || '';
              return (
                <button
                  key={product.id}
                  onClick={() => handleSelect(product)}
                  className="w-full flex items-center gap-3 p-3 hover:bg-secondary transition-colors text-left"
                >
                  {img ? (
                    <img src={img} alt={product.name} className="w-12 h-12 object-cover rounded-sm shrink-0" />
                  ) : (
                    <div className="w-12 h-12 bg-muted rounded-sm shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.category}</p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default NavSearch;

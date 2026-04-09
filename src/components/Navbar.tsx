import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import luxtileLogo from '@/assets/luxtile-logo.png';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Collections', href: '/collections' },
  { name: 'Sales', href: '/sales' },
  { name: 'Why Us', href: '/why-us' },
  { name: 'Inspiration', href: '/inspiration' },
  { name: 'Contact', href: '/contact' },
];

const darkPages = ['/why-us'];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const isDarkPage = darkPages.includes(location.pathname);
  const useLight = isDarkPage && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-background/95 backdrop-blur-md shadow-ceramic py-4'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="section-padding flex items-center justify-between">
        <Link to="/" className="transition-opacity duration-300 hover:opacity-80">
          <img
            src={luxtileLogo}
            alt="Luxtile Installations"
            className={`h-12 md:h-16 w-auto object-contain transition-all duration-300 ${
              useLight ? 'brightness-0 invert' : ''
            }`}
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`text-sm tracking-[0.08em] uppercase transition-all duration-300 hover:tracking-[0.12em] ${
                location.pathname === link.href
                  ? 'text-accent'
                  : useLight
                    ? 'text-white/70 hover:text-white'
                    : 'text-foreground/70 hover:text-foreground'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className={`lg:hidden p-2 transition-colors duration-300 ${
            useLight ? 'text-white' : 'text-foreground'
          }`}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-background/98 backdrop-blur-lg overflow-hidden"
          >
            <nav className="section-padding py-8 flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`text-lg font-display ${
                    location.pathname === link.href ? 'text-accent' : 'text-primary-foreground'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;

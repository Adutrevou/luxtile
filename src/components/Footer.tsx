import { Link } from "react-router-dom";
import luxtileLogoWhite from "@/assets/luxtile-logo-white.png";

const footerLinks = [
  { name: "Home", href: "/" },
  { name: "Collections", href: "/collections" },
  { name: "Sales", href: "/sales" },
  { name: "Why Us", href: "/why-us" },
  { name: "Inspiration", href: "/inspiration" },
  { name: "Contact", href: "/contact" },
];

const Footer = () => (
  <footer className="bg-surface-dark text-surface-dark-foreground">
    <div className="section-padding py-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
        <div>
          <img src={luxtileLogoWhite} alt="Luxtile Installations" className="h-12 md:h-14 w-auto object-contain mb-4" />
          <p className="text-surface-dark-foreground/60 text-sm leading-relaxed max-w-xs">
            Premium large format salbs for spaces that demand nothing less than exceptional.
          </p>
        </div>
        <div>
          <p className="label-caps mb-6">Quick Links</p>
          <nav className="flex flex-col gap-3">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-surface-dark-foreground/60 hover:text-accent transition-colors text-sm"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
        <div>
          <p className="label-caps mb-6">Contact</p>
          <div className="text-surface-dark-foreground/60 text-sm space-y-2">
            <p>Johannesburg, Gauteng, South Africa</p>
            <p>+27 83 605 5551</p>
            <p>Sales@luxtile.co.za</p>
          </div>
        </div>
      </div>
      <div className="border-t border-surface-dark-foreground/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-surface-dark-foreground/40 text-xs">
          © 2026 Luxtile Installations. All rights reserved. Johannesburg, South Africa.
        </p>
        <p className="text-surface-dark-foreground/30 text-xs">Made with love in South Africa</p>
      </div>
    </div>
  </footer>
);

export default Footer;

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SITE_URL = 'https://luxtile.co.za';
const DEFAULT_OG = `${SITE_URL}/og-image.jpg`;

interface SeoProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  type?: 'website' | 'article';
  jsonLd?: object | object[];
  noindex?: boolean;
}

const upsertMeta = (selector: string, attr: 'name' | 'property', key: string, content: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
};

const upsertLink = (rel: string, href: string) => {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
};

const SCHEMA_ID = 'page-jsonld';

const Seo = ({ title, description, keywords, image, type = 'website', jsonLd, noindex }: SeoProps) => {
  const { pathname } = useLocation();
  const canonical = `${SITE_URL}${pathname === '/' ? '' : pathname}`;
  const ogImage = image || DEFAULT_OG;

  useEffect(() => {
    document.title = title;

    upsertMeta('meta[name="description"]', 'name', 'description', description);
    if (keywords) upsertMeta('meta[name="keywords"]', 'name', 'keywords', keywords);
    upsertMeta('meta[name="robots"]', 'name', 'robots', noindex ? 'noindex,nofollow' : 'index,follow,max-image-preview:large,max-snippet:-1');

    upsertMeta('meta[property="og:title"]', 'property', 'og:title', title);
    upsertMeta('meta[property="og:description"]', 'property', 'og:description', description);
    upsertMeta('meta[property="og:type"]', 'property', 'og:type', type);
    upsertMeta('meta[property="og:url"]', 'property', 'og:url', canonical);
    upsertMeta('meta[property="og:image"]', 'property', 'og:image', ogImage);
    upsertMeta('meta[property="og:site_name"]', 'property', 'og:site_name', 'Luxtile Installations');
    upsertMeta('meta[property="og:locale"]', 'property', 'og:locale', 'en_ZA');

    upsertMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    upsertMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    upsertMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    upsertMeta('meta[name="twitter:image"]', 'name', 'twitter:image', ogImage);

    upsertLink('canonical', canonical);

    // JSON-LD
    const existing = document.getElementById(SCHEMA_ID);
    if (existing) existing.remove();
    if (jsonLd) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = SCHEMA_ID;
      script.text = JSON.stringify(Array.isArray(jsonLd) ? jsonLd : [jsonLd]);
      document.head.appendChild(script);
    }
  }, [title, description, keywords, ogImage, type, canonical, JSON.stringify(jsonLd ?? null), noindex]);

  return null;
};

export default Seo;

// Centralised JSON-LD schema generators for Luxtile Installations
// Non-visual SEO additions only.

const SITE_URL = 'https://luxtile.co.za';

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': `${SITE_URL}/#organization`,
  name: 'Luxtile Installations',
  alternateName: 'Luxtile',
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.ico`,
  image: `${SITE_URL}/og-image.jpg`,
  description:
    'Luxtile Installations supplies and installs premium large format porcelain slabs and luxury tiles across Johannesburg, Sandton, Pretoria and South Africa.',
  telephone: '+27-83-605-5551',
  email: 'Sales@luxtile.co.za',
  priceRange: 'RR-RRRR',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Johannesburg',
    addressRegion: 'Gauteng',
    addressCountry: 'ZA',
  },
  areaServed: [
    { '@type': 'City', name: 'Johannesburg' },
    { '@type': 'City', name: 'Sandton' },
    { '@type': 'City', name: 'Randburg' },
    { '@type': 'City', name: 'Roodepoort' },
    { '@type': 'City', name: 'Midrand' },
    { '@type': 'City', name: 'Pretoria' },
    { '@type': 'City', name: 'Centurion' },
    { '@type': 'AdministrativeArea', name: 'Gauteng' },
    { '@type': 'Country', name: 'South Africa' },
  ],
  geo: {
    '@type': 'GeoCoordinates',
    latitude: -26.2041,
    longitude: 28.0473,
  },
  sameAs: [],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Tile & Slab Installation Services',
    itemListElement: [
      'Large Format Tile Installation',
      'Porcelain Slab Installation',
      'Bathroom Tiling',
      'Kitchen Tiling',
      'Floor Tiling',
      'Wall Tiling',
      'Commercial Tiling',
      'Precision Tile Cutting',
      'Mitre & Bevel Tile Finishing',
    ].map((s) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name: s },
    })),
  },
};

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: SITE_URL,
  name: 'Luxtile Installations',
  publisher: { '@id': `${SITE_URL}/#organization` },
  inLanguage: 'en-ZA',
};

export const breadcrumb = (items: { name: string; path: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: it.name,
    item: `${SITE_URL}${it.path === '/' ? '' : it.path}`,
  })),
});

export const serviceSchema = (name: string, description: string, slug: string) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name,
  description,
  serviceType: name,
  provider: { '@id': `${SITE_URL}/#organization` },
  areaServed: ['Johannesburg', 'Sandton', 'Pretoria', 'Gauteng', 'South Africa'],
  url: `${SITE_URL}${slug}`,
});

export const faqSchema = (faqs: { q: string; a: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
});

export const homeFaqs = [
  {
    q: 'Do you install large format porcelain slabs in Johannesburg?',
    a: 'Yes. Luxtile Installations specialises in large format porcelain slab installations up to 1600×3200mm across Johannesburg, Sandton, Pretoria and the wider Gauteng region.',
  },
  {
    q: 'What sizes of large format tiles do you supply and install?',
    a: 'We work with premium slabs up to 1600×3200mm, suitable for floors, walls, kitchen countertops, vanities and feature walls in luxury residential and commercial projects.',
  },
  {
    q: 'How much does large format tile installation cost in South Africa?',
    a: 'Pricing depends on slab selection, surface area, substrate preparation and finishing details such as mitre edges. Request a free site assessment for an accurate, project-specific quote.',
  },
  {
    q: 'Do you service areas outside Johannesburg?',
    a: 'Yes, we deliver and install nationwide, with regular projects in Sandton, Pretoria, Centurion, Midrand, the East Rand and West Rand.',
  },
  {
    q: 'Can you assist architects and property developers with specifications?',
    a: 'Absolutely. We partner with architects, interior designers and developers to specify the ideal slabs, finishes and installation methods for each project.',
  },
];

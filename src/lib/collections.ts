import slabCalacatta from '@/assets/slab-calacatta.jpg';
import slabGrigio from '@/assets/slab-grigio.jpg';
import slabConcrete from '@/assets/slab-concrete.jpg';
import slabNero from '@/assets/slab-nero.jpg';
import slabTravertino from '@/assets/slab-travertino.jpg';
import slabOak from '@/assets/slab-oak.jpg';

export interface Collection {
  id: string;
  name: string;
  description: string;
  sizes: string[];
  image: string;
  category: string;
}

export const collections: Collection[] = [
  {
    id: 'calacatta',
    name: 'Calacatta Marble Look',
    description: 'Dramatic white veining on a pristine background — timeless opulence.',
    sizes: ['600×1200mm', '800×1600mm', '1200×2400mm'],
    image: slabCalacatta,
    category: 'Marble',
  },
  {
    id: 'grigio',
    name: 'Grigio Stone',
    description: 'Raw natural stone texture with modern precision and durability.',
    sizes: ['600×600mm', '600×1200mm', '800×1600mm'],
    image: slabGrigio,
    category: 'Stone',
  },
  {
    id: 'urban-concrete',
    name: 'Urban Concrete',
    description: 'Industrial sophistication for bold, contemporary interiors.',
    sizes: ['600×1200mm', '800×1600mm'],
    image: slabConcrete,
    category: 'Concrete',
  },
  {
    id: 'nero-marquina',
    name: 'Nero Marquina',
    description: 'Deep black with white veining — the pinnacle of dramatic luxury.',
    sizes: ['600×1200mm', '1200×2400mm'],
    image: slabNero,
    category: 'Dark',
  },
  {
    id: 'travertino',
    name: 'Travertino Beige',
    description: 'Warm earthy tones evoking ancient Roman architecture.',
    sizes: ['600×600mm', '600×1200mm'],
    image: slabTravertino,
    category: 'Stone',
  },
  {
    id: 'nordic-oak',
    name: 'Nordic Oak',
    description: 'Authentic wood aesthetics with the resilience of porcelain.',
    sizes: ['200×1200mm', '300×1200mm'],
    image: slabOak,
    category: 'Wood',
  },
];

export const categories = ['All', 'Marble', 'Stone', 'Concrete', 'Dark', 'Wood'];

import PageTransition from '@/components/PageTransition';
import SectionReveal from '@/components/SectionReveal';

import inspKitchen from '@/assets/insp-kitchen.jpg';
import inspLiving from '@/assets/insp-living.jpg';
import inspLobby from '@/assets/insp-lobby.jpg';
import inspSpa from '@/assets/insp-spa.jpg';
import inspTerrace from '@/assets/insp-terrace.jpg';
import inspShower from '@/assets/insp-shower.jpg';
import heroCalacatta from '@/assets/hero-calacatta.jpg';
import slabCalacatta from '@/assets/slab-calacatta.jpg';
import slabNero from '@/assets/slab-nero.jpg';
import slabTravertino from '@/assets/slab-travertino.jpg';
import slabOak from '@/assets/slab-oak.jpg';
import slabGrigio from '@/assets/slab-grigio.jpg';

const images = [
  { src: inspKitchen, caption: 'Kitchen — Calacatta Marble Look', aspect: 'aspect-[4/3]' },
  { src: inspLobby, caption: 'Hotel Lobby — Nero Marquina', aspect: 'aspect-[3/4]' },
  { src: inspLiving, caption: 'Living Room — Urban Concrete', aspect: 'aspect-[4/3]' },
  { src: inspSpa, caption: 'Spa Bathroom — Travertino Beige', aspect: 'aspect-[4/3]' },
  { src: inspTerrace, caption: 'Terrace — Nordic Oak', aspect: 'aspect-[3/4]' },
  { src: inspShower, caption: 'Walk-in Shower — Grigio Stone', aspect: 'aspect-[3/4]' },
  { src: heroCalacatta, caption: 'Master Bath — Calacatta', aspect: 'aspect-[16/9]' },
  { src: slabCalacatta, caption: 'Detail — Calacatta Veining', aspect: 'aspect-[3/4]' },
  { src: slabNero, caption: 'Detail — Nero Marquina', aspect: 'aspect-[3/4]' },
  { src: slabTravertino, caption: 'Detail — Travertino Surface', aspect: 'aspect-[3/4]' },
  { src: slabOak, caption: 'Detail — Nordic Oak Grain', aspect: 'aspect-[3/4]' },
  { src: slabGrigio, caption: 'Detail — Grigio Texture', aspect: 'aspect-[3/4]' },
];

const InspirationPage = () => (
  <PageTransition>
    <section className="pt-32 pb-20 section-padding">
      <SectionReveal>
        <p className="label-caps mb-4">Inspiration</p>
        <h1 className="heading-display text-foreground mb-6">Spaces Transformed</h1>
        <p className="text-muted-foreground max-w-xl mb-16">
          See how our collections come to life in residences, hotels, and commercial spaces across South Africa.
        </p>
      </SectionReveal>

      <div className="columns-1 md:columns-2 lg:columns-3 gap-1 space-y-1">
        {images.map((img, i) => (
          <SectionReveal key={i} delay={(i % 3) * 0.1}>
            <div className="break-inside-avoid overflow-hidden group relative">
              <img
                src={img.src}
                alt={img.caption}
                className="w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/30 transition-colors duration-500" />
              <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                <p className="text-primary-foreground text-sm font-display">{img.caption}</p>
              </div>
            </div>
          </SectionReveal>
        ))}
      </div>
    </section>
  </PageTransition>
);

export default InspirationPage;

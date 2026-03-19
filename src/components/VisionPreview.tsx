import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Mail } from 'lucide-react';
import { collections } from '@/lib/collections';

import inspKitchen from '@/assets/insp-kitchen.jpg';
import inspShower from '@/assets/insp-shower.jpg';
import inspLobby from '@/assets/insp-lobby.jpg';
import inspLiving from '@/assets/insp-living.jpg';

const PROJECT_TYPE_IMAGES: Record<string, { src: string; label: string }> = {
  kitchen: { src: inspKitchen, label: 'Kitchen' },
  bathroom: { src: inspShower, label: 'Bathroom' },
  'feature-wall': { src: inspLobby, label: 'Feature Wall' },
  custom: { src: inspLiving, label: 'Custom' },
};

const STYLE_SLABS: Record<string, string[]> = {
  minimal: ['grigio', 'urban-concrete'],
  luxury: ['calacatta', 'nero-marquina'],
  bold: ['nero-marquina', 'urban-concrete'],
  natural: ['travertino', 'nordic-oak'],
};

const STYLE_LABELS: Record<string, string> = {
  minimal: 'Minimal',
  luxury: 'Luxury',
  bold: 'Bold',
  natural: 'Natural',
};

const BUDGET_LABELS: Record<string, string> = {
  'under-50k': 'Under R50k',
  '50k-150k': 'R50k – R150k',
  '150k-plus': 'R150k+',
};

interface VisionPreviewProps {
  projectType: string;
  style: string;
  budget: string;
  step: number;
}

const VisionPreview = ({ projectType, style, budget, step }: VisionPreviewProps) => {
  const hasSelections = projectType || style || budget;
  const recommendedSlabs = style
    ? collections.filter((c) => STYLE_SLABS[style]?.includes(c.id))
    : [];
  const showSummary = budget && projectType && style;

  return (
    <div className="h-full flex flex-col">
      {/* Heading — always visible */}
      <p className="label-caps mb-4">Begin Your Journey</p>
      <h1 className="heading-display text-foreground mb-6">
        Ready to Transform<br />Your Space?
      </h1>

      {!hasSelections && (
        <p className="text-muted-foreground mb-12 max-w-md">
          Our consultants are ready to help you select the perfect slab for your vision.
          Complete our brief consultation form and we'll craft a tailored recommendation.
        </p>
      )}

      {/* Dynamic vision board */}
      <div className="flex-1 space-y-6">
        {/* Room inspiration image */}
        <AnimatePresence mode="wait">
          {projectType && PROJECT_TYPE_IMAGES[projectType] && (
            <motion.div
              key={`room-${projectType}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative overflow-hidden aspect-[16/10]"
            >
              <img
                src={PROJECT_TYPE_IMAGES[projectType].src}
                alt={PROJECT_TYPE_IMAGES[projectType].label}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                <span className="text-white/90 text-xs tracking-[0.15em] uppercase font-medium">
                  {PROJECT_TYPE_IMAGES[projectType].label} Inspiration
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recommended slabs */}
        <AnimatePresence>
          {style && recommendedSlabs.length > 0 && (
            <motion.div
              key={`slabs-${style}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="label-caps text-xs mb-3">Recommended for {STYLE_LABELS[style]} Style</p>
              <div className="grid grid-cols-2 gap-3">
                {recommendedSlabs.map((slab) => (
                  <div key={slab.id} className="group">
                    <div className="aspect-square overflow-hidden border border-border/40">
                      <img
                        src={slab.image}
                        alt={slab.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <p className="text-xs text-foreground mt-2 font-medium">{slab.name}</p>
                    <p className="text-[10px] text-muted-foreground">{slab.category}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Vision summary card */}
        <AnimatePresence>
          {showSummary && (
            <motion.div
              key="summary"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="border border-accent/30 bg-accent/5 p-5"
            >
              <p className="label-caps text-xs text-accent mb-3">Your Vision</p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                <span className="text-foreground font-medium">
                  {PROJECT_TYPE_IMAGES[projectType]?.label}
                </span>
                <span className="text-muted-foreground">·</span>
                <span className="text-foreground font-medium">{STYLE_LABELS[style]}</span>
                <span className="text-muted-foreground">·</span>
                <span className="text-foreground font-medium">{BUDGET_LABELS[budget]}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Compact contact info at bottom */}
      <div className="mt-8 pt-6 border-t border-border/30 flex flex-wrap gap-6 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <MapPin size={14} className="text-accent shrink-0" />
          <span>Johannesburg, SA</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone size={14} className="text-accent shrink-0" />
          <span>+27 83 605 5551</span>
        </div>
        <div className="flex items-center gap-2">
          <Mail size={14} className="text-accent shrink-0" />
          <span>Wesley@luxtile.co.za</span>
        </div>
      </div>
    </div>
  );
};

export default VisionPreview;

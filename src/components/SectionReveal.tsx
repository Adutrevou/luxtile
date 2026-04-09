import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface SectionRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

const SectionReveal = forwardRef<HTMLDivElement, SectionRevealProps>(
  ({ children, className = '', delay = 0 }, ref) => (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
);

SectionReveal.displayName = 'SectionReveal';

export default SectionReveal;

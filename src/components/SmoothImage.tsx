import { useState, useCallback, memo } from 'react';

interface SmoothImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
}

/** Image component that fades in smoothly once loaded, preventing pop-in jank. */
const SmoothImage = ({ src, alt, className = '', loading = 'lazy' }: SmoothImageProps) => {
  const [loaded, setLoaded] = useState(false);
  const onLoad = useCallback(() => setLoaded(true), []);

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      onLoad={onLoad}
      className={`${className} transition-opacity duration-500 ease-in-out ${loaded ? 'opacity-100' : 'opacity-0'}`}
    />
  );
};

export default memo(SmoothImage);

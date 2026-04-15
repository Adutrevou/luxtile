import { memo, useCallback, useRef, useState, useEffect } from 'react';

interface SmoothImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
}

const SmoothImage = ({ src, alt, className = '', loading = 'lazy' }: SmoothImageProps) => {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const onReady = useCallback(() => setLoaded(true), []);

  // Handle images that loaded before React attached the onLoad handler (cached images)
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth > 0) {
      setLoaded(true);
    }
  }, [src]);

  return (
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      loading={loading}
      decoding="async"
      fetchPriority={loading === 'eager' ? 'high' : 'auto'}
      onLoad={onReady}
      onError={onReady}
      className={`${className} transition-opacity duration-200 ease-out ${loaded ? 'opacity-100' : 'opacity-0'}`}
    />
  );
};

export default memo(SmoothImage);

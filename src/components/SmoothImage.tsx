import { memo, useCallback, useState } from 'react';

interface SmoothImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
}

const SmoothImage = ({ src, alt, className = '', loading = 'lazy' }: SmoothImageProps) => {
  const [loaded, setLoaded] = useState(false);
  const onReady = useCallback(() => setLoaded(true), []);

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      decoding="async"
      fetchPriority={loading === 'eager' ? 'high' : 'auto'}
      onLoad={onReady}
      onError={onReady}
      className={`${className} transition-opacity duration-300 ease-out ${loaded ? 'opacity-100' : 'opacity-0'}`}
    />
  );
};

export default memo(SmoothImage);
import { ReactNode } from '@tanstack/react-router';
import { useEffect } from 'react';

type PreloadErrorMiddlewareProps = { children?: ReactNode };

const PreloadErrorMiddleware = ({ children }: PreloadErrorMiddlewareProps) => {
  useEffect(() => {
    window.addEventListener('vite:preloadError', (event) => {
      window.location.reload();
    });

    console.log('[Middleware] preloadError registered');
  }, []);

  return children;
};

export default PreloadErrorMiddleware;

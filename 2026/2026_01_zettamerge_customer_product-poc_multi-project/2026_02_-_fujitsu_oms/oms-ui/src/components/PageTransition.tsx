import { useState, useEffect, useRef, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import PageSkeleton, { type SkeletonVariant } from './PageSkeleton';

const ROUTE_SKELETON_MAP: Record<string, SkeletonVariant> = {
  '/': 'dashboard',
  '/orders': 'orders',
  '/delivery': 'delivery',
  '/reservation': 'reservation',
  '/etax': 'etax',
  '/epvp10': 'epvp10',
};

const LOADING_DURATION = 400; // ms

interface Props {
  children: ReactNode;
}

export default function PageTransition({ children }: Props) {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const prevPathRef = useRef(location.pathname);
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    if (location.pathname !== prevPathRef.current) {
      prevPathRef.current = location.pathname;
      setLoading(true);

      const timer = setTimeout(() => {
        setLoading(false);
        setAnimKey((k) => k + 1);
      }, LOADING_DURATION);

      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  if (loading) {
    const variant = ROUTE_SKELETON_MAP[location.pathname] || 'dashboard';
    return <PageSkeleton variant={variant} />;
  }

  return <div key={animKey} className="page-content-enter">{children}</div>;
}

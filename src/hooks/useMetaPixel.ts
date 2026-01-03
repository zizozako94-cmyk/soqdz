import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { initMetaPixel, trackPageView } from '@/lib/metaPixel';

export const useMetaPixel = (): void => {
  const location = useLocation();

  // Initialize pixel on mount
  useEffect(() => {
    initMetaPixel();
  }, []);

  // Track page view on route change
  useEffect(() => {
    trackPageView();
  }, [location.pathname]);
};

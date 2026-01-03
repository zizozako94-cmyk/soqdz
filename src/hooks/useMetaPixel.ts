import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { initMetaPixel, trackPageView } from '@/lib/metaPixel';

export const useMetaPixel = (): void => {
  const location = useLocation();
  const [pixelId, setPixelId] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Fetch pixel ID from database
  useEffect(() => {
    const fetchPixelId = async () => {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('facebook_pixel')
          .limit(1)
          .maybeSingle();

        if (error) {
          console.error('Error fetching Facebook Pixel ID:', error);
          return;
        }

        if (data?.facebook_pixel) {
          setPixelId(data.facebook_pixel);
        }
      } catch (error) {
        console.error('Error fetching Facebook Pixel ID:', error);
      }
    };

    fetchPixelId();
  }, []);

  // Initialize pixel when ID is available
  useEffect(() => {
    if (pixelId && !isInitialized) {
      initMetaPixel(pixelId);
      setIsInitialized(true);
      // Track initial page view
      trackPageView();
    }
  }, [pixelId, isInitialized]);

  // Track page view on route change
  useEffect(() => {
    if (isInitialized) {
      trackPageView();
    }
  }, [location.pathname, isInitialized]);
};

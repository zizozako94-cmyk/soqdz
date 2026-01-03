// Meta (Facebook) Pixel Integration
// Pixel ID: 1944966153032787

declare global {
  interface Window {
    fbq: ((...args: unknown[]) => void) & {
      callMethod?: (...args: unknown[]) => void;
      queue: unknown[];
      loaded: boolean;
      version: string;
      push: (...args: unknown[]) => void;
    };
    _fbq: typeof window.fbq;
  }
}

const PIXEL_ID = '1944966153032787';

export const initMetaPixel = (): void => {
  if (typeof window === 'undefined') return;
  
  // Check if already initialized
  if (window.fbq) return;

  // Meta Pixel Base Code
  const n = function (...args: unknown[]) {
    if (n.callMethod) {
      n.callMethod.apply(n, args);
    } else {
      n.queue.push(args);
    }
  } as Window['fbq'];
  
  n.push = n;
  n.loaded = true;
  n.version = '2.0';
  n.queue = [];
  
  window.fbq = n;
  window._fbq = n;

  const s = document.createElement('script');
  const fjs = document.getElementsByTagName('script')[0];
  
  s.async = true;
  s.src = 'https://connect.facebook.net/en_US/fbevents.js';
  
  if (fjs && fjs.parentNode) {
    fjs.parentNode.insertBefore(s, fjs);
  } else {
    document.head.appendChild(s);
  }

  // Initialize pixel
  window.fbq('init', PIXEL_ID);
};

// Track PageView event
export const trackPageView = (): void => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'PageView');
  }
};

// Track Lead event (when CTA is clicked)
export const trackLead = (data?: { content_name?: string; value?: number; currency?: string }): void => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Lead', data);
  }
};

// Track Purchase event (when order is completed)
export const trackPurchase = (data: { 
  value: number; 
  currency: string; 
  content_name?: string;
  content_type?: string;
  content_ids?: string[];
}): void => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Purchase', data);
  }
};

// Track InitiateCheckout event (when form is started)
export const trackInitiateCheckout = (data?: { value?: number; currency?: string }): void => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'InitiateCheckout', data);
  }
};

"use client";

import { useEffect } from 'react';

export default function CSSLoader() {
  useEffect(() => {
    // Load non-critical CSS after initial paint
    const loadCSS = (href: string) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.media = 'print';
      link.onload = function() { 
        (this as HTMLLinkElement).media = 'all'; 
      };
      document.head.appendChild(link);
    };

    // Use requestIdleCallback for better performance
    const loadStyles = () => {
      loadCSS('/index.css');
      loadCSS('/main_css.css');
      loadCSS('/assets/fontstyle/stylesheet.css');
    };

    if (typeof window !== 'undefined') {
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(loadStyles, { timeout: 2000 });
      } else {
        // Fallback: load after a short delay
        setTimeout(loadStyles, 100);
      }
    }
  }, []);

  return null;
}
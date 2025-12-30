"use client";

import { useEffect } from 'react';

export default function CSSLoader() {
  useEffect(() => {
    // Load non-critical CSS after initial render
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

    // Batch load all non-critical stylesheets
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        loadCSS('/index.css');
        loadCSS('/main_css.css');
        loadCSS('/assets/fontstyle/stylesheet.css');
      }, { timeout: 1000 });
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(() => {
        loadCSS('/index.css');
        loadCSS('/main_css.css');
        loadCSS('/assets/fontstyle/stylesheet.css');
      }, 1);
    }
  }, []);

  return null;
}
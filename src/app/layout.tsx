"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "@/redux/store";
import envirnment from "@/envirnment";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Inter } from 'next/font/google';
import Image from "next/image";
import Script from "next/script";
import CSSLoader from "@/components/CSSLoader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({ 
  subsets: ['latin'],
  display: "swap",
  variable: "--font-inter",
});

const Loading = ({ id = '', className = '' }) => {
  return <>
    <div id={id} className={`flex fixed items-center justify-center top-0 left-0 w-full h-full z-[9999] backdrop-blur ${className}`}>
      <div>
        <Image
          src="/img/loader.gif"
          width={20}
          height={20}
          alt="logo"
          className="w-[50px]"
        />
      </div>
    </div>
  </>
}

const CLIENT_ID = envirnment.googleClientId;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        
        {/* Inline critical CSS */}
        <style dangerouslySetInnerHTML={{
          __html: `
            .bg-primary{background-color:#541218}
            .text-primary{color:#541218}
            button{cursor:pointer}
            body{font-family:var(--font-inter),Arial,Helvetica,sans-serif}
            div#headlessui-portal-root{z-index:999;position:relative}
            .z-9999{z-index:99999}
            .react-tooltip{z-index:99999}
            .d-none{display:none!important}
          `
        }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased`}
      >
        <CSSLoader />
        
        {/* Load Material Icons asynchronously */}
        <Script
          id="load-material-icons"
          strategy="lazyOnload"
        >
          {`
            (function() {
              var link = document.createElement('link');
              link.rel = 'stylesheet';
              link.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap';
              document.head.appendChild(link);
            })();
          `}
        </Script>

        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <GoogleOAuthProvider clientId={CLIENT_ID}>
              {children}
            </GoogleOAuthProvider>
          </PersistGate>
        </Provider>

        <ToastContainer />
        <Loading id="loader" className="hidden" />
      </body>
    </html>
  );
}

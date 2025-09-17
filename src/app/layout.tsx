"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./index.css";
import "./main_css.css";

import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "@/redux/store";
import envirnment from "@/envirnment";
import { GoogleOAuthProvider } from "@react-oauth/google";



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const Loading = ({ id = '', className = '' }) => {
  return <>
    <div id={id} className={`flex fixed items-center justify-center top-0 left-0 w-full h-full z-[9999] backdrop-blur ${className}`}>
      <div>
        <img
          src="/img/loader.gif"
          alt="logo"
          className="w-[50px]"
        />
      </div>
    </div>
  </>
}

const CLIENT_ID = envirnment.googleClientId;


import { Inter } from 'next/font/google'
// If loading a variable font, you don't need to specify the font weight
const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.gstatic.com"
          rel="preconnect"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
          rel="stylesheet"
        />
         <link rel="stylesheet" href="/assets/fontstyle/stylesheet.css" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased ${inter.className}`}
      >
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

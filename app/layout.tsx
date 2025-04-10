"use client";

import { GeistSans } from "geist/font/sans";
import { ToastContainer } from "react-toastify";
import "./globals.css";
import ClientLayout from "./ClientLayout";
import "react-toastify/dist/ReactToastify.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={GeistSans.className} suppressHydrationWarning>
      <head>
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />

        {/* PWA config */}
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="msapplication-TileColor" content="#da532c" />
      </head>

      <body className="bg-gray-50 text-gray-900 antialiased">
        {/* Client-side components */}
        <ClientLayout>{children}</ClientLayout>

        {/* Toast notifications */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />

        {/* Analytics script (optional) */}
        {process.env.NODE_ENV === "production" && (
          <script async src="https://analytics.example.com/script.js" />
        )}
      </body>
    </html>
  );
}

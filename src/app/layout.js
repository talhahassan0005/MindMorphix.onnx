import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Optimize font loading with display swap and preload
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

export const metadata = {
  title: "MindMorphix - AI-Powered Brain Tumor Detection",
  description: "Advanced AI-powered brain tumor detection using machine learning. Upload MRI scans for instant, accurate tumor detection and classification.",
  keywords: "brain tumor detection, AI, machine learning, MRI, medical imaging, healthcare",
  authors: [{ name: "MindMorphix Team" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: "MindMorphix - AI-Powered Brain Tumor Detection",
    description: "Advanced AI-powered brain tumor detection using machine learning.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "MindMorphix - AI-Powered Brain Tumor Detection",
    description: "Advanced AI-powered brain tumor detection using machine learning.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        {/* Preload critical resources with priority hints */}
        <link rel="preload" href="/HeroSection.mp4" as="video" type="video/mp4" />
        <link rel="preload" href="/onnxmodel.onnx" as="fetch" crossOrigin="anonymous" fetchPriority="low" />
        <link rel="dns-prefetch" href="//images.unsplash.com" />
        
        {/* Resource hints for better performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Performance monitoring */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Performance monitoring
              if (typeof window !== 'undefined') {
                window.addEventListener('load', function() {
                  setTimeout(function() {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    if (perfData) {
                      console.log('Page Load Time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
                      console.log('DOM Content Loaded:', perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart, 'ms');
                    }
                  }, 0);
                });
              }
            `,
          }}
        />
      </head>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

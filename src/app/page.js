import dynamic from 'next/dynamic';
import styles from "./page.module.css";

// Lazy load components for better performance
const HeroSection = dynamic(() => import("@/components/HeroSection"), {
  loading: () => <div className="h-screen bg-dark animate-pulse" />,
  ssr: true,
});

const FeaturesSection = dynamic(() => import("@/components/BottomHerosection"), {
  loading: () => <div className="h-96 bg-dark animate-pulse" />,
  ssr: true,
});

export default function Home() {
  return (
    <div>
      <HeroSection />
      <FeaturesSection />
    </div>
  );
}

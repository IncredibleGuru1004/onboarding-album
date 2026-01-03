"use client";

import { useState, useEffect } from "react";
import CategorySection from "@/components/gallery/CategorySection";
import GallerySection from "@/components/gallery/GallerySection";
import { Footer, Header, Hero } from "@/components/layout";
import { ArrowUpIcon } from "@heroicons/react/24/solid";

export default function Home() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button when user scrolls down more than 100px
      setShowScrollTop(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <Header
        onHomeClick={() => {
          scrollToSection("home");
        }}
        onCollectionsClick={() => {
          scrollToSection("collections");
        }}
      />

      <section id="home">
        <Hero />
      </section>

      <div className=" px-10">
        <GallerySection />
        <section id="collections">
          <CategorySection />
        </section>
      </div>

      <Footer />

      {/* Floating Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Scroll to top"
        >
          <ArrowUpIcon className="w-6 h-6" />
        </button>
      )}
    </>
  );
}

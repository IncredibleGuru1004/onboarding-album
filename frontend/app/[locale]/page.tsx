"use client";

import CategorySection from "@/components/gallery/CategorySection";
import GallerySection from "@/components/gallery/GallerySection";
import { Footer, Header, Hero } from "@/components/layout";

export default function Home() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
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
    </>
  );
}

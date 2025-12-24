"use client";

import CategorySection from "@/components/gallery/CategorySection";
import GallerySection from "@/components/gallery/GallerySection";
import { Footer, Header, Hero, SectionTitle } from "@/components/layout";

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
        onHomeClick={() => scrollToSection("home")}
        onCollectionsClick={() => scrollToSection("collections")}
      />

      <section id="home">
        <Hero />
      </section>

      <section className="container mx-auto px-4 py-12">
        <SectionTitle
          title="Recently Added"
          subtitle="Not thoughts all exercise blessing. Indulgence way everything joy alteration boisterous the attachment."
        />
        <GallerySection />
      </section>

      <section id="collections" className="container mx-auto px-4 py-12">
        <SectionTitle
          title="Categories"
          subtitle="Party we years to order allow asked of. We so opinion friends me message as delight."
        />
        <CategorySection />
      </section>

      <Footer />
    </>
  );
}

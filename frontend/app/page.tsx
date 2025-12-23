"use client";

import CategorySection from "@/components/gallery/CategorySection";
import GallerySection from "@/components/gallery/GallerySection";
import { Footer, Header, Hero, SectionTitle } from "@/components/layout";

export default function Home() {
  return (
    <>
      <Header />

      <Hero />

      <section className="container mx-auto px-4 py-12">
        <SectionTitle
          title="Featured Collections"
          subtitle="Handpicked galleries and trending collections"
        />
        <GallerySection />
      </section>

      <section className="container mx-auto px-4 py-12">
        <SectionTitle title="Categories" subtitle="Browse by category" />
        <CategorySection />
      </section>

      <Footer />
    </>
  );
}

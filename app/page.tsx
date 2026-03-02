import Bento from "@/components/landing/bento";
import Faq from "@/components/landing/faq";
import Footer from "@/components/landing/footer";
import HeroSection from "@/components/landing/herosection";
import Navbar from "@/components/landing/navbar";
import Search from "@/components/landing/search";
import Testimonials from "@/components/landing/testimonials";
import React from "react";

const Page = () => {
  return (
    <div className="relative w-full grid min-h-screen grid-cols-[1fr_auto_1fr] grid-rows-[auto_1px_auto_1px_auto_1px_auto_1px_auto_1px_auto_1px_auto] bg-[#F5F5F5] dark:bg-background font-[family-name:var(--font-inter-tight)] overflow-hidden">
      {/* Row 1: Navbar */}
      <div className="col-start-2 row-start-1 flex w-[95vw] md:w-[90vw] px-3 sm:px-6 py-3 flex-col relative overflow-hidden">
        <Navbar />
      </div>

      <div className="pointer-events-none col-span-full col-start-1 row-start-2 border-b-2 border-dashed" />

      {/* Row 2: Hero Section */}
      <div className="col-start-2 row-start-3 flex flex-col w-[95vw] md:w-[90vw] px-3 sm:px-6 pt-20 gap-2">
        <HeroSection />
      </div>

      <div className="pointer-events-none col-span-full col-start-1 row-start-4 border-b-2 border-dashed" />

      {/* Row 3: Search Section */}
      <div className="col-start-2 row-start-5 flex flex-col w-[95vw] md:w-[90vw] px-3 sm:px-6 gap-2">
        <Search />
      </div>

      <div className="pointer-events-none col-span-full col-start-1 row-start-6 border-b-2 border-dashed" />

      {/* Row 4: Bento Section */}
      <div className="col-start-2 row-start-7 flex flex-col w-[95vw] md:w-[90vw] px-3 sm:px-6">
        <Bento />
      </div>

      <div className="pointer-events-none col-span-full col-start-1 row-start-8 border-b-2 border-dashed" />

      {/* Row 5: Testimonials Section */}
      <div className="col-start-2 row-start-9 flex flex-col w-[95vw] md:w-[90vw] px-3 sm:px-6">
        <Testimonials />
      </div>

      <div className="pointer-events-none col-span-full col-start-1 row-start-10 border-b-2 border-dashed" />

      {/* Row 6: FAQ Section */}
      <div className="col-start-2 row-start-11 flex flex-col w-[95vw] md:w-[90vw] px-3 sm:px-6">
        <Faq />
      </div>

      <div className="pointer-events-none col-span-full col-start-1 row-start-12 border-b-2 border-dashed" />

      {/* Row 7: Footer */}
      <div className="col-start-2 row-start-13 flex flex-col w-[95vw] md:w-[90vw] px-3 sm:px-6 py-6">
        <Footer />
      </div>

      {/* Decorative side borders - border-x-2 */}
      <div className="pointer-events-none col-start-2 row-span-full row-start-1 border-x-2 border-dashed z-50" />
    </div>
  );
};

export default Page;


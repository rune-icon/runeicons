import React from "react";

import Bento from "@/components/landing/components/bento";
import CTA from "@/components/landing/components/cta";
import Faq from "@/components/landing/components/faq";
import Footer from "@/components/landing/components/footer";
import HeroSection from "@/components/landing/components/herosection";
import Navbar from "@/components/landing/components/navbar";
import Search from "@/components/landing/components/search";
import Testimonials from "@/components/landing/components/testimonials";

const Page = () => {
  return (
    <div className="dark:bg-background relative grid min-h-screen w-full grid-cols-[1fr_auto_1fr] grid-rows-[auto_1px_auto_1px_auto_1px_auto_1px_auto_1px_auto_1px_auto_1px_auto] overflow-hidden bg-[#F5F5F5] font-(family-name:--font-inter-tight)">
      {/* Row 1: Navbar */}
      <div className="relative col-start-2 row-start-1 flex w-[95vw] flex-col overflow-hidden px-3 py-3 sm:px-6 md:w-[90vw]">
        <Navbar />
      </div>

      <div className="pointer-events-none col-span-full col-start-1 row-start-2 border-b-2 border-dashed" />

      {/* Row 2: Hero Section */}
      <div
        id="home"
        className="col-start-2 row-start-3 flex w-[95vw] scroll-mt-24 flex-col gap-2 px-3 pt-20 sm:px-6 md:w-[90vw]"
      >
        <HeroSection />
      </div>

      <div className="pointer-events-none col-span-full col-start-1 row-start-4 border-b-2 border-dashed" />

      {/* Row 3: Search Section */}
      <div
        id="search"
        className="col-start-2 row-start-5 flex w-[95vw] scroll-mt-24 flex-col gap-2 px-3 sm:px-6 md:w-[90vw]"
      >
        <Search />
      </div>

      <div className="pointer-events-none col-span-full col-start-1 row-start-6 border-b-2 border-dashed" />

      {/* Row 4: Bento Section */}
      <div
        id="features"
        className="col-start-2 row-start-7 flex w-[95vw] scroll-mt-24 flex-col p-3 sm:p-6 md:w-[90vw]"
      >
        <Bento />
      </div>

      <div className="pointer-events-none col-span-full col-start-1 row-start-8 border-b-2 border-dashed" />

      {/* Row 5: Testimonials Section */}
      <div
        id="testimonials"
        className="col-start-2 row-start-9 flex w-[95vw] scroll-mt-24 flex-col p-3 sm:p-6 md:w-[90vw]"
      >
        <Testimonials />
      </div>

      <div className="pointer-events-none col-span-full col-start-1 row-start-10 border-b-2 border-dashed" />

      {/* Row 6: FAQ Section */}
      <div
        id="faq"
        className="col-start-2 row-start-11 flex w-[95vw] scroll-mt-24 flex-col px-3 sm:px-6 md:w-[90vw]"
      >
        <Faq />
      </div>

      <div className="pointer-events-none col-span-full col-start-1 row-start-12 border-b-2 border-dashed" />

      {/* Row 7: CTA Section */}
      <div className="col-start-2 row-start-13 flex w-[95vw] flex-col overflow-hidden p-3 sm:p-6 md:w-[90vw]">
        <CTA />
      </div>

      <div className="pointer-events-none col-span-full col-start-1 row-start-14 border-b-2 border-dashed" />

      {/* Row 8: Footer */}
      <div className="col-start-2 row-start-15 flex w-[95vw] flex-col px-3 py-6 sm:px-6 md:w-[90vw]">
        <Footer />
      </div>

      {/* Decorative side borders - border-x-2 */}
      <div className="pointer-events-none z-50 col-start-2 row-span-full row-start-1 border-x-2 border-dashed" />
    </div>
  );
};

export default Page;

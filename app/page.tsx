import Bento from "@/components/landing/bento";
import Features from "@/components/landing/features";
import Footer from "@/components/landing/footer";
import HeroSection from "@/components/landing/herosection";
import Navbar from "@/components/landing/navbar";
import Search from "@/components/landing/search";
import React from "react";
const Page = () => {
  return (
    <div className="px-14 h-full w-full bg-[#F5F5F5]">
      <div className=" border-x-2 border-dashed pt-16  px-6 ">
        <Navbar />
        <HeroSection />
        <Search />
        <Bento />
        <Features />
        <Footer />
      </div>
    </div>
  );
};

export default Page;

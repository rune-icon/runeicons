"use client";
import { useState } from "react";

import { motion } from "motion/react";

import { AmountSelector } from "./components/ui/amount-selector";
import { CertificateCard } from "./components/ui/certificate-card";

const Page = () => {
  const [selectedAmount, setSelectedAmount] = useState("$5");
  return (
    <main className="flex min-h-screen flex-col items-center bg-[#181818] px-4 py-20 text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex w-full max-w-3xl flex-col items-center"
      >
        <h1 className="mb-8 text-[40px] font-normal tracking-wide">
          Support the project
        </h1>

        <p className="mb-8 max-w-[600px] text-center font-mono text-[13px] leading-[1.8] text-[#a1a1aa]">
          this is a place for those who want to go beyond a simple thank you.
          <br />
          I&apos;m grateful for any kind of support, whether it&apos;s just a DM
          with
          <br />
          kind words or something more. your donation is by no means required
          <br />
          - this page is made just for those who asked for it. I am incredibly
          <br />
          grateful for any support you choose to provide
        </p>

        <p className="mb-6 font-mono text-[13px] text-[#a1a1aa]">
          Choose amount you want to support the project with:
        </p>

        <AmountSelector
          selectedAmount={selectedAmount}
          onAmountChange={setSelectedAmount}
        />

        <CertificateCard amount={selectedAmount} />

        <p className="mt-16 font-mono text-[11px] text-[#71717a]">
          analytics by{" "}
          <span className="cursor-pointer underline decoration-[#71717a] underline-offset-2 transition-colors hover:text-white">
            OpenPanel
          </span>
        </p>
      </motion.div>
    </main>
  );
};

export default Page;

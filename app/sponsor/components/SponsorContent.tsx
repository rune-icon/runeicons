"use client";
import { useState } from "react";

import { CreemCheckout } from "@creem_io/nextjs";
import * as m from "motion/react-m";

import { getProductIdForAmount } from "@/lib/creem";

import { AmountSelector } from "./ui/amount-selector";
import { CertificateCard } from "./ui/certificate-card";
import { Navbar } from "./ui/navbar";

export default function SponsorContent() {
  const [selectedAmount, setSelectedAmount] = useState(5);

  const productId = getProductIdForAmount(selectedAmount) || "";

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 flex-col items-center px-4 py-10 sm:py-20">
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex w-full max-w-3xl flex-col items-center"
        >
          <h1 className="mb-6 text-center text-[32px] font-normal tracking-wide sm:mb-8 sm:text-[40px]">
            Support the project
          </h1>

          <p className="mb-8 max-w-[600px] text-center font-mono text-[13px] leading-[1.8] text-[#a1a1aa]">
            this is a place for those who want to go beyond a simple thank you.
            <br className="hidden sm:block" />
            I&apos;m grateful for any kind of support, whether it&apos;s just a
            DM with
            <br className="hidden sm:block" />
            kind words or something more. your donation is by no means required
            <br className="hidden sm:block" />
            - this page is made just for those who asked for it. I am incredibly
            <br className="hidden sm:block" />
            grateful for any support you choose to provide
          </p>

          <p className="mb-6 text-center font-mono text-[13px] text-[#a1a1aa]">
            Choose amount you want to support the project with:
          </p>

          <AmountSelector
            selectedAmount={selectedAmount}
            onAmountChange={setSelectedAmount}
          />

          <div className="hidden w-full sm:block">
            {productId ? (
              <CreemCheckout productId={productId} successUrl="/sponsor">
                <CertificateCard amount={selectedAmount} />
              </CreemCheckout>
            ) : (
              <CertificateCard amount={selectedAmount} />
            )}
          </div>

          {productId ? (
            <CreemCheckout productId={productId} successUrl="/sponsor">
              <button className="w-full rounded-xl bg-[#F0562E] py-4 text-[17px] font-medium text-white transition-colors hover:bg-[#d94d29] sm:hidden">
                Sponsor
              </button>
            </CreemCheckout>
          ) : (
            <button
              disabled
              className="w-full cursor-not-allowed rounded-xl bg-zinc-800 py-4 text-[17px] font-medium text-zinc-500 sm:hidden"
            >
              Sponsor (Coming Soon)
            </button>
          )}

          <p className="mt-12 font-mono text-[11px] text-[#71717a] sm:mt-16">
            analytics by{" "}
            <span className="cursor-pointer underline decoration-[#71717a] underline-offset-2 transition-colors hover:text-white">
              OpenPanel
            </span>
          </p>
        </m.div>
      </main>
    </div>
  );
}

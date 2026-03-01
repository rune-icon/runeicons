"use client";
import { HouseDuck } from "../illustrations/house-duck";
import { Stamp } from "../illustrations/stamp";

interface CertificateCardProps {
  amount: number;
}

export function CertificateCard({ amount }: CertificateCardProps) {
  return (
    <div className="relative mt-2 w-full rounded-[32px] bg-black shadow-2xl">
      {/* Cutouts */}
      <div className="absolute top-[90px] left-0 z-10 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#181818]"></div>
      <div className="absolute top-[90px] right-0 z-10 h-10 w-10 translate-x-1/2 -translate-y-1/2 rounded-full bg-[#181818]"></div>

      {/* Top Section */}
      <div className="flex h-[90px] items-center justify-between px-10">
        <h2 className="text-[28px] font-normal tracking-wide">
          Chill Guy Certificate
        </h2>
        <span className="text-[17px] text-zinc-300">Supporter</span>
      </div>

      {/* Divider */}
      <div className="relative h-px w-full">
        <div className="absolute inset-0 mx-8 border-t border-dashed border-zinc-800"></div>
      </div>

      {/* Bottom Section */}
      <div className="relative flex gap-10 overflow-hidden rounded-b-[32px] px-10 py-10">
        {/* Image */}
        <div className="relative h-[200px] w-[200px] shrink-0 overflow-hidden rounded-2xl border border-zinc-800/50 bg-black">
          <HouseDuck />
        </div>

        {/* Content */}
        <div className="z-10 flex flex-col justify-center">
          <h3 className="text-[32px] font-normal tracking-wide">
            ${amount} Donation
          </h3>
          <p className="mt-4 max-w-[280px] font-mono text-[12px] leading-relaxed text-zinc-400">
            The icons will always be free and open-source, regardless of
            donations
          </p>
          <button className="mt-8 w-fit cursor-pointer rounded-md bg-[#F0562E] px-6 py-2 text-[15px] font-medium text-white transition-colors hover:bg-[#d94d29]">
            Sponsor
          </button>
        </div>

        {/* Stamp */}
        <div className="pointer-events-none absolute -right-4 -bottom-4 h-[220px] w-[220px] rotate-[-15deg] opacity-90">
          <Stamp />
        </div>
      </div>
    </div>
  );
}

import {
  HeroCatIcon,
  HeroGraphic,
  TickmarkIcon,
} from "@/components/icon-page/simple-svg";

export default function HeroSection() {
  return (
    <main className="flex min-h-screen items-center justify-center overflow-hidden px-4 pt-24 pb-12 sm:px-6 sm:pt-32 md:px-12 lg:px-20 xl:px-29.75 xl:py-12">
      <div className="relative flex w-full flex-col items-center justify-between gap-12 sm:gap-16 xl:flex-row xl:items-center xl:gap-10">
        {/* Left Content Column */}
        <section className="z-10 flex w-full flex-col items-start gap-3 transition-all duration-500 sm:gap-4 xl:w-174.5">
          {/* Badge: Added 1000 icons */}
          <div className="flex h-7 flex-row items-center gap-1.5 rounded-lg border border-[#C8C8C8] bg-white px-1 pl-2 shadow-[0.125rem_0.25rem_0.41875rem_rgba(0,0,0,0.13)] sm:h-8 sm:gap-2 sm:pl-2.75">
            <div className="relative h-2 w-2 sm:h-2.5 sm:w-2.5">
              <div className="bg-primary absolute inset-0 scale-125 rounded-full blur-[0.2375rem]"></div>
              <div className="bg-primary absolute inset-0 rounded-full"></div>
            </div>
            <span className="flex h-full items-center text-[0.625rem] font-semibold tracking-[-0.05em] sm:text-xs">
              <span className="text-primary">Added</span>
              <span className="ml-1 text-black">1000 icons</span>
            </span>
            <TickmarkIcon
              className="block h-5 w-5 shrink-0 sm:h-6 sm:w-6"
              aria-hidden="true"
              focusable="false"
            />
          </div>

          {/* Main Headline */}
          <div className="relative">
            <h1 className="text-[2rem] leading-tight font-normal tracking-[-0.05em] text-black sm:text-[2.5rem] sm:leading-[0.50] md:text-[3rem] lg:text-[3.5rem] xl:text-[4rem]">
              Strong
              <span className="relative -mx-1 inline-block shrink-0 translate-y-1 align-middle sm:-mx-2 sm:translate-y-2">
                <HeroCatIcon
                  className="block h-12 w-12 shrink-0 sm:h-16 sm:w-16 md:h-17.5 md:w-17.5 lg:h-20 lg:w-20 xl:h-21.75 xl:w-21.75"
                  aria-hidden="true"
                  focusable="false"
                />
              </span>
              Icons <br />
              Icons for SaaS & Ai teams
            </h1>
          </div>

          {/* Description */}
          <p className="mt-1 max-w-full text-sm leading-5 font-medium tracking-[-0.05em] text-black opacity-80 sm:mt-2 sm:max-w-161.25 sm:text-base sm:leading-5">
            Strong Icons delivers powerful, modern icon systems crafted for SaaS
            and AI products. Built for clarity, scalability, and impact so your
            interface looks sharp at every size.
          </p>

          {/* Action Buttons */}
          <div className="mt-4 flex w-full flex-col gap-3 sm:mt-8 sm:w-auto sm:flex-row sm:gap-6">
            <button className="flex h-11 w-full items-center justify-center rounded-[0.328125rem] bg-[#222222] text-sm leading-none font-normal text-white shadow-[0.025rem_0.025rem_0.0375rem_-0.046875rem_rgba(0,0,0,0.26),0.075rem_0.075rem_0.10625rem_-0.09375rem_rgba(0,0,0,0.247),0.1625rem_0.1625rem_0.23125rem_-0.140625rem_rgba(0,0,0,0.23),0.36875rem_0.36875rem_0.51875rem_-0.1875rem_rgba(0,0,0,0.192),0.875rem_0.875rem_1.3125rem_-0.234375rem_rgba(0,0,0,0.2),-0.03125rem_-0.03125rem_0_rgba(0,0,0,0.686),inset_0.0625rem_0.0625rem_0.0625rem_rgba(255,255,255,0.7),inset_-0.0625rem_-0.0625rem_0.0625rem_rgba(0,0,0,0.23)] transition-all hover:bg-black sm:h-11.5 sm:w-40.75">
              Browse Component
            </button>
            <button className="flex h-11 w-full items-center justify-center rounded-sm border border-[#222222]/10 bg-transparent text-sm leading-none font-normal text-black transition-all hover:bg-[#222222]/5 sm:h-11.5 sm:w-40.75">
              Browse Component
            </button>
          </div>
        </section>

        {/* Right Graphic Column */}
        <section className="pointer-events-none relative w-full select-none sm:w-125 md:w-150 lg:w-175 xl:absolute xl:top-1/2 xl:right-0 xl:w-293.5 xl:-translate-y-[50%]">
          <HeroGraphic className="h-auto w-full" />
        </section>
      </div>
    </main>
  );
}

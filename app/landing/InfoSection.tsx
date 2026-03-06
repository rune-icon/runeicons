import Image from "next/image";

import {
  BarrierIcon,
  BlackEarthIcon,
  BookmarkIcon,
  BrainIcon,
  BunnyIcon,
  CatIcon,
  CherryIcon,
  CircleIcon,
  CubeIcon,
  DiamondIcon,
  EarthIcon,
  FireIcon,
  HeartIcon,
  MoonIcon,
  SearchIcon,
  StarIcon,
  WatermelonIcon,
} from "@/components/icon-page/simple-svg";
import infoBg from "@/public/images/info-bg.png";

export default function InfoSection() {
  return (
    <section className="bg-background w-full px-4 py-10 sm:px-6 md:px-12 lg:px-20 xl:px-29.75">
      <div className="flex w-full flex-col gap-10 xl:flex-row xl:items-start xl:gap-6">
        <div className="relative h-175.5 w-full overflow-hidden xl:aspect-589/702 xl:h-auto xl:flex-1">
          <DiamondIcon
            className="absolute top-[12%] left-[11%] block w-[30%] sm:w-[28%] xl:w-[32%]"
            aria-hidden="true"
            focusable="false"
          />

          <div className="absolute top-[6%] right-[10%] w-[32%] sm:w-[30%] xl:w-[34%]">
            <StarIcon
              className="block w-full opacity-80"
              aria-hidden="true"
              focusable="false"
            />
          </div>

          <CatIcon
            className="absolute bottom-[16%] left-[12%] block w-[32%] opacity-45 sm:w-[30%] xl:w-[34%]"
            aria-hidden="true"
            focusable="false"
          />

          <BunnyIcon
            className="absolute right-[10%] bottom-[28%] block w-[30%] sm:w-[28%] xl:w-[32%]"
            aria-hidden="true"
            focusable="false"
          />

          <div className="absolute bottom-8 left-8 z-10">
            <div className="absolute inset-0 -inset-x-6 -inset-y-4 bg-white/80 blur-2xl"></div>

            <div className="relative flex flex-col gap-4">
              <h3 className="text-5xl leading-[97%] font-normal text-black">
                Search &<br />
                <span className="text-primary">Discover Icons</span>
              </h3>

              <p className="max-w-143 text-2xl leading-[108%] text-black">
                Quickly find the perfect icon using smart search, filters, and
                organized categories.
              </p>
            </div>
          </div>
        </div>

        <div className="relative flex h-175.5 w-full items-center justify-center overflow-hidden rounded-3xl border border-black/5 bg-[#F7F7F7] xl:aspect-589/702 xl:h-auto xl:flex-1">
          {/* Background Pattern */}
          <Image
            src={infoBg}
            alt=""
            fill
            sizes="(max-width: 1280px) 100vw, 50vw"
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 object-cover object-center"
          />

          <div className="relative z-10 flex w-106.75 flex-col items-end gap-1.25">
            {/* Search Bar */}
            <div className="flex h-14 w-106.75 items-center gap-4.75 rounded-full border border-[#DBDBDB] bg-[#F3F3F3] px-4 shadow-[inset_0_0.0625rem_0.125rem_rgba(0,0,0,0.15),inset_0.0625rem_-0.125rem_0.125rem_rgba(0,0,0,0.08)]">
              <SearchIcon
                className="block h-6 w-6 shrink-0"
                aria-hidden="true"
                focusable="false"
              />
              <span className="text-base leading-[88%] text-[#626262]">
                Search Icons...
              </span>
            </div>

            {/* Icon Grid Container */}
            <div className="relative h-72.5 w-106.75">
              {/* Background */}
              <div className="absolute inset-0 rounded-3xl border border-[#DBDBDB] bg-[#F2F2F2]"></div>

              {/* Icon Grid */}
              <div className="absolute top-8.75 left-9.5 flex w-88.5 flex-col gap-8.75">
                {/* Row 1 */}
                <div className="flex h-12.5 items-center justify-between gap-13.25">
                  <div className="flex h-12.5 w-12.5 items-center justify-center">
                    <CherryIcon
                      className="block h-12.5 w-12.5"
                      aria-hidden="true"
                      focusable="false"
                    />
                  </div>
                  <div className="flex h-12.5 w-12.5 items-center justify-center">
                    <CircleIcon
                      className="block h-12.5 w-12.5"
                      aria-hidden="true"
                      focusable="false"
                    />
                  </div>
                  <div className="flex h-12.5 w-12.5 items-center justify-center">
                    <FireIcon
                      className="block h-10.75 w-10.75"
                      aria-hidden="true"
                      focusable="false"
                    />
                  </div>
                  <div className="flex h-12.5 w-12.5 items-center justify-center">
                    <CatIcon
                      className="block h-12.5 w-12.5"
                      aria-hidden="true"
                      focusable="false"
                    />
                  </div>
                </div>

                {/* Row 2 */}
                <div className="flex h-12.5 items-center justify-between gap-13.5">
                  <div className="flex h-12.5 w-12.5 items-center justify-center">
                    <BarrierIcon
                      className="block h-12.5 w-12.5"
                      aria-hidden="true"
                      focusable="false"
                    />
                  </div>
                  <div className="flex h-12.5 w-12.5 items-center justify-center">
                    <EarthIcon
                      className="block h-12.5 w-12.5"
                      aria-hidden="true"
                      focusable="false"
                    />
                  </div>
                  <div className="flex h-12.5 w-12.5 items-center justify-center">
                    <CubeIcon
                      className="block h-12.5 w-12.5"
                      aria-hidden="true"
                      focusable="false"
                    />
                  </div>
                  <div className="flex h-12.5 w-12.5 items-center justify-center">
                    <MoonIcon
                      className="block h-12.5 w-12.5"
                      aria-hidden="true"
                      focusable="false"
                    />
                  </div>
                </div>

                {/* Row 3 */}
                <div className="flex h-12.5 items-center justify-between gap-13.75">
                  <div className="flex h-12.5 w-12.5 items-center justify-center">
                    <BrainIcon
                      className="block h-12.5 w-12.5"
                      aria-hidden="true"
                      focusable="false"
                    />
                  </div>
                  <div className="flex h-12.5 w-12.5 items-center justify-center">
                    <BookmarkIcon
                      className="block h-12.5 w-12.5"
                      aria-hidden="true"
                      focusable="false"
                    />
                  </div>
                  <div className="flex h-11.25 w-11.25 items-center justify-center">
                    <HeartIcon
                      className="block h-11.25 w-11.25"
                      aria-hidden="true"
                      focusable="false"
                    />
                  </div>
                  <div className="flex h-12.5 w-12.5 items-center justify-center">
                    <WatermelonIcon
                      className="block h-12.5 w-12.5"
                      aria-hidden="true"
                      focusable="false"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Category Buttons */}
            <div className="flex h-15.75 w-106.75 items-center justify-between rounded-full bg-[#F4F4F4] px-2 pr-6 shadow-[0_0.0625rem_0_rgba(255,255,255,0.25),inset_0_0.0625rem_0.125rem_rgba(0,0,0,0.15)]">
              <button
                type="button"
                className="flex h-12 w-24 items-center justify-center rounded-full bg-[#F4F4F4] shadow-[0.0275rem_0.0275rem_0.04rem_-0.0625rem_rgba(0,0,0,0.26),0.17rem_0.17rem_0.235rem_-0.14rem_rgba(0,0,0,0.23),0.625rem_0.625rem_1.325rem_-0.23rem_rgba(0,0,0,0.055),-0.03rem_-0.03rem_0_rgba(0,0,0,0.05),inset_0.0625rem_0.0625rem_0.0625rem_#fff,inset_-0.0625rem_-0.0625rem_0.0625rem_rgba(0,0,0,0.15)]"
                aria-label="Earth category"
              >
                <BlackEarthIcon
                  className="block h-8 w-8"
                  aria-hidden="true"
                  focusable="false"
                />
              </button>
              <button
                type="button"
                className="flex h-12 w-12 items-center justify-center rounded-full opacity-80"
                aria-label="Diamond category"
              >
                <DiamondIcon
                  className="block h-9.5 w-9.5"
                  aria-hidden="true"
                  focusable="false"
                />
              </button>
              <button
                type="button"
                className="flex h-12 w-12 items-center justify-center rounded-full opacity-80"
                aria-label="Star category"
              >
                <StarIcon
                  className="block h-9.5 w-9.5"
                  aria-hidden="true"
                  focusable="false"
                />
              </button>
              <button
                type="button"
                className="flex h-12 w-12 items-center justify-center rounded-full opacity-80"
                aria-label="Cat category"
              >
                <CatIcon
                  className="block h-9.5 w-9.5"
                  aria-hidden="true"
                  focusable="false"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

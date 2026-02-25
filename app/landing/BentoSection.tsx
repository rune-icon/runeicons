import Image, { type StaticImageData } from "next/image";

import {
  BlackCircleIcon,
  CatBentoIcon,
  ElectronIcon,
  LeafIcon,
  PineIcon,
  SoundIcon,
} from "@/components/icons/svg";
import char1 from "@/public/images/char1.png";
import char2 from "@/public/images/char2.png";
import char3 from "@/public/images/char3.png";
import char4 from "@/public/images/char4.png";
import char5 from "@/public/images/char5.png";
import longSvgImg from "@/public/images/LongSvg.png";
import svgEditorImg from "@/public/images/svg-editer.png";

export default function BentoSection() {
  return (
    <section className="bg-background w-full px-4 py-10 sm:px-6 md:px-12 lg:px-20 xl:px-29.75">
      <div className="flex w-full flex-col gap-5.25 xl:flex-row xl:items-stretch">
        <div className="flex w-full flex-col gap-5.25 xl:min-w-0 xl:flex-[315_1_0%]">
          <article className="flex flex-col overflow-hidden rounded-3xl bg-[#FFFFFF] xl:min-h-0 xl:flex-[441_1_0%]">
            {/* Photo Grid */}
            <div className="flex items-center justify-center px-[18.4%] pt-[12%]">
              <div className="grid w-full grid-cols-3 gap-x-1.25 gap-y-1.75">
                {/* Row 1 */}
                <PhotoCard />
                <PhotoCard image={char1} hasShadow />
                <PhotoCard />
                {/* Row 2 */}
                <PhotoCard image={char2} />
                <PhotoCard image={char3} />
                <PhotoCard image={char4} />
                {/* Row 3 */}
                <PhotoCard />
                <PhotoCard image={char5} />
                <PhotoCard />
              </div>
            </div>

            {/* Names Strip*/}
            <div className="mt-[7.6%] overflow-hidden">
              <div className="mx-auto flex w-[107%] -translate-x-[3.3%] items-center justify-center gap-6.25 text-[8px] leading-[108%] font-normal whitespace-nowrap text-[#A6A6A6]">
                <span>Aman gupta</span>
                <span>Abhinav Kale</span>
                <span className="shrink-0 rounded-full border-[0.4px] border-[#C4C4C4] px-2 py-1 text-black">
                  Vansh Nagar
                </span>
                <span>Mohit Mehtre</span>
                <span>Pranav Jinturkar</span>
              </div>
            </div>

            {/* Text Content */}
            <div className="mt-[4.4%] flex flex-col gap-2 px-[7%]">
              <h3 className="text-[20px] leading-[108%] font-normal text-black">
                Met the Mind Behind the Magic
              </h3>
              <p className="text-[12px] leading-[108%] font-normal text-[#545454]">
                Finally met the creator whose work inspired me. From screens to
                real life surreal
              </p>
            </div>
          </article>

          <article className="flex flex-col overflow-hidden rounded-3xl bg-[#FFFFFF] xl:min-h-0 xl:flex-[296_1_0%]">
            {/* SVG Editor Image */}
            <div className="px-[6.2%] pt-[6.3%]">
              <div className="relative aspect-276/140 w-full overflow-hidden rounded-xl">
                <Image
                  src={svgEditorImg}
                  alt="Interactive SVG editing interface"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 90vw, 276px"
                />
              </div>
            </div>

            {/* Text Content */}
            <div className="mt-[19.4%] flex flex-col gap-2 px-[6%]">
              <h3 className="text-[20px] leading-[108%] font-normal text-black">
                Interactive SVG Editing
              </h3>
              <p className="text-[12px] leading-[108%] font-normal text-[#545454]">
                Drag points, reshape paths, and customize vectors directly in
                the browser.
              </p>
            </div>
          </article>
        </div>

        <article className="flex items-center justify-center overflow-hidden rounded-3xl bg-[#FFFFFF] xl:aspect-333/758 xl:min-w-0 xl:flex-[333_1_0%]">
          <div className="relative aspect-270/618 w-[81.1%]">
            <Image
              src={longSvgImg}
              alt="3D device stack illustration"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 90vw, 270px"
            />
          </div>
        </article>

        <div className="flex w-full flex-col gap-5.25 xl:min-w-0 xl:flex-[517_1_0%]">
          <article className="flex flex-col overflow-hidden rounded-3xl bg-[#FFFFFF] xl:min-h-0 xl:flex-[252_1_0%]">
            {/* Top Toolbar */}
            <div className="flex items-center gap-1.5 px-[2.3%] pt-[2.3%]">
              <span className="rounded-md border border-[#DADADA] bg-white px-2.5 py-1.5 text-[8px] leading-[88%] text-black">
                Select status <span className="text-[#ABABAB]">▾</span>
              </span>
              <span className="flex h-6.5 w-6.5 items-center justify-center rounded-md border border-[#DADADA] bg-white text-[8px] text-black">
                |
              </span>
              <span className="flex h-6.5 w-6.5 items-center justify-center rounded-md border border-[#DADADA] bg-white text-[8px] text-black">
                +
              </span>
              <span className="flex h-6.5 w-6.5 items-center justify-center rounded-md border border-[#DADADA] bg-white text-[8px] text-black">
                |
              </span>
              <span className="flex h-6.5 w-6.5 items-center justify-center rounded-md border border-[#DADADA] bg-white text-[8px] text-black">
                +
              </span>

              <div className="ml-auto flex items-center gap-3">
                <SizeMeter />
                <SizeMeter />
              </div>
            </div>

            {/* Icons Row */}
            <div className="flex flex-1 items-center justify-center gap-[6%] px-[1%]">
              <SoundIcon
                className="block w-[10.2%] shrink-0"
                aria-hidden="true"
                focusable="false"
              />
              <LeafIcon
                className="block w-[16.8%] shrink-0"
                aria-hidden="true"
                focusable="false"
              />
              <CatBentoIcon
                className="block w-[25.8%] shrink-0"
                aria-hidden="true"
                focusable="false"
              />
              <PineIcon
                className="block w-[14.3%] shrink-0"
                aria-hidden="true"
                focusable="false"
              />
              <ElectronIcon
                className="block w-[11.6%] shrink-0"
                aria-hidden="true"
                focusable="false"
              />
            </div>

            {/* Pagination Dots */}
            <div className="flex justify-center gap-0.5 pb-[3.5%]">
              <span className="size-1 rounded-full bg-[#ABABAB]" />
              <span className="size-1 rounded-full bg-black" />
              <span className="size-1 rounded-full bg-[#ABABAB]" />
              <span className="size-1 rounded-full bg-[#ABABAB]" />
              <span className="size-1 rounded-full bg-[#ABABAB]" />
              <span className="size-1 rounded-full bg-[#ABABAB]" />
            </div>
          </article>

          <article className="flex flex-col overflow-hidden rounded-3xl bg-[#FFFFFF] xl:min-h-0 xl:flex-[487_1_0%]">
            {/* Geometric Pattern with Icon */}
            <div className="flex items-center justify-center pt-[5.9%]">
              <BlackCircleIcon
                className="block w-[67.9%]"
                aria-hidden="true"
                focusable="false"
              />
            </div>

            {/* Text Content */}
            <div className="mt-[5.8%] flex flex-col gap-2 px-[4.1%] pb-[4.1%]">
              <h3 className="text-[20px] leading-[108%] font-normal text-black">
                Over 1000+ Icons Crafted For your website
              </h3>
              <p className="text-[12px] leading-[108%] font-normal text-[#545454]">
                Designed a library of 1000+ scalable, performance-optimized SVG
                icons with a consistent visual system for seamless use in modern
                web apps.
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

function PhotoCard({
  image,
  hasShadow,
}: {
  image?: StaticImageData;
  hasShadow?: boolean;
}) {
  return (
    <div
      className={`relative aspect-63/77 overflow-hidden rounded-[5px] border-[0.5px] border-[#DADADA] bg-white ${
        hasShadow ? "shadow-[0_4px_4px_rgba(0,0,0,0.25)]" : ""
      }`}
    >
      {image && (
        <Image
          src={image}
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 768px) 80px, 63px"
        />
      )}
    </div>
  );
}

function SizeMeter() {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[0.625rem] text-black/60">Size</span>
      <span className="h-0.5 w-14 rounded-full bg-black/20">
        <span className="block h-0.5 w-8 rounded-full bg-black/45" />
      </span>
      <span className="text-[0.625rem] text-black/60">16</span>
    </div>
  );
}

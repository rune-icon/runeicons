import { FeatureLeafIcon, FeatureStarIcon } from "@/components/icon-page/simple-svg";

type Feature = {
  number: string;
  title: string;
  featured?: boolean;
  description?: string;
};

const FEATURES: Feature[] = [
  { number: "01.", title: "10,000+\nIcons" },
  {
    number: "02.",
    title: "Customize Your Icons",
    featured: true,
    description:
      "Ex eiusmod non veniam labore aliqua do. Aute laboris et culpa ea eiusmod ullamco proident elit et ad. Sint nisi velit cupidatat deserunt consequatpariatur. Officia elit veniam eu proident Lorem. Cillu",
  },
  { number: "03.", title: "Deliver In\nMinuts" },
  { number: "04.", title: "Process" },
];

export default function FeaturesSection() {
  return (
    <section className="bg-background relative w-full px-4 pt-28 pb-10 sm:px-6 md:px-12 lg:px-20 xl:px-29.75">
      {/* Background grid */}
      <div className="pointer-events-none absolute -top-34.25 left-[21.6%] h-209 w-[71.9%] bg-[linear-gradient(to_right,#797979_1px,transparent_1px),linear-gradient(to_bottom,#797979_1px,transparent_1px)] mask-[radial-gradient(ellipse_60%_55%_at_50%_55%,rgba(0,0,0,1)_0%,rgba(0,0,0,0)_70%)] bg-size-[86.9px_83.6px] [-webkit-mask-image:radial-gradient(ellipse_60%_55%_at_50%_55%,rgba(0,0,0,1)_0%,rgba(0,0,0,0)_70%)]" />

      <div className="relative z-10 flex flex-col gap-12">
        {/* Header */}
        <div className="flex flex-col gap-4">
          {/* Badge Pill */}
          <div className="flex w-fit items-center gap-2 rounded-full bg-black/8 py-0.5 pr-2 pl-0.5 shadow-[0_1px_0_rgba(255,255,255,0.25),inset_0_1px_2px_rgba(0,0,0,0.15)]">
            <div className="flex size-4.5 items-center justify-center rounded-full bg-[#F4F4F4] shadow-[0.44px_0.44px_0.63px_-0.75px_rgba(0,0,0,0.26),1.21px_1.21px_1.71px_-1.5px_rgba(0,0,0,0.25),2.66px_2.66px_3.76px_-2.25px_rgba(0,0,0,0.23),5.9px_5.9px_8.35px_-3px_rgba(0,0,0,0.19),10px_10px_21.21px_-3.75px_rgba(0,0,0,0.06),inset_1px_1px_1px_#fff,inset_-1px_-1px_0_rgba(0,0,0,0.1)]">
              <FeatureStarIcon className="block size-3" aria-hidden="true" />
            </div>
            <span className="text-[8px] leading-[88%] font-normal text-black">
              Features
            </span>
          </div>

          {/* Title */}
          <h2 className="max-w-84.25 text-[48px] leading-[97%] font-normal text-black">
            Here&apos;s what <br />
            Rune <span className="text-primary">helps you</span>
          </h2>
        </div>

        {/* Cards Row */}
        <div className="flex flex-col items-center gap-6 md:flex-row md:items-center">
          {FEATURES.map((feature, i) =>
            feature.featured ? (
              <FeaturedCard key={i} feature={feature} />
            ) : (
              <SmallCard key={i} feature={feature} />
            )
          )}
        </div>
      </div>
    </section>
  );
}

function SmallCard({ feature }: { feature: Feature }) {
  return (
    <article className="relative flex w-full flex-col overflow-hidden rounded-3xl bg-[#FFFEFE] md:h-98.25 md:flex-1 xl:aspect-264/393 xl:h-auto xl:min-w-0 xl:flex-[264_1_0%]">
      {/* Large faded number */}
      <span className="font-gemunu absolute top-4.5 left-3.75 text-[56px] leading-[88%] font-bold text-black/8 [text-shadow:0px_1px_0px_rgba(255,255,255,0.25)]">
        {feature.number}
      </span>

      {/* Bottom content */}
      <div className="mt-auto flex flex-col gap-4 px-3.75 pb-6">
        {/* Leaf icon */}
        <div className="size-6">
          <FeatureLeafIcon
            className="block size-6"
            aria-hidden="true"
            focusable="false"
          />
        </div>

        {/* Title */}
        <p className="text-[16px] leading-[99%] font-normal whitespace-pre-line text-black">
          {feature.title}
        </p>
      </div>
    </article>
  );
}

function FeaturedCard({ feature }: { feature: Feature }) {
  return (
    <article className="relative flex w-full flex-col overflow-hidden rounded-3xl bg-[#FFFEFE] md:h-123.75 md:w-88 md:shrink-0 xl:aspect-352/495 xl:h-auto xl:w-auto xl:min-w-0 xl:flex-[352_1_0%] xl:shrink">
      {/* Top gradient area */}
      <div className="relative mx-auto mt-1.25 aspect-340/195 w-[96.6%] overflow-hidden rounded-[20px] bg-linear-to-b from-[rgba(19,70,231,0.1)] to-transparent" />

      {/* Icon + Title */}
      <div className="mt-5.75 flex flex-col gap-4 px-5.75 xl:mt-auto">
        <div className="size-6">
          <FeatureLeafIcon
            className="block size-6"
            aria-hidden="true"
            focusable="false"
          />
        </div>
        <h3 className="max-w-66 text-[32px] leading-[99%] font-normal text-black">
          {feature.title}
        </h3>
      </div>

      {/* Description */}
      <p className="mt-13 px-5.75 text-[10px] leading-[195%] font-medium text-[#949494] xl:pb-5.75">
        {feature.description}
      </p>
    </article>
  );
}

import { FooterLogo } from "@/components/icons/svg";

const FOOTER_COLUMNS = [
  {
    title: "Product",
    links: ["new one", "new one", "new one", "new one"],
  },
  {
    title: "Product",
    links: ["new one", "new one", "new one", "new one"],
  },
  {
    title: "Product",
    links: ["new one", "new one", "new one", "new one"],
  },
];

export default function FooterSection() {
  return (
    <footer className="bg-background relative w-full px-4 pt-20 pb-0 sm:px-6 md:px-12 lg:px-20 xl:px-29.75">
      {/* Dashed line running behind the card */}
      <hr className="border-borderColor absolute top-76 right-0 left-0 z-0 border-t border-dashed" />

      <div className="relative z-10 flex flex-col items-center">
        {/* Main Card */}
        <div className="relative flex min-h-96 w-full flex-col justify-between rounded-3xl bg-white shadow-[inset_1px_1px_1px_#fff,inset_-1px_-1px_0_rgba(0,0,0,0.1)] xl:aspect-25/8 xl:min-h-0">
          <div className="flex flex-col px-10 pt-15 md:flex-row md:items-start md:justify-between">
            <div className="flex max-w-80 flex-col gap-6">
              <FooterLogo className="block h-10.5 w-10.25" aria-hidden="true" />
              <p className="text-base leading-[136%] font-normal text-[#656565]">
                Exercitation irure pariatur velit dolor culpa duis enim enim
                ipsum do labore ullamco.
              </p>
            </div>

            {/* Right - Link Columns */}
            <div className="mt-8 flex gap-14.5 md:mt-0">
              {FOOTER_COLUMNS.map((col, i) => (
                <div key={i} className="flex flex-col gap-1.25">
                  <h4 className="text-base leading-[136%] font-medium text-black">
                    {col.title}
                  </h4>
                  <div className="flex flex-col gap-1.5">
                    {col.links.map((link, j) => (
                      <a
                        key={j}
                        href="#"
                        className="text-sm leading-[136%] font-medium text-[#656565] transition-colors hover:text-black"
                      >
                        {link}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Separator Line */}
          <div className="mx-auto w-[93.4%] border-t-[0.6px] border-[#D9D9D9]" />

          {/* Bottom Bar */}
          <div className="flex items-center justify-between px-10 py-9">
            <span className="text-xs leading-[108%] font-normal text-[#656565]">
              © 2026 Rune Icons. All rights reserved.
            </span>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="text-xs leading-[108%] font-normal text-[#656565] underline transition-colors hover:text-black"
              >
                Terms of Services
              </a>
              <a
                href="#"
                className="text-xs leading-[108%] font-normal text-[#656565] underline transition-colors hover:text-black"
              >
                Privacy Policy
              </a>
            </div>
          </div>
        </div>

        {/* Big Faded Text */}
        <div className="mt-4 h-32 w-full overflow-hidden font-(--font-geist-sans)">
          <h2 className="w-full bg-[linear-gradient(180deg,rgba(81,81,81,0.08)_0%,rgba(215,215,215,0.016)_100%)] bg-clip-text text-center text-[13vw] leading-[88%] font-bold whitespace-nowrap text-transparent [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]">
            RUNE ICONS
          </h2>
        </div>
      </div>
    </footer>
  );
}

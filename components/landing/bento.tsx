import React from "react";
import IconCarousel from "./icon-carousel";

interface BentoCardProps {
  title: string;
  description: string;
  children?: React.ReactNode;
  className?: string;
  graphicClassName?: string;
}

const BentoCard = ({
  title,
  description,
  children,
  className,
  graphicClassName,
}: BentoCardProps) => {
  return (
    <div className={`rounded-2xl md:rounded-3xl border border-border bg-card text-card-foreground flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg min-h-0 ${className}`}>
      <div className={`flex-1 min-h-0 flex justify-center items-center p-3 md:p-6 overflow-hidden ${graphicClassName}`}>
        {children}
      </div>
      <div className="p-4 md:p-8 pt-0 mt-auto shrink-0">
        <h3 className="text-sm md:text-md font-semibold mb-1">
          {title}
        </h3>
        <p className="text-sm md:text-md text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
};

const Bento = () => {
  return (
    <section className="w-full my-12">
      <div className="mx-auto grid w-full h-[90vh] grid-cols-1 gap-2 md:gap-4 lg:grid-cols-12">
        {/* Left Column */}
        <div className="grid grid-cols-2 md:grid-cols-1 gap-2 md:gap-4 lg:col-span-3 lg:grid-rows-[6fr_4fr] min-h-0">
          <BentoCard
            title="Met the Mind Behind the Magic"
            description="Finally met the creator whose work inspired me. From screens to real life surreal"
            className="h-full"
          >
            hiiiii
          </BentoCard>
          <BentoCard
            title="Interactive SVG Editing"
            description="Drag points, reshape paths, and customize vectors directly in the browser."
            className="h-full"
          >
            hiii
          </BentoCard>
        </div>

        {/* Center Card */}
        <BentoCard
          title=""
          description=""
          className="lg:col-span-4 h-full min-h-0"
        >
          hi        </BentoCard>

        {/* Right Column */}
        <div className="grid grid-cols-1 gap-2 md:gap-4 lg:col-span-5 lg:grid-rows-[4fr_6fr] min-h-0">
          <BentoCard
            title=""
            description=""
            className="h-full"
          >
            <IconCarousel /> 
          </BentoCard>
          <BentoCard
            title="Over 1000+ Icons Crafted For your website"
            description="Designed a library of 1000+ scalable, performance-optimized SVG icons with a consistent visual system for seamless use in modern web apps."
            className="h-full"
          >
            <svg
              width="383"
              height="381"
              viewBox="0 0 383 381"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-auto max-w-[300px]"
            >
              <mask
                id="mask0_53_3139"
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="383"
                height="381"
              >
                <rect
                  x="1.2627"
                  y="0.75"
                  width="378.97"
                  height="378.095"
                  stroke="#E0E0E0"
                  strokeWidth="1.5"
                />
                <line
                  x1="381.512"
                  y1="0.53094"
                  x2="1.04258"
                  y2="380.126"
                  stroke="#E0E0E0"
                  strokeWidth="1.5"
                />
                <circle
                  cx="191.206"
                  cy="190.667"
                  r="78.6061"
                  stroke="#E0E0E0"
                  strokeWidth="1.5"
                />
                <circle
                  cx="191.206"
                  cy="190.666"
                  r="173.024"
                  stroke="#E0E0E0"
                  strokeWidth="1.5"
                />
                <rect
                  x="136.583"
                  y="136.044"
                  width="109.245"
                  height="109.245"
                  stroke="#E0E0E0"
                  strokeWidth="1.5"
                />
                <rect
                  x="41.8281"
                  y="41.2871"
                  width="298.757"
                  height="298.757"
                  rx="22.25"
                  stroke="#E0E0E0"
                  strokeWidth="1.5"
                />
                <rect
                  x="63.4346"
                  y="17.6416"
                  width="255.545"
                  height="346.049"
                  rx="22.25"
                  stroke="#E0E0E0"
                  strokeWidth="1.5"
                />
                <rect
                  x="18.1816"
                  y="65.0029"
                  width="346.049"
                  height="251.327"
                  rx="22.25"
                  stroke="#E0E0E0"
                  strokeWidth="1.5"
                />
                <line
                  x1="191.956"
                  y1="1.73828"
                  x2="191.956"
                  y2="379.595"
                  stroke="#E0E0E0"
                  strokeWidth="1.5"
                />
                <line
                  x1="136.583"
                  y1="1.74414"
                  x2="136.583"
                  y2="379.601"
                  stroke="#E0E0E0"
                  strokeWidth="1.5"
                />
                <line
                  x1="3.12598"
                  y1="245.289"
                  x2="380.983"
                  y2="245.289"
                  stroke="#E0E0E0"
                  strokeWidth="1.5"
                />
                <line
                  x1="245.879"
                  y1="0.868164"
                  x2="245.879"
                  y2="378.725"
                  stroke="#E0E0E0"
                  strokeWidth="1.5"
                />
                <line
                  x1="1.40527"
                  y1="136.081"
                  x2="379.262"
                  y2="136.081"
                  stroke="#E0E0E0"
                  strokeWidth="1.5"
                />
                <line
                  x1="380.129"
                  y1="191.422"
                  x2="2.27209"
                  y2="191.422"
                  stroke="#E0E0E0"
                  strokeWidth="1.5"
                />
                <line
                  x1="0.529142"
                  y1="1.21263"
                  x2="380.081"
                  y2="379.069"
                  stroke="#E0E0E0"
                  strokeWidth="1.5"
                />
                <path
                  d="M308.66 228.194H252.585C246.034 228.194 239.751 230.797 235.118 235.43C230.485 240.062 227.883 246.345 227.883 252.897V308.971"
                  stroke="#515151"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M129.073 84.1787V104.682C129.073 114.509 132.977 123.934 139.926 130.883C146.875 137.832 156.3 141.735 166.127 141.735C172.678 141.735 178.962 144.338 183.594 148.971C188.227 153.603 190.829 159.886 190.829 166.438C190.829 180.024 201.945 191.14 215.532 191.14C222.083 191.14 228.366 188.538 232.999 183.905C237.632 179.272 240.234 172.989 240.234 166.438C240.234 152.851 251.35 141.735 264.937 141.735H304.09"
                  stroke="#515151"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M178.479 314.035V265.248C178.479 258.696 175.876 252.413 171.244 247.78C166.611 243.148 160.328 240.545 153.777 240.545C147.225 240.545 140.942 237.943 136.309 233.31C131.677 228.677 129.074 222.394 129.074 215.843V203.491C129.074 196.94 126.472 190.657 121.839 186.024C117.206 181.392 110.923 178.789 104.372 178.789H67.9355"
                  stroke="#515151"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M190.83 314.653C259.043 314.653 314.342 259.355 314.342 191.141C314.342 122.927 259.043 67.6289 190.83 67.6289C122.616 67.6289 67.3174 122.927 67.3174 191.141C67.3174 259.355 122.616 314.653 190.83 314.653Z"
                  stroke="#515151"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </mask>
              <g mask="url(#mask0_53_3139)">
                <g filter="url(#filter0_f_53_3139)">
                  <circle cx="192.054" cy="189.797" r="158.762" fill="#D9D9D9" />
                </g>
              </g>
              <defs>
                <filter
                  id="filter0_f_53_3139"
                  x="-16.708"
                  y="-18.9648"
                  width="417.523"
                  height="417.523"
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="BackgroundImageFix"
                    result="shape"
                  />
                  <feGaussianBlur
                    stdDeviation="25"
                    result="effect1_foregroundBlur_53_3139"
                  />
                </filter>
              </defs>
            </svg>
          </BentoCard>
        </div>
      </div>
    </section>
  );
};

export default Bento;


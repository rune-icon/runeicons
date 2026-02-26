interface OnSpeakerIconProps {
  size?: number;
  className?: string;
}

const OnSpeakerIcon = ({ size = 20, className = "" }: OnSpeakerIconProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M13 7L8 11H4V17H8L13 21V7Z"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <g>
        <path
          d="M21.07 7C22.9447 8.87528 23.9979 11.4184 23.9979 14.07C23.9979 16.7216 22.9447 19.2647 21.07 21.14"
          stroke="white"
          strokeWidth="1.5"
          pathLength="1"
          strokeDashoffset="0px"
          strokeDasharray="1px 1px"
        ></path>
        <path
          d="M17.54 10.53C18.4773 11.4676 19.0039 12.7392 19.0039 14.065C19.0039 15.3908 18.4773 16.6624 17.54 17.6"
          stroke="white"
          strokeWidth="1.5"
          pathLength="1"
          strokeDashoffset="0px"
          strokeDasharray="1px 1px"
        ></path>
      </g>
    </svg>
  );
};

export default OnSpeakerIcon;

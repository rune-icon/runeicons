interface XIconProps {
  size?: number;
  className?: string;
}

const XIcon = ({ size = 20, className = "" }: XIconProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M14.8885 2.5H17.4953L11.8002 8.85385L18.5 17.5H13.2541L9.14539 12.2562L4.44405 17.5H1.8357L7.92711 10.7038L1.5 2.5H6.87904L10.593 7.29308L14.8885 2.5ZM13.9736 15.9769H15.418L6.09417 3.94308H4.54413L13.9736 15.9769Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default XIcon;

type IconInputTextProps = {
  width?: number | string;
  height?: number | string;
};

const IconInputText = ({ width = 20, height = 21 }: IconInputTextProps) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 20 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_25231_157214)">
        <path d="M0 5.5H20" stroke="#0E1726" strokeWidth="1.67" />
        <path d="M0 5.5L-5.2165e-08 16.5" stroke="#0E1726" strokeWidth="1.67" />
        <path d="M20 5.5L20 16.5" stroke="#0E1726" strokeWidth="1.67" />
        <path d="M0 16.5H20" stroke="#0E1726" strokeWidth="1.67" />
        <path d="M2 8.5H6" stroke="#0E1726" />
        <path d="M4.00012 8.5V13.5" stroke="#0E1726" />
        <path d="M2 13.5H6" stroke="#0E1726" />
      </g>
      <defs>
        <clipPath id="clip0_25231_157214">
          <rect width="20" height="20" fill="white" transform="translate(0 0.5)" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default IconInputText;

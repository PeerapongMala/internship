type IconSendProps = {
  className?: string;
  width?: number;
  height?: number;
};

const IconSend = ({ className, height = 20, width = 20 }: IconSendProps) => {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.15417 14.1666V14.1854L4.17153 14.1781L14.0465 10.0114L14.0738 9.99992L14.0465 9.9884L4.17153 5.82173L4.15417 5.81441V5.83325V8.74992V8.75968L4.16364 8.76205L9.11513 9.99992L4.16364 11.2378L4.15417 11.2402V11.2499V14.1666ZM2.5125 16.6478V3.35208L18.3011 9.99992L2.5125 16.6478Z"
        fill="#333333"
        stroke="#333333"
        stroke-width="0.025"
      />
    </svg>
  );
};

export default IconSend;

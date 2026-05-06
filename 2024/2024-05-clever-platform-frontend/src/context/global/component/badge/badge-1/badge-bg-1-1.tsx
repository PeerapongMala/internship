import { FC } from 'react';

const BadgeBg1_1: FC<{ className?: string }> = ({
  className,
}: {
  className?: string;
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="230"
      height="71"
      viewBox="0 0 230 71"
      fill="none"
      className={className}
    >
      <g filter="url(#filter0_dd_11026_90673)">
        <g clip-path="url(#clip0_11026_90673)">
          <mask id="path-1-inside-1_11026_90673" fill="white">
            <path d="M8 31C8 17.7452 18.7452 7 32 7H198C211.255 7 222 17.7452 222 31C222 44.2548 211.255 55 198 55H32C18.7452 55 8 44.2548 8 31Z" />
          </mask>
          <path
            d="M8 31C8 17.7452 18.7452 7 32 7H198C211.255 7 222 17.7452 222 31C222 44.2548 211.255 55 198 55H32C18.7452 55 8 44.2548 8 31Z"
            fill="url(#paint0_linear_11026_90673)"
          />
          <mask id="path-3-inside-2_11026_90673" fill="white">
            <path d="M8 31C8 17.7452 18.7452 7 32 7H198C211.255 7 222 17.7452 222 31C222 44.2548 211.255 55 198 55H32C18.7452 55 8 44.2548 8 31Z" />
          </mask>
          <path
            d="M8 7H222H8ZM222 31C222 46.464 209.464 59 194 59H36C20.536 59 8 46.464 8 31C8 42.0457 18.7452 51 32 51H198C211.255 51 222 42.0457 222 31ZM8 55V7V55ZM222 7V55V7Z"
            fill="black"
            fill-opacity="0.05"
            mask="url(#path-3-inside-2_11026_90673)"
          />
        </g>
        <path
          d="M8 7H222H8ZM222 31C222 46.464 209.464 59 194 59H36C20.536 59 8 46.464 8 31C8 42.0457 18.7452 51 32 51H198C211.255 51 222 42.0457 222 31ZM8 55V7V55ZM222 7V55V7Z"
          fill="#E86201"
          mask="url(#path-1-inside-1_11026_90673)"
        />
      </g>
      <defs>
        <filter
          id="filter0_dd_11026_90673"
          x="0"
          y="7"
          width="230"
          height="64"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="8" />
          <feGaussianBlur stdDeviation="4" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_11026_90673"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"
          />
          <feBlend
            mode="normal"
            in2="effect1_dropShadow_11026_90673"
            result="effect2_dropShadow_11026_90673"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect2_dropShadow_11026_90673"
            result="shape"
          />
        </filter>
        <linearGradient
          id="paint0_linear_11026_90673"
          x1="115"
          y1="7"
          x2="115"
          y2="55"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#FCA726" />
          <stop offset="0.5" stop-color="#FF6B00" />
          <stop offset="1" stop-color="#CC0000" />
        </linearGradient>
        <clipPath id="clip0_11026_90673">
          <path
            d="M8 31C8 17.7452 18.7452 7 32 7H198C211.255 7 222 17.7452 222 31C222 44.2548 211.255 55 198 55H32C18.7452 55 8 44.2548 8 31Z"
            fill="white"
          />
        </clipPath>
      </defs>
    </svg>
  );
};

export default BadgeBg1_1;

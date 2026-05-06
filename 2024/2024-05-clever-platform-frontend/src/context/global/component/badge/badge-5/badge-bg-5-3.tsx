import { FC } from 'react';

const BadgeBg5_3: FC<{ className?: string }> = ({
  className,
}: {
  className?: string;
}) => {
  return (
    <svg
      width="230"
      height="71"
      viewBox="0 0 230 71"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g filter="url(#filter0_dd_11026_90694)">
        <g clip-path="url(#clip0_11026_90694)">
          <mask id="path-1-inside-1_11026_90694" fill="white">
            <path d="M8 15C8 10.5817 11.5817 7 16 7H214C218.418 7 222 10.5817 222 15V47C222 51.4183 218.418 55 214 55H16C11.5817 55 8 51.4183 8 47V15Z" />
          </mask>
          <path
            d="M8 15C8 10.5817 11.5817 7 16 7H214C218.418 7 222 10.5817 222 15V47C222 51.4183 218.418 55 214 55H16C11.5817 55 8 51.4183 8 47V15Z"
            fill="url(#paint0_linear_11026_90694)"
          />
          <mask id="path-3-inside-2_11026_90694" fill="white">
            <path d="M8 31C8 17.7452 18.7452 7 32 7H198C211.255 7 222 17.7452 222 31C222 44.2548 211.255 55 198 55H32C18.7452 55 8 44.2548 8 31Z" />
          </mask>
          <path
            d="M8 7H222H8ZM222 31C222 46.464 209.464 59 194 59H36C20.536 59 8 46.464 8 31C8 42.0457 18.7452 51 32 51H198C211.255 51 222 42.0457 222 31ZM8 55V7V55ZM222 7V55V7Z"
            fill="black"
            fill-opacity="0.05"
            mask="url(#path-3-inside-2_11026_90694)"
          />
        </g>
        <path
          d="M8 7H222H8ZM222 47C222 52.5228 217.523 57 212 57H18C12.4772 57 8 52.5228 8 47C8 50.3137 11.5817 53 16 53H214C218.418 53 222 50.3137 222 47ZM8 55V7V55ZM222 7V55V7Z"
          fill="#77DB82"
          mask="url(#path-1-inside-1_11026_90694)"
        />
      </g>
      <defs>
        <filter
          id="filter0_dd_11026_90694"
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
            result="effect1_dropShadow_11026_90694"
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
            in2="effect1_dropShadow_11026_90694"
            result="effect2_dropShadow_11026_90694"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect2_dropShadow_11026_90694"
            result="shape"
          />
        </filter>
        <linearGradient
          id="paint0_linear_11026_90694"
          x1="115"
          y1="7"
          x2="115"
          y2="55"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#78EC00" />
          <stop offset="1" stop-color="#079017" />
        </linearGradient>
        <clipPath id="clip0_11026_90694">
          <path
            d="M8 15C8 10.5817 11.5817 7 16 7H214C218.418 7 222 10.5817 222 15V47C222 51.4183 218.418 55 214 55H16C11.5817 55 8 51.4183 8 47V15Z"
            fill="white"
          />
        </clipPath>
      </defs>
    </svg>
  );
};

export default BadgeBg5_3;

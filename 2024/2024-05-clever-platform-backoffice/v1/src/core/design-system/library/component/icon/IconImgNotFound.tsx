import React, { FC, SVGProps } from 'react';

type IconImgNotFoundProps = React.SVGProps<SVGSVGElement> & {};

const IconImgNotFound = ({
  className,
  width = '20',
  height = '20',
}: IconImgNotFoundProps) => {
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
        d="M11.6668 18.3332H5.00016C4.55814 18.3332 4.13421 18.1576 3.82165 17.845C3.50909 17.5325 3.3335 17.1085 3.3335 16.6665V3.33317C3.3335 2.89114 3.50909 2.46722 3.82165 2.15466C4.13421 1.8421 4.55814 1.6665 5.00016 1.6665H11.6668L16.6668 6.6665V12.5"
        stroke="#525252"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.6665 1.6665V6.6665H16.6665"
        stroke="#525252"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19 14L14.0003 18.9997"
        stroke="#525252"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 14.0005L18.9997 19.0002"
        stroke="#525252"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default IconImgNotFound;

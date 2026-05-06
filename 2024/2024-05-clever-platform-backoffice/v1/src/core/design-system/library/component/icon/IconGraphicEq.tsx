import { FC } from 'react';

const IconGraphicEq: FC<{ className?: string; duotone?: boolean }> = ({
  className,
}: {
  className?: string;
}) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M5.83333 14.9998V4.99984H7.5V14.9998H5.83333ZM9.16667 18.3332V1.6665H10.8333V18.3332H9.16667ZM2.5 11.6665V8.33317H4.16667V11.6665H2.5ZM12.5 14.9998V4.99984H14.1667V14.9998H12.5ZM15.8333 11.6665V8.33317H17.5V11.6665H15.8333Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default IconGraphicEq;

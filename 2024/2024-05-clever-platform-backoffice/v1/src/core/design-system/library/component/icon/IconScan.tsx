import { FC } from 'react';

const IconScan: FC<{ className?: string }> = ({ className }: { className?: string }) => {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M0.666504 1.49984C0.666504 1.0396 1.0396 0.666504 1.49984 0.666504H5.99984V2.33317H2.33317V5.99984H0.666504V1.49984ZM15.6665 2.33317H11.9998V0.666504H16.4998C16.9601 0.666504 17.3332 1.0396 17.3332 1.49984V5.99984H15.6665V2.33317ZM2.33317 15.6665V11.9998H0.666504V16.4998C0.666504 16.9601 1.0396 17.3332 1.49984 17.3332H5.99984V15.6665H2.33317ZM15.6665 15.6665V11.9998H17.3332V16.4998C17.3332 16.9601 16.9601 17.3332 16.4998 17.3332H11.9998V15.6665H15.6665ZM17.3332 9.83317H0.666504V8.1665H17.3332V9.83317Z"
        fill="black"
      />
    </svg>
  );
};

export default IconScan;

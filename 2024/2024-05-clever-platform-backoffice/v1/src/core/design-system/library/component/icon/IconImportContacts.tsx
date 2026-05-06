import { FC } from 'react';

const IconImportContacts: FC<{ className?: string }> = ({
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
        d="M1.66797 2.5H6.66797C7.55202 2.5 8.39987 2.85119 9.02499 3.47631C9.65011 4.10143 10.0013 4.94928 10.0013 5.83333V17.5C10.0013 16.837 9.73791 16.2011 9.26907 15.7322C8.80023 15.2634 8.16434 15 7.5013 15H1.66797V2.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.3333 2.5H13.3333C12.4493 2.5 11.6014 2.85119 10.9763 3.47631C10.3512 4.10143 10 4.94928 10 5.83333V17.5C10 16.837 10.2634 16.2011 10.7322 15.7322C11.2011 15.2634 11.837 15 12.5 15H18.3333V2.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default IconImportContacts;

import IconDownload from '@core/design-system/library/component/icon/IconDownload';
import { FC } from 'react';

interface CWButtonDownloadDocsProps {
  href: string;
  label: string;
  className?: string;
}

export const CWButtonDownloadDocs: FC<CWButtonDownloadDocsProps> = ({
  href,
  label,
  className = '',
}) => {
  return (
    <div className={`rounded-lg bg-white p-5 shadow-md ${className}`}>
      <div className="flex items-center gap-2 text-primary">
        <IconDownload className="h-5 w-5" />
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm hover:underline"
        >
          {label}
        </a>
      </div>
    </div>
  );
};

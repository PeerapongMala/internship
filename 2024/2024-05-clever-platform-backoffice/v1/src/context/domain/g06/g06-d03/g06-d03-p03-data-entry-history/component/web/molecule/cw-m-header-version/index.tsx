import { cn } from '@core/design-system/library/vristo/source/utils/cn';

type HeaderVersionProps = {
  className?: string;
  version?: string;
};

const HeaderVersion = ({ className, version }: HeaderVersionProps) => {
  return (
    <div className={cn('text-xl', className)}>
      <span className="font-bold">Version</span>
      <span> {version}</span>
    </div>
  );
};

export default HeaderVersion;

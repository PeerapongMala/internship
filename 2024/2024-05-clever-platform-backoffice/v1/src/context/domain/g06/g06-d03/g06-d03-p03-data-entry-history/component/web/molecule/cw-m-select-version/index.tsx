import CWButton from '@component/web/cw-button';
import CWSelect, { TCWSelectProps } from '@component/web/cw-select';
import { cn } from '@core/design-system/library/vristo/source/utils/cn';
import showMessage from '@global/utils/showMessage';

type SelectVersionProps = TCWSelectProps & {
  onRetrieveVersion?: (versionID: number) => void;
  selectedVersionID?: number;
  containerClassName?: string;
};

// million-ignore
const SelectVersion = ({
  containerClassName,
  className,
  onRetrieveVersion,
  selectedVersionID,
  ...props
}: SelectVersionProps) => {
  const handleRetrieveVersion = () => {
    if (!selectedVersionID) {
      showMessage(
        'กรุณาเลือก version ที่ต้องการเปรียบเทียบ และเรียกคืนเรียกคืน',
        'warning',
      );
      return;
    }

    onRetrieveVersion?.(selectedVersionID);
  };

  return (
    <div className={cn('flex gap-4', containerClassName)}>
      <CWSelect {...props} className="w-full max-w-[300px]" />

      <CWButton
        className="h-9 text-nowrap"
        variant="primary"
        outline
        title="เรียกคืน version นี้"
        onClick={handleRetrieveVersion}
      />
    </div>
  );
};

export default SelectVersion;

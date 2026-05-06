import CWInput from '@component/web/cw-input';

type PanelNoCriteriaProps = {
  disabledEdit?: boolean;
  indicatorName?: string;
  onIndicatorNameChange?: (name: string) => void;
};

const PanelNoCriteria = ({
  disabledEdit,
  indicatorName,
  onIndicatorNameChange,
}: PanelNoCriteriaProps) => {
  return (
    <div className="flex flex-col gap-5">
      <CWInput
        disabled={disabledEdit}
        required={!disabledEdit}
        label="ชื่อตัวชี้วัด"
        value={indicatorName}
        onChange={(e) => onIndicatorNameChange?.(e.target.value)}
      />
    </div>
  );
};

export default PanelNoCriteria;

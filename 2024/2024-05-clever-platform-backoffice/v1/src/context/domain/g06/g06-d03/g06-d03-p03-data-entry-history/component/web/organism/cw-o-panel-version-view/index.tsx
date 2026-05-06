import { SelectOption } from '@component/web/cw-select';
import HeaderVersion from '../../molecule/cw-m-header-version';
import SelectVersion from '../../molecule/cw-m-select-version';

type PanelVersionViewProps = {
  selectedVersion?: string;
  selectedVersionID?: number;
  options: SelectOption[];
  onRetrieveVersion?: (version: number) => void;
};

const PanelVersionView = ({
  selectedVersion,
  selectedVersionID,
  onRetrieveVersion,
  options,
}: PanelVersionViewProps) => {
  return (
    <div className="flex w-full items-end justify-between">
      <HeaderVersion version={selectedVersion} />

      <SelectVersion
        label="Version"
        containerClassName="items-end"
        options={options}
        disabled
        value={selectedVersion}
        selectedVersionID={selectedVersionID}
        onRetrieveVersion={onRetrieveVersion}
      />
    </div>
  );
};

export default PanelVersionView;

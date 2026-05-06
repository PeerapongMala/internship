import CWInputSearch from '@component/web/cw-input-search';
import CWSelect from '@component/web/cw-select';
import { ChangeEvent } from 'react';

interface CWSearchSelectProps {
  value?: string;
  _key: string;
  onSearchChange(e: ChangeEvent<HTMLInputElement>): void;
  onSelectChange(e: ChangeEvent<HTMLInputElement>): void;
  options: { label: string; value: string }[];
}

const CWSearchSelect: React.FC<CWSearchSelectProps> = (props) => {
  return (
    <div className="flex">
      <CWInputSearch
        className="flex-1 !rounded-e-none *:!w-full"
        placeholder={'ค้นหา'}
        value={props.value}
        onChange={(e) => {
          props.onSearchChange(e);
        }}
      />
      <CWSelect
        className="shrink-0 *:min-w-32 *:!rounded-s-none"
        value={props._key}
        options={props.options}
        onChange={(e) => props.onSelectChange(e)}
      />
    </div>
  );
};

export default CWSearchSelect;

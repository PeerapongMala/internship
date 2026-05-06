import CWALoadingOverlay from '@component/web/atom/cw-a-loading-overlay';

import ProgressSelectTemplate from '../cw-o-select-with-data';
import { useLoadingApiStore } from '@store/useLoadingApiStore';

// Define the shape of a single item in the progressData array
type ProgressDataItem = {
  filterOptions: { id: string; name: string }[];
  averageProgress: number;
};

// Define the props for our new component
type ProgressSelectorGroupProps = {
  scopeList: string[];
  scopeNameList: string[];
  selectedValues: string[];
  progressData: ProgressDataItem[];
  onSelectorChange: (index: number, value: string) => void;
};

const ProgressSelectorGroup = ({
  scopeList,
  scopeNameList,
  selectedValues,
  progressData,
  onSelectorChange,
}: ProgressSelectorGroupProps) => {
  const loadingApiStore = useLoadingApiStore();

  return (
    <div className="flex flex-row gap-5">
      {scopeList.map((_, index) => (
        <div
          key={index}
          className="relative w-1/3 gap-5 rounded-md border bg-white px-3 pb-5 shadow-md"
        >
          <CWALoadingOverlay visible={loadingApiStore.apiLoadingList.length > 0} />
          <ProgressSelectTemplate
            title={`เลือก${scopeNameList[index]} (ทั้งหมด ${progressData[index].filterOptions.length} เขต)`}
            selectValue={selectedValues[index]}
            options={progressData[index].filterOptions.map((option) => ({
              value: option.id,
              label: index === 0 ? `เขตตรวจ ${option.name}` : option.name,
            }))}
            progressValue={progressData[index].averageProgress}
            onChange={(e) => onSelectorChange(index, e.target.value)}
          />
        </div>
      ))}
    </div>
  );
};

export default ProgressSelectorGroup;

import CWWhiteBox from '@component/web/cw-white-box';
import { useRef, useState } from 'react';
import DataTable from '../../organism/cw-o-data-table';
import DropdownYearList from '../../molecule/cw-m-dropdown-year-list';
import { TEvaluationFormGetListFilter } from '@domain/g06/g06-d02/local/types/grade';
import SearchBox from '../../molecule/cw-m-search-box';
import TabStatusFilter from '../../organism/cw-o-tab-status-filter';
import CWButton from '@component/web/cw-button';
import IconPlus from '@core/design-system/library/component/icon/IconPlus';
import { useNavigate } from '@tanstack/react-router';
import BulkEditOrganism from '../../organism/cw-o-bulk-edit';
import CsvDownload from '../../organism/cw-o-csv-download';
import CsvUpload from '../../organism/cw-o-csv-upload';

type EvaluatePanelProps = {
  schoolID: string;
};

const EvaluatePanel = ({ schoolID }: EvaluatePanelProps) => {
  const [filterSearch, setFilterSearch] = useState<TEvaluationFormGetListFilter>({});
  const [bulkEditLists, setBulkEditList] = useState<number[]>([]);

  const dataTableRef = useRef<{
    fetchEvaluationList: (controller?: AbortController) => void;
  }>(null);

  const navigate = useNavigate();

  return (
    <CWWhiteBox className="flex flex-col gap-5">
      <div className="col-span-6 flex w-full items-center justify-between">
        <div className="flex flex-row gap-[10px]">
          <BulkEditOrganism
            disabled={bulkEditLists.length == 0}
            className="h-9 px-2 py-[9px]"
            updateItemIDLists={bulkEditLists}
            onSuccess={async () => {
              setBulkEditList([]);
              dataTableRef?.current?.fetchEvaluationList();
            }}
          />

          <svg className="h-full bg-slate-300" width={2} height={38}>
            <path d="M1 0V38" stroke="#D4D4D4" />
          </svg>

          <CWButton
            className="!h-9 !gap-1 p-2 !px-2"
            variant={'primary'}
            title={'สร้างใบประเมิน'}
            onClick={(): void => {
              navigate({ to: `/grade-system/evaluation/create` });
            }}
            disabled={false}
            icon={<IconPlus />}
          />
          <SearchBox
            onSubmit={(v) => setFilterSearch((prev) => ({ ...prev, search: v }))}
          />
        </div>

        <div className="flex flex-row gap-[10px]">
          <CsvDownload schoolID={schoolID} />

          <CsvUpload schoolID={schoolID} />
        </div>
      </div>

      <DropdownYearList
        value={filterSearch.year ?? ''}
        onChange={(v) => setFilterSearch((prev) => ({ ...prev, year: v }))}
      />

      <TabStatusFilter
        onSelectFilter={(filter) =>
          setFilterSearch((prev) => ({ ...prev, status: filter }))
        }
      />

      <DataTable
        ref={dataTableRef}
        filterSearch={filterSearch}
        schoolID={schoolID}
        checkedLists={bulkEditLists}
        onToggleCheckBox={(lists: number[], isChecked: boolean) => {
          setBulkEditList((prev) => {
            if (isChecked) {
              // Add items to bulkEditList (avoiding duplicates)
              return [...new Set([...prev, ...lists])];
            } else {
              // Remove items from bulkEditList
              return prev.filter((id) => !lists.includes(id));
            }
          });
        }}
      />
    </CWWhiteBox>
  );
};

export default EvaluatePanel;

import { SelectOption } from '@component/web/cw-select';
import API from '@domain/g06/g06-d03/local/api';
import { IGetHistoryDropdown } from '@domain/g06/g06-d03/local/type';
import { ESortOrder } from '@global/enums';
import { TPaginationReq } from '@global/types/api';
import { PaginationAPIResponse } from '@global/utils/apiResponseHelper';
import dayjs from '@global/utils/dayjs';
import showMessage from '@global/utils/showMessage';
import { useState } from 'react';

export default function useFetchHistoryOptions() {
  const [historyOptions, setHistoryOptions] = useState<SelectOption[]>([]);
  const [fetching, setFetching] = useState(false);

  const fetchData = async (
    sheetID: number,
    options?: TPaginationReq & { filterVersion?: string },
  ) => {
    setFetching(true);

    let res: PaginationAPIResponse<IGetHistoryDropdown>;
    try {
      res = await API.dropdown.GetHistoryList(sheetID, {
        ...options,
        sort_order: ESortOrder.DESC,
        sort_by: 'version',
      });
    } catch (error) {
      showMessage('พบปัญหาในการเรียกข้อมูลกับเซิร์ฟเวอร์', 'error');
      throw error;
    } finally {
      setFetching(false);
    }

    if (res.status_code == 200) {
      let optionsLists: SelectOption[] = res.data.map((data) => {
        return {
          label: `${data.version} (${dayjs(data.updated_at).format('DD/MM/BBBB HH:mm')})`,
          value: data.version,
        } as SelectOption;
      });

      if (options?.filterVersion) {
        optionsLists = optionsLists.filter((item) => item.value != options.filterVersion);
      }

      setHistoryOptions(optionsLists);
      return;
    }

    showMessage(res.message || 'พบปัญหาในการเรียกข้อมูลกับเซิร์ฟเวอร์', 'error');
  };

  return {
    fetchHistoryOptions: fetchData,
    isHistoryOptionsFetching: fetching,
    historyOptions,
  };
}

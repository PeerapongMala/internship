import API from '@domain/g06/g06-d03/local/api';
import { IGetSheetCompare } from '@domain/g06/g06-d03/local/type';
import { rankStudents } from '@domain/g06/g06-d03/local/utils/score';
import { TBaseResponse } from '@global/types/api';
import showMessage from '@global/utils/showMessage';
import { useState } from 'react';

export default function useFetchComparedVersion() {
  const [data, setData] = useState<IGetSheetCompare>();
  const [fetching, setFetching] = useState(false);

  const fetchData = async (
    sheetId: number,
    versionLeft: string,
    versionRight: string,
  ) => {
    setFetching(true);
    let res: TBaseResponse<IGetSheetCompare>;
    try {
      res = await API.sheet.GetHistoryCompare(sheetId, versionLeft, versionRight);
    } catch (error) {
      showMessage('พบปัญหาในการเรียกค่ากับเซิร์ฟเวอร์', 'error');
      throw error;
    } finally {
      setFetching(false);
    }

    if (res.status_code == 200) {
      const rankedData: IGetSheetCompare = {
        version_left: {
          ...res.data.version_left,
          json_student_score_data: rankStudents(
            res.data.version_left.json_student_score_data,
          ),
        },
        version_right: {
          ...res.data.version_right,
          json_student_score_data: rankStudents(
            res.data.version_right.json_student_score_data,
          ),
        },
      };

      setData(rankedData);

      return;
    }
    showMessage('พบปัญหาในการเรียกค่ากับเซิร์ฟเวอร์', 'error');
  };

  const clear = () => {
    setData(undefined);
  };

  return {
    historyCompareData: data,
    fetchHistoryCompare: fetchData,
    isFetchingHistoryCompare: fetching,
    clearHistoryCompareData: clear,
  };
}

import API from '@domain/g06/g06-d03/local/api';
import { TGetSheetDataOptions } from '@domain/g06/g06-d03/local/api/helpers/sheet';
import { IGetSheetDetail, IUpdateSheetRequest } from '@domain/g06/g06-d03/local/type';
import { processSubjectScoreData } from '@domain/g06/g06-d03/local/utils/sheet-score/subject-data';
import showMessage from '@global/utils/showMessage';
import { useState } from 'react';

const useFetchSheetData = () => {
  const [sheetDetail, setSheetDetail] = useState<IGetSheetDetail>();
  const [scoreData, setScoreData] = useState<IUpdateSheetRequest>();
  const [isFetching, setIsFetching] = useState(true);

  const fetchData = async (sheetId: number, options: TGetSheetDataOptions) => {
    setIsFetching(true);
    try {
      const res = await API.sheet.GetSheet(sheetId, options);

      if (res.status_code === 200 && res.data?.subject_data) {
        const processedData = processSubjectScoreData(res.data, {
          disableGameScoreMap: true,
        });
        setSheetDetail(res.data);
        setScoreData({
          id: Number(sheetId),
          start_edit_at: '',
          json_student_score_data: processedData,
        });
      } else {
        showMessage(res.message || 'พบปัญหาในการเรียกข้อมูลจากเซิร์ฟเวอร์', 'error');
      }
    } catch (error) {
      console.error('Failed to fetch sheet version:', error);
      showMessage('พบปัญหาในการเรียกข้อมูลจากเซิร์ฟเวอร์', 'error');
    } finally {
      setIsFetching(false);
    }
  };
  return {
    sheetDetail,
    setSheetDetail,
    scoreData,
    setScoreData,
    isFetchingSheetData: isFetching,
    fetchSheetData: fetchData,
  };
};

export default useFetchSheetData;

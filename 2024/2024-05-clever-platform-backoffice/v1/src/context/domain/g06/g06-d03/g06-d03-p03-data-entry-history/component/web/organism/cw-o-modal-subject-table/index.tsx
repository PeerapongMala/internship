import { useEffect, useState } from 'react';
import CWModalCustom from '@component/web/cw-modal/cw-modal-custom';
import SubjectDataTable from '@domain/g06/g06-d03/local/component/web/organism/cw-o-table-subject-data';
import useFetchSheetData from './hooks/useFetchSheetData';
import useUpdateSheetData from './hooks/useUpdateSheetData';
import { EEvaluationSheetStatus } from '@domain/g06/g06-d02/local/enums/evaluation';
import PanelVersionAction from '../cw-o-panel-version-action';
import useFetchHistoryOptions from './hooks/useFetchHistoryOptions';
import useFetchComparedVersion from './hooks/useFetchComparedVersion';
import useUpdateRetrieveVersion from './hooks/useFetchRetieveVersion';
import PanelVersionView from '../cw-o-panel-version-view';
import { ESortOrder } from '@global/enums';
import useModal from '@global/utils/useModal';
import showMessage from '@global/utils/showMessage';

type ModalSubjectTableProps = {
  sheetId: number;
  isOpen: boolean;
  onClose: () => void;
  version: string;
  viewOnly?: boolean;
  onSaveToNewVersionSuccess?: () => void;
  onRetrieveVersionSuccess?: () => void;
};

const ModalSubjectTable = ({
  sheetId,
  isOpen,
  onClose,
  version,
  viewOnly,
  onSaveToNewVersionSuccess,
  onRetrieveVersionSuccess,
}: ModalSubjectTableProps) => {
  const modalConfirm = useModal();
  const [selectedRetrieveVersionID, setSelectedRetrieveVersionID] = useState<
    number | null
  >(null);

  const { sheetDetail, scoreData, isFetchingSheetData, fetchSheetData } =
    useFetchSheetData();
  const comparedData = useFetchComparedVersion();
  const retrieveVersion = useUpdateRetrieveVersion();

  const [selectedVersionCompare, setSelectedVersionCompared] = useState(version);

  useEffect(() => {
    if (viewOnly) return;

    if (!selectedVersionCompare || !sheetDetail?.version) {
      comparedData.clearHistoryCompareData();
      return;
    }

    comparedData.fetchHistoryCompare(
      sheetId,
      sheetDetail?.version,
      selectedVersionCompare,
    );
  }, [sheetDetail?.version, selectedVersionCompare]);

  const { fetchUpdateSheetData, isFetchUpdateSheetData } = useUpdateSheetData();
  const { historyOptions, fetchHistoryOptions, isHistoryOptionsFetching } =
    useFetchHistoryOptions();

  useEffect(() => {
    if (!isOpen) {
      comparedData.clearHistoryCompareData();
    }

    fetchSheetData(sheetId, {
      no_student_lesson_score: true,
      version: viewOnly ? version : undefined, // fetch current version when compare data
    });
    fetchHistoryOptions(sheetId, { limit: 1, sort_order: ESortOrder.DESC });

    return;
  }, [isOpen]);

  const handleSaveToNewVersion = async () => {
    if (sheetDetail?.json_student_score_data) {
      await fetchUpdateSheetData({
        id: sheetId,
        start_edit_at: new Date().toISOString(),
        json_student_score_data:
          comparedData.historyCompareData?.version_right?.json_student_score_data ?? [],
        status: EEvaluationSheetStatus.ENABLED,
        additional_data: null as any,
      });

      onSaveToNewVersionSuccess?.();
      onClose();
    }
  };

  const handleRetrieveVersionConfirm = (retrieveVersionID: number) => {
    setSelectedRetrieveVersionID(retrieveVersionID);
    modalConfirm.open();
  };
  const handleRetrieveVersion = async (retrieveVersionID: number) => {
    modalConfirm.close();
    await retrieveVersion.fetch(sheetId, retrieveVersionID);
    onClose();
    onRetrieveVersionSuccess?.();
  };

  return (
    <>
      <CWModalCustom
        title="ประวัติ"
        className="w-full max-w-[80%]"
        containerClassName="h-[60vh]"
        open={isOpen}
        disableOk={isFetchUpdateSheetData}
        onOk={handleSaveToNewVersion}
        onClose={onClose}
        buttonName={'บันทึกเป็น Version ใหม่'}
        cancelButtonName={'ยกเลิก'}
        loading={
          isFetchingSheetData ||
          isHistoryOptionsFetching ||
          comparedData.isFetchingHistoryCompare ||
          retrieveVersion.fetching
        }
      >
        {viewOnly ? (
          <PanelVersionView
            selectedVersion={sheetDetail?.version}
            selectedVersionID={sheetDetail?.id}
            options={historyOptions}
            onRetrieveVersion={handleRetrieveVersionConfirm}
          />
        ) : (
          <>
            <PanelVersionAction
              sheetDetail={sheetDetail}
              historyOptions={historyOptions}
              selectedVersionCompare={selectedVersionCompare}
              onSelectedVersionComparedChange={setSelectedVersionCompared}
              comparedData={comparedData.historyCompareData}
              onRetrieveVersion={handleRetrieveVersionConfirm}
            />

            <span className="text-red-600">
              *เมื่อกดเรียกคืนเวอร์ชั่นนี้ ระบบจะยังไม่บันทึกเป็นเวอร์ชั่นใหม่
              โปรดตรวจทานให้มั่นใจและทำการบันทึกจากหน้าหลัก
            </span>
          </>
        )}

        {sheetDetail && scoreData && (
          <SubjectDataTable
            viewOnly
            compareData={
              comparedData.historyCompareData?.version_right?.json_student_score_data
            }
            advanceMode={false}
            editMode={false}
            sheetDetail={sheetDetail}
            studentScoreData={scoreData}
            onIndicatorChange={() => {}}
            onInputScoreChange={() => {}}
          />
        )}
      </CWModalCustom>

      <CWModalCustom
        loading={retrieveVersion.fetching}
        open={modalConfirm.isOpen}
        onClose={() => {
          modalConfirm.close();
          setSelectedRetrieveVersionID(null);
        }}
        onOk={() => {
          if (!selectedRetrieveVersionID) {
            showMessage('ยังไม่ได้เลือกเวอร์ชั่นเพื่อทำการเรียกคืน', 'warning');
            return;
          }
          handleRetrieveVersion(selectedRetrieveVersionID);
        }}
        title="ยืนยันการเรียกคืน version"
        buttonName="ยืนยัน"
        cancelButtonName="ยกเลิก"
      >
        คุณยืนยันที่จะทำการเรียกคืน version นี้ใช่หรือไม่
      </CWModalCustom>
    </>
  );
};

export default ModalSubjectTable;

import CWInput from '@component/web/cw-input';
import CWModalCustom from '@component/web/cw-modal/cw-modal-custom';
import API from '@domain/g06/g06-d07/local/api';
import { TBaseErrorResponse } from '@domain/g06/g06-d02/local/types';
import showMessage from '@global/utils/showMessage';
import useModal from '@global/utils/useModal';
import { AxiosError } from 'axios';
import { useRef, useState } from 'react';
import ModalAcademicYear from '@domain/g03/g03-d04/g03-d04-p01-game-statistic/component/organism/ModalAcademicYear';
import { getUserData } from '@global/utils/store/getUserData';
import CWModalAcademicYearRange from '@component/web/cw-modal/cw-modal-academicyear-range';

type ModalUploadStudentsProps = {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess?: () => void;
};

const ModalUploadStudents = ({
  isOpen,
  onClose,
  onUploadSuccess,
}: ModalUploadStudentsProps) => {
  const refUpload = useRef<HTMLInputElement>(null);
  const acceptedFileTypes = ['text/csv'];
  const [academicYear, setAcademicYear] = useState<number>();

  const userData = getUserData();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    //  No file selected
    if (!files || files.length === 0) {
      return;
    }

    const selectedFile = files[0];

    //  Check if the selected file type is supported
    const isFileTypeSupported =
      acceptedFileTypes.includes(selectedFile.type) ||
      acceptedFileTypes.some((type) => selectedFile.name.toLowerCase().endsWith(type));

    if (!isFileTypeSupported) {
      showMessage('กรุณาอัปโหลดไฟล์ CSV', 'warning');
      event.target.value = '';
      return;
    }

    if (!academicYear || academicYear === 0) {
      showMessage('กรุณาระบุปีการศึกษา', 'warning');
      event.target.value = '';
      return;
    }

    handleUploadFile(academicYear, selectedFile);
    event.target.value = '';
  };

  const handleUploadFile = async (academicYear: number, file: File) => {
    try {
      const response = await API.GradeSetting.UploadStudentInformation({
        academic_year: academicYear,
        csv_file: file,
      });

      showMessage(response.data.message);
      onClose();
      onUploadSuccess?.();
    } catch (error) {
      const err = error as AxiosError<TBaseErrorResponse>;

      if (err.response?.data.message) {
        showMessage(err.response.data.message, 'error');
        throw error;
      }

      showMessage((error as Error).message, 'error');
      throw error;
    }
  };
  return (
    <>
      <CWModalAcademicYearRange
        description="ผู้ใช้งานจำเป็นต้องเลือกปีการศึกษาก่อนอัปโหลดไฟล์"
        schoolId={Number(userData.school_id)}
        open={isOpen}
        onClose={() => {
          onClose();
        }}
        setSelectedValueDateRange={(value) => {
          const academicYear = Number(value?.name);
          if (isNaN(academicYear)) {
            return;
          }
          setAcademicYear(academicYear);
          refUpload?.current?.click();
        }}
        deleteMode={false}
        createMode={false}
      />

      <input
        hidden
        type="file"
        ref={refUpload}
        accept={acceptedFileTypes.join(', ')}
        onChange={handleFileChange}
      />
    </>
  );
};

export default ModalUploadStudents;

import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from '@tanstack/react-router';
import {
  Modal,
  ModalProps,
} from '@core/design-system/library/vristo/source/components/Modal';

import CWInput from '@component/web/cw-input';
import API from '../../../api';
import { SubCriteria, SubStandard } from '../../../type';
import showMessage from '@global/utils/showMessage';

interface ModalEditProps extends ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  sub_standard_id?: number | null;
  curriculumId?: number;
  data: string;
  setData?: (value: string) => void;
}

const ModalEdit = ({
  open,
  onClose,
  children,
  onOk,
  title,
  sub_standard_id,
  curriculumId,
  data,
  setData,
  ...rest
}: ModalEditProps) => {
  const [inputValue, setInputValue] = useState(data);
  const [subStandardData, setSubStandardData] = useState<SubCriteria[]>([]);
  const [currentSubStandard, setCurrentSubStandard] = useState<SubCriteria | null>(null);

  useEffect(() => {
    setInputValue(data);
  }, [data]);

  useEffect(() => {
    fetchSubStandard();
  }, [curriculumId, sub_standard_id]);

  const fetchSubStandard = () => {
    API.SubStandard.GetBySubStandard(Number(curriculumId), {})
      .then((res) => {
        if (res.status_code === 200) {
          const foundSubStandard = res.data.find(
            (item: any) => item.index === sub_standard_id,
          );
          setCurrentSubStandard(foundSubStandard || null);
        } else {
          console.log(res.message);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };

  const handleChangeName = () => {
    API.SubStandard.UpdateSubStandard(Number(sub_standard_id), {
      curriculum_group_id: Number(curriculumId),
      name: inputValue,
    })
      .then((res) => {
        if (res.status_code === 200) {
          showMessage('แก้ไขชื่อสำเร็จ');
          fetchSubStandard();
          onClose();
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };

  return (
    <Modal
      className="h-auto w-[400px]"
      open={open}
      onClose={onClose}
      onOk={onOk}
      disableCancel
      disableOk
      title={title}
      {...rest}
    >
      <div className="w-full">
        <div className="flex flex-col gap-4">
          <CWInput
            label={`ชื่อมาตรฐาน ${sub_standard_id ?? ''}:`}
            onChange={(e) => setInputValue(e.target.value)}
            value={`${currentSubStandard?.name}`}
          />
        </div>

        <div className="flex w-full justify-between gap-5 px-5 py-5">
          <button onClick={onClose} className="btn btn-outline-dark flex w-full gap-2">
            ยกเลิก
          </button>
          <button
            onClick={handleChangeName}
            className="btn btn-primary flex w-full gap-1"
          >
            {' '}
            บันทึก
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalEdit;

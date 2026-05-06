import { useState, useEffect, useMemo, SetStateAction } from 'react';
import { Link, useNavigate, useParams } from '@tanstack/react-router';
import Modal, { ModalProps } from '@global/component/web/cw-modal/Modal';
import CWSelect from '@component/web/cw-select';
import IconEye from '@core/design-system/library/component/icon/IconEye';
import IconPlus from '@core/design-system/library/component/icon/IconPlus';
import { toDateTimeTH } from '@global/utils/date';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import { SpecialReward, SpecialRewardInside, Status } from '../../../type';
import CWInput from '@component/web/cw-input';
import showMessage from '@global/utils/showMessage';
import API from '../../../api';

interface ModalEditAmount extends ModalProps {
  open: boolean;
  onClose: () => void;
  levelId: number;
  selectedData?: SpecialRewardInside[];
  onSuccess?: () => void;
}

const CWModalEditAmount = ({
  open,
  onClose,
  onOk,
  levelId,
  selectedData,
  onSuccess,
  ...rest
}: ModalEditAmount) => {
  const rewardData = selectedData ? selectedData[0] : null;
  const [fetching, setFetching] = useState<boolean>(false);
  const [amount, setAmount] = useState<number>(rewardData?.amount || 0);
  useEffect(() => {
    if (selectedData && selectedData[0]) {
      setAmount(selectedData[0]?.amount || 0);
    }
  }, [selectedData]);

  const handleAddItem = async () => {
    if (amount <= 0) {
      showMessage('กรุณากรอกจำนวน', 'error');
      return;
    }
    if (!rewardData?.id) {
      showMessage('ไม่พบข้อมูลไอเทม', 'error');
      return;
    }
    setFetching(true);
    try {
      const res = await API.gamification.EditItem(
        Number(levelId),
        Number(rewardData?.id),
        amount,
      );
      if (res.status_code === 200) {
        showMessage('แก้ไขไอเทมสำเร็จ', 'success');
        setTimeout(() => {
          onSuccess?.();
          onClose();
        }, 1500);
      }
    } catch (error: any) {
      showMessage(error?.message || 'เกิดข้อผิดพลาด', 'error');
    } finally {
      setFetching(false);
    }
  };

  return (
    <Modal
      className="w-[800px]"
      open={open}
      onClose={onClose}
      onOk={onOk}
      disableCancel
      disableOk
      title="แก้ไขจำนวน"
      {...rest}
    >
      <div className="h-auto w-full">
        <div className="mb-5 flex w-full gap-5">
          <CWInput
            label="จำนวน"
            required
            value={amount}
            className="w-[50%]"
            onChange={(e) => setAmount(Number(e.target.value))}
          />
        </div>
        <hr />
        <div className="mt-5 h-[100px] w-full">
          <div className="flex justify-evenly rounded-md border-[1px] px-5 py-2">
            <p>ID: {rewardData?.id}</p>
            <img
              src={rewardData?.image_url || '/default-image.png'}
              alt="Item"
              className="size-6"
            />
            <p>{rewardData?.name}</p>
            <p>{rewardData?.description}</p>
          </div>
        </div>

        <div className="absolute bottom-5 left-0 mt-5 flex w-full justify-between gap-5 px-5">
          <button
            onClick={onClose}
            className="btn btn-outline-primary flex w-[150px] gap-2"
          >
            ย้อนกลับ
          </button>
          <button
            onClick={handleAddItem}
            className="btn btn-primary flex w-[150px] gap-2"
            disabled={fetching}
          >
            {fetching ? 'กำลังบันทึก...' : 'บันทึก'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CWModalEditAmount;

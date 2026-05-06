import IconPencil from '@core/design-system/library/vristo/source/components/Icon/IconPencil';
import { useState } from 'react';
import ModalQuestionOrder from './ModalQuestionOrder';

const HeaderForm = () => {
  const [open, setOpen] = useState(false);

  const onClose = () => {
    setOpen(false);
  };

  const onOk = () => {
    setOpen(false);
  };

  const mockData = [
    {
      label: 'ID : 00001, กานดาได้รับเงินเดือนเดือนละ 20,000 บาท',
      index: 1,
      disabledUp: true,
    },
    { label: 'ID : 00002, กานดาได้รับเงินเดือนเดือนละ 30,000 บาท', index: 2 },
    {
      label: 'ID : 00003, กานดาได้รับเงินเดือนเดือนละ 40,000 บาท',
      index: 3,
      disabledDown: true,
    },
  ];
  return (
    <>
      <ModalQuestionOrder open={open} onClose={onClose} onOk={onOk} data={mockData} />
      <button className="btn btn-primary flex w-44 gap-2">
        <IconPencil /> เพิ่มคำถาม
      </button>
      <button className="btn btn-outline-primary w-44" onClick={() => setOpen(true)}>
        เรียงลำดับคำถาม
      </button>
    </>
  );
};

export default HeaderForm;

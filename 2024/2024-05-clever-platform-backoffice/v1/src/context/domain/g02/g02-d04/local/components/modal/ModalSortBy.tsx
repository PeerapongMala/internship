import React, { useEffect } from 'react';
import IconArrowLeft from '@core/design-system/library/vristo/source/components/Icon/IconArrowLeft';
import IconPlus from '@core/design-system/library/vristo/source/components/Icon/IconPlus';
import { Modal } from '@core/design-system/library/vristo/source/components/Modal';
import { cn } from '@core/design-system/library/vristo/source/utils/cn';

const ModalSortBy = ({
  open,
  onClose,
  onOk,
  onClickAddQuestion,
  data,
  setData,
  enbledAddQuestion,
  title,
  prefix,
  swapIndex,
}: {
  open: boolean;
  onClose: () => void;
  onOk: () => void;
  onClickAddQuestion?: () => void;
  data: {
    label: string;
    index: number;
    disabledUp?: boolean;
    disabledDown?: boolean;
  }[];
  setData: (data: any) => void;
  enbledAddQuestion?: boolean;
  title?: string;
  prefix?: string;
  swapIndex?: any;
}) => {
  useEffect(() => {
    setData(updateDisabledProperties(data));
  }, [data, setData]);

  const updateDisabledProperties = (list: any[]) => {
    return list.map((item: any, index: number) => ({
      ...item,
      disabledUp: index === 0,
      disabledDown: index === list.length - 1,
    }));
  };

  const handleClickUp = (index: number) => {
    swapIndex(index, 'up');
  };

  const handleClickDown = (index: number) => {
    swapIndex(index, 'down');
  };

  const classNameDisabled = 'pointer-events-none opacity-20';

  return (
    <Modal
      className="w-[40rem]"
      open={open}
      onClose={onClose}
      onOk={onOk}
      disableCancel
      disableOk
      title={title || 'จัดการคำถาม'}
    >
      <div className="flex flex-col gap-4">
        {enbledAddQuestion && (
          <button
            className="btn btn-primary w-full"
            type="button"
            onClick={onClickAddQuestion}
          >
            <IconPlus />
            เพิ่มคำถาม
          </button>
        )}
        <div className="grid grid-cols-[10%_90%] items-center gap-2 pt-2">
          {data.map((item, index) => (
            <React.Fragment key={index}>
              <div>
                {prefix || '#'}
                {item.index}
              </div>
              <div className="form-input flex h-10 w-full items-center justify-between">
                <div className="truncate font-normal">{item.label}</div>
                <div className="flex gap-2">
                  <div
                    className={cn('cursor-pointer', item.disabledUp && classNameDisabled)}
                    onClick={() => handleClickUp(index)}
                  >
                    <IconArrowLeft className="h-6 w-6 -rotate-90" />
                  </div>
                  <div
                    className={cn(
                      'cursor-pointer',
                      item.disabledDown && classNameDisabled,
                    )}
                    onClick={() => handleClickDown(index)}
                  >
                    <IconArrowLeft className="h-6 w-6 rotate-90" />
                  </div>
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
        <div className="flex gap-4">
          <button className="btn btn-outline-primary w-full" onClick={onClose}>
            ยกเลิก
          </button>
          <button className="btn btn-primary w-full" onClick={onOk}>
            บันทึก
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalSortBy;

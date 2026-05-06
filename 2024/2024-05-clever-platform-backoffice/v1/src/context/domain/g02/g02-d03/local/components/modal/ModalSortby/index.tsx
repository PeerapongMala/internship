import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalProps,
} from '@core/design-system/library/vristo/source/components/Modal';
import IconArrowUpward from '@core/design-system/library/component/icon/IconArrowUpward';
import IconArrowDownward from '@core/design-system/library/component/icon/IconArrowDownward';

export interface SortItem {
  id: number;
  label: string;
  index: number;
}

// Use Omit to remove the onOk property from ModalProps and then add your own
interface ModalSortByProps extends Omit<ModalProps, 'onOk'> {
  open: boolean;
  items?: SortItem[];
  onClose: () => void;
  onOk?: (sortedItems: SortItem[]) => void;
}

const ModalSortBy: React.FC<ModalSortByProps> = ({
  open,
  items = [],
  onClose,
  onOk,
  ...rest
}) => {
  // Local state for sorted items
  const [sortedItems, setSortedItems] = useState<SortItem[]>([]);

  useEffect(() => {
    if (items && items.length > 0) {
      // Sort items by their index property
      const sorted = [...items].sort((a, b) => a.index - b.index);
      setSortedItems(sorted);
    }
  }, [items]);

  // Swap item with the one above it
  const moveItemUp = (idx: number) => {
    if (idx === 0) return;
    setSortedItems((prev) => {
      const newItems = [...prev];
      [newItems[idx - 1], newItems[idx]] = [newItems[idx], newItems[idx - 1]];
      return newItems;
    });
  };

  // Swap item with the one below it
  const moveItemDown = (idx: number) => {
    if (idx === sortedItems.length - 1) return;
    setSortedItems((prev) => {
      const newItems = [...prev];
      [newItems[idx], newItems[idx + 1]] = [newItems[idx + 1], newItems[idx]];
      return newItems;
    });
  };

  const handleOk = () => {
    if (onOk) {
      onOk(sortedItems);
    }
  };

  return (
    <Modal
      className="h-[400px] w-[400px]"
      open={open}
      onClose={onClose}
      onOk={handleOk}
      disableCancel={false}
      disableOk={false}
      title="เรียงลำดับบทเรียนหลัก"
      {...rest}
    >
      <div className="flex w-full flex-col">
        <div className="h-[250px] overflow-y-scroll">
          {sortedItems.map((item, idx) => (
            <div key={item.id} className="flex flex-row items-center gap-5">
              <div className="">
                <span className="text-[14px]">บทที่ {idx + 1}</span>
              </div>
              <div className="flex w-full flex-1 items-center justify-between rounded-md p-2">
                <span className="text-[14px]">
                  {`ID : ${item.id.toString().padStart(5, '0')} / ${item.label}`}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    className=""
                    onClick={() => moveItemUp(idx)}
                    disabled={idx === 0}
                  >
                    <IconArrowUpward className="h-6 w-6" />
                  </button>
                  <button
                    className="p-1"
                    onClick={() => moveItemDown(idx)}
                    disabled={idx === sortedItems.length - 1}
                  >
                    <IconArrowDownward className="h-6 w-6" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex w-full justify-between gap-5 py-5">
          <button onClick={onClose} className="btn btn-outline-primary flex w-full gap-2">
            ยกเลิก
          </button>
          <button onClick={handleOk} className="btn btn-primary flex w-full gap-2">
            เลือก
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalSortBy;

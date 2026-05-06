import { useState } from 'react';

import Modal, { ModalProps } from '../Modal';

interface CWModalSelectProps extends ModalProps {
  title: string;
  label: string;
  open: boolean;
  onClose: () => void;
  onSelect: (selected: string) => void;
  optionsList: { id: number; name: string }[];
}

const CWModalSelect = ({
  title,
  label,
  open,
  onClose,
  onSelect,
  optionsList,
  ...rest
}: CWModalSelectProps) => {
  const [selectedOption, setSelectedOption] = useState<string>('');

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(e.target.value);
  };

  return (
    <Modal
      className="h-auto w-[400px]"
      open={open}
      onClose={onClose}
      title={title}
      {...rest}
    >
      <div className="w-full">
        <div className="flex flex-col gap-2">
          <label className="text-sm">{label}</label>
          <select
            value={selectedOption}
            onChange={handleSelectChange}
            className="w-full rounded-md border px-4 py-2"
          >
            <option value="">เลือก</option>
            {optionsList.map((option: { id: number; name: string }) => (
              <option key={option.id} value={option.name}>
                {option.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex w-full justify-between gap-5 py-5">
          <button onClick={onClose} className="btn btn-outline-dark flex w-full gap-2">
            ยกเลิก
          </button>
          <button
            onClick={() => onSelect(selectedOption)}
            className="btn btn-primary flex w-full gap-1"
            disabled={!selectedOption}
          >
            เปลี่ยน
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CWModalSelect;

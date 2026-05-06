import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { FC, useState, useEffect } from 'react';

interface DropdownSelectorProps {
  placeholder?: string | number;
  options: { label: string; value: string }[];
  onSelect: (selected: string) => void;
  showTop?: boolean;
  disabled?: boolean; // ปิดการใช้งาน dropdown ทั้งหมด
  disabledOptions?: string[]; // ปิดการใช้งานบาง option
  maxHeight?: string;
}

const WCADropdown: FC<DropdownSelectorProps> = ({
  placeholder = 'เลือกตัวเลือก',
  options,
  onSelect,
  showTop = false,
  disabled = false,
  disabledOptions = [],
  maxHeight = '200px',
}) => {
  const [selectedValue, setSelectedValue] = useState<string>('');

  useEffect(() => {
    if (options.length > 0 && !selectedValue) {
      setSelectedValue(options[0].value);
      onSelect(options[0].value);
    }
  }, [options]);

  return (
    <Menu as="div" className="relative inline-block w-full text-left">
      <div>
        <MenuButton
          className={`inline-flex w-full items-center justify-between gap-x-1.5 rounded-md px-4 py-2 text-sm font-normal ring-1 ring-inset ${
            disabled
              ? 'cursor-not-allowed bg-neutral-100 text-gray-400 ring-gray-300'
              : 'bg-white ring-gray-300 hover:ring-gray-400 focus:ring-2 focus:ring-indigo-500 dark:bg-black'
          }`}
          aria-haspopup="true"
          aria-expanded="false"
          disabled={disabled}
        >
          {options.find((opt) => opt.value === selectedValue)?.label || placeholder}
          <ChevronDownIcon aria-hidden="true" className="-mr-1 h-5 w-5 text-gray-400" />
        </MenuButton>
      </div>

      {!disabled && (
        <MenuItems
          as="div"
          className={`absolute right-0 z-10 w-full origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none dark:bg-black ${
            showTop ? 'bottom-full mb-2 origin-bottom-right' : 'mt-2 origin-top-right'
          }`}
        >
          <div className="overflow-y-auto py-1" style={{ maxHeight: maxHeight }}>
            <div className="py-1">
              {options.map((option, index) => (
                <MenuItem key={index} disabled={disabledOptions.includes(option.value)}>
                  {({ active, disabled }) => (
                    <button
                      onClick={() => {
                        if (!disabled) {
                          setSelectedValue(option.value);
                          onSelect(option.value);
                        }
                      }}
                      disabled={disabled}
                      className={`block w-full px-4 py-2 text-left text-sm ${
                        disabled
                          ? 'cursor-not-allowed text-gray-400'
                          : active
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-700'
                      } focus:outline-none`}
                    >
                      {option.label}
                    </button>
                  )}
                </MenuItem>
              ))}
            </div>
          </div>
        </MenuItems>
      )}
    </Menu>
  );
};

export default WCADropdown;

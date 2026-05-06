import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { FC } from 'react';

interface DropdownSelectorProps {
  placeholder: string | number;
  options: string[];
  onSelect: (selected: string) => void;
  showTop?: boolean;
  disabled?: boolean; // ปิดการใช้งาน dropdown ทั้งหมด
  disabledOptions?: string[]; // ปิดการใช้งานบาง option
  error?: string | boolean;
  maxHeight?: string;
  label?: string;
  required?: boolean;
}

const WCADropdown: FC<DropdownSelectorProps> = ({
  placeholder,
  options,
  onSelect,
  showTop = false,
  disabled = false,
  disabledOptions = [],
  error,
  maxHeight = '200px',
  label,
  required = false,
}) => {
  return (
    <div className="w-full">
      <Menu as="div" className="relative inline-block w-full text-left">
        <div>
          {label && (
            <div className="mb-1.5 flex text-sm text-gray-700 dark:text-white">
              {required && <span className="mr-1 text-red-500">*</span>}
              {label}
            </div>
          )}

          <MenuButton
            className={`inline-flex w-full items-center justify-between gap-x-1.5 rounded-md px-4 py-2 text-sm font-normal ring-1 ring-inset ${
              disabled
                ? 'cursor-not-allowed bg-neutral-100 text-gray-400 ring-gray-300'
                : error
                  ? '!border-red-500 !ring-red-500'
                  : 'bg-white ring-gray-300 hover:ring-gray-400 focus:ring-2 focus:ring-indigo-500 dark:bg-black'
            }`}
            aria-haspopup="true"
            aria-expanded="false"
            disabled={disabled}
          >
            {placeholder}
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
                  <MenuItem key={index} disabled={disabledOptions.includes(option)}>
                    {({ active, disabled }) => (
                      <button
                        onClick={() => !disabled && onSelect(option)}
                        disabled={disabled}
                        className={`block w-full px-4 py-2 text-left text-sm ${
                          disabled
                            ? 'cursor-not-allowed text-gray-400'
                            : active
                              ? 'cursor-pointer bg-gray-100 text-gray-900'
                              : 'cursor-pointer text-gray-700'
                        } focus:outline-none`}
                      >
                        {option}
                      </button>
                    )}
                  </MenuItem>
                ))}
              </div>
            </div>
          </MenuItems>
        )}
      </Menu>
    </div>
  );
};

export default WCADropdown;

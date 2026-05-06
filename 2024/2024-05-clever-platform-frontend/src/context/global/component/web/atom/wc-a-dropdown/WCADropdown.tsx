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
}

const WCADropdown: FC<DropdownSelectorProps> = ({
  placeholder,
  options,
  onSelect,
  showTop = false,
  disabled = false,
  disabledOptions = [],
  error,
}) => {
  return (
    <div className="w-full">
      <Menu as="div" className="relative inline-block text-left w-full">
        <div>
          <MenuButton
            className={`inline-flex w-full justify-between items-center gap-x-1.5 rounded-md px-4 py-2 text-sm font-normal ring-1 ring-inset 
              ${
                disabled
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed ring-gray-300'
                  : error
                    ? '!ring-red-500 !border-red-500'
                    : 'bg-white ring-gray-300 hover:ring-gray-400 focus:ring-2 focus:ring-indigo-500'
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
            className={`absolute right-0 z-10 w-full origin-top-right rounded-md bg-white ring-1 ring-black ring-opacity-5 shadow-lg transition focus:outline-none 
              ${
                showTop ? 'origin-bottom-right bottom-full mb-2' : 'origin-top-right mt-2'
              }`}
          >
            <div className="py-1">
              {options.map((option, index) => (
                <MenuItem key={index} disabled={disabledOptions.includes(option)}>
                  {({ active, disabled }) => (
                    <button
                      onClick={() => !disabled && onSelect(option)}
                      disabled={disabled}
                      className={`block w-full px-4 py-2 text-sm text-left 
                        ${
                          disabled
                            ? 'text-gray-400 cursor-not-allowed'
                            : active
                              ? 'bg-gray-100 text-gray-900'
                              : 'text-gray-700'
                        } focus:outline-none`}
                    >
                      {option}
                    </button>
                  )}
                </MenuItem>
              ))}
            </div>
          </MenuItems>
        )}
      </Menu>
    </div>
  );
};

export default WCADropdown;

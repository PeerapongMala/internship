import { Menu } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import React, { FC, useMemo } from 'react';

export interface SelectOption {
  value: any;
  label: string;
}

export type TCWSelectProps = {
  options?: SelectOption[];
  onChange?: (selectedValue: any) => void;
  required?: boolean;
  displayRequired?: boolean;
  defaultValue?: any;
  disabled?: boolean;
  value?: any;
  label?: React.ReactNode;
  className?: string;
  title?: string;
  error?: string | boolean;
  name?: string;
  hideEmptyOption?: boolean;
  placeholderValue?: any;
};

const CWSelect: FC<TCWSelectProps> = ({
  options = [],
  onChange,
  required,
  displayRequired,
  defaultValue,
  disabled = false,
  label,
  title = 'กรุณาเลือก',
  value,
  className = '',
  error,
  hideEmptyOption = false,
  placeholderValue = '',
}) => {
  const selectedLabel = useMemo(() => {
    const selected = options.find((opt) => opt.value === value);
    return selected?.label ?? title;
  }, [options, value, title]);

  const handleSelect = (val: any) => {
    if (onChange) {
      onChange({
        target: { value: val },
        currentTarget: { value: val },
      });
    }
  };

  return (
    <div className={`w-full font-noto-sans-thai ${className}`}>
      {label && (
        <div className="mb-1.5 flex text-sm text-gray-700 dark:text-white">
          {(required || displayRequired) && <span className="text-red-500">*</span>}
          {label}
        </div>
      )}

      <Menu as="div" className="relative w-full">
        {({ open }) => (
          <>
            <Menu.Button
              className={`inline-flex w-full items-center justify-between rounded-md px-4 py-2 text-sm font-normal ring-1 ring-inset ${
                disabled
                  ? 'cursor-not-allowed bg-neutral-100 text-gray-400 ring-gray-300'
                  : error
                    ? '!border-red-500 !ring-red-500'
                    : 'bg-white ring-gray-300 hover:ring-gray-400 focus:ring-2 focus:ring-indigo-500 dark:bg-black'
              }`}
              disabled={disabled}
            >
              {selectedLabel}
              <ChevronDownIcon className="h-5 w-5 text-gray-400" />
            </Menu.Button>

            {!disabled && open && (
              <Menu.Items
                as="div"
                className="absolute z-10 mt-2 w-full rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-black"
              >
                <div className="max-h-60 overflow-y-auto py-1">
                  {!hideEmptyOption && (
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => handleSelect(placeholderValue)}
                          className={`w-full px-4 py-2 text-left text-sm ${
                            active
                              ? 'cursor-pointer bg-gray-100 text-gray-900'
                              : 'cursor-pointer text-gray-700'
                          }`}
                        >
                          {title}
                        </button>
                      )}
                    </Menu.Item>
                  )}
                  {options.map((opt) => (
                    <Menu.Item key={opt.value}>
                      {({ active }) => (
                        <button
                          onClick={() => handleSelect(opt.value)}
                          className={`w-full px-4 py-2 text-left text-sm ${
                            active
                              ? 'cursor-pointer bg-gray-100 text-gray-900'
                              : 'cursor-pointer text-gray-700'
                          }`}
                        >
                          {opt.label}
                        </button>
                      )}
                    </Menu.Item>
                  ))}
                </div>
              </Menu.Items>
            )}
          </>
        )}
      </Menu>
    </div>
  );
};

export default CWSelect;

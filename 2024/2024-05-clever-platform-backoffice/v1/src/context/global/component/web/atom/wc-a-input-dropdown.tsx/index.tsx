import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import IconSearch from '../wc-a-icons/IconSearch';
import { cn } from '@core/design-system/library/vristo/source/utils/cn';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { useState } from 'react';

interface IOption {
  value: string | number;
  label: React.ReactNode;
}

interface WCAInputDropdownProps {
  hideDropdown?: boolean;
  inputPlaceholder?: string;
  inputValue?: string;
  dropdownValue?: string;
  onInputBtnClick?: () => void;
  onInputChange?: (evt: React.ChangeEvent<HTMLInputElement>) => void;
  dropdownPlaceholder?: React.ReactNode;
  dropdownOptions?: IOption[];
  dropdownClassName?: { inner: string; outer: string; option: string };
  onDropdownSelect?: (selected: string | number) => void;
  disabled?: boolean;
}

export default function WCAInputDropdown({
  inputPlaceholder,
  inputValue,
  dropdownValue,
  onInputChange,
  onInputBtnClick,
  dropdownPlaceholder,
  dropdownOptions = [],
  dropdownClassName,
  onDropdownSelect,
  disabled,
  hideDropdown,
}: WCAInputDropdownProps) {
  const [selectedOption, setSelectedOption] = useState<IOption>(
    dropdownOptions.find((opt) => opt.value == dropdownValue) ?? {
      label: '',
      value: '',
    },
  );
  return (
    <div className="dropdown flex h-[38px] flex-row font-noto-sans-thai">
      <div className="relative w-full sm:w-auto">
        <input
          className="form-input w-full !rounded-r-none sm:w-auto"
          value={inputValue}
          onChange={onInputChange}
          placeholder={inputPlaceholder}
          disabled={disabled}
        />
        <button
          type="button"
          className="!absolute right-0 mr-2 h-full focus:outline-none"
          onClick={onInputBtnClick}
        >
          <IconSearch className="!h-5 !w-5" />
        </button>
      </div>
      {!hideDropdown && (
        <Listbox
          as="div"
          value={selectedOption}
          onChange={(option) => {
            setSelectedOption(option);
            if (onDropdownSelect) onDropdownSelect(option.value);
          }}
          className={cn(
            'relative inline-block h-full text-left',
            dropdownClassName?.outer,
          )}
          disabled={disabled}
        >
          <ListboxButton
            className={cn(
              'form-input',
              'relative inline-flex h-full w-fit min-w-[100px] items-center justify-between',
              'rounded-md !rounded-l-none border-l-0 px-4 py-2',
              'bg-white text-sm !font-normal dark:bg-black',
              dropdownClassName?.inner,
            )}
            disabled={disabled}
          >
            <div className="w-full overflow-clip text-left">
              {selectedOption?.label || dropdownPlaceholder}
            </div>
            <ChevronDownIcon
              className="group pointer-events-none -mr-1 h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </ListboxButton>
          {dropdownOptions.length > 0 && (
            <ListboxOptions
              anchor="bottom start"
              className={cn(
                'z-[1000] flex min-w-[100px] flex-col rounded-md py-2',
                'bg-white shadow-lg transition focus:outline-none dark:bg-black',
                'ring-1 ring-black ring-opacity-5',
              )}
            >
              {dropdownOptions.map((option) => (
                <ListboxOption
                  key={option.value}
                  value={option}
                  className={cn(
                    'block w-full cursor-pointer px-4 py-2 text-left text-sm focus:outline-none',
                    'text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900',
                    dropdownClassName?.option,
                  )}
                >
                  {option.label}
                </ListboxOption>
              ))}
            </ListboxOptions>
          )}
        </Listbox>
      )}
    </div>
  );
}

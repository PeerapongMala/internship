import { Menu } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

interface SelectValueProps {
  options: { label: string; value: any }[];
  value: any;
  onChange: (val: any) => void;
  required?: boolean;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
  title?: string;
  label?: string;
}

const CWSelectValue = ({
  options,
  value,
  onChange,
  required,
  className = '',
  disabled = false,
  placeholder = 'กรุณาเลือก',
  title,
  label,
}: SelectValueProps) => {
  const selected = options.find((opt) => opt.value === value);

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="mb-1 block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500"> *</span>}
        </label>
      )}

      <Menu as="div" className="relative w-full">
        <Menu.Button
          className={`w-full cursor-pointer border ${
            disabled ? 'bg-gray-100 text-gray-400' : 'bg-white'
          } focus:ring-primary-500 rounded-md px-3 py-2 text-left text-sm shadow-sm focus:outline-none focus:ring-2 ${
            required && !selected ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={disabled}
        >
          <span className="block truncate">
            {selected ? (
              selected.label
            ) : (
              <span className="text-gray-400">{placeholder}</span>
            )}
          </span>
          <ChevronDownIcon
            className="pointer-events-none absolute right-2 top-2.5 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </Menu.Button>

        <Menu.Items className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          {options.map((option) => (
            <Menu.Item key={option.value}>
              {({ active }) => (
                <button
                  type="button"
                  className={`block w-full px-4 py-2 text-left ${
                    active ? 'bg-primary-100 text-primary-900' : 'text-gray-700'
                  }`}
                  onClick={() => onChange(option.value)}
                >
                  {option.label}
                </button>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Menu>
    </div>
  );
};

export default CWSelectValue;

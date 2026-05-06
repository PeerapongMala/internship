import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

interface ModalSelectorProps {
  placeholder: string;
  options: string[];
}

const ModalSelector: React.FC<ModalSelectorProps> = ({ placeholder, options }) => {
  return (
    <Menu as="div" className="relative inline-block w-full text-left">
      <div>
        <MenuButton className="inline-flex w-full justify-between gap-x-1.5 rounded-md bg-white px-4 py-2 text-sm font-normal ring-1 ring-inset ring-gray-300 dark:bg-black">
          {placeholder}
          <ChevronDownIcon aria-hidden="true" className="-mr-1 h-5 w-5 text-gray-400" />
        </MenuButton>
      </div>

      <MenuItems
        transition
        className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in dark:bg-black"
      >
        <div className="py-1">
          {options.map((option, index) => (
            <MenuItem key={index}>
              <a
                href="#"
                className="block px-4 py-2 text-sm data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
              >
                {option}
              </a>
            </MenuItem>
          ))}
        </div>
      </MenuItems>
    </Menu>
  );
};
export default ModalSelector;

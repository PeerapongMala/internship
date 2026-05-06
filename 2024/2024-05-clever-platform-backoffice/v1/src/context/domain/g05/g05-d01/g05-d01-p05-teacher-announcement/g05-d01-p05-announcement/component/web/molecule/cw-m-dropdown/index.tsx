import Dropdown from '@core/design-system/library/vristo/source/components/Dropdown';

interface CWMDropdownProps {
  label: React.ReactNode;
  className?: string;
  disabled?: boolean;
  items: DropdownItem[];
}

export type DropdownItem = {
  label: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

const CWMDropdown = function (props: CWMDropdownProps) {
  return (
    <div className="dropdown w-full">
      <Dropdown
        button={props.label}
        btnClassName={`w-full btn btn-primary dropdown-toggle !font-bold !px-3 gap-1 ${props.className ?? ''}`}
        placement="bottom-start"
        disabled={props.disabled}
      >
        <ul className="flex flex-col overflow-hidden rounded-md shadow-md">
          {props.items.map((config, index) => (
            <li key={`dropdown-item-${index}`} className="bg-white">
              <button type="button" className="w-full px-4 py-2" onClick={config.onClick}>
                {config.label}
              </button>
            </li>
          ))}
        </ul>
      </Dropdown>
    </div>
  );
};

export default CWMDropdown;

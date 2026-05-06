import { cn } from '@core/design-system/library/vristo/source/utils/cn';

type Tab = {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  activeClassName?: string;
};

type CWSwitchTabButtonProps = {
  tabs: Tab[];
  selectedTab: number | null;
  onSelectTab?: (index: number) => void;
};

const CWSwitchTabButton = ({
  tabs,
  selectedTab,
  onSelectTab,
}: CWSwitchTabButtonProps) => {
  return (
    <div className="flex">
      {tabs.map((tab, i) => (
        <button
          disabled={tab.disabled}
          key={`cw-switch-tab-button-${i}`}
          className={cn(
            'cursor-pointer rounded-sm border border-slate-200 bg-slate-100 px-4 py-1.5 font-normal text-neutral-700',
            i === selectedTab ? 'bg-primary font-bold text-white' : '',
            i === selectedTab && tab.activeClassName ? tab.activeClassName : '',
            tab.disabled && i !== selectedTab ? 'cursor-not-allowed' : '',
          )}
          onClick={() => {
            tab.onClick?.();
            onSelectTab?.(i);
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default CWSwitchTabButton;

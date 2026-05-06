import { createContext, CSSProperties, useContext, useState } from 'react';

type ListContentContext = {
  value?: string;
  setValue?: (value: string) => void;
};

const ListContentContext = createContext<ListContentContext>({});

interface ListContentRootProps {
  children: React.ReactElement[];
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  style?: CSSProperties;
}

export function ListContentRoot({
  children,
  defaultValue,
  onValueChange,
  className,
  style,
}: ListContentRootProps) {
  const [value, setValue] = useState<string | undefined>(defaultValue);
  return (
    <ListContentContext.Provider
      value={{
        value,
        setValue: (x: string) => {
          if (onValueChange) onValueChange(x);
          setValue(x);
        },
      }}
    >
      <div className={`relative w-full h-full overflow-auto ${className}`} style={style}>
        {children}
      </div>
    </ListContentContext.Provider>
  );
}

interface ListContentTriggersProps {
  children: React.ReactElement[];
  className?: string;
  style?: CSSProperties;
}

export function ListContentTriggers({
  children,
  className,
  style,
}: ListContentTriggersProps) {
  return (
    <div className={`relative ${className}`} style={style}>
      {children}
    </div>
  );
}

interface ListContentTriggerItemProps {
  value: string;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
}

export function ListContentTriggerItem({
  value,
  children,
  className,
  style,
  disabled = false,
}: ListContentTriggerItemProps) {
  const { value: currentValue, setValue } = useContext(ListContentContext);
  const isSelected = currentValue === value;
  return (
    <div
      onClick={() => {
        if (!disabled && setValue) setValue(value);
      }}
      data-state={isSelected ? 'active' : 'inactive'}
      data-disabled={disabled ? '' : undefined}
      aria-selected={isSelected}
      className={'appearance-none cursor-pointer ' + className}
      style={style}
    >
      {children}
    </div>
  );
}

interface ListContentDisplayProps {
  children: React.ReactElement[];
  className?: string;
  style?: CSSProperties;
}

export function ListContentDisplay({
  children,
  className,
  style,
}: ListContentDisplayProps) {
  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
}

interface ListContentSectionProps {
  value: string;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
}

export function ListContentSection({
  value,
  children,
  className,
  style,
}: ListContentSectionProps) {
  const { value: currentValue } = useContext(ListContentContext);
  const isSelected = currentValue === value;
  return (
    <div
      data-state={isSelected ? 'active' : 'inactive'}
      className={'data-[state=inactive]:hidden ' + className}
      style={style}
    >
      {children}
    </div>
  );
}

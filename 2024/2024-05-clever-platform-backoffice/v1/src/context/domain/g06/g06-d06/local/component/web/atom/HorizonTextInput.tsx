import CWInput from '@component/web/cw-input';
import { cn } from '@core/design-system/library/vristo/source/utils/cn';
import { Flex, Text } from '@mantine/core';
import { Control, Controller, FieldValues, UseControllerProps } from 'react-hook-form';

interface HorizonTextInputProps {
  name: string;
  label?: string;
  control: Control<FieldValues, any>;
  unit?: string;
  inputClassName?: string;
  placeholder?: string;
  inputSize?: 'sm' | 'md';
  className?: string;
  rules?: UseControllerProps['rules'];
}

const HorizonTextInput: React.FC<HorizonTextInputProps> = (props) => {
  const {
    name,
    label,
    control,
    unit,
    inputClassName,
    placeholder,
    inputSize,
    className,
    rules,
  } = props;
  return (
    <Flex align={'center'} gap="lg" className={className}>
      {label && (
        <Text size="sm" className="min-w-fit">
          {label}
        </Text>
      )}
      <Controller
        control={control}
        rules={rules}
        name={name}
        render={({ field, fieldState }) => (
          <div className={cn('relative w-full', inputClassName)}>
            <CWInput
              placeholder={placeholder}
              className={cn('border-1 w-full', {
                ['w-28']: inputSize === 'md',
                ['w-16']: inputSize === 'sm',
                ['rounded-lg border border-red-500']:
                  fieldState?.error?.type === 'required',
              })}
              {...field}
            />
          </div>
        )}
      />
      {unit && (
        <Text size="sm" className="min-w-fit">
          {unit}
        </Text>
      )}
    </Flex>
  );
};

export default HorizonTextInput;

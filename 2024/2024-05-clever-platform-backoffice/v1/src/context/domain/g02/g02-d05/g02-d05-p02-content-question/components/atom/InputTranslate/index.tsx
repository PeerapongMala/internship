import CWInput from '@component/web/cw-input';
import { ModalTranslate, TranslationText } from '@domain/g02/g02-d05/local/type';
import React from 'react';

const InputTranslate = ({
  value,
  handleShowModalTranslate,
  callback,
  required,
  label,
  placeholder,
  onClear,
}: {
  value?: TranslationText;
  handleShowModalTranslate?: ModalTranslate;
  callback?: (value: TranslationText) => void;
  required?: boolean;
  label?: React.ReactNode;
  placeholder?: string;
  onClear?: () => void;
}) => {
  return (
    <>
      <div className="my-2 text-base">
        {/* if label is string */}
        {typeof label === 'string' && (
          <div className="text-base">
            {required && <span className="text-red-500">* </span>}
            {label}:
          </div>
        )}

        {/* if label is react node */}
        {label && typeof label !== 'string' && (
          <div className="flex gap-1">
            {required && <span className="text-red-500">*</span>}
            {label}
          </div>
        )}
      </div>
      <CWInput
        className="cursor-pointer caret-transparent"
        onClick={() =>
          handleShowModalTranslate &&
          handleShowModalTranslate({
            show: true,
            callback: (id, value) => callback && callback({ id, value }),
            selected: value?.id,
          })
        }
        onKeyDown={(e) => e.preventDefault()}
        required={required}
        placeholder={placeholder}
        value={value?.value}
        onClear={onClear}
      />
    </>
  );
};

export default InputTranslate;

import { InputFile } from '@core/design-system/library/vristo/source/components/Input';
import { ModalTranslate, TranslationText } from '@domain/g02/g02-d05/local/type';

const InputAnswer = ({
  inputAnswer,
  index,
  handleChangeOptions,
  handleShowModalTranslate,
  keyAnswer,
  disabled,
}: {
  inputAnswer: { value: string };
  index: number;
  handleChangeOptions: (key: string, value: string) => void;
  handleShowModalTranslate?: ModalTranslate;
  keyAnswer: string;
  disabled?: boolean;
}) => {
  return (
    <div className="">
      <div className="my-2 text-base">
        <span className="text-red-500">*</span> ตัวเลือกคำตอบที่ {index + 1}
      </div>
      <div
        className={`form-input cursor-pointer !font-normal ${disabled ? 'pointer-events-none !bg-[#eee] dark:bg-[#1b2e4b]' : ''} `}
        onClick={() =>
          handleShowModalTranslate &&
          handleShowModalTranslate({
            show: true,
            callback: (id, value) => handleChangeOptions(keyAnswer + index, value),
          })
        }
      >
        {inputAnswer.value || <div className="text-gray-500">กรุณาเลือกคำตอบ</div>}
      </div>
    </div>
  );
};

const ImageAnswer = ({
  inputAnswer,
  index,
  handleChangeOptions,
  handleShowModalTranslate,
  keyAnswer,
  disabled,
  label,
}: {
  inputAnswer: { image_url?: string };
  index?: number;
  handleChangeOptions: (
    key: string,
    value: string,
    translation?: TranslationText,
    file?: File,
  ) => void;
  handleShowModalTranslate?: ModalTranslate;
  keyAnswer: string;
  disabled?: boolean;
  label: string;
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChangeOptions(keyAnswer + index, '', undefined, e.target.files?.[0]);
  };

  return (
    <div className="">
      <InputFile
        label={label}
        onChange={handleFileChange}
        disabled={disabled}
        image_url={inputAnswer.image_url}
        required={inputAnswer.image_url ? false : true}
        placeholder={inputAnswer.image_url ? inputAnswer.image_url : 'Choose file...'}
      />
    </div>
  );
};

const SoundAnswer = ({
  inputAnswer,
  index,
  handleChangeOptions,
  handleShowModalTranslate,
  keyAnswer,
  disabled,
}: {
  inputAnswer: { value: string };
  index: number;
  handleChangeOptions: (key: string, value: string) => void;
  handleShowModalTranslate?: ModalTranslate;
  keyAnswer: string;
  disabled?: boolean;
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChangeOptions(keyAnswer + index, e.target.value);
  };

  return (
    <div className="">
      <InputFile
        label={`ตัวเลือกคำตอบที่ ${index + 1}`}
        required
        onChange={handleFileChange}
        accept="audio/*"
        disabled={disabled}
      />
    </div>
  );
};

export { InputAnswer, ImageAnswer, SoundAnswer };

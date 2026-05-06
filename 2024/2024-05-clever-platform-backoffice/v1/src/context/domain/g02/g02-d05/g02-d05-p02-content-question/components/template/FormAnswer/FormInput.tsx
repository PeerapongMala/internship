import InputTranslate from '../../atom/InputTranslate';
import { FormAnswerProps } from '.';

const FormInput = ({
  handleChangeOptions,
  handleShowModalTranslate,
  inputCorrectText,
  inputWrongText,
}: FormAnswerProps) => {
  return (
    <div className="flex flex-col gap-2">
      <InputTranslate
        callback={(value) => handleChangeOptions?.('inputCorrectText', '', value)}
        handleShowModalTranslate={handleShowModalTranslate}
        label="คำอธิบายเมื่อคำตอบถูก"
        placeholder="คำตอบถูกต้อง"
        // required
        value={inputCorrectText}
      />
      <InputTranslate
        callback={(value) => handleChangeOptions?.('inputWrongText', '', value)}
        handleShowModalTranslate={handleShowModalTranslate}
        label="คำอธิบายเมื่อคำตอบผิด"
        placeholder="คำตอบผิด"
        value={inputWrongText}
      />
    </div>
  );
};

export default FormInput;

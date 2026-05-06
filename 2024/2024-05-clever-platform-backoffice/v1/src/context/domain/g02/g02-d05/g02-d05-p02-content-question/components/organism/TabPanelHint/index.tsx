import { ModalTranslate, TranslationText } from '@domain/g02/g02-d05/local/type';
import TabPanelComponent from '../../molecule/TabPanelComponent';

const TabPanelHint = ({
  inputHint,
  inputHintImage,
  setInputHint,
  setInputHintImage,
  handleShowModalTranslate,
  onClear,
}: {
  inputHint: TranslationText;
  inputHintImage: any;
  setInputHint: (value: TranslationText) => void;
  setInputHintImage: (images: any) => void;
  handleShowModalTranslate?: ModalTranslate;
  onClear?: () => void;
}) => {
  return (
    <TabPanelComponent
      input={inputHint}
      inputImage={inputHintImage}
      setInput={setInputHint}
      multipleUpload={false}
      onUploadChange={setInputHintImage}
      handleShowModalTranslate={handleShowModalTranslate}
      inputRequired={false}
      onClear={onClear}
    />
  );
};

export default TabPanelHint;

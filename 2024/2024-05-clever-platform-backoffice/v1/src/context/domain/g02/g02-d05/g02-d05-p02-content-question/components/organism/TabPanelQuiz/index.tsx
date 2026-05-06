import { ModalTranslate, TranslationText } from '@domain/g02/g02-d05/local/type';
import TabPanelComponent from '../../molecule/TabPanelComponent';

const TabPanelQuiz = ({
  setInputQustion,
  setInputQustionImage,
  inputQustion,
  inputQustionImage,
  handleShowModalTranslate,
  onClear,
}: {
  inputQustion: TranslationText;
  inputQustionImage: any;
  setInputQustion: (value: TranslationText) => void;
  setInputQustionImage: (images: any) => void;
  handleShowModalTranslate?: ModalTranslate;
  onClear?: () => void;
}) => {
  return (
    <TabPanelComponent
      input={inputQustion}
      inputImage={inputQustionImage}
      setInput={setInputQustion}
      multipleUpload={false}
      onUploadChange={setInputQustionImage}
      handleShowModalTranslate={handleShowModalTranslate}
      onClear={onClear}
    />
  );
};

export default TabPanelQuiz;

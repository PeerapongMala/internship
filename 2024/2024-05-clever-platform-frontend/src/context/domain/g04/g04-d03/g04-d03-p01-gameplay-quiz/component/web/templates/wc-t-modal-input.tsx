import Button from '@component/web/atom/wc-a-button';
import API from '@domain/g04/g04-d03/local/api';
import Modal from '@global/component/web/molecule/wc-m-modal';
import { useEffect, useRef, useState } from 'react';
import { useAudioRecorder } from 'react-audio-voice-recorder';
import { useTranslation } from 'react-i18next';
import ImageIconMisc from '../../../assets/icon-misc.svg';
import ImageIconRefresh from '../../../assets/icon-refresh.svg';
import ImageIconSymbol from '@global/assets/icon-symbol.svg';
import ConfigJson from '../../../config/index.json';
import { AnswerPlaceholderProps, GameConfig } from '../../../type';
import StoreLevel from '@store/global/level';
import ModalLatexEditor from '@component/web/organism/wc-t-latex-editor';

const ModalInput = ({
  showModal,
  setShowModal,
  onChange,
  onConfirm,
  answer,
  inputType,
  hintType,
}: {
  showModal: boolean;
  setShowModal: any;
  onChange?: (value: string) => void;
  onConfirm?: (value: string) => void;
  answer?: AnswerPlaceholderProps;
  inputType?: GameConfig['inputType'];
  hintType?: GameConfig['hintType'];
}) => {
  const { inputValue } = StoreLevel.StateGet(['inputValue']);

  const recorderControls = useAudioRecorder();
  const { t } = useTranslation([ConfigJson.key]);
  const [value, setValue] = useState('');
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [showLatexEditor, setShowLatexEditor] = useState(false);

  const handleClick = () => {
    if (recorderControls.isRecording) {
      // stop recording
      recorderControls.stopRecording();
    } else {
      // start recording
      recorderControls.startRecording();
    }
  };

  const handleClickRefresh = () => {
    setValue('');
    setErrorText('');
  };

  const handleSpeechToText = (file: File) => {
    setLoading(true);
    return API.Helper.SpeechToText({
      audio_file: file,
      language: 'en',
    })
      .then((res) => {
        console.log(res);
        if (res.status_code === 200) {
          const transcript = res.data.transcript;
          setValue(transcript);
          if (transcript === '') {
            setErrorText(
              t(
                'modalInput.errors.speechToTextFailed',
                'ไม่สามารถแปลงเสียงเป็นข้อความได้ กรุณาลองใหม่อีกครั้ง',
              ),
            );
            return false;
          }
          return true;
        } else {
          setErrorText(t('modalInput.errors.somethingWentWrong', 'มีบางอย่างผิดพลาด'));
          return false;
        }
      })
      .catch((err) => {
        setErrorText(t('modalInput.errors.somethingWentWrong', 'มีบางอย่างผิดพลาด'));
        throw err;
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleLatexEditor = () => {
    setShowLatexEditor(true);
    // setShowModal(false);
  };

  const blobToFile = (blob: Blob, fileName: string): File => {
    const file = new File([blob], fileName, { type: blob.type });
    return file;
  };

  useEffect(() => {
    if (file) {
      setFile(null);
      handleSpeechToText(file);
    }
  }, [file]);

  useEffect(() => {
    if (showModal && answer?.answerInput && value === '') {
      setValue(answer?.answerInput);
    } else {
      setValue('');
    }
  }, [showModal, answer?.answerInput]);

  useEffect(() => {
    if (recorderControls.isRecording) {
      setRecording(true);
    } else {
      setRecording(false);
    }
  }, [recorderControls.isRecording]);

  useEffect(() => {
    if (recorderControls.recordingBlob) {
      const file = blobToFile(recorderControls.recordingBlob, 'recording.mp3');
      setFile(file);
    }
  }, [recorderControls.recordingBlob]);

  // Use translation for titles
  const textInputTitle = t('modalInput.titles.textInput', 'พิมพ์คำตอบ');
  const speechInputTitle = t('modalInput.titles.speechInput', 'พูดคำตอบ');
  const title =
    inputType === 'text'
      ? textInputTitle
      : inputType === 'speech'
        ? speechInputTitle
        : '';

  const countHint = answer?.text?.[0]?.text?.length || 0;
  const confirmButtonText = t('modalInput.buttons.confirm', 'ตกลง');

  return (
    <>
      {showLatexEditor ? (
        <ModalLatexEditor
          setShowModal={(show: boolean) => {
            setShowLatexEditor(show);
          }}
          showModal
          value={value}
          setValue={(val: string) => {
            onConfirm?.(val);
            setShowLatexEditor(false);
          }}
        />
      ) : null}

      {showModal && !showLatexEditor ? (
        <Modal
          setShowModal={setShowModal}
          title={title}
          className="h-[30rem] w-[60rem]"
          customBody={
            <div className="w-full h-full flex flex-col gap-4 items-center justify-center">
              {inputType === 'text' && (
                <InputText
                  countHint={countHint}
                  setValue={setValue}
                  value={value}
                  onClickLatexEditor={handleLatexEditor}
                  hintType={hintType}
                />
              )}
              {inputType === 'speech' && (
                <InputSpeech
                  active={recording}
                  onClick={handleClick}
                  onClickRefresh={handleClickRefresh}
                  value={value || inputValue}
                  errorText={errorText}
                  loading={loading}
                />
              )}
            </div>
          }
          customFooter={
            <div className="w-full h-40 flex items-center justify-center border-t-2 border-dashed border-secondary">
              <Button
                onClick={() => onConfirm?.(value)}
                variant="primary"
                width="30rem"
                height="70px"
              >
                {confirmButtonText}
              </Button>
            </div>
          }
        />
      ) : null}
    </>
  );
};

const InputText = ({
  countHint,
  value,
  setValue,
  onClickLatexEditor,
  hintType,
}: {
  countHint?: number;
  value?: string;
  setValue?: any;
  onClickLatexEditor?: () => void;
  hintType?: GameConfig['hintType'];
}) => {
  const { t } = useTranslation([ConfigJson.key]);
  const inputRef = useRef<HTMLInputElement>(null);

  const hintText = t('modalInput.text.hint', 'คำใบ้: คำตอบมี {{count}} ตัวอักษร', {
    count: countHint,
  });
  const placeholder = t('modalInput.text.placeholder', 'พิมพ์คำตอบ...');

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <>
      {hintType !== 'none' && <div className="">{hintText}</div>}
      <div className="flex w-8/12 h-16">
        <input
          ref={inputRef}
          type="text"
          className={`w-full h-full border-4 rounded-2xl rounded-r-none pr-4 text-center focus:outline-none bg-whiteborder-secondary focus:border-secondary border-r-0`}
          placeholder={placeholder}
          onInput={(e) => setValue(e.currentTarget.value)}
          value={value}
        />
        <div
          className="flex !rounded-xl !rounded-l-none h-full w-[66px] bg-warning/90 items-center justify-center font-bold text-white text-4xl border-4 border-warning cursor-pointer"
          onClick={onClickLatexEditor}
        >
          <img className="h-10 w-10" src={ImageIconSymbol} alt="+" />
        </div>
      </div>

      {hintType !== 'none' && (
        <div
          // shift to the right
          className="text-gray-400 text-right w-8/12"
        >
          {value?.length}/{countHint}
        </div>
      )}
    </>
  );
};

const InputSpeech = ({
  active,
  loading,
  onClick,
  onClickRefresh,
  value,
  errorText,
}: {
  active?: boolean;
  loading?: boolean;
  onClick?: () => void;
  onClickRefresh?: () => void;
  value?: string;
  errorText?: string;
}) => {
  const { t } = useTranslation([ConfigJson.key]);

  const youSaidText = t('modalInput.speech.youSaid', 'คุณพูดว่า');
  const listeningText = t('modalInput.speech.listening', 'กำลังฟัง...');
  const tapToStartText = t('modalInput.speech.tapToStart', 'กดเพื่อเริ่มพูด');
  const processingText = t('modalInput.speech.processing', 'กำลังประมวลผล...');

  return (
    <>
      {value || errorText ? (
        <div className="flex flex-col gap-4 items-center">
          {!errorText && (
            <>
              <div className="">{youSaidText}</div>
              <div className="font-medium">"{value}"</div>
            </>
          )}

          {errorText && <div className="text-red-500">{errorText}</div>}

          <Button
            className={`!h-20 !w-20 p-4`}
            variant={`secondary`}
            onClick={onClickRefresh}
          >
            <img
              className="h-10 w-10"
              src={ImageIconRefresh}
              alt={t('modalInput.icons.refresh', 'ไอคอนรีเฟรช')}
            />
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4 items-center">
          {!loading && <div className="">{active ? listeningText : tapToStartText}</div>}
          {loading && <div className="">{processingText}</div>}

          <Button
            className={`!h-20 !w-20 p-4`}
            variant={`${active ? 'danger' : 'secondary'}`}
            onClick={onClick}
            disabled={loading}
          >
            <img
              className="h-10 w-10"
              src={ImageIconMisc}
              alt={t('modalInput.icons.mic', 'ไอคอนไมโครโฟน')}
            />
          </Button>
        </div>
      )}
    </>
  );
};

export default ModalInput;

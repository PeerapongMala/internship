import IconPencil from '@core/design-system/library/vristo/source/components/Icon/IconPencil';
import { useEffect, useState } from 'react';
import ModalQuestionOrder from './ModalQuestionOrder';

const HeaderForm = ({
  onClickAddQuestion,
  disabledAddQuestion,
  questionsList,
  mainLanguage,
  onOkSortQuestion,
  loading,
}: {
  onClickAddQuestion: () => void;
  disabledAddQuestion?: boolean;
  questionsList?: any;
  mainLanguage: string;
  onOkSortQuestion?: (questionsListState: any[]) => void;
  loading?: boolean;
}) => {
  const [questionsListState, setQuestionsListState] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  const onClose = () => {
    setOpen(false);
  };

  const onOk = () => {
    setOpen(false);
    onOkSortQuestion && onOkSortQuestion(questionsListState);
  };

  useEffect(() => {
    setQuestionsListState(
      questionsList.map((item: any, index: number) => {
        return {
          id: item.id,
          label: `ID : ${item.id}, ${item?.command_text?.translations?.[mainLanguage]?.text || ''}`,
          index: index + 1,
          disabledUp: index === 0,
          disabledDown: index === questionsList.length - 1,
        };
      }),
    );
  }, [questionsList, mainLanguage]);

  return (
    <>
      <ModalQuestionOrder
        open={open}
        onClose={onClose}
        onOk={onOk}
        data={questionsListState}
        setData={setQuestionsListState}
        enbledAddQuestion={!disabledAddQuestion}
        onClickAddQuestion={onClickAddQuestion}
      />
      <button
        className="btn btn-primary flex w-44 gap-2"
        type="button"
        onClick={onClickAddQuestion}
        disabled={disabledAddQuestion || loading}
      >
        {loading ? (
          <span className="inline-block h-[18px] w-[18px] shrink-0 animate-spin rounded-full border-2 border-white border-l-transparent align-middle" />
        ) : (
          <IconPencil />
        )}
        เพิ่มคำถาม
      </button>
      <button
        className="btn btn-outline-primary w-44"
        onClick={() => setOpen(true)}
        type="button"
        disabled={loading}
      >
        {loading && (
          <span className="inline-block h-[18px] w-[18px] shrink-0 animate-spin rounded-full border-2 border-primary border-l-transparent align-middle" />
        )}
        เรียงลำดับคำถาม
      </button>
    </>
  );
};

export default HeaderForm;

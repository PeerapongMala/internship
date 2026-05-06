import { useEffect, useRef, useState } from 'react';
import { LevelItem, Question } from '@domain/g02/g02-d05/local/type';
import API from '@domain/g02/g02-d05/local/api';
import { useReactToPrint } from 'react-to-print';
import CWButton, { IButtonProps } from '@component/web/cw-button';
import LevelDocumentPDFDOM from '@component/web/molecule/cw-m-levels-document-pdf-dom';

interface ButtonDownloadLevelsPdfProps {
  levelId?: number;
  propsButton?: IButtonProps;
}

const ButtonDownloadLevelsPdf: React.FC<ButtonDownloadLevelsPdfProps> = ({ levelId }) => {
  const [pdfLoading, setPdfLoading] = useState(false);
  const [academicLevel, setAcademicLevel] = useState<LevelItem | undefined>();
  const [standard, setStandard] = useState<LevelItem['standard'] | null>(null);
  const [mainLanguage, setMainLanguage] = useState('en');
  const [questionsList, setQuestionsList] = useState<Question[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);

  const reactToPrintFn = useReactToPrint({
    contentRef,
    documentTitle: `level-${levelId}-document`,
    pageStyle: '@media print { @page { 3rem 3rem 3rem 3rem !important; } }',
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!levelId) return;
      setPdfLoading(true);
      try {
        const res = await API.academicLevel.GetById(levelId.toString());
        if (res.status_code === 200) {
          const level = res.data?.[0] as LevelItem;
          setAcademicLevel(level);
          setMainLanguage(level.language.language);
          const std = await API.academicLevel.GetG02D05A41(
            level.sub_lesson_id.toString(),
          );
          setStandard(
            std.status_code === 200 ? (std.data?.[0] as LevelItem['standard']) : null,
          );
          const questionsRes = await API.academicLevel.GetG02D05A29(levelId.toString(), {
            page: 1,
            limit: -1,
          });
          setQuestionsList(
            questionsRes.status_code === 200 ? (questionsRes.data as Question[]) : [],
          );
        }
      } finally {
        setPdfLoading(false);
      }
    };
    fetchData();
  }, [levelId]);

  return (
    <>
      <CWButton onClick={reactToPrintFn} title="พิมพ์คำถาม" loading={pdfLoading} />
      <LevelDocumentPDFDOM
        contentRef={contentRef}
        level={academicLevel}
        standard={standard}
        questionsList={questionsList}
      />
    </>
  );
};

export default ButtonDownloadLevelsPdf;

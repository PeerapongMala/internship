import { useState, useEffect } from 'react';
import AnimateHeight from 'react-animate-height';

import { LevelItem, Question, QuestionType } from '@domain/g02/g02-d05/local/type';
import API from '@domain/g02/g02-d05/local/api';
import APIHomework from '@domain/g03/g03-d06/local/api';
import { Divider } from '@core/design-system/library/vristo/source/components/Divider';
import FormAnswerSelect from './form-answer-select';
import { LevelPlayLogItem } from './type';
import CWMAccordion from '@component/web/molecule/cw-m-accordion';
import G01D01API from '@domain/g01/g01-d01/local/api';
import { getTranslation } from '@domain/g02/g02-d05/local/util';
import { getQuestionType } from '@global/utils/levelConvert';
import Latex from 'react-latex-next';
import { TPagination } from '@domain/g00/g00-d01/local/types';
import CWPagination from '@component/web/cw-pagination';
import PaginationControls from '@component/web/cw-pagination/PaginationControl';
import usePagination from '@global/hooks/usePagination';

interface LevelViewProps {
  levelId?: number;
  levelPlayLogId?: number;
  expandAll?: boolean;
  useSchoolStatAPI?: boolean;
  onStandardLoaded?: (standard: LevelItem['standard']) => void;
}

const CWTLevelView = ({
  levelId,
  levelPlayLogId,
  expandAll,
  useSchoolStatAPI = false,
  onStandardLoaded,
}: LevelViewProps) => {
  const [academicLevel, setAcademicLevel] = useState<LevelItem>();
  const [levelPlayLog, setLevelPlayLog] = useState<LevelPlayLogItem[]>();
  const [standard, setStandard] = useState<LevelItem['standard']>();
  const [mainLanguage, setMainLanguage] =
    useState<LevelItem['language']['language']>('en');

  const [questionsList, setQuestionsList] = useState<Question[]>();
  const [isLoading, setIsLoading] = useState(false);
  const { pagination, setPagination } = usePagination({ isModal: true });

  const [questionActive, setQuestionActive] = useState<number | null>(null);

  const handleClickQuestion = (index: number) => {
    setQuestionActive((prev) => (prev === index ? null : index));
  };

  const getPlayLogFromQuestion = (questionId: number) => {
    if (levelPlayLog) {
      const playLog = levelPlayLog.find((log) => log.question_id === questionId);
      if (playLog) {
        return playLog;
      }
    }
    return null;
  };

  const getStandard = (id: number) => {
    API.academicLevel.GetG02D05A41(id.toString()).then((res) => {
      if (res.status_code === 200) {
        const standardData = res.data?.[0] as LevelItem['standard'];
        setStandard(standardData);
        if (onStandardLoaded) {
          onStandardLoaded(standardData);
        }
      }
    });
  };

  const getQuestions = async (id: number, page?: number, limit?: number) => {
    setIsLoading(true);

    try {
      const res = await API.academicLevel.GetG02D05A29(id.toString(), {
        page,
        limit,
      });

      if (res.status_code === 200) {
        setQuestionsList(res.data as Question[]);
        setPagination((prev) => ({
          ...prev,
          total_count: res._pagination?.total_count || 0,
        }));
      }
    } catch (err) {
      console.error('Error fetching questions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleFetchQuestionAndLevelPlayLog();
  }, [levelId, pagination.page, pagination.limit]);
  const handleFetchQuestionAndLevelPlayLog = async () => {
    if (levelId) {
      await getQuestions(levelId, pagination.page, pagination.limit);
    }

    if (levelPlayLogId) {
      getLevelPlayLogId(levelPlayLogId);
    }
  };

  const getLevelPlayLogId = (levelPlayLogId: number) => {
    if (useSchoolStatAPI) {
      G01D01API.SchoolStat.GetPlayLog({ play_log_id: levelPlayLogId }).then((res) => {
        if (res.status_code === 200) {
          const data = res.data as unknown as LevelPlayLogItem[];

          setLevelPlayLog(data);
          setQuestionsList((prev) =>
            prev?.filter((question) =>
              data.find((log) => log.question_id === question.id),
            ),
          );
        }
      });
    } else {
      APIHomework.teacherHomework.GetLevelPlayLogs(levelPlayLogId).then((res) => {
        if (res.status_code === 200) {
          const data = res.data as unknown as LevelPlayLogItem[];

          setLevelPlayLog(data);
          setQuestionsList((prev) =>
            prev?.filter((question) =>
              data.find((log) => log.question_id === question.id),
            ),
          );
        }
      });
    }
  };

  useEffect(() => {
    if (levelId) {
      API.academicLevel.GetById(levelId.toString()).then((res) => {
        if (res.status_code === 200) {
          setAcademicLevel(res.data?.[0] as LevelItem);
          setMainLanguage(res.data?.[0].language.language);
          getStandard(res.data?.[0].sub_lesson_id);
          // getQuestions(levelId);
        }
      });
    }
  }, [levelId, levelPlayLogId]);

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };
  return (
    <>
      <div className="flex flex-col gap-2 text-base">
        <div>
          <p className="font-bold">วัตถุประสงค์การเรียนรู้</p>
          <p>{standard?.criteria_name || '-'}</p>
        </div>
        <div>
          <p className="font-bold">มาตรฐาน</p>
          <p>{standard?.learning_content_name || '-'}</p>
        </div>
        <div>
          <p className="font-bold">ตัวชี้วัด</p>
          <p>{standard?.indicator_name || '-'}</p>
        </div>
      </div>
      <Divider />
      {isLoading ? (
        <div className="flex items-center justify-center gap-2 font-bold">
          <span className="inline-block h-[18px] w-[18px] shrink-0 animate-spin rounded-full border-2 border-primary border-l-transparent align-middle" />
          Loading questions...
        </div>
      ) : (
        <div className="flex flex-col gap-2 text-base">
          {questionsList?.map((question, index) => (
            <div key={question.id || index}>
              {' '}
              {/* Better to use question.id if available */}
              <QuestionView
                questionNo={1 + index + (pagination.page - 1) * pagination.limit}
                question={question}
                playLog={getPlayLogFromQuestion(question.id)}
                questionActive={questionActive}
                onClick={() => handleClickQuestion(question.id)}
                mainLanguage={mainLanguage}
                expandAll={expandAll}
              />
            </div>
          ))}
          {pagination.total_count > 0 && (
            <div className="mt-5 flex w-full items-center justify-center">
              <PaginationControls
                currentPage={pagination.page}
                totalPages={Math.ceil(pagination.total_count / pagination.limit)}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
};

const QuestionView = ({
  questionNo,
  question,
  questionActive,
  onClick,
  mainLanguage,
  playLog,
  expandAll,
}: {
  questionNo: number;
  question: Question;
  questionActive: number | null;
  onClick: () => void;
  mainLanguage: LevelItem['language']['language'];
  playLog?: LevelPlayLogItem | null;
  expandAll?: boolean;
}) => {
  const timeUsed = playLog?.time_used;
  const isCorrect = playLog?.is_correct;

  return (
    <CWMAccordion
      title={
        <div className="grid w-full grid-cols-3">
          <div className="pl-4 text-left font-bold">ข้อที่ {questionNo}</div>
          {playLog && (
            <>
              <div>{timeUsed} วินาที</div>
              <div className="text-right">{isCorrect ? 'ถูก' : 'ผิด'}</div>
            </>
          )}
        </div>
      }
      isOpen={questionActive === question.id}
      onClick={onClick}
      expandAll={expandAll}
    >
      <div className="flex flex-col gap-2 p-2">
        <div>
          <p className="font-bold">รูปแบบคำถาม</p>
          {getQuestionType(question?.question_type)}
        </div>
        <div>
          <p className="font-bold">คำสั่ง</p>
          <p className="pl-4">
            <Latex>
              {getTranslation(
                question?.command_text.translations,
                mainLanguage,
                'text',
              ) || '-'}
            </Latex>
          </p>
        </div>
        <div>
          <p className="font-bold">โจทย์</p>
          <p className="pl-4">
            <Latex>
              {getTranslation(
                question?.description_text.translations,
                mainLanguage,
                'text',
              ) || '-'}
            </Latex>
          </p>
        </div>
        <div>
          <p className="font-bold">คำใบ้</p>
          <p className="pl-4">
            <Latex>
              {getTranslation(question?.hint_text.translations, mainLanguage, 'text') ||
                '-'}
            </Latex>
          </p>
        </div>
        <FormAnswerSelect
          question={question}
          mainLanguage={mainLanguage}
          playLog={playLog}
        />
      </div>
    </CWMAccordion>
  );
};

export default CWTLevelView;

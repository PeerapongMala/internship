import { LevelItem, Question } from '@domain/g02/g02-d05/local/type';
import FormQuestion from './form-question';

type Props = {
  level?: LevelItem;
  standard?: LevelItem['standard'] | null;
  questionsList?: Question[];
  contentRef: React.RefObject<HTMLDivElement>;
};

const LevelDocumentPDFDOM = ({ contentRef, level, standard, questionsList }: Props) => {
  return (
    <>
      <div ref={contentRef} className="print-content flex h-full w-full flex-col">
        <div className="w-full text-center text-lg font-bold">
          ข้อมูลด่านที่ {level?.id}
        </div>
        <div className="flex flex-col gap-2 text-base">
          <div>
            <p className="font-bold">วัตถุประสงค์การเรียนรู้</p>
            <p>{standard?.criteria_name}</p>
          </div>
          <div>
            <p className="font-bold">มาตรฐาน</p>
            <p>{standard?.learning_content_name}</p>
          </div>
          <div>
            <p className="font-bold">ตัวชี้วัด</p>
            <p>{standard?.indicator_name}</p>
          </div>
        </div>
        {questionsList?.map((question, index) => (
          <div
            key={index}
            className="text-base"
            style={{
              breakInside: 'avoid',
            }}
          >
            <div className="text-lg font-bold">ข้อที่ {question.index}</div>
            <FormQuestion
              mainLanguage={level?.language?.language || 'th'}
              question={question}
            />
            <div className="mb-4 mt-4 h-px w-full border-b border-black" />
          </div>
        ))}
      </div>
    </>
  );
};

export default LevelDocumentPDFDOM;

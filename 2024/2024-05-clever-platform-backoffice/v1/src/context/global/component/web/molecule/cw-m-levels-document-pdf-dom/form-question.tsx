import {
  LevelItem,
  Question,
  QuestionDescriptions,
  TextChoice,
  TranslationChoice,
} from '@domain/g02/g02-d05/local/type';
import { getTranslation } from '@domain/g02/g02-d05/local/util';
import { getQuestionType } from '@global/utils/levelConvert';
import Latex from 'react-latex-next';

const FormQuestion = ({
  question,
  mainLanguage,
}: {
  question: Question;
  mainLanguage: LevelItem['language']['language'];
}) => {
  return (
    <>
      <div className="flex flex-col gap-2">
        <div>
          <p className="font-bold">รูปแบบคำถาม</p>
          <p className="pl-4">{getQuestionType(question?.question_type)}</p>
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
      </div>

      {question?.question_type === 'multiple-choices' && (
        <MultipleChoices question={question} mainLanguage={mainLanguage} />
      )}
      {question?.question_type === 'pairing' && (
        <Pairing question={question} mainLanguage={mainLanguage} />
      )}
      {question?.question_type === 'sorting' && (
        <Sorting question={question} mainLanguage={mainLanguage} />
      )}
      {question?.question_type === 'placeholder' && (
        <Placeholder question={question} mainLanguage={mainLanguage} />
      )}
      {question?.question_type === 'input' && (
        <FormInput question={question} mainLanguage={mainLanguage} />
      )}
    </>
  );
};

const MultipleChoices = ({
  question,
  mainLanguage,
}: {
  question: Question;
  mainLanguage: LevelItem['language']['language'];
}) => {
  const textChoices = question?.text_choices as TranslationChoice[];
  const imageChoices = question?.image_choices as TranslationChoice[];

  const AnswerSelect = () => {
    const shuffledTextChoices = shuffleArray(textChoices || []);
    const shuffledImageChoices = shuffleArray(imageChoices || []);

    const labeledChoices =
      question?.choice_type === 'text-speech' || question?.choice_type === 'speech'
        ? shuffledTextChoices.map((choice, index) => ({
            label: String.fromCharCode(65 + index) + '.',
            content: getTranslation(choice.translations, mainLanguage, 'text') || '-',
          }))
        : shuffledImageChoices.map((choice, index) => ({
            label: String.fromCharCode(65 + index) + '.',
            content: choice.image_url,
          }));

    return (
      <>
        <div className="text-base font-bold">ตัวเลือก</div>
        <div className="grid grid-cols-2 gap-4 pl-4">
          {labeledChoices.map((choice, index) => (
            <div key={index} className="mt-2">
              {question?.choice_type === 'text-speech' ||
              question?.choice_type === 'speech' ? (
                <Latex>
                  {choice.label} {choice.content}
                </Latex>
              ) : (
                <div style={{ flexDirection: 'row', alignItems: 'center' }} key={index}>
                  <div>{choice.label}</div>
                  <img
                    src={choice.content}
                    style={{ width: 64, height: 64, marginLeft: 8 }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </>
    );
  };

  return (
    <>
      <AnswerSelect />
    </>
  );
};

const Pairing = ({
  question,
  mainLanguage,
}: {
  question: Question;
  mainLanguage: LevelItem['language']['language'];
}) => {
  const textChoices = question?.text_choices as TranslationChoice[];
  const imageChoices = question?.image_choices as TranslationChoice[];
  const textGroup = shuffleArray(question?.groups || []);

  const AnswerSelect = () => {
    return (
      <>
        <div className="grid grid-cols-2 gap-4">
          {/* Groups Column */}
          <div className="flex flex-col">
            <div className="font-bold">กลุ่ม</div>
            <div className="pl-4">
              {textGroup?.map((group, index) => (
                <div key={index} className="mt-2 flex flex-row justify-between pr-[30%]">
                  <Latex>
                    {getTranslation(group.translations, mainLanguage, 'text') ||
                      `group_${index + 1}`}
                  </Latex>
                  <div className="text-xl">•</div>
                </div>
              ))}
            </div>
          </div>

          {/* Choices Column */}
          <div style={{ flex: 1 }}>
            <div className="font-bold">ตัวเลือก</div>
            <div className="pl-4">
              {question?.choice_type === 'text-speech' ||
              question?.choice_type === 'speech'
                ? textChoices.map((choice, index) => (
                    <div key={index} className="mt-2 flex flex-row items-center gap-2">
                      <div className="text-xl">• </div>
                      <Latex>
                        {getTranslation(choice.translations, mainLanguage, 'text') ||
                          `choice_${index + 1}`}
                      </Latex>
                    </div>
                  ))
                : imageChoices.map((choice, index) => (
                    <div key={index} className="mt-2 flex flex-row items-center gap-2">
                      <div className="text-xl">• </div>
                      <img
                        key={index}
                        src={choice.image_url}
                        style={{ width: 64, height: 64 }}
                      />
                    </div>
                  ))}
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <AnswerSelect />
    </>
  );
};

const Sorting = ({
  question,
  mainLanguage,
}: {
  question: Question;
  mainLanguage: LevelItem['language']['language'];
}) => {
  const textChoices = question?.text_choices as TranslationChoice[];
  const imageChoices = question?.image_choices as TranslationChoice[];

  const AnswerSelect = () => {
    const shuffledTextChoices = shuffleArray(textChoices || []);
    const shuffledImageChoices = shuffleArray(imageChoices || []);

    const labeledChoices =
      question?.choice_type === 'text-speech' || question?.choice_type === 'speech'
        ? shuffledTextChoices.map((choice, index) => ({
            label: String.fromCharCode(65 + index) + '.',
            content: getTranslation(choice.translations, mainLanguage, 'text') || '-',
          }))
        : shuffledImageChoices.map((choice, index) => ({
            label: String.fromCharCode(65 + index) + '.',
            content: choice.image_url,
          }));

    return (
      <>
        <div className="font-bold">ตัวเลือก</div>
        {/* <div style={styles.gridColumn2}> */}
        <div className="mt-2 grid grid-cols-2 gap-4 pl-4">
          {labeledChoices.map((choice, index) => (
            <div key={index}>
              {question?.choice_type === 'text-speech' ||
              question?.choice_type === 'speech' ? (
                <Latex>
                  {choice.label} {choice.content}
                </Latex>
              ) : (
                <div style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <div>{choice.label}</div>
                  <img
                    src={choice.content}
                    style={{ width: 64, height: 64, marginLeft: 8 }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="font-bold">คำตอบ</div>
        <div className="mt-2 flex flex-row flex-wrap gap-2 pl-4">
          {labeledChoices.map((choice, index) => (
            <div key={index} className="h-12 w-12 border border-black" />
          ))}
        </div>
      </>
    );
  };

  return (
    <>
      <AnswerSelect />
    </>
  );
};

const Placeholder = ({
  question,
  mainLanguage,
}: {
  question: Question;
  mainLanguage: LevelItem['language']['language'];
}) => {
  const textChoices = question?.text_choices as TextChoice[];
  const textChoicesCorrect = question?.text_choices?.filter(
    (choice) => choice.is_correct,
  ) as TextChoice[];

  const descriptions = question?.descriptions;

  const getChoiceFromIndex = (index: number) => {
    const choice = textChoicesCorrect?.find((choice) => choice.index === index);
    return choice ? choice.text : '';
  };

  const getDescriptionText = (description: QuestionDescriptions) => {
    const text = description.text;

    const elements = text.split(/({Ans\d+})/g).map((part, index) => {
      const match = part.match(/{Ans(\d+)}/);
      if (match) {
        const answerIndex = parseInt(match[1], 10) - 1;
        const answer = description.answers?.[answerIndex];

        if (!answer || question.hint_type === 'none') {
          return '_______________';
        }

        const answerText = getChoiceFromIndex(answer.text[0].choice_index);

        return `_______$\\textcolor{lightgray}{(${answerText.length})}$________`;
      }

      // Return normal text for non-placeholder parts
      return part;
    });

    return elements.join(' ');
  };

  const AnswerSelect = () => {
    const shuffledTextChoices = shuffleArray(textChoices || []) as TextChoice[];
    const shuffledDescriptions = shuffleArray(
      descriptions || [],
    ) as Question['descriptions'];

    const labeledChoices = shuffledTextChoices.map((choice, index) => ({
      label: String.fromCharCode(65 + index) + '.',
      content: choice.text,
    }));

    return (
      <>
        <div className="font-bold">ตัวเลือก</div>
        <div className="my-2 grid grid-cols-2 gap-4 pl-4">
          {labeledChoices.map((choice, index) => (
            <div key={index} className="grid grid-cols-2 gap-4">
              <Latex>
                {choice.label} {choice.content}
              </Latex>
            </div>
          ))}
        </div>
        <div className="font-bold">โจทย์</div>
        <div className="pl-4">
          {shuffledDescriptions?.map((description, index) => (
            <div key={index} className="my-2 flex flex-row flex-wrap gap-4">
              <div>{index + 1}. </div>
              <Latex>{getDescriptionText(description)}</Latex>
            </div>
          ))}
        </div>
      </>
    );
  };

  return (
    <>
      <AnswerSelect />
    </>
  );
};

const FormInput = ({
  question,
  mainLanguage,
}: {
  question: Question;
  mainLanguage?: LevelItem['language']['language'];
}) => {
  const descriptions = question?.descriptions;

  const getDescriptionText = (description: QuestionDescriptions) => {
    const text = description.text;

    const elements = text.split(/({Ans\d+})/g).map((part, index) => {
      const match = part.match(/{Ans(\d+)}/);
      if (match) {
        const answerIndex = parseInt(match[1], 10) - 1;
        const answer = description.answers?.[answerIndex];

        if (!answer || question.hint_type === 'none') {
          return (
            <div key={index} className="w-[10%] border-b-2 border-dashed border-black">
              {' '}
            </div>
          );
        }

        const answerText = answer.text?.[0]?.text || '';

        return (
          <div key={index} className="w-[10%] border-b-2 border-dashed border-black">
            <div
              style={{
                opacity: 0.3,
              }}
            >{`(${answerText.length})`}</div>
          </div>
        );
      }

      // Return normal text for non-placeholder parts
      return <Latex key={index}>{part}</Latex>;
    });

    return elements;
  };

  const shuffledDescriptions = shuffleArray(
    descriptions || [],
  ) as Question['descriptions'];

  const AnswerSelect = () => {
    return (
      <>
        <div className="font-bold">โจทย์</div>
        <div className="pl-4">
          {shuffledDescriptions?.map((description, index) => (
            // <div key={index} style={{ marginBottom: 8, marginLeft: 8 }}>
            <div key={index} className="my-2 flex flex-row flex-wrap gap-4">
              <div>{index + 1}. </div>
              {getDescriptionText(description)}
            </div>
          ))}
        </div>
      </>
    );
  };

  return (
    <>
      <AnswerSelect />
    </>
  );
};

const shuffleArray = (array: any[]) => {
  return array
    .map((item) => ({ item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }) => item);
};

export default FormQuestion;

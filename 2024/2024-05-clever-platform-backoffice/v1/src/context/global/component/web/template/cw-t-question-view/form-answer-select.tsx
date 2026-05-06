import {
  AnswerPlaceholderProps,
  LevelItem,
  Question,
  TextChoice,
  TranslationChoice,
} from '@domain/g02/g02-d05/local/type';
import {
  LevelPlayLogInputAnswer,
  LevelPlayLogItem,
  LevelPlayLogMultipleChoicesAnswer,
  LevelPlayLogPairingAnswer,
  LevelPlayLogPlaceholderAnswer,
  LevelPlayLogSortingAnswer,
} from './type';
import React from 'react';
import Latex from 'react-latex-next';
import { getTranslation } from '@domain/g02/g02-d05/local/util';

const FormAnswerSelect = ({
  question,
  mainLanguage,
  playLog,
}: {
  question: Question;
  mainLanguage: LevelItem['language']['language'];
  playLog?: LevelPlayLogItem | null;
}) => {
  return (
    <>
      {question?.question_type === 'multiple-choices' && (
        <MultipleChoices
          question={question}
          mainLanguage={mainLanguage}
          playLog={playLog}
        />
      )}
      {question?.question_type === 'pairing' && (
        <Pairing question={question} mainLanguage={mainLanguage} playLog={playLog} />
      )}
      {question?.question_type === 'sorting' && (
        <Sorting question={question} mainLanguage={mainLanguage} playLog={playLog} />
      )}
      {question?.question_type === 'placeholder' && (
        <Placeholder question={question} mainLanguage={mainLanguage} playLog={playLog} />
      )}
      {question?.question_type === 'input' && (
        <FormInput question={question} mainLanguage={mainLanguage} playLog={playLog} />
      )}
    </>
  );
};

const MultipleChoices = ({
  question,
  mainLanguage,
  playLog,
}: {
  question: Question;
  mainLanguage: LevelItem['language']['language'];
  playLog?: LevelPlayLogItem | null;
}) => {
  const playLogAnswer = playLog?.answer as LevelPlayLogMultipleChoicesAnswer;

  const textChoices = question?.text_choices as TranslationChoice[];
  const textChoicesCorrect = question?.text_choices?.filter(
    (choice) => choice.is_correct,
  ) as TranslationChoice[];
  const textChoicesIncorrect = question?.text_choices?.filter(
    (choice) => !choice.is_correct,
  ) as TranslationChoice[];

  const imageChoices = question?.image_choices as TranslationChoice[];
  const imageChoicesCorrect = question?.image_choices?.filter(
    (choice) => choice.is_correct,
  ) as TranslationChoice[];
  const imageChoicesIncorrect = question?.image_choices?.filter(
    (choice) => !choice.is_correct,
  ) as TranslationChoice[];

  const getChoiceFromId = (id: number) => {
    if (question?.choice_type === 'text-speech' || question?.choice_type === 'speech') {
      return textChoices?.find((choice) => choice.id === id);
    } else if (question?.choice_type === 'image') {
      return imageChoices?.find((choice) => choice.id === id);
    }
    return null;
  };

  const CorrectAnswer = () => {
    return (
      <>
        <div className="font-bold">ตัวเลือกคำตอบถูก</div>
        {question?.choice_type === 'text-speech' || question?.choice_type === 'speech'
          ? textChoicesCorrect?.map((choice, index) => (
              <div key={index} className="pl-4">
                <Latex>
                  {getTranslation(choice.translations, mainLanguage, 'text') || '-'}
                </Latex>
              </div>
            ))
          : imageChoicesCorrect?.map((choice, index) => (
              <img
                key={index}
                src={choice.image_url}
                alt=""
                className="h-auto w-16 pl-4"
              />
            ))}
      </>
    );
  };

  const IncorrectAnswer = () => {
    return (
      <>
        <div className="font-bold">ตัวเลือกคำตอบผิด</div>
        {question?.choice_type === 'text-speech' || question?.choice_type === 'speech'
          ? textChoicesIncorrect?.map((choice, index) => (
              <div key={index} className="pl-4">
                <Latex>
                  {getTranslation(choice.translations, mainLanguage, 'text') || '-'}
                </Latex>
              </div>
            ))
          : imageChoicesIncorrect?.map((choice, index) => (
              <img
                key={index}
                src={choice.image_url}
                alt=""
                className="h-auto w-16 pl-4"
              />
            ))}
      </>
    );
  };

  const StudentAnswer = () => {
    return (
      <>
        <div className="font-bold">คำตอบของนักเรียน</div>
        <div className="pl-4">
          <Latex>
            {getTranslation(
              getChoiceFromId(playLogAnswer?.text_choice_id)?.translations,
              mainLanguage,
              'text',
            ) || '-'}
          </Latex>
        </div>
      </>
    );
  };

  return (
    <>
      <CorrectAnswer />
      {playLog ? <StudentAnswer /> : <IncorrectAnswer />}
    </>
  );
};

const Pairing = ({
  question,
  mainLanguage,
  playLog,
}: {
  question: Question;
  mainLanguage: LevelItem['language']['language'];
  playLog?: LevelPlayLogItem | null;
}) => {
  const playLogAnswer = playLog?.answer as LevelPlayLogPairingAnswer[];

  const textChoices = question?.text_choices as TranslationChoice[];
  const textChoicesCorrect = question?.text_choices?.filter(
    (choice) => choice.is_correct,
  ) as TranslationChoice[];
  const textChoicesIncorrect = question?.text_choices?.filter(
    (choice) => !choice.is_correct,
  ) as TranslationChoice[];

  const imageChoices = question?.image_choices as TranslationChoice[];
  const imageChoicesCorrect = question?.image_choices?.filter(
    (choice) => choice.is_correct,
  ) as TranslationChoice[];
  const imageChoicesIncorrect = question?.image_choices?.filter(
    (choice) => !choice.is_correct,
  ) as TranslationChoice[];

  const textGroup = question?.groups;

  const filterChoices = (groupIndex: number) => {
    if (mainLanguage) {
      if (question?.choice_type === 'text-speech' || question?.choice_type === 'speech') {
        return textChoicesCorrect?.filter((choice) =>
          choice.group_indexes?.includes(groupIndex),
        );
      } else {
        return imageChoicesCorrect?.filter((choice) =>
          choice.group_indexes?.includes(groupIndex),
        );
      }
    }
    return [];
  };

  const getGroupFromId = (id: number) => {
    return textGroup?.find((group) => group.index === id);
  };

  const getChoiceFromId = (id: number) => {
    if (question?.choice_type === 'text-speech' || question?.choice_type === 'speech') {
      return textChoices?.find((choice) => choice.id === id);
    } else if (question?.choice_type === 'image') {
      return imageChoices?.find((choice) => choice.id === id);
    }
    return null;
  };

  const CorrectAnswer = () => {
    return (
      <>
        <div className="font-bold">ตัวเลือกคำตอบถูก</div>
        {textGroup?.map((group, index) => (
          <div key={index} className="flex flex-col gap-2">
            <div className="font-bold">
              กลุ่ม{' '}
              <Latex>
                {getTranslation(group.translations, mainLanguage, 'text') || '-'}
              </Latex>
            </div>
            <div className="grid grid-cols-3 gap-2 pl-4">
              {question?.choice_type === 'text-speech' ||
              question?.choice_type === 'speech'
                ? filterChoices(group.index)?.map((choice, index) => (
                    <div key={index} className="">
                      <Latex>
                        {getTranslation(choice.translations, mainLanguage, 'text') || '-'}
                      </Latex>
                    </div>
                  ))
                : filterChoices(group.index)?.map((choice, index) => (
                    <img
                      key={index}
                      src={choice.image_url}
                      alt=""
                      className="h-auto w-16"
                    />
                  ))}
            </div>
          </div>
        ))}
      </>
    );
  };

  const IncorrectAnswer = () => {
    return (
      <>
        <div className="font-bold">ตัวเลือกคำตอบผิด</div>
        {question?.choice_type === 'text-speech' || question?.choice_type === 'speech'
          ? textChoicesIncorrect?.map((choice, index) => (
              <div key={index} className="pl-4">
                <Latex>
                  {getTranslation(choice.translations, mainLanguage, 'text') || '-'}
                </Latex>
              </div>
            ))
          : imageChoicesIncorrect?.map((choice, index) => (
              <img
                key={index}
                src={choice.image_url}
                alt=""
                className="h-auto w-16 pl-4"
              />
            ))}
      </>
    );
  };

  const StudentAnswer = () => {
    const answerByGroup = playLogAnswer?.reduce(
      (acc, answer) => {
        if (!acc[answer.group_id]) {
          acc[answer.group_id] = [];
        }
        acc[answer.group_id].push(answer);
        return acc;
      },
      {} as Record<number, LevelPlayLogPairingAnswer[]>,
    );

    return (
      <>
        <div className="font-bold">คำตอบของนักเรียน</div>
        {Object.entries(answerByGroup).map(([groupIndex, answers], index) => (
          <div key={index} className="flex flex-col gap-2">
            <div className="font-bold">
              กลุ่ม{' '}
              <Latex>
                {getTranslation(
                  getGroupFromId(+groupIndex)?.translations,
                  mainLanguage,
                  'text',
                ) || '-'}
              </Latex>
            </div>
            <div className="grid grid-cols-3 gap-2 pl-4">
              {question?.choice_type === 'text-speech' ||
              question?.choice_type === 'speech'
                ? answers.map((answer, index) => (
                    <div key={index} className="">
                      <Latex>
                        {getTranslation(
                          getChoiceFromId(answer.choice_id)?.translations,
                          mainLanguage,
                          'text',
                        ) || '-'}
                      </Latex>
                    </div>
                  ))
                : answers.map((answer, index) => (
                    <img
                      key={index}
                      src={getChoiceFromId(answer.choice_id)?.image_url}
                      alt=""
                      className="h-auto w-16"
                    />
                  ))}
            </div>
          </div>
        ))}
      </>
    );
  };

  return (
    <>
      <CorrectAnswer />
      {playLog ? <StudentAnswer /> : <IncorrectAnswer />}
    </>
  );
};

const Sorting = ({
  question,
  mainLanguage,
  playLog,
}: {
  question: Question;
  mainLanguage: LevelItem['language']['language'];
  playLog?: LevelPlayLogItem | null;
}) => {
  const playLogAnswer = playLog?.answer as LevelPlayLogSortingAnswer[];

  const textChoices = question?.text_choices as TranslationChoice[];
  const textChoicesCorrect = question?.text_choices?.filter(
    (choice) => choice.is_correct,
  ) as TranslationChoice[];
  const textChoicesIncorrect = question?.text_choices?.filter(
    (choice) => !choice.is_correct,
  ) as TranslationChoice[];

  const imageChoices = question?.image_choices as TranslationChoice[];
  const imageChoicesCorrect = question?.image_choices?.filter(
    (choice) => choice.is_correct,
  ) as TranslationChoice[];
  const imageChoicesIncorrect = question?.image_choices?.filter(
    (choice) => !choice.is_correct,
  ) as TranslationChoice[];

  const getChoiceFromId = (id: number) => {
    if (question?.choice_type === 'text-speech' || question?.choice_type === 'speech') {
      return textChoices?.find((choice) => choice.id === id);
    } else if (question?.choice_type === 'image') {
      return imageChoices?.find((choice) => choice.id === id);
    }
    return null;
  };

  const CorrectAnswer = () => {
    return (
      <>
        <div className="font-bold">ตัวเลือกคำตอบถูก</div>
        {question?.choice_type === 'text-speech' || question?.choice_type === 'speech'
          ? textChoicesCorrect?.map((choice, index) => (
              <div key={index} className="grid grid-cols-5 pl-4">
                <div className="col-span-1">#{choice.index}</div>
                <div className="col-span-4">
                  <Latex>
                    {getTranslation(choice.translations, mainLanguage, 'text') || '-'}
                  </Latex>
                </div>
              </div>
            ))
          : imageChoicesCorrect?.map((choice, index) => (
              <img
                key={index}
                src={choice.image_url}
                alt=""
                className="h-auto w-16 pl-4"
              />
            ))}
      </>
    );
  };

  const IncorrectAnswer = () => {
    return (
      <>
        <div className="font-bold">ตัวเลือกคำตอบผิด</div>
        {question?.choice_type === 'text-speech' || question?.choice_type === 'speech'
          ? textChoicesIncorrect?.map((choice, index) => (
              <div key={index} className="pl-4">
                <Latex>
                  {getTranslation(choice.translations, mainLanguage, 'text') || '-'}
                </Latex>
              </div>
            ))
          : imageChoicesIncorrect?.map((choice, index) => (
              <img
                key={index}
                src={choice.image_url}
                alt=""
                className="h-auto w-16 pl-4"
              />
            ))}
      </>
    );
  };

  const StudentAnswer = () => {
    return (
      <>
        <div className="font-bold">คำตอบของนักเรียน</div>
        <div className="pl-4">
          {playLogAnswer
            ?.sort((a, b) => a.answer_index - b.answer_index)
            ?.map((answer, index) => (
              <div key={index} className="grid grid-cols-5">
                <div className="col-span-1">#{answer.answer_index}</div>
                <div className="col-span-4">
                  <Latex>
                    {getTranslation(
                      getChoiceFromId(answer.choice_id)?.translations,
                      mainLanguage,
                      'text',
                    ) || '-'}
                  </Latex>
                </div>
              </div>
            ))}
          {playLogAnswer?.length === 0 && '-'}
        </div>
      </>
    );
  };

  return (
    <>
      <CorrectAnswer />
      {playLog ? <StudentAnswer /> : <IncorrectAnswer />}
    </>
  );
};

const Placeholder = ({
  question,
  mainLanguage,
  playLog,
}: {
  question: Question;
  mainLanguage?: LevelItem['language']['language'];
  playLog?: LevelPlayLogItem | null;
}) => {
  const playLogAnswer = playLog?.answer as LevelPlayLogPlaceholderAnswer[];

  const textChoices = question?.text_choices as TextChoice[];
  const textChoicesCorrect = question?.text_choices?.filter(
    (choice) => choice.is_correct,
  ) as TextChoice[];

  const descriptions = question?.descriptions;

  const getChoiceText = (textChoiceIndex: AnswerPlaceholderProps['text']) => {
    const choiceIndexs = textChoiceIndex.map((choice) => choice.choice_index);
    const choiceIndexsTextChoicesCorrect = textChoicesCorrect.filter((choice) =>
      choiceIndexs.includes(choice.index),
    );
    return choiceIndexsTextChoicesCorrect.map((choice) => choice.text).join(', ');
  };

  const getChoiceFromId = (id: number) => {
    return textChoices?.find((choice) => choice.id === id);
  };

  const CorrectAnswer = () => {
    return (
      <>
        <div className="font-bold">ตัวเลือกคำตอบถูก</div>
        {descriptions?.map((description, index) => (
          <div key={index} className="">
            <div className="font-bold">โจทย์#{description.index}</div>
            <div className="pl-4">
              <Latex>{description.text}</Latex>
            </div>
            <div className="font-bold">เฉลย</div>
            {description.answers?.map((answer, index) => (
              <div key={index} className="grid grid-cols-5 pl-4">
                <div className="col-span-1">{`{Ans${answer.index}}`}</div>
                <span key={index} className="col-span-4">
                  <Latex>{getChoiceText(answer.text)}</Latex>
                </span>
              </div>
            ))}
          </div>
        ))}
      </>
    );
  };

  const StudentAnswer = () => {
    const answerByDescriptionIndex = playLogAnswer?.reduce(
      (acc, answer) => {
        if (!acc[answer.description_index]) {
          acc[answer.description_index] = [];
        }
        acc[answer.description_index].push(answer);
        return acc;
      },
      {} as Record<number, LevelPlayLogPlaceholderAnswer[]>,
    );

    return (
      <>
        <div className="font-bold">คำตอบของนักเรียน</div>
        {descriptions?.map((description, index) => (
          <div key={index} className="">
            <div className="font-bold">โจทย์#{description.index}</div>
            {description.answers?.map((answer, index) => (
              <div key={index} className="grid grid-cols-5 pl-4">
                <div className="col-span-1">{`{Ans${answer.index}}`}</div>
                {answerByDescriptionIndex[description.index]?.map((answer, index) => (
                  <span key={index} className="col-span-4">
                    <Latex>{getChoiceFromId(answer.choice_id)?.text || ''}</Latex>
                  </span>
                ))}
                {!answerByDescriptionIndex?.[description?.index] && (
                  <span className="col-span-4">-</span>
                )}
              </div>
            ))}
          </div>
        ))}
      </>
    );
  };

  return (
    <>
      <CorrectAnswer />
      {playLog ? <StudentAnswer /> : null}
    </>
  );
};

const FormInput = ({
  question,
  mainLanguage,
  playLog,
}: {
  question: Question;
  mainLanguage?: LevelItem['language']['language'];
  playLog?: LevelPlayLogItem | null;
}) => {
  const playLogAnswer = playLog?.answer as LevelPlayLogInputAnswer[];

  const descriptions = question?.descriptions;

  const getChoiceText = (textChoiceIndex: AnswerPlaceholderProps['text']) => {
    return textChoiceIndex.map((choice) => choice.text).join(', ');
  };

  const CorrectAnswer = () => {
    return (
      <>
        <div className="font-bold">ตัวเลือกคำตอบถูก</div>
        {descriptions?.map((description, index) => (
          <div key={index} className="">
            <div className="font-bold">โจทย์#{description.index}</div>
            <div className="pl-4">
              <Latex>{description.text}</Latex>
            </div>
            <div className="font-bold">เฉลย</div>
            {description.answers?.map((answer, index) => (
              <div key={index} className="grid grid-cols-5 pl-4">
                <div className="col-span-1">{`{Ans${answer.index}}`}</div>
                <span key={index} className="col-span-4">
                  <Latex>{getChoiceText(answer.text)}</Latex>
                </span>
              </div>
            ))}
          </div>
        ))}
      </>
    );
  };

  const StudentAnswer = () => {
    const answerByDescriptionIndex = playLogAnswer?.reduce(
      (acc, answer) => {
        if (!acc[answer.description_index]) {
          acc[answer.description_index] = [];
        }
        acc[answer.description_index].push(answer);
        return acc;
      },
      {} as Record<number, LevelPlayLogInputAnswer[]>,
    );

    return (
      <>
        <div className="font-bold">คำตอบของนักเรียน</div>
        {descriptions?.map((description, index) => (
          <div key={index}>
            <div className="font-bold">โจทย์#{description.index}</div>
            {description.answers?.map((answer, index) => (
              <div key={index} className="grid grid-cols-5 pl-4">
                <div className="col-span-1">{`{Ans${answer.index}}`}</div>
                {answerByDescriptionIndex[description.index]?.map((ans, index) => (
                  <React.Fragment key={index}>
                    {answer.index === ans.answer_index && (
                      <span className="col-span-4">
                        <Latex>{ans.answer}</Latex>
                      </span>
                    )}
                  </React.Fragment>
                ))}
                {!answerByDescriptionIndex?.[description?.index] && (
                  <span className="col-span-4">-</span>
                )}
              </div>
            ))}
          </div>
        ))}
      </>
    );
  };

  return (
    <>
      <CorrectAnswer />
      {playLog ? <StudentAnswer /> : null}
    </>
  );
};

export default FormAnswerSelect;

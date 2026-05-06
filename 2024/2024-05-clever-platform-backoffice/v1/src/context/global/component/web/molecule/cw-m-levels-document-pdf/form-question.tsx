import {
  LevelItem,
  Question,
  QuestionDescriptions,
  TextChoice,
  TranslationChoice,
} from '@domain/g02/g02-d05/local/type';
import { getTranslation } from '@domain/g02/g02-d05/local/util';
import { Text, View, Image } from '@react-pdf/renderer';
import { styles } from '.';
import { getQuestionType } from '@global/utils/levelConvert';

const FormQuestion = ({
  question,
  mainLanguage,
}: {
  question: Question;
  mainLanguage: LevelItem['language']['language'];
}) => {
  return (
    <>
      <Text style={styles.textBold}>รูปแบบคำถาม</Text>
      <Text style={[{ marginLeft: 8 }]}>{getQuestionType(question?.question_type)}</Text>

      <Text style={styles.textBold}>คำสั่ง</Text>
      <Text style={[{ marginLeft: 8 }]}>
        {getTranslation(question?.command_text.translations, mainLanguage, 'text') || '-'}
      </Text>

      <Text style={styles.textBold}>โจทย์</Text>
      <Text style={[{ marginLeft: 8 }]}>
        {getTranslation(question?.description_text.translations, mainLanguage, 'text') ||
          '-'}
      </Text>

      <Text style={styles.textBold}>คำใบ้</Text>
      <Text style={[{ marginLeft: 8 }]}>
        {getTranslation(question?.hint_text.translations, mainLanguage, 'text') || '-'}
      </Text>

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
        <Text style={styles.textBold}>ตัวเลือก</Text>
        <View style={styles.gridColumn2}>
          {labeledChoices.map((choice, index) => (
            <View key={index} style={styles.gridItem}>
              {question?.choice_type === 'text-speech' ||
              question?.choice_type === 'speech' ? (
                <Text>
                  {choice.label} {choice.content}
                </Text>
              ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text>{choice.label}</Text>
                  <Image
                    src={choice.content}
                    style={{ width: 64, height: 64, marginLeft: 8 }}
                  />
                </View>
              )}
            </View>
          ))}
        </View>
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
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          {/* Groups Column */}
          <View style={{ flex: 1, marginRight: 16 }}>
            <Text style={styles.textBold}>กลุ่ม</Text>
            {textGroup?.map((group, index) => (
              <View
                key={index}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: 4,
                  paddingRight: '30%',
                }}
              >
                <Text>
                  {getTranslation(group.translations, mainLanguage, 'text') ||
                    `group_${index + 1}`}
                </Text>
                <Text>•</Text>
              </View>
            ))}
          </View>

          {/* Choices Column */}
          <View style={{ flex: 1 }}>
            <Text style={styles.textBold}>ตัวเลือก</Text>
            {question?.choice_type === 'text-speech' || question?.choice_type === 'speech'
              ? textChoices.map((choice, index) => (
                  <Text key={index} style={{ marginBottom: 4 }}>
                    •{' '}
                    {getTranslation(choice.translations, mainLanguage, 'text') ||
                      `choice_${index + 1}`}
                  </Text>
                ))
              : imageChoices.map((choice, index) => (
                  <View
                    key={index}
                    style={{
                      marginBottom: 4,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                  >
                    <Text>• </Text>
                    <Image
                      key={index}
                      src={choice.image_url}
                      style={{ width: 64, height: 64 }}
                    />
                  </View>
                ))}
          </View>
        </View>
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
        <Text style={styles.textBold}>ตัวเลือก</Text>
        <View style={styles.gridColumn2}>
          {labeledChoices.map((choice, index) => (
            <View key={index} style={styles.gridItem}>
              {question?.choice_type === 'text-speech' ||
              question?.choice_type === 'speech' ? (
                <Text>
                  {choice.label} {choice.content}
                </Text>
              ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text>{choice.label}</Text>
                  <Image
                    src={choice.content}
                    style={{ width: 64, height: 64, marginLeft: 8 }}
                  />
                </View>
              )}
            </View>
          ))}
        </View>
        <Text style={styles.textBold}>คำตอบ</Text>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 8,
          }}
        >
          {labeledChoices.map((choice, index) => (
            <View
              key={index}
              style={{
                borderWidth: 1,
                borderColor: '#000',
                height: 32,
                width: '7%',
                marginBottom: 8,
              }}
            ></View>
          ))}
        </View>
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
          return (
            <Text key={index} style={[styles.input, { width: '10%' }]}>
              {' '}
            </Text>
          );
        }

        const answerText = getChoiceFromIndex(answer.text[0].choice_index);

        return (
          <Text key={index} style={[styles.input, { width: '10%' }]}>
            <Text
              style={{
                opacity: 0.3,
                fontSize: 14,
              }}
            >{`(${answerText.length})`}</Text>
          </Text>
        );
      }

      // Return normal text for non-placeholder parts
      return <Text key={index}>{part}</Text>;
    });

    return elements;
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
        <Text style={styles.textBold}>ตัวเลือก</Text>
        <View style={styles.gridColumn2}>
          {labeledChoices.map((choice, index) => (
            <View key={index} style={styles.gridItem}>
              <Text>
                {choice.label} {choice.content}
              </Text>
            </View>
          ))}
        </View>
        <Text style={styles.textBold}>โจทย์</Text>
        {shuffledDescriptions?.map((description, index) => (
          <View key={index} style={{ marginBottom: 8, marginLeft: 8 }}>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 4,
              }}
            >
              <Text>{index + 1}. </Text>
              {getDescriptionText(description)}
            </View>
          </View>
        ))}
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
            <Text key={index} style={[styles.input, { width: '10%' }]}>
              {' '}
            </Text>
          );
        }

        const answerText = answer.text?.[0]?.text || '';

        return (
          <Text key={index} style={[styles.input, { width: '10%' }]}>
            <Text
              style={{
                opacity: 0.3,
                fontSize: 14,
              }}
            >{`(${answerText.length})`}</Text>
          </Text>
        );
      }

      // Return normal text for non-placeholder parts
      return <Text key={index}>{part}</Text>;
    });

    return elements;
  };

  const shuffledDescriptions = shuffleArray(
    descriptions || [],
  ) as Question['descriptions'];

  const AnswerSelect = () => {
    return (
      <>
        <Text style={styles.textBold}>โจทย์</Text>
        {shuffledDescriptions?.map((description, index) => (
          <View key={index} style={{ marginBottom: 8, marginLeft: 8 }}>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 4,
              }}
            >
              <Text>{index + 1}. </Text>
              {getDescriptionText(description)}
            </View>
          </View>
        ))}
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

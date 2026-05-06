import { Divider } from '@core/design-system/library/vristo/source/components/Divider';
import {
  Checkbox,
  Radio,
} from '@core/design-system/library/vristo/source/components/Input';
import { FormAnswerProps } from '.';
import InputTranslate from '../../atom/InputTranslate';

const FormPairing = ({
  inputAnswerGroupList,
  inputAnswerList,
  handleChangeOptions,
  handleShowModalTranslate,
  inputCorrectText,
  inputWrongText,
  selectedCanReuseChoice,
  answerType,
}: FormAnswerProps) => {
  return (
    <div className="flex flex-col gap-2">
      {inputAnswerGroupList &&
        inputAnswerGroupList.map((itemGroup, groupIndex) => (
          <div className="flex flex-col justify-center gap-4" key={groupIndex}>
            <div className="font-bold">{itemGroup.value}</div>
            <div className="grid grid-cols-3 gap-2">
              {[...(inputAnswerList ?? [])]
                ?.sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
                .map((itemAnswer, answerIndex) => (
                  <FormAnswerType
                    key={answerIndex}
                    itemAnswer={itemAnswer}
                    itemGroup={itemGroup}
                    answerType={answerType}
                    handleChangeOptions={handleChangeOptions}
                    selectedCanReuseChoice={selectedCanReuseChoice}
                    inputAnswerGroupList={inputAnswerGroupList}
                  />
                ))}
            </div>
            <Divider />
          </div>
        ))}
      <InputTranslate
        callback={(value) => handleChangeOptions?.('inputCorrectText', '', value)}
        handleShowModalTranslate={handleShowModalTranslate}
        label="คำอธิบายเมื่อคำตอบถูก"
        placeholder="คำตอบถูกต้อง"
        // required
        value={inputCorrectText}
      />
      <InputTranslate
        callback={(value) => handleChangeOptions?.('inputWrongText', '', value)}
        handleShowModalTranslate={handleShowModalTranslate}
        label="คำอธิบายเมื่อคำตอบผิด"
        placeholder="คำตอบผิด"
        value={inputWrongText}
      />
    </div>
  );
};

const FormAnswerType = ({
  itemAnswer,
  itemGroup,
  handleChangeOptions,
  selectedCanReuseChoice,
  inputAnswerGroupList,
  answerType,
}: {
  itemAnswer: NonNullable<FormAnswerProps['inputAnswerList']>[0];
  itemGroup: NonNullable<FormAnswerProps['inputAnswerGroupList']>[0];
  handleChangeOptions: FormAnswerProps['handleChangeOptions'];
  selectedCanReuseChoice: FormAnswerProps['selectedCanReuseChoice'];
  inputAnswerGroupList: FormAnswerProps['inputAnswerGroupList'];
  answerType: FormAnswerProps['answerType'];
}) => {
  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChangeOptions?.(
      `answer_group_answer_${itemGroup.index}_${itemAnswer.index}`,
      e.target.checked.toString(),
    );
    if (!selectedCanReuseChoice) {
      inputAnswerGroupList?.forEach((item) => {
        if (item.index === itemGroup.index) {
          return;
        }
        handleChangeOptions?.(
          `answer_group_answer_${item.index}_${itemAnswer.index}`,
          'false',
        );
      });
    }
  };

  return (
    <>
      {selectedCanReuseChoice ? (
        <Checkbox
          label={
            answerType === 'image' ? `คำตอบที่ #${itemAnswer.index}` : itemAnswer.value
          }
          onChange={(e) => handleCheck(e)}
          checked={itemAnswer.group_indexes?.includes(itemGroup?.index || -1)}
        />
      ) : (
        <Radio
          name={`answer_${itemAnswer.index}`}
          label={
            answerType === 'image' ? `คำตอบที่ #${itemAnswer.index}` : itemAnswer.value
          }
          onChange={(e) => {
            handleCheck(e);
          }}
          checked={itemAnswer.group_indexes?.includes(itemGroup?.index || -1)}
        />
      )}
    </>
  );
};

export default FormPairing;

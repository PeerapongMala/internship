import Modal from '@global/component/web/molecule/wc-m-modal-gameplay';
import { useEffect, useState } from 'react';
import Latex from 'react-latex-next';
import { GameConfig, GroupType } from '../../../type';
import AnswerImage from '../atoms/wc-a-answer-image';
import AnswerSound from '../atoms/wc-a-answer-sound';
import AnswerText from '../atoms/wc-a-answer-text';

const ModalGroup = ({
  showModal,
  setShowModal,
  groupIndex,
  gameConfig,
  onCanceled,
  handleZoom
}: {
  showModal: boolean;
  setShowModal: any;
  groupIndex: number;
  gameConfig: GameConfig;
  onCanceled: (groupIndex: number, answerIndex: number) => void;
  handleZoom?: (img: string) => void;
}) => {
  const [group, setGroup] = useState<GroupType>();
  const [answerList, setAnswerList] = useState<GameConfig['answerList']>([]);
  const [answerType, setAnswerType] = useState<string>('text-speech');

  useEffect(() => {
    const findGroup = gameConfig.groupList?.find((item) => item.index === groupIndex);

    if (findGroup) {
      const answerList = gameConfig.answerList?.filter((item) =>
        findGroup.groupDetails?.includes(item.choice ?? ''),
      );
      if (answerList) {
        setAnswerList(answerList);
      }

      setGroup(findGroup);
    }

    if (gameConfig.answerType) {
      setAnswerType(gameConfig.answerType);
    }
  }, [gameConfig, groupIndex]);


  return (
    <>
      {showModal ? (
        <Modal
          setShowModal={setShowModal}
          title={<Latex>{group?.groupName || ""}</Latex>}
          className="h-auto w-[60rem]"
          customBody={
            <div className="grid grid-cols-2 min-h-[350px]  h-full w-full gap-10 px-10 py-5">
              {answerList?.map((item, index) => (
                <>
                  {answerType === 'text-speech' && (
                    <AnswerText
                      key={index}
                      className="!w-full"
                      id={`answer-${item.index}`}
                      choice={item.choice}
                      answer={item.answer}
                      onCanceled={() => onCanceled(groupIndex, item.index)}
                    />
                  )}
                  {answerType === 'image' && (
                    <AnswerImage
                      key={index}
                      className="!w-[400px] aspect-square object-cover rounded-[30px] z-[50]"
                      image={item.imageUrl}
                      id={`answer-${item.index}`}
                      choice={item.choice}
                      onCanceled={() => onCanceled(groupIndex, item.index)}
                      is_openZoom={true}
                      onZoom={handleZoom}
                    />
                  )}
                  {answerType === 'speech' && (
                    <AnswerSound
                      key={index}
                      className="!w-fit"
                      id={`answer-${item.index}`}
                      choice={item.choice}
                      sound={item?.speechUrl}
                      onCanceled={() => onCanceled(groupIndex, item.index)}
                    />
                  )}
                </>
              ))}
            </div>
          }
        />
      ) : null}
    </>
  );
};

export default ModalGroup;

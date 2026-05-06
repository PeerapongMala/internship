import ImageEmptyGroup from '@context/domain/g04/g04-d03/g04-d03-p01-gameplay-quiz/assets/group-empty.svg';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Latex from 'react-latex-next';
import { ReactSortable } from 'react-sortablejs';
import ConfigJson from '../../../config/index.json';
import { AnswerContainerProps, AnswerProps, HandleChange, ItemType } from '../../../type';
import AnswerGroup from '../atoms/wc-a-answer-group';
import DropComponent from './wc-m-drop-component';

interface GroupComponentProps {
  dataList?: Array<{ groupName: string; groupDetails: string[] }>;
  pattern?: string;
  handleChange?: HandleChange;
  questionType: AnswerContainerProps['questionType'];
  answerListSort?: AnswerProps[];
  handleGroup?: (groupIndex: number) => void;
  dragging?: boolean;
  itemsInDrop?: ItemType[];
}

const GroupOrDropComponent: React.FC<GroupComponentProps> = ({
  questionType,
  dataList,
  pattern,
  handleChange,
  answerListSort,
  handleGroup,
  dragging,
  itemsInDrop,
}) => {
  const { t } = useTranslation([ConfigJson.key]);
  const [state, setState] = useState<ItemType[]>([]);

  useEffect(() => {
    if (itemsInDrop && itemsInDrop.length > 0) {
      setState(itemsInDrop);
    }
  }, [itemsInDrop]);

  return (
    <>
      {questionType === 'pairing' ? (
        <GroupComponent
          questionType={questionType}
          dataList={dataList}
          pattern={pattern}
          handleChange={handleChange}
          handleGroup={handleGroup}
          dragging={dragging}
        />
      ) : (
        <div className="relative h-full border-[8px] border-white rounded-[34px] p-4 overflow-auto scrollbar-hidden">
          <DropComponent
            className="flex flex-wrap justify-center h-full w-full gap-4"
            answerListSort={answerListSort}
            groupName="shared"
            handleChange={handleChange}
            state={state}
            setState={setState}
          />
          {state?.length === 0 && (
            <div className="absolute w-1/2 h-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="flex flex-col w-full h-full items-center justify-center">
                <img
                  src={ImageEmptyGroup}
                  alt={t('groupOrDrop.emptyGroupImage', 'ภาพกลุ่มว่างเปล่า')}
                  className="w-16"
                />
                <div className="bg-white rounded-full p-2 px-5 mt-2">
                  <p className="font-semibold text-blue-500">
                    {t('groupOrDrop.dragAnswerHere', 'ลากคำตอบมาวางที่นี่')}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

const GroupComponent: React.FC<GroupComponentProps> = ({
  dataList = [
    { groupName: 'Group A', groupDetails: ['A', 'B', 'C'] },
    { groupName: 'Group D', groupDetails: ['A', 'B', 'C'] },
    { groupName: 'Group D', groupDetails: ['A', 'B', 'C'] },
    { groupName: 'Group D', groupDetails: ['A', 'B', 'C'] },
    { groupName: 'Group D', groupDetails: ['A', 'B', 'C'] },
    { groupName: 'Group D', groupDetails: ['A', 'B', 'C'] },
  ],
  pattern = '2-col',
  handleChange,
  handleGroup,
  dragging,
}) => {
  const { t } = useTranslation([ConfigJson.key]);
  const ref = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState({
    top: 0,
    left: 0,
    height: 0,
    width: 0,
  });
  const dataPerRowOrCol: any[] = [];
  const [number, type] = pattern.split('-');
  const noAnswersText = t('groupOrDrop.noAnswers', 'ไม่มีคำตอบ');

  const count = parseInt(number, 10);

  if (type === 'col') {
    let dataRow: any[] = [];
    dataList.forEach((data, index) => {
      dataRow.push(data);
      if ((index + 1) % count === 0) {
        dataPerRowOrCol.push(dataRow);
        dataRow = [];
      }
    });

    if (dataRow.length > 0) {
      dataPerRowOrCol.push(dataRow);
    }
  } else if (type === 'row') {
    const rows = count;
    const cols = Math.ceil(dataList.length / rows);

    for (let i = 0; i < rows; i++) {
      const dataRow: any[] = [];
      for (let j = 0; j < cols; j++) {
        const index = i + j * rows;
        if (index < dataList.length) {
          dataRow.push(dataList[index]);
        }
      }
      dataPerRowOrCol.push(dataRow);
    }
  }
  useEffect(() => {
    // border-[8px] border-white rounded-[34px]
    // get parent ref
    const parent = ref.current?.parentElement;
    if (parent) {
      parent.style.borderRadius = '34px';
      parent.style.borderWidth = '8px';
      parent.style.borderColor = 'white';
    }

    const handleScroll = (event: Event) => {
      const scrollTop = (event.target as HTMLElement).scrollTop;
      const scrollLeft = (event.target as HTMLElement).scrollLeft;
      const scrollHeight = (event.target as HTMLElement).scrollHeight;
      const scrollWidth = (event.target as HTMLElement).scrollWidth;

      if (!dragging) {
        // console.log("not dragging", scrollPosition);

        setScrollPosition({
          top: scrollTop,
          left: scrollLeft,
          height: scrollHeight,
          width: scrollWidth,
        });
      } else {
        // console.log("dragging", scrollPosition);
        if (ref.current && dragging) {
          const { top, left, height, width } = scrollPosition;
          ref.current.scrollTop = top;
          ref.current.scrollLeft = left;
          // ref.current.style.height = `${height}px`;
          // ref.current.style.width = `${width}px`;
        }
      }
    };

    const currentRef = ref.current;
    if (currentRef) {
      currentRef.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (currentRef) {
        currentRef.removeEventListener('scroll', handleScroll);
      }
    };
  }, [ref, dragging]);

  return (
    <div ref={ref} className={`h-full p-4 overflow-auto scrollbar-hidden`}>
      {dataPerRowOrCol.map((data, index) => (
        <div key={index} className="flex gap-4 h-auto mb-4 font-medium">
          {data.map((item: any, idx: number) => (
            <ReactSortable
              key={idx}
              list={[]}
              setList={() => { }}
              className={'w-full !h-auto min-w-28'}
              group={{
                name: 'shared',
                pull: 'clone',
                put: true,
              }}
              sort={false}
              onAdd={(evt) => {
                const eItem = evt.clone;
                const dataId = eItem.getAttribute('data-id');
                if (dataId) {
                  handleChange?.('answerDropGroup', `${item.index}_${dataId}`);
                }
              }}
              ghostClass={'!hidden'}
              handle={'.handle'}
            >
              <AnswerGroup
                key={idx}
                onClick={() => handleGroup?.(item.index)}
                id={`answer_group_${index}_${idx}`}
              >
                <div className="flex flex-col justify-center items-center text-center h-full p-4 relative">
                  <div className=" font-medium text-gray-800 mb-2 leading-tight break-words w-full">
                    <Latex>{item.groupName}</Latex>
                  </div>

                  {item.groupDetails && item.groupDetails.length > 0 ? (
                    <div className=" text-primary/90 font-normal mt-1 px-4 w-full truncate  leading-relaxed break-words whitespace-pre-wrap">
                      {item.groupDetails.join(' | ')}
                    </div>
                  ) : (
                    <div className="text-gray-400 font-light mt-2 ">
                      {noAnswersText}
                    </div>
                  )}
                </div>
              </AnswerGroup>
            </ReactSortable>
          ))}
        </div>
      ))}
    </div>
  );
};

export default GroupOrDropComponent;

import { useEffect, useState } from 'react';
import { ReactSortable } from 'react-sortablejs';
import {
  AnswerContainerProps,
  AnswerProps,
  GameConfig,
  HandleChange,
} from '../../../type';
import AnswerImage from '../atoms/wc-a-answer-image';
import AnswerSound from '../atoms/wc-a-answer-sound';
import AnswerText from '../atoms/wc-a-answer-text';

interface ItemType extends AnswerProps {
  id: number;
}

const AnswerContainerComponent: React.FC<AnswerContainerProps> = ({
  dataList = [
    { id: 1, index: 1, choice: 'A', answer: 'Ans' },
    { id: 2, index: 2, choice: 'B', answer: 'Ansxxxxsssasds', disabled: true },
    { id: 3, index: 3, choice: 'C', answer: 'Ans', disabled: true },
    { id: 4, index: 4, choice: 'D', answer: 'Ans' },
    { id: 5, index: 5, answer: 'Ans' },
    { id: 6, index: 6, answer: 'Ans' },
  ],
  pattern = '2-col',
  answerType = 'text-speech',
  handleChange,
  draggable,
}) => {
  const [number, type] = pattern.split('-');
  const [newDataList, setNewDataList] = useState<ItemType[]>([]);
  const [dataPerRowOrCol, setDataPerRowOrCol] = useState<any[]>([]);

  const count = parseInt(number, 10);

  useEffect(() => {
    const dataPerRowOrCol: any[] = [];

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

    setDataPerRowOrCol(dataPerRowOrCol);
  }, [newDataList]);

  useEffect(() => {
    setNewDataList(
      dataList.map((item, index) => ({
        ...item,
        id: item.id,
      })),
    );
  }, [dataList]);

  const getClassname = () => {
    if (type === 'col') {
      return `grid grid-cols-${number} gap-4 mt-4`;
    } else if (type === 'row') {
      return `grid grid-rows-${number} grid-flow-col gap-4 mt-4`;
    }
    return '';
  };

  return (
    <div className="h-full p-4 overflow-hidden">
      <AnswerSortable
        handleChange={handleChange}
        state={newDataList}
        setState={setNewDataList}
        className={getClassname()}
        draggable={draggable}
        answerType={answerType}
      />
    </div>
  );
};

const AnswerSortable = ({
  draggable = true,
  handleChange,
  state,
  setState,
  className,
  answerType,
}: {
  draggable?: boolean;
  handleChange?: HandleChange;
  state: ItemType[];
  setState: any;
  className: string;
  answerType: GameConfig['answerType'];
}) => {
  const handleMove = (evt: any) => {
    console.log('handleMove', evt);
    handleChange?.('answerDragged', '');
  };
  return (
    <div className="h-full w-full overflow-auto scrollbar-hidden">
      <ReactSortable
        list={state}
        setList={() => { }}
        direction={'horizontal'}
        className={className}
        animation={150}
        group={{
          name: 'shared',
          pull: 'clone',
          put: false,
        }}
        sort={false}
        filter={'.filtered'}
        dragClass="w-fit"
        disabled={!draggable}
        onChoose={handleMove}
        onEnd={(evt) => {
          handleChange?.('answerDrop', '');
        }}
      >
        {state?.map((item) => (
          <div key={item.id} className={`w-full ${item.disabled ? 'filtered' : ''}`}>
            {answerType === 'text-speech' && (
              <AnswerText
                id={`answer-${item.id}`}
                choice={item.choice}
                answer={item.answer}
                disabled={item.disabled}
                selected={item.selected}
                onClick={() => handleChange?.('answerSelected', item.index.toString())}
              />
            )}
            {answerType === 'image' && (
              <AnswerImage
                id={`answer-${item.id}`}
                choice={item.choice}
                // answer={item.answer}
                disabled={item.disabled}
                selected={item.selected}
                image={item.imageUrl}
                onClick={() => handleChange?.('answerSelected', item.index.toString())}
              />
            )}
            {answerType === 'speech' && (
              <AnswerSound
                id={`answer-${item.id}`}
                choice={item.choice}
                sound={item?.speechUrl}
                disabled={item.disabled}
                selected={item.selected}
                onClick={() => handleChange?.('answerSelected', item.index.toString())}
              />
            )}
          </div>
        ))}
      </ReactSortable>
    </div>
  );
};

export default AnswerContainerComponent;

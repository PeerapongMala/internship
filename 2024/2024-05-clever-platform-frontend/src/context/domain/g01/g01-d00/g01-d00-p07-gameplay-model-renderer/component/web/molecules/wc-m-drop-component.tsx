import React, { useEffect } from 'react';
import { ReactSortable } from 'react-sortablejs';
import styles from '../../../index.module.css';
import { AnswerProps, HandleChange, ItemType } from '../../../type';
import AnswerText from '../atoms/wc-a-answer-drag';

type DropComponent = {
  className?: string;
  answerListSort?: AnswerProps[];
  groupName?: string;
  handleChange?: HandleChange;
  state: ItemType[];
  setState: React.Dispatch<React.SetStateAction<ItemType[]>>;
};

const DropComponent: React.FC<DropComponent> = ({
  className = '',
  answerListSort,
  groupName,
  handleChange,
  state,
  setState,
}) => {
  // Handle the order of the list after drag-and-drop
  const handleSetList = (list: AnswerProps[]) => {
    setState(
      list.map((item, index) => ({
        ...item,
        id: index,
      })),
    );
    const orderIndex = list.map((item) => item.index).join(',');
    handleChange?.('orderIndex', orderIndex);
  };

  // Remove an item when dragged out
  const handleCancel = (index: number) => {
    setState((prevState) => prevState.filter((item) => item.index !== index));
    const updatedState = state.filter((item) => item.index !== index); // use state prop
    handleSetList(updatedState);
  };

  // Detect when an item is dragged out
  const handleDragEnd = (event: any) => {
    if (!event.to) {
      const draggedIndex = event.item?.dataset?.index;
      if (draggedIndex) {
        handleCancel(Number(draggedIndex));
      }
    }
  };

  useEffect(() => {
    if (answerListSort) {
      setState(
        answerListSort.map((item, index) => ({
          ...item,
          id: index,
        })),
      );
    }
  }, [answerListSort]);

  return (
    <>
      <div className="overflow-visible h-[90%]">
        {/* Main Drop Area */}
        <ReactSortable
          list={state}
          setList={handleSetList}
          direction={'horizontal'}
          className={className}
          animation={150}
          group={groupName}
          ghostClass={styles['ghost']}
          onEnd={handleDragEnd} // Detect when dragging ends
        >
          {state?.map((item) => (
            <div key={item.id} className="w-fit min-w-16">
              <AnswerText
                id={`answer-${item.index}`}
                choice={item.choice}
                answer={item.answer}
                disabled={item.disabled}
                onCanceled={() => handleCancel(item.index)}
              />
            </div>
          ))}
        </ReactSortable>

        {/* Invisible Drop Zone (For Dragging Out) */}
        <ReactSortable
          list={[]} // Empty list to catch dragged items
          setList={() => { }} // Do nothing
          className="h-10 w-full opacity-0" // Invisible but still functional
          group={groupName}
          onAdd={(event) => {
            const draggedIndex = event.item?.dataset?.index;
            if (draggedIndex) {
              handleCancel(Number(draggedIndex));
            }
          }}
        />
      </div>
    </>
  );
};

export default DropComponent;

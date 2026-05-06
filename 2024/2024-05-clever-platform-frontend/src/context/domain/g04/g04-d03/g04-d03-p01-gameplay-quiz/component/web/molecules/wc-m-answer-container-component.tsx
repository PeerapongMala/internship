import { cn } from '@global/helper/cn';
import StoreGlobal from '@store/global';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ReactSortable, Sortable } from 'react-sortablejs';
import {
  AnswerContainerProps,
  answerProps,
  GameConfig,
  HandleChange,
} from '../../../type';
import AnswerImage from '../atoms/wc-a-answer-image';
import AnswerSound from '../atoms/wc-a-answer-sound';
import AnswerText from '../atoms/wc-a-answer-text';

interface ItemType extends answerProps {
  id: number;
}
let gameConfig: Partial<GameConfig> = {
  layout: '',
  position: '1',
  patternAnswer: ''
};
try {
  const configStr = localStorage.getItem('game-config');
  if (configStr) {
    gameConfig = JSON.parse(configStr);
  }
} catch (error) {
  console.error('Error parsing game-config from localStorage:', error);
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
  questionType,
  handleZoom
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
    <div
      className={` p-4 overflow-auto scrollbar-hidden
           ${gameConfig.position === '1' ? ' flex flex-col items-center justify-center' : ''}
        `}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="w-full max-w-full">
        <AnswerSortable
          handleChange={handleChange}
          state={newDataList}
          setState={setNewDataList}
          className={getClassname()}
          draggable={draggable}
          answerType={answerType}
          handleZoom={handleZoom}
        />
      </div>
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
  handleZoom
}: {
  draggable?: boolean;
  handleChange?: HandleChange;
  state: ItemType[];
  setState: any;
  className: string;
  answerType: GameConfig['answerType'];
  handleZoom?: (img: string) => void;
}) => {
  const { scale } = StoreGlobal.StateGet(['scale']);
  const { cursorPosition } = StoreGlobal.StateGet(['cursorPosition']);
  const [draggedItem, setDraggedItem] = useState<ItemType | null>(null);
  const [draggedItemDimensions, setDraggedItemDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [cleanupTimeout, setCleanupTimeout] = useState<NodeJS.Timeout | null>(null);

  const clearDragPreview = () => {
    setDraggedItem(null);
    setDraggedItemDimensions(null);
    if (cleanupTimeout) {
      clearTimeout(cleanupTimeout);
      setCleanupTimeout(null);
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (cleanupTimeout) {
        clearTimeout(cleanupTimeout);
      }
    };
  }, [cleanupTimeout]);

  const handleChoose = (evt: Sortable.SortableEvent) => {
    console.log('handleChoose', evt);
    handleChange?.('answerDragged', '');

    // Clear any existing timeout
    if (cleanupTimeout) {
      clearTimeout(cleanupTimeout);
    }

    // Get the item data from the dragged element
    const itemId = evt.item.getAttribute('data-id');
    if (itemId) {
      const foundItem = state.find((item) => item.id === Number(itemId));
      if (foundItem) {
        setDraggedItem(foundItem);
        setDraggedItemDimensions({
          width: evt.item.offsetWidth,
          height: evt.item.offsetHeight,
        });

        // Set a timeout to clean up the preview in case onEnd/onUnchoose doesn't fire
        const timeout = setTimeout(() => {
          clearDragPreview();
        }, 1000); // Clean up after 1 second if no proper drag event occurs
        setCleanupTimeout(timeout);
      }
    }
  };

  const handleStart = (evt: Sortable.SortableEvent) => {
    console.log('handleStart', evt);
    // Clear the cleanup timeout since we have a proper drag start
    if (cleanupTimeout) {
      clearTimeout(cleanupTimeout);
      setCleanupTimeout(null);
    }
  };

  const handleEnd = (evt: Sortable.SortableEvent) => {
    console.log('handleEnd', evt);
    handleChange?.('answerDrop', '');
    clearDragPreview();
  };

  const handleUnchoose = (evt: Sortable.SortableEvent) => {
    console.log('handleUnchoose', evt);
    // Clean up if drag was cancelled (e.g., just a click)
    clearDragPreview();
  };

  const renderAnswerItem = (item: ItemType) => {
    const commonProps = {
      id: `answer-${item.id}`,
      choice: item.choice,
      disabled: item.disabled,
      selected: item.selected,
      onClick: () => handleChange?.('answerSelected', item.index.toString()),
    };

    switch (answerType) {
      case 'text-speech':
        return <AnswerText {...commonProps} answer={item.answer} />;
      case 'image':
        return <AnswerImage {...commonProps} image={item.imageUrl} is_openZoom={true} onZoom={handleZoom} />;
      case 'speech':
        return <AnswerSound {...commonProps} sound={item.speechUrl} />;
      default:
        return <AnswerText {...commonProps} answer={item.answer} />;
    }
  };

  return (
    <div
      className="h-full w-full overflow-auto scrollbar-hidden"
      onContextMenu={(e) => e.preventDefault()}
    >
      <DragPreview
        item={draggedItem}
        dimensions={draggedItemDimensions}
        answerType={answerType}
        cursorPosition={cursorPosition || null}
        scale={scale || 1}
        handleZoom={handleZoom}
      />

      <ReactSortable
        list={state}
        setList={() => { }}
        direction="horizontal"
        className={className}
        animation={150}
        group={{
          name: 'shared',
          pull: 'clone',
          put: false,
        }}
        sort={false}
        filter=".filtered"
        disabled={!draggable}
        onChoose={handleChoose}
        onStart={handleStart}
        onEnd={handleEnd}
        onUnchoose={handleUnchoose}
        fallbackClass="hidden"
        forceFallback={true}
        delay={0}
      >
        {state?.map((item) => (
          <div
            key={item.id}
            data-id={item.id}
            className={cn('w-full', { filtered: item.disabled })}
          >
            {renderAnswerItem(item)}
          </div>
        ))}
      </ReactSortable>
    </div>
  );
};


interface DragPreviewProps {
  item: ItemType | null;
  dimensions: { width: number; height: number } | null;
  answerType: GameConfig['answerType'];
  cursorPosition: { x: number; y: number } | null | undefined;
  scale: number | undefined;
  handleZoom?: (img: string) => void;
}

const DragPreview: React.FC<DragPreviewProps> = ({
  item,
  dimensions,
  answerType,
  cursorPosition,
  scale = 1,
  handleZoom
}) => {
  if (!item || !cursorPosition) return null;

  const renderAnswerComponent = () => {
    const baseProps = {
      id: `drag-preview-${item.id}`,
      choice: item.choice,
      disabled: false,
      selected: false,
    };

    switch (answerType) {
      case 'text-speech':
        return <AnswerText {...baseProps} answer={item.answer} />;
      case 'image':
        return <AnswerImage {...baseProps} image={item.imageUrl} is_openZoom={true} onZoom={handleZoom} />;
      case 'speech':
        return <AnswerSound {...baseProps} sound={item.speechUrl} />;
      default:
        return <AnswerText {...baseProps} answer={item.answer} />;
    }
  };

  return createPortal(
    <div
      className="absolute z-50 pointer-events-none"
      style={{
        left: `${cursorPosition.x}px`,
        top: `${cursorPosition.y}px`,
        transform: `translate(-30%, -50%) scale(${scale})`,
      }}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div
        style={{
          width: dimensions?.width,
          height: dimensions?.height,
          opacity: 0.8,
        }}
      >
        {renderAnswerComponent()}
      </div>
    </div>,
    document.body
  );
};


export default AnswerContainerComponent;

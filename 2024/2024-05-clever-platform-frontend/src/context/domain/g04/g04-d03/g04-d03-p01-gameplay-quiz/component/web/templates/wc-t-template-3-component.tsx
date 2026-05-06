import { Alignment, answerProps, GameConfig, HandleChange } from '../../../type';
import AnswerContainerComponent from '../molecules/wc-m-answer-container-component';
import GroupOrDropComponent from '../molecules/wc-m-group-or-drop-component';
import LayoutContainerComponent from '../organisms/wc-o-layout-container-component';
import QuestionAndAnswerComponent from '../organisms/wc-o-question-and-answer-component';

const Template3C = ({
  handleZoom,
  handleHint,
  handleGroup,
  gameConfig,
  handleChange,
  handleTouchEnd,
  currentElementDraging,
  answerListSort,
  dragging,
}: {
  handleZoom: (img: string) => void;
  handleHint: (question: string) => void;
  handleGroup?: (groupIndex: number) => void;
  gameConfig: GameConfig;
  handleChange?: HandleChange;
  handleTouchEnd?: (position: { x: number; y: number }) => void;
  currentElementDraging?: HTMLElement | null;
  answerListSort?: answerProps[];
  dragging?: boolean;
}) => {
  return (
    <LayoutContainerComponent
      alignment={Alignment.Vertical}
      flex={[7, 3]}
      className="gap-7 px-4 pt-5 pb-2"
    >
      <LayoutContainerComponent
        alignment={Alignment.Horizontal}
        flex={(gameConfig.layout ? gameConfig.layout.split(':') : ['1', '1']).map(
          (item: string) => parseInt(item),
        )}
        className="gap-7"
      >
        <QuestionAndAnswerComponent
          gameConfig={gameConfig}
          handleHint={handleHint}
          handleZoom={handleZoom}
        />
        {gameConfig.position === '1' ? (
          <AnswerContainerComponent
            questionType={gameConfig.questionType}
            answerType={gameConfig.answerType}
            pattern={gameConfig.patternAnswer}
            dataList={gameConfig.answerList}
            handleChange={handleChange}
            handleTouchEnd={handleTouchEnd}
            currentElementDraging={currentElementDraging}
            handleZoom={handleZoom}
          />
        ) : (
          <GroupOrDropComponent
            handleGroup={handleGroup}
            questionType={gameConfig.questionType}
            pattern={gameConfig.patternGroup}
            dataList={gameConfig.groupList}
            handleChange={handleChange}
            answerListSort={answerListSort}
            dragging={dragging}
            itemsInDrop={gameConfig.itemsInDrop}
          />
        )}
      </LayoutContainerComponent>
      {gameConfig.position === '1' ? (
        <GroupOrDropComponent
          handleGroup={handleGroup}
          questionType={gameConfig.questionType}
          pattern={gameConfig.patternGroup}
          dataList={gameConfig.groupList}
          handleChange={handleChange}
          answerListSort={answerListSort}
          dragging={dragging}
          itemsInDrop={gameConfig.itemsInDrop}

        />
      ) : (
        <AnswerContainerComponent
          questionType={gameConfig.questionType}
          answerType={gameConfig.answerType}
          pattern={gameConfig.patternAnswer}
          dataList={gameConfig.answerList}
          handleChange={handleChange}
          handleTouchEnd={handleTouchEnd}
        />
      )}
      {/* <div className="bg-red-300 w-full h-full"></div> */}
    </LayoutContainerComponent>
  );
};

export default Template3C;

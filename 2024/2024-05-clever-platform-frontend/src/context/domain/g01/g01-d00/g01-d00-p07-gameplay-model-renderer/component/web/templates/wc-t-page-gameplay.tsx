import StoreGame from '@global/store/game';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ConfigJson from '../../../config/index.json';
import {
  AnswerPlaceholderProps,
  AnswerProps,
  GameConfig,
  QuestionListProps
} from '../../../type';

const PageGameplay = ({
  gameConfig,
  setGameConfig,
  handleZoom,
  handleHint,
  handleGroup,
  handleShowInput,
  setSelectedAnswer,
  setOrderIndex,
}: {
  gameConfig: GameConfig;
  setGameConfig: (value: GameConfig) => void;
  handleZoom: (img: string) => void;
  handleHint: (question: string) => void;
  handleGroup: (groupIndex: number) => void;
  handleShowInput: (question: QuestionListProps, answer: AnswerPlaceholderProps) => void;
  setSelectedAnswer: (answer: AnswerProps) => void;
  setOrderIndex: (orderIndex: number[]) => void;
}) => {
  const { t } = useTranslation([ConfigJson.id]);

  useEffect(() => {
    StoreGame.MethodGet().GameCanvasEnableSet(false);
    // StoreGame.MethodGet().State.Flow.Set(StateFlow.Gameplay);
  }, []);

  return (
    <>
      Gameplay
    </>
  );
};

export default PageGameplay;

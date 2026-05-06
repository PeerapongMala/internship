import { useGameStore } from '../store/gameStore';
import styled from 'styled-components';

const StatsContainer = styled.div`
  position: absolute;
  bottom: 20px;
  left: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  pointer-events: none;
  z-index: 9999;
`;

const StatBox = styled.div`
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 10px 20px;
  border-radius: 10px;
  font-size: 20px;
  font-weight: bold;
`;

export function ScoreDisplay() {
  const score = useGameStore((state) => state.score);
  const burstCount = useGameStore((state) => state.burstCount);
  const burstSpeed = useGameStore((state) => state.burstSpeed);

  return (
    <StatsContainer>
      <StatBox>Score: {score}</StatBox>
      <StatBox>Burst: {burstCount}x</StatBox>
      <StatBox>
        Fire Rate: {burstSpeed > 0 ? '+' : ''}
        {burstSpeed}ms
      </StatBox>
    </StatsContainer>
  );
}

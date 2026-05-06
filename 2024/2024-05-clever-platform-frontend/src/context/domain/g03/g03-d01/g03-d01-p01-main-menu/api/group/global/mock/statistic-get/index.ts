import { MainMenuStatistic } from '../../../../../type';
import MockJson from './index.json';

const StatisticGet = (
  userId: string,
): Promise<{
  json: () => MainMenuStatistic;
}> => {
  return new Promise((resolve, reject) => {
    resolve({
      json: () => (MockJson as { [userId: string]: MainMenuStatistic })[userId],
    });
  });
};

export default StatisticGet;

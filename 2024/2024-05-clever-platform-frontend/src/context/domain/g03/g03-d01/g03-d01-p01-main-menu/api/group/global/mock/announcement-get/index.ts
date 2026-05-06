import { MainMenuFooter } from '../../../../../type';
import MockJson from './index.json';

const AnnouncementGet = (): Promise<{ json: () => MainMenuFooter }> => {
  return new Promise((resolve, reject) => {
    resolve({ json: () => MockJson });
  });
};

export default AnnouncementGet;

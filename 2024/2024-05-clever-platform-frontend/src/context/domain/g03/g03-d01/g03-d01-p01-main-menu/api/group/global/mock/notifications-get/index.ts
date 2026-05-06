import { MainMenuNotification } from '../../../../../type';
import MockJson from './index.json';

const NotificationsGet = (
  userId: string,
): Promise<{ json: () => MainMenuNotification }> => {
  return new Promise((resolve, reject) => {
    resolve({
      json: () => (MockJson as { [userId: string]: MainMenuNotification })[userId],
    });
  });
};

export default NotificationsGet;

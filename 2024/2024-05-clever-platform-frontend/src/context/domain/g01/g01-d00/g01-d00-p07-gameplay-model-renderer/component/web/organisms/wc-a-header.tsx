import { useTranslation } from 'react-i18next';
import ConfigJson from '../../../config/index.json';

const Header = () => {
  const { t } = useTranslation([ConfigJson.key]);

  const settingText = t('header.setting', 'Setting');
  const teacherText = t('header.teacher', 'Teacher');
  const lessonInfoText = t('header.lessonInfo', 'Lesson info');
  const scoreText = t('header.score', 'Score');
  const swordText = t('header.sword', 'Sword');

  return (
    <div className="absolute flex h-full left-[65px] gap-4">
      <div className="w-16 h-full bg-blue-300">{settingText}</div>
      <div className="w-16 h-full bg-lime-300">{teacherText}</div>
      <div className="w-[363px] h-full bg-blue-300">{lessonInfoText}</div>
      <div className="w-[549px] h-full bg-lime-300">{scoreText}</div>
      <div className="w-[87px] h-full bg-blue-300">{swordText}</div>
    </div>
  );
};

export default Header;

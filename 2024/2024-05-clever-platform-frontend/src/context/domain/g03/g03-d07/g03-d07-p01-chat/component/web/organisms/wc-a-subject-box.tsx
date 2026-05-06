import { useTranslation } from 'react-i18next';

import ImageIconChange from '../../../assets/icon-change.svg';
import ImageDefaultSchoolAvatar from '../../../assets/school-avatar.png';
import ConfigJson from '../../../config/index.json';
import { Icon } from '../atoms/wc-a-icon';
import { TextNormal } from '../atoms/wc-a-text';

interface SubjectBoxProps {
  subject?: string;
  school: {
    fullname: string;
    avatar?: string;
  };
  onClick?: () => void;
}

export function SubjectBox({ subject, school, onClick }: SubjectBoxProps) {
  const { t } = useTranslation([ConfigJson.key]);
  return (
    <div
      className="flex flex-col rounded-3xl w-full h-auto bg-[#FCD401] p-1 cursor-pointer"
      style={{
        boxShadow:
          '0px 4px 4px 0px rgba(0, 0, 0, 0.15), 0px 8px 8px 0px rgba(0, 0, 0, 0.05), inset 0 -4px 0 rgba(0, 0, 0, 0.05)',
        borderBottom: '4px solid #FE9',
      }}
      onClick={onClick}
    >
      <div
        className="flex rounded-t-[1.25rem] items-center justify-center p-2 gap-2"
        style={{
          background: 'linear-gradient(180deg, #FFFEEC 0%, #FFF8B4 50%, #FFF596 100%)',
        }}
      >
        <img
          title="school-avatar"
          src={school?.avatar ?? ImageDefaultSchoolAvatar}
          className="rounded-full h-full w-auto"
        />
        <TextNormal className="truncate">{school.fullname}</TextNormal>
      </div>
      <div className="flex justify-between">
        <div className="flex-1 flex justify-center items-center p-2">
          <TextNormal>{t('label_selected_subjects', { subject: subject })}</TextNormal>
        </div>
        <div className="border-l-2 border-solid border-[#efc901] p-2">
          <Icon src={ImageIconChange} />
        </div>
      </div>
    </div>
  );
}

export default SubjectBox;

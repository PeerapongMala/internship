import { useTranslation } from 'react-i18next';

import { Avatar } from '@component/web/molecule/wc-m-avatar';
import { UserData } from '@domain/g02/g02-d01/local/type';
import Button from '@global/component/web/atom/wc-a-button';
import ScrollableContainer from '@global/component/web/atom/wc-a-scrollable-container';
import { useNavigate } from '@tanstack/react-router';
import ImageIconCopy from '../../../assets/icon-copy.svg';
import ConfigJson from '../../../config/index.json';
import { Icon } from '../atoms/wc-a-icon';
import { TextMuted } from '../atoms/wc-a-text';

interface SectionAccountProps {
  account?: UserData;
  setShowChangePinModal: (isOpen: boolean) => void;
}

function SectionAccount({ account, setShowChangePinModal }: SectionAccountProps) {
  const { t } = useTranslation([ConfigJson.key]);
  const navigate = useNavigate();

  const userFullName = `${account?.first_name} ${account?.last_name}`;
  return (
    <>
      <ScrollableContainer>
        <div className="flex justify-between p-6 gap-4 bg-white bg-opacity-80 w-full">
          <div className="flex gap-2">
            <Avatar
              user={account}
              className="w-[48px] h-[48px] border-1 border-white border-solid"
            />
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-gray-20">{userFullName}</span>
              <span className="text-xl">
                {t('account_display_role', {
                  /** todo: role teacher? */
                  role: 'Student',
                })}
              </span>
            </div>
          </div>
          <Button
            prefix={<Icon src={ImageIconCopy} className="ml-2 pr-1" />}
            textClassName="text-xl justify-center items-center"
            onClick={() => {
              navigator.clipboard.writeText(account?.id ?? '');
            }}
          >
            {t('account_button_copy_uuid')}
          </Button>
        </div>
        <div className="flex-1 flex p-4 gap-4 w-full">
          <div className="flex flex-col gap-4">
            <TextMuted>{t('account_info_title')}</TextMuted>
            <span className="text-2xl">
              {t('account_info_uuid', { uuid: account?.id ?? '' })}
            </span>
            <span className="text-2xl">
              {t('account_info_student_id', { studentId: account?.school_id ?? '' })}
            </span>
            <span className="text-2xl">
              {t('account_info_school', {
                schoolId: account?.school_id ?? '',
                schoolName: account?.school_name ?? '',
              })}
            </span>
          </div>
        </div>
      </ScrollableContainer>
      <div className="flex gap-8 p-4 px-12 mt-auto w-full items-center justify-around bg-white bg-opacity-80 border-t-2 border-solid border-yellow-primary">
        <Button
          className="w-full text-center"
          textClassName="text-xl justify-center items-center"
          onClick={() => {
            navigate({ to: '/report-bug' });
          }}
        >
          {t('account_footer_button_bug_report')}
        </Button>
        <Button
          className="w-full text-center"
          textClassName="text-xl justify-center items-center"
          onClick={() => setShowChangePinModal(true)}
        >
          {t('account_footer_button_change_pin')}
        </Button>
        <Button
          className="w-full text-center"
          textClassName="text-xl justify-center items-center"
          onClick={() => {
            navigate({ to: '/profile-share' });
          }}
        >
          {t('account_footer_button_share_profile')}
        </Button>
      </div>
    </>
  );
}

export default SectionAccount;

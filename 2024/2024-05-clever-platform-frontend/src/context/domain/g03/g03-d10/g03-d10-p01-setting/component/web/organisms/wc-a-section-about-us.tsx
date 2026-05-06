import { Trans, useTranslation } from 'react-i18next';

import Button from '@global/component/web/atom/wc-a-button';
import ScrollableContainer from '@global/component/web/atom/wc-a-scrollable-container';
import ConfigJson from '../../../config/index.json';

function SectionAboutUs({
  setShowPrivacyPolicyModal,
  setShowTOUModal
}: {
  setShowPrivacyPolicyModal: (isOpen: boolean) => void;
  setShowTOUModal: (isOpen: boolean) => void;
}
) {
  const { t } = useTranslation([ConfigJson.key]);
  return (
    <>
      <ScrollableContainer className="flex flex-col gap-4 p-6 text-lg">
        <p className='text-xl'><Trans t={t} i18nKey={'about_us_content.title'} /></p>
        <p className='text-xl'><Trans t={t} i18nKey={'about_us_content.content'} /></p>
      </ScrollableContainer >
      <div className="flex gap-8 p-4 px-12 mt-auto w-full justify-end bg-white bg-opacity-80 border-t-2 border-solid border-yellow-primary">
        <Button
          className="text-center w-[240px]"
          textClassName="text-xl justify-center items-center"
          onClick={() => { setShowPrivacyPolicyModal(true) }}
        >
          {t('privacy_policy')}
        </Button>
        <Button
          className="text-center"
          textClassName="text-xl justify-center items-center"
          onClick={() => setShowTOUModal(true)}
        >
          {t('terms_of_use')}
        </Button>
      </div>
    </>
  );
}

export default SectionAboutUs;

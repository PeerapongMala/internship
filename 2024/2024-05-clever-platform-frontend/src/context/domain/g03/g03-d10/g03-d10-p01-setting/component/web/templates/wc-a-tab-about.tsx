import { useTranslation } from 'react-i18next';

import ConfigJson from '../../../config/index.json';
import {
  ListContentDisplay,
  ListContentRoot,
  ListContentSection,
  ListContentTriggerItem,
  ListContentTriggers,
} from '../atoms/wc-a-list-content';
import { TextNormal } from '../atoms/wc-a-text';
import SectionAboutUs from '../organisms/wc-a-section-about-us';
import SectionContactUs from '../organisms/wc-a-section-contact-us';

function TabAbout({
  setShowPrivacyPolicyModal,
  setShowTOUModal,
}: {
  setShowPrivacyPolicyModal: (isShow: boolean) => void;
  setShowTOUModal: (isShow: boolean) => void;
}) {
  const { t } = useTranslation([ConfigJson.key]);
  return (
    <ListContentRoot className="flex" defaultValue="about-us">
      <ListContentTriggers className="flex flex-col w-2/5 h-full justify-start items-start overflow-y-auto pb-10 border-r-2 border-r-white border-solid">
        <ListContentTriggerItem
          value="about-us"
          className="data-[state=active]:bg-[#fcd401] bg-white px-4 py-6 w-full"
        >
          <TextNormal>{t('section_tab_menu_about_us')}</TextNormal>
        </ListContentTriggerItem>
        <ListContentTriggerItem
          value="contact-us"
          className="data-[state=active]:bg-[#fcd401] bg-white px-4 py-6 w-full"
        >
          <TextNormal>{t('section_tab_menu_contact_us')}</TextNormal>
        </ListContentTriggerItem>
      </ListContentTriggers>
      <ListContentDisplay className="w-full h-full">
        <ListContentSection value="about-us" className="flex flex-col h-full">
          <SectionAboutUs setShowPrivacyPolicyModal={setShowPrivacyPolicyModal} setShowTOUModal={setShowTOUModal} />
        </ListContentSection>
        <ListContentSection value="contact-us" className="flex flex-col w-full h-full">
          <SectionContactUs />
        </ListContentSection>
      </ListContentDisplay>
    </ListContentRoot>
  );
}

export default TabAbout;

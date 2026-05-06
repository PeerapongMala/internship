import { useTranslation } from 'react-i18next';

import { UserData } from '@domain/g02/g02-d01/local/type';
import StoreGlobalPersist from '@store/global/persist';
import ConfigJson from '../../../config/index.json';
import {
  ListContentDisplay,
  ListContentRoot,
  ListContentSection,
  ListContentTriggerItem,
  ListContentTriggers,
} from '../atoms/wc-a-list-content';
import { TextNormal } from '../atoms/wc-a-text';
import SectionAccount from '../organisms/wc-a-section-account';
import SectionFamilyQRCode from '../organisms/wc-a-section-family-qrcode';

function TabAccount({
  setShowChangePinModal,
}: {
  setShowChangePinModal: (isOpen: boolean) => void;
}) {
  const { t } = useTranslation([ConfigJson.key]);

  const { userData } = StoreGlobalPersist.StateGet(['userData']) as {
    userData: UserData;
  };

  return (
    <ListContentRoot className="flex" defaultValue="account">
      <ListContentTriggers className="flex flex-col w-2/5 h-full justify-start items-start overflow-y-auto pb-10 border-r-2 border-r-white border-solid">
        <ListContentTriggerItem
          value="account"
          className="data-[state=active]:bg-[#fcd401] bg-white px-4 py-6 w-full"
        >
          <TextNormal>{t('section_tab_menu_account')}</TextNormal>
        </ListContentTriggerItem>
        <ListContentTriggerItem
          value="qr-code"
          className="data-[state=active]:bg-[#fcd401] bg-white px-4 py-6 w-full"
        >
          <TextNormal>{t('section_tab_menu_family_qrcode')}</TextNormal>
        </ListContentTriggerItem>
      </ListContentTriggers>
      <ListContentDisplay className="w-full h-full">
        <ListContentSection value="account" className="flex flex-col h-full">
          <SectionAccount
            account={userData}
            setShowChangePinModal={setShowChangePinModal}
          />
        </ListContentSection>
        <ListContentSection value="qr-code" className="flex flex-col h-full">
          <SectionFamilyQRCode account={userData} />
        </ListContentSection>
      </ListContentDisplay>
    </ListContentRoot>
  );
}

export default TabAccount;

import CWWhiteBox from '@component/web/cw-white-box';
import CWWizardBar from '@component/web/cw-wizard-bar';
import { useEffect } from 'react';
import { Tab } from '@domain/g06/g06-d02/local/types';

type WizardBarProps = {
  tabs: Tab[];
  selectedTab: number;
  handleSetActiveTab: (tab: number) => void;
  onTabChange?: (isFirstPage: boolean, isLastPage: boolean) => void;
};

const WizardBar = ({
  tabs,
  selectedTab,
  handleSetActiveTab,
  onTabChange,
}: WizardBarProps) => {
  const handleTabChange = (id: number) => {
    handleSetActiveTab(id);
  };

  useEffect(() => {
    const isFirstPage = selectedTab === tabs[0].id;
    const isLastPage = selectedTab === tabs[tabs.length - 1].id;

    onTabChange?.(isFirstPage, isLastPage);
  }, [selectedTab]);

  return (
    <CWWhiteBox className="px-[50px] py-5">
      <CWWizardBar
        disabled
        customActiveTab={selectedTab}
        customSetActiveTab={handleTabChange}
        tabs={tabs}
      />
    </CWWhiteBox>
  );
};

export default WizardBar;

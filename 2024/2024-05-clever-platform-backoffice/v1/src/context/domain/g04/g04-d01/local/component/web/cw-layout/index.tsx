import { useTranslation } from 'react-i18next';
import ConfigJson from '../../../../local/config/index.json';

import CWMBreadcrumb from '@component/web/molecule/cw-m-breadcrumb';

interface CWLayoutProps {
  children: React.ReactNode;
  created?: boolean;
}

const CWLayout: React.FC<CWLayoutProps> = ({ children, created }) => {
  const { t } = useTranslation([ConfigJson.key]);

  const breadcrumbs = [
    { text: t('breadcrumb.announcement'), href: '' },
    { text: t('breadcrumb.manage'), href: '' },
  ];
  if (created) breadcrumbs.push({ text: t('breadcrumb.create'), href: '' });

  return (
    <div className="font-noto-san flex flex-col gap-6">
      <div>
        <CWMBreadcrumb items={breadcrumbs} />
      </div>
      {children}
    </div>
  );
};

export default CWLayout;

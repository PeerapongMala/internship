import { useTranslation } from 'react-i18next';
import ConfigJson from '../../../../../g01-d05-p00-classroom/config/index.json';
import CWBreadcrumbs from '@component/web/cw-breadcrumbs';
import { boolean } from 'yup';

interface CWTLayoutProps {
  breadcrumbs: { text: string; href: string; disabled?: boolean }[];
  children: React.ReactNode;
}

const CWTLayout = function ({ breadcrumbs, children }: CWTLayoutProps) {
  const { t } = useTranslation([ConfigJson.key]);

  return (
    <div className="font-noto-san flex flex-col gap-6">
      <div>
        <CWBreadcrumbs
          links={breadcrumbs.map((item) => ({
            label: item.text,
            href: item.href,
            disabled: item.disabled ?? false,
          }))}
        />
      </div>
      {children}
    </div>
  );
};

export default CWTLayout;

import { cn } from '@core/design-system/library/vristo/source/utils/cn';
import { HTMLAttributes } from 'react';
import ResponsiveLayout from '../../organism/cw-o-screen-responsive-layout';
import Header from '../../../../component/web/molecule/cw-m-header';

type FamilyTemplateProps = HTMLAttributes<HTMLDivElement> & {
  title?: string;
  familyMenu?: React.ReactNode;
};

const FamilyTemplate = ({
  title = 'จัดการครอบครัว',
  familyMenu,
  className,
  children,
  ...props
}: FamilyTemplateProps) => {
  return (
    <ResponsiveLayout {...props} className={cn('', className)}>
      <div className="fixed left-0 top-0 w-screen gap-[5px] bg-white px-5">
        <Header title={title} />
        {familyMenu && familyMenu}
      </div>
      <div className="h-[20px]"></div>

      {children}
    </ResponsiveLayout>
  );
};

export default FamilyTemplate;

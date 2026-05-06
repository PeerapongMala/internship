import CWBreadcrumbs from '@component/web/cw-breadcrumbs';
import CWMTabs from '@component/web/molecule/cw-n-tabs';
import { useNavigate } from '@tanstack/react-router';

interface CWLayoutProps<T> {
  breadcrumbs: {
    label: string;
    href: string;
  }[];
  type: 'frame' | 'badge' | 'coupon';
  children: React.ReactNode;
  itemHref: string;
  userType?: 'gm' | 'teacher';
}

const CWLayout = function <T>({
  breadcrumbs,
  children,
  type,
  itemHref,
  userType = 'gm',
}: CWLayoutProps<T>) {
  const navigate = useNavigate();

  const getTabs = () => {
    const baseTabs = [
      {
        key: 'frame',
        label: 'กรอบรูป',
        to: '../frame',
      },
      {
        key: 'badge',
        label: 'โล่',
        to: '../badge',
      },
      {
        key: 'coupon',
        label: 'คูปอง',
        to: '../coupon',
      },
    ];

    if (userType === 'teacher') {
      return baseTabs.filter((tab) => tab.key === 'coupon');
    }

    return baseTabs;
  };
  const tabs = getTabs();
  const tabIndex = tabs.findIndex((t) => t.key == type);

  return (
    <div className="flex flex-col gap-4">
      <CWBreadcrumbs links={breadcrumbs} />
      <div className="flex flex-col gap-1">
        <div className="text-2xl font-bold">{'จัดการร้านค้า'}</div>
        <div className="flex gap-2">
          {
            'สร้างสินค้าจากไอเทม กำหนดราคา และขายในร้านค้ากลางของเกม หากคุณยังไม่ได้สร้างไอเทม สามารสร้างไอเทมได้จากเมนู'
          }
          <button
            onClick={() => {
              navigate({ to: itemHref });
            }}
            className="text-primary underline"
          >
            {'จัดการไอเทม'}
          </button>
        </div>
      </div>
      <CWMTabs
        items={tabs.map((t) => t.label)}
        currentIndex={tabIndex}
        onClick={(index) => {
          navigate({ to: tabs[index]?.to });
        }}
      />

      {children}
    </div>
  );
};

export default CWLayout;

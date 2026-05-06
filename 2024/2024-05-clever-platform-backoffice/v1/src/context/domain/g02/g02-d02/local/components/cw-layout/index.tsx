import CWBreadcrumbs from '@component/web/cw-breadcrumbs';
import CWTitleGroup from '@component/web/cw-title-group';
import IconArrowBackward from '@core/design-system/library/component/icon/IconArrowBackward';
import LayoutDefault from '@core/design-system/library/component/layout/default';
import { ICurriculum } from '@domain/g01/g01-d03/local/type';
import Breadcrumbs from '@domain/g02/g02-d02/g02-d02-p01-manage-year/component/web/atom/wc-a-breadcrumbs';
import showMessage from '@global/utils/showMessage';
import StoreGlobalPersist from '@store/global/persist';
import { useNavigate, useParams } from '@tanstack/react-router';

interface CWLayoutProps {
  children: React.ReactNode;
  type?: 'created' | 'updated';
  navigate: {
    title: string;
    to: string;
    description?: string;
  };
}

const CWLayout = function ({ children, type, navigate }: CWLayoutProps) {
  const { platformId } = useParams({ strict: false });
  const navigator = useNavigate();

  const curriculum: ICurriculum =
    StoreGlobalPersist.StateGetAllWithUnsubscribe().curriculumData;
  if (!curriculum) {
    showMessage('กรุณาเลือกหลักสูตร');
    window.location.href = `/curriculum`;
  }

  let links = [
    {
      label: 'เกี่ยวกับหลักสูตร',
      href: '#',
    },
    {
      label: 'หลักสูตร',
      href: '#',
    },
    {
      label: `สังกัดวิชา ${curriculum.short_name}`,
      href: '#',
    },
    {
      label: 'จัดการชั้นปี',
      href: '#',
    },
  ];
  if (type == 'created') {
    links = [
      ...links,
      {
        label: 'เพิ่มแพลตฟอร์ม',
        href: '#',
      },
    ];
  } else if (type == 'updated' && platformId != undefined) {
    links = [
      ...links,
      {
        label: platformId,
        href: '#',
      },
    ];
  }

  return (
    <div className="flex flex-col gap-6">
      <CWBreadcrumbs links={links} />

      {/* <Breadcrumbs
        variant="bold"
        links={[
          {
            label: "สังกัดของฉัน",
            href: "#",
          },
          {
            label: `${curriculum.name} (${curriculum.short_name})`,
            href: "#",
          },
        ]}
      /> */}
      <CWTitleGroup
        listText={['สังกัดของฉัน', `${curriculum.name} (${curriculum.short_name})`]}
      />

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-x-4">
          <button
            onClick={() => {
              navigator({ to: navigate.to });
            }}
          >
            <IconArrowBackward className="text-xl" />
          </button>
          <h2 className="text-2xl font-bold">{navigate.title}</h2>
        </div>
        {navigate.description && <div>{navigate.description}</div>}
      </div>

      {children}
    </div>
  );
};

export default CWLayout;

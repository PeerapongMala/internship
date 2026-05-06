import { useEffect, useState, useMemo, SetStateAction, useRef } from 'react';
import { Curriculum, SeedYear } from '../local/type';
import { Link, useNavigate, useParams, useSearch } from '@tanstack/react-router';
import { useDebouncedValue } from '@mantine/hooks';
import StoreGlobal from '@store/global';
import GamificationHeader from '../local/components/web/template/cw-t-header';
import CWSwitchTabs from '@component/web/cs-switch-taps';
import CWRewardGeneral from '../local/components/web/template/cw-tap-general';
import CWRewardSpecial from '../local/components/web/template/cw-tap-special';
import API from '../local/api';
import CWSelect from '@component/web/cw-select';
import StoreGlobalPersist from '@store/global/persist';
import { Select } from '@core/design-system/library/vristo/source/components/Input';
import WCADropdown from '../local/components/web/atom/WCADropdown';
import CWMTabs from '@component/web/molecule/cw-n-tabs';

const DomainJSX = () => {
  const navigate = useNavigate();
  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);

    if (!search.tab) {
      navigate({
        search: { tab: 'normal' } as any,
        replace: true,
      });
    }
  }, []);

  const search = useSearch({ strict: false }) as any;

  const [fetching, setFetching] = useState<boolean>(false);
  const [seedyear, setSeedyear] = useState<SeedYear[]>([]);
  const [seedyearId, setSeedyearId] = useState<number>(1);
  useEffect(() => {
    setFetching(true);
    API.gamification
      .GetSeedYear()
      .then((res) => {
        if (res.status_code === 200) {
          setSeedyear(res.data);
        } else if (res.status_code === 401) {
          navigate({ to: '/' });
        } else {
          console.log(res.message);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      })
      .finally(() => {
        setFetching(false);
      });
  }, []);
  const [key, setKey] = useState(0);
  const currentTab = search.tab || 'normal';
  useEffect(() => {
    setKey((prev) => prev + 1);
  }, [currentTab]);

  const switchTabs = [
    {
      id: 'normal',
      label: 'รางวัลทั่วไป',
      content: <CWRewardGeneral seedyearId={seedyearId} />,
      onClick: () => navigate({ search: { tab: 'normal' } as any }),
      isActive: currentTab === 'normal',
    },
    {
      id: 'special',
      label: 'รางวัลพิเศษ',
      content: <CWRewardSpecial seedyearId={seedyearId} />,
      onClick: () => navigate({ search: { tab: 'special' } as any }),
      isActive: currentTab === 'special',
    },
  ];

  return (
    <div className="w-full">
      <GamificationHeader />
      <div className="w-[250px]">
        <WCADropdown
          placeholder="เลือกกลุ่มวิชา"
          options={seedyear.map((item) => ({
            label: item.name,
            value: item.id.toString(),
          }))}
          onSelect={(selectedValue) => {
            if (selectedValue) {
              setSeedyearId(Number(selectedValue));
            }
          }}
        />
      </div>
      <div className="mt-5">
        <CWSwitchTabs key={key} tabs={switchTabs} initialTabId={currentTab} />
      </div>
    </div>
  );
};

export default DomainJSX;

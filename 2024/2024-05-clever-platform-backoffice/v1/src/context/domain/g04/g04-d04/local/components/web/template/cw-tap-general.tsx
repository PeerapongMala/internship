import CWSelect from '@component/web/cw-select';
import CWEasy from './level/cw-easy';
import CWMedium from './level/cw-medium';
import CWHard from './level/cw-hard';
import CWSwitchTabs from '@component/web/cs-switch-taps';
import { LevelReward, Leveltype, SeedYear } from '../../../type';
import { useEffect, useState } from 'react';
import API from '../../../api';
import { useNavigate } from '@tanstack/react-router';
import CWWhiteBox from '@component/web/cw-white-box';
import usePagination from '@global/hooks/usePagination';

const CWRewardGeneral = ({ seedyearId }: { seedyearId: number }) => {
  const navigate = useNavigate();
  const [fetching, setFetching] = useState<boolean>(false);
  const [seedyear, setSeedyear] = useState<SeedYear[]>([]);
  const [record, setRecord] = useState<LevelReward[]>([]);

  const [levelType, setLevelType] = useState<Leveltype>(Leveltype.EASY);

  const { pagination } = usePagination();

  useEffect(() => {
    setRecord([]);
    if (seedyearId && levelType) {
      setFetching(true);
      API.gamification
        .Gets(Number(seedyearId), levelType, pagination.page, pagination.limit)
        .then((res) => {
          if (res.status_code === 200) {
            setRecord(res.data);
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
    }
  }, [seedyearId, levelType, pagination.page, pagination.limit]);

  const filterRecordByLevelType = (level: Leveltype) => {
    return record.filter((item) => item.level_type === level);
  };
  const renderContent = (level: Leveltype, component: React.ReactNode) => {
    const filteredRecords = filterRecordByLevelType(level);

    if (fetching) {
      return <div className="py-4 text-center">กำลังโหลดข้อมูล...</div>;
    }

    if (filteredRecords.length === 0) {
      return (
        <CWWhiteBox>
          <div className="py-4 text-center text-gray-500">ไม่พบข้อมูล</div>
        </CWWhiteBox>
      );
    }

    return component;
  };

  const switchTabs = [
    {
      id: '1',
      label: 'ด่านระดับง่าย',
      content: renderContent(
        Leveltype.EASY,
        <CWEasy records={filterRecordByLevelType(Leveltype.EASY)} />,
      ),
      onClick: () => setLevelType(Leveltype.EASY),
    },
    {
      id: '2',
      label: 'ด่านระดับปานกลาง',
      content: renderContent(
        Leveltype.MEDIUM,
        <CWMedium records={filterRecordByLevelType(Leveltype.MEDIUM)} />,
      ),
      onClick: () => setLevelType(Leveltype.MEDIUM),
    },
    {
      id: '3',
      label: 'ด่านระดับยาก',
      content: renderContent(
        Leveltype.HARD,
        <CWHard records={filterRecordByLevelType(Leveltype.HARD)} />,
      ),
      onClick: () => setLevelType(Leveltype.HARD),
    },
  ];

  return (
    <div className="w-full">
      <div className="">
        <CWSwitchTabs tabs={switchTabs} />
      </div>
    </div>
  );
};

export default CWRewardGeneral;

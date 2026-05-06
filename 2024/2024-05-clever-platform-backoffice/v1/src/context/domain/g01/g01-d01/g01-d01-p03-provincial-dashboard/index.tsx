import StoreGlobal from '@global/store/global';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import ConfigJson from './config/index.json';
import LayoutDefault from '@core/design-system/library/component/layout/default';
import TranslationHeader from './component/web/template/Header';
import ScoreOverview from './component/web/ui/score-overview/ScoreOverview';
import ComparativeStatistics from './component/web/ui/comparative-statistics/ComparativeStatistics';
import CWSelect from '@component/web/cw-select';
import { WCAInputDateFlat } from '@component/web/atom/wc-a-input-date';
import { Thai } from 'flatpickr/dist/l10n/th';
import { MdDateRange } from 'react-icons/md';
import { useProvinceLocation } from '@global/utils/geolocation';
import { Provinces } from './component/web/ui/score-overview/Provinces';

const DomainJSX = () => {
  const { t, i18n } = useTranslation([ConfigJson.key]);
  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);
  const [tabs, setTabs] = useState<boolean>(true);
  const [selectProvince, setSelectProvince] = useState<string>(
    Provinces.find((item) => item.label === 'กรุงเทพมหานคร')?.value ?? '',
  );

  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const handleStep = (tab: boolean) => {
    // setSelectProvince('');
    // setStartDate('');
    // setEndDate('');
    setTabs(tab);
  };

  return (
    <div className="w-full">
      <TranslationHeader />
      <div className="w-full font-noto-sans-thai">
        <div className="mb-6 flex">
          <div className="mr-3 w-[15%]">
            <CWSelect
              label="จังหวัด"
              options={Provinces}
              value={selectProvince}
              onChange={(e) => setSelectProvince(e.target.value)}
              required
              hideEmptyOption
            />
          </div>
          <div className="relative flex items-center gap-8">
            <h4 className="mt-5 w-40 text-end">ระยะเวลาในการแสดงผล</h4>
            <WCAInputDateFlat
              label="วันที่เริ่มต้น-วันที่สิ้นสุด"
              required
              placeholder="วว/ดด/ปปปป - วว/ดด/ปปปป"
              options={{
                mode: 'range',
                dateFormat: 'd/m/Y',
                locale: {
                  ...Thai,
                },
              }}
              className="w-60 cursor-pointer"
              onChange={(e) => {
                if (e.length > 0) {
                  const localStartDate = e[0].toLocaleDateString('en-CA'); // This will output YYYY-MM-DD format
                  setStartDate(localStartDate);
                }
                if (e.length > 1) {
                  const localEndDate = e[1].toLocaleDateString('en-CA'); // This will output YYYY-MM-DD format
                  setEndDate(localEndDate);
                }
              }}
            />
            {/* <div className='absolute inset-y-0 right-0 flex items-center pr-2'><MdDateRange size={24} color={"#8a8a8a"} /></div> */}
          </div>
        </div>
        <div className="mb-4 flex items-center">
          <div className="mr-14 flex h-10 w-fit border-b border-gray-200 bg-white">
            <button
              className={`inline-block w-40 rounded-t-lg border-b ${tabs ? 'border-[#4361EE] text-[#4361EE]' : 'border-gray-300 text-gray-400'}`}
              onClick={() => handleStep(true)}
            >
              ภาพรวมคะแนน
            </button>
            <button
              className={`inline-block w-40 rounded-t-lg border-b ${!tabs ? 'border-[#4361EE] text-[#4361EE]' : 'border-gray-300 text-gray-400'}`}
              onClick={() => handleStep(false)}
            >
              สถิติเปรียบเทียบ
            </button>
          </div>
        </div>
        <div className="mt-3 w-full">
          {tabs ? (
            <ScoreOverview
              province={
                Provinces.find((item) => item.value === selectProvince)?.label ?? ''
              }
              provinceCode={selectProvince}
              startDate={startDate}
              endDate={endDate}
            />
          ) : (
            <ComparativeStatistics
              province={
                Provinces.find((item) => item.value === selectProvince)?.label ?? ''
              }
              startDate={startDate}
              endDate={endDate}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DomainJSX;

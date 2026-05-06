// import { useTranslation } from 'react-i18next';
import StoreGlobal from '@global/store/global';
import { Link, useNavigate } from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import CWBreadcrumbs from '@component/web/cw-breadcrumbs';
import CWSelect from '@component/web/cw-select';
import { WCAInputDateFlat } from '@component/web/atom/wc-a-input-date';
import { Thai } from 'flatpickr/dist/l10n/th';
import CWButton from '@component/web/cw-button';
import IconDownload from '@core/design-system/library/component/icon/IconDownload';
import CWWhiteBox from '@component/web/cw-white-box';

import LineLiffPage from '../local/component/web/template/cw-t-lineliff-page';
import FooterMenu from '../local/component/web/organism/cw-o-footer-menu';
import { CWDashboard } from './local/components/web/template/cw-dashboard';

const DomainJSX = () => {
  const navigate = useNavigate();

  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(false);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  const responsible = 'ป. 4/1';
  const totalStudent = 31;

  return (
    <LineLiffPage>
      <div className="w-full p-5">
        <CWBreadcrumbs
          links={[
            { label: 'การเรียนการสอน', href: '#' },
            { label: 'ภาพรวมครู', href: '#' },
          ]}
        />
        {/* Title Center */}
        <div className="mt-5">
          <h1 className="text-center text-2xl font-bold">ภาพรวมครู</h1>
        </div>

        {/* All selects in one column */}
        <div className="mt-5 flex w-full flex-col gap-4">
          <CWSelect title="ปีการศึกษา" />
          <WCAInputDateFlat
            placeholder="วว/ดด/ปปปป - วว/ดด/ปปปป"
            options={{
              mode: 'range',
              dateFormat: 'd/m/Y',
              locale: {
                ...Thai,
              },
            }}
          />
          <CWSelect title="ชั้นปี" />
          <CWSelect title="ห้อง" />
        </div>

        {/* Hide Download Button */}
        {/* <div className='w-full flex justify-end'>
        <CWButton
          className='mt-5'
          title='Download'
          icon={<IconDownload />}
          onClick={() => alert("Download")}
        />
      </div> */}

        <hr className="my-5" />

        {/* Styling for "ระดับชั้นที่รับผิดชอบ" & "นักเรียนทั้งหมด" */}
        <div className="grid w-full grid-cols-1 gap-5">
          <div className="flex flex-col gap-2 rounded-md bg-white px-3 py-5 shadow-md">
            <h1 className="text-[16px]">ระดับชั้นที่รับผิดชอบ</h1>
            <p className="text-[28px]">{responsible}</p>
          </div>
          <div className="flex flex-col gap-2 rounded-md bg-white px-3 py-5 shadow-md">
            <h1 className="text-[16px]">นักเรียนทั้งหมด (คน)</h1>
            <p className="text-[28px]">{totalStudent}</p>
          </div>
        </div>

        {/* Dashboard */}
        <div className="mt-5 w-full">
          <CWDashboard />
        </div>
      </div>

      <div className="mt-4 flex w-full justify-center">
        <FooterMenu />
      </div>
    </LineLiffPage>
  );
};

export default DomainJSX;

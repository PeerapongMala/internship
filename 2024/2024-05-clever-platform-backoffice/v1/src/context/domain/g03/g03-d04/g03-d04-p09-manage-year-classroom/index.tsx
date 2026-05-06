// import { useTranslation } from 'react-i18next';
import StoreGlobal from '@global/store/global';

import { Link, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import ConfigJson from './config/index.json';

import CWMBreadcrumb from '@component/web/molecule/cw-m-breadcrumb';

import IconArrowBackward from '@core/design-system/library/component/icon/IconArrowBackward';
import CWSelect from '@component/web/cw-select';
import CWAInputText from '@domain/g01/g01-d05/local/component/web/atom/cw-a-input-text';
import CWInput from '@component/web/cw-input';
import CWTextArea from '@component/web/cw-textarea';

const DomainJSX = () => {
  const { t, i18n } = useTranslation([ConfigJson.key]);
  const [opacity, opacitySet] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  return (
    <div>
      <CWMBreadcrumb
        items={[
          {
            text: 'โรงเรียนสาธิตมัธยม',
            href: '#',
          },
          {
            text: 'การเรียนการสอน',
            href: '#',
          },
          {
            text: 'ข้อมูลนักเรียน',
            href: '#',
          },
          {
            text: 'เพิ่มโน๊ต',
          },
        ]}
      />

      <div className="my-5 flex items-center gap-4">
        <Link to="/teacher/student/all-student/1/history/teacher-comments">
          <IconArrowBackward />
        </Link>
        <h1 className="text-xl font-bold">เพิ่มโน๊ต</h1>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-3 w-full rounded border bg-white p-5 shadow">
          <div className="grid grid-cols-3 gap-5">
            <CWSelect
              required
              label="ปีการศึกษา"
              title="2567"
              className="min-w-36"
              options={[]}
            />
            <CWSelect
              required
              label="ชั้นปี"
              title="ป.4"
              className="min-w-36"
              options={[]}
            />
            <CWSelect
              required
              label="วิชา"
              title="วิชาคณิตศาสตร์"
              className="min-w-36"
              options={[]}
            />
            <CWSelect
              required
              label="บทที่"
              title="บทที่ 1 จำนวนนับ"
              className="min-w-36"
              options={[]}
            />
            <CWSelect
              required
              label="บทเรียนย่อยที่"
              title="บทที่ 1-1 จำนวนนับมากกว่า 1 ล้าน"
              className="min-w-36"
              options={[]}
            />
            <CWSelect
              required
              label="ด่านที่"
              title="ด่านที่ 1"
              className="min-w-36"
              options={[]}
            />
            <div className="col-span-3">
              <CWTextArea
                required
                label="เพิ่มโน๊ต"
                title="เพิ่มโน๊ต"
                classNameTextarea="min-h-[100px] "
              />
            </div>
          </div>
        </div>

        <div className="grid h-fit w-full grid-cols-3 gap-2 rounded bg-white p-5 shadow">
          <label>แก้ไขล่าสุด</label>
          <span className="col-span-2">20 ก.พ 2565 24:24</span>

          <label>แก้ไขล่าสุดโดย</label>
          <span className="col-span-2">Teacher</span>

          <button className="btn btn-primary col-span-3 w-full">บันทึก</button>
        </div>
      </div>
    </div>
  );
};

export default DomainJSX;

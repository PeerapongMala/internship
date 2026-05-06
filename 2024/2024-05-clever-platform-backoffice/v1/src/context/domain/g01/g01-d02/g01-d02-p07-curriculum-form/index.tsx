// import { useTranslation } from 'react-i18next';
import StoreGlobal from '@global/store/global';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import ConfigJson from './config/index.json';
import CWBreadcrumbs from '@component/web/cw-breadcrumbs';
import { useNavigate, useParams } from '@tanstack/react-router';
import IconArrowBackward from '@core/design-system/library/component/icon/IconArrowBackward';
import TContentCreatorRecords from './tabs/TContentCreatorRecords';
import TCurriculumForm from './tabs/TCurriculumForm';
import CWMTabs from '@component/web/molecule/cw-n-tabs';
import { CurriculumGroup } from '../local/type';
import API from '../local/api';
import showMessage from '@global/utils/showMessage';

const DomainJSX = () => {
  const { t, i18n } = useTranslation([ConfigJson.key]);
  const { curriculumGroupId } = useParams({ strict: false });
  const navigate = useNavigate();

  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  const [formType] = useState<'create' | 'update'>(
    curriculumGroupId ? 'update' : 'create',
  );
  const [menuTabIndex, setMenuTabIndex] = useState(0);
  const [record, setRecord] = useState<CurriculumGroup>();
  const [isFetch, setIsFetch] = useState(false);

  useEffect(() => {
    if (curriculumGroupId) {
      API.curriculumGroup.GetById(curriculumGroupId).then((res) => {
        if (res.status_code == 200) {
          setRecord(res.data);
        } else {
          showMessage(res.message, 'error');
        }
      });
    }
  }, [isFetch]);

  function onSubmit(formData: Partial<CurriculumGroup>) {
    if (record) {
      API.curriculumGroup.Update(record.id, formData).then((res) => {
        if (res.status_code == 200 || res.status_code == 201) {
          showMessage('บันทึกสำเร็จ', 'success');
          navigate({ to: '../' });
          setIsFetch((prev) => !prev);
        } else {
          showMessage(res.message, 'error');
        }
      });
    } else {
      API.curriculumGroup.Create(formData).then((res) => {
        if (res.status_code == 200 || res.status_code == 201) {
          showMessage('บันทึกสำเร็จ', 'success');
          navigate({ to: '..' });
        } else {
          showMessage(res.message, 'error');
        }
      });
    }
  }

  const menuTabs = [
    {
      label: 'ข้อมูลสังกัด',
      content: <TCurriculumForm record={record} onSubmit={onSubmit} />,
    },
    {
      label: 'รายชื่อนักวิชาการ',
      content: <TContentCreatorRecords curriculumGroupId={curriculumGroupId} />,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <CWBreadcrumbs
        links={[
          {
            label: 'สำหรับแอดมิน',
            href: '/',
            disabled: true,
          },
          {
            label: 'สังกัดวิชา',
            href: '/admin/curriculum',
          },
          {
            label: formType == 'update' ? curriculumGroupId : 'เพิ่มสังกัด',
            href: '/',
          },
        ]}
      />

      <div className="flex items-center gap-4">
        <button
          onClick={() => {
            navigate({ to: '/admin/curriculum' });
          }}
        >
          <IconArrowBackward />
        </button>
        <div className="text-2xl font-bold">
          {formType == 'update' ? 'แก้ไข' : 'เพิ่ม'}สังกัดวิชา
        </div>
      </div>

      {record && (
        <div className="rounded-md bg-neutral-100 p-2">
          <div className="text-2xl font-bold">{record.short_name}</div>
        </div>
      )}

      <CWMTabs
        items={menuTabs.map((tab) => tab.label)}
        currentIndex={menuTabIndex}
        onClick={(r) => {
          if (record) setMenuTabIndex(r);
          else showMessage('กรุณาบันทึกข้อมูลก่อน', 'warning');
        }}
      />

      {menuTabs[menuTabIndex]?.content}
    </div>
  );
};

export default DomainJSX;

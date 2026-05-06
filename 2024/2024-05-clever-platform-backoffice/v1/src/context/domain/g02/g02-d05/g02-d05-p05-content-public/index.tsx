import StoreGlobal from '@global/store/global';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import ConfigJson from './config/index.json';
import LayoutDefault from '@core/design-system/library/component/layout/default';
import { Link, useNavigate, useParams } from '@tanstack/react-router';

import { Divider } from '@core/design-system/library/vristo/source/components/Divider';
import Box from '../local/components/atom/Box';
import FooterForm from '../local/components/organism/FooterForm';
import WizardBar from '../local/components/organism/WizardBar';
import BaseInformation from '../local/components/template/BaseInformation';
import { tabs } from '../local/components/template/Tab';
import API from '../local/api';
import { AcademicLevelStatusType } from '../local/type';
import { convertIdToThreeDigit } from '../local/util';
import { ISubject } from '@domain/g02/g02-d02/local/type';
import StoreGlobalPersist from '@store/global/persist';
import HeaderBreadcrumbs from '../local/components/template/header-breadcrumbs';
import showMessage from '@global/utils/showMessage';

const DomainJSX = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation([ConfigJson.key]);

  const { academicLevelId, subLessonId } = useParams({ from: '' });
  const { subjectData }: { subjectData: ISubject } = StoreGlobalPersist.StateGet([
    'subjectData',
  ]);
  const [academicLevel, setAcademicLevel] = useState<any>({});

  const [loading, setLoading] = useState(false);

  const handlePrevious = async () => {
    console.log('handlePrevious');
    setLoading(true);
    navigate({
      to: `/content-creator/level/${subLessonId}/create-sound/${academicLevel.id}`,
    });
    setLoading(false);
  };

  const handlePublish = async () => {
    const dataLevel = {
      wizard_index: 5,
      status: 'enabled' as keyof typeof AcademicLevelStatusType,
    };

    if (academicLevel?.wizard_index > dataLevel.wizard_index) {
      dataLevel.wizard_index = academicLevel.wizard_index;
      dataLevel.status = academicLevel.status;
    }

    API.academicLevel.Update(academicLevelId, dataLevel).then((res) => {
      if (res.status_code === 200) {
        showMessage('เผยแพร่ด่านเรียบร้อย', 'success');
        setAcademicLevel(res.data?.[0]);
        navigate({ to: `/content-creator/level/${subLessonId}` });
        return true;
      } else {
        showMessage(res.message, 'error');
        return false;
      }
    });
  };

  useEffect(() => {
    if (academicLevelId) {
      API.academicLevel.GetById(academicLevelId).then((res) => {
        if (res.status_code === 200) {
          setAcademicLevel(res.data?.[0]);
        }
      });
    }
  }, [academicLevelId]);

  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(false);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  return (
    <LayoutDefault>
      <HeaderBreadcrumbs
        links={[
          {
            label: 'เกี่ยวกับหลักสูตร',
            href: `/content-creator/sublesson/${subjectData.id}`,
          },
          { label: 'จัดการด่าน', href: `/content-creator/level/${subLessonId}` },
          { label: academicLevelId ? 'แก้ไขด่าน' : 'เพิ่มบทเรียนหลัก', href: '' },
        ]}
        headerTitle={academicLevelId ? 'แก้ไขด่าน' : 'เพิ่มบทเรียนหลัก'}
        headerDescription={<div>ID: {convertIdToThreeDigit(academicLevelId)}</div>}
        sublessonId={subLessonId}
        backLink={`/content-creator/level/${subLessonId}`}
      />
      <div className="mt-5 w-full font-noto-sans-thai">
        <Box className="w-full rounded-lg bg-white p-5 shadow-md">
          <WizardBar tabs={tabs} activeId={5} />
        </Box>
        <div className="flex gap-4 pt-5">
          <div className="flex w-2/3 flex-col gap-6">
            <Box className="flex flex-col items-center gap-2 text-xl">
              <div className="text-3xl font-bold">ตรวจสอบความเรียบร้อย</div>
              <Divider />
              <div>กรุณาตรวจสอบก่อนเผยแพร่ข้อมูล หลังจากที่เผยแพร่ข้อมูลแล้ว</div>
              <div>
                คุณจะ<span className="underline">ไม่สามารถแก้ไข</span>
                การตั้งค่าที่เกี่ยวข้องกับด่านได้
              </div>
              <Box className="flex flex-col items-center justify-center gap-2 rounded-sm bg-gray-100 text-base">
                <div className="font-bold">
                  สิ่งที่คุณสามารถแแก้ไขได้หลังจากเผยแพร่ข้อมูล
                </div>
                <ul className="ml-2 list-inside list-disc space-y-3">
                  <li className="mb-1">{'การสะกดคำข้อความของโจทย์และคำตอบ'}</li>
                  <li className="mb-1">{'การแปลภาษา'}</li>
                  <li className="mb-1">{'การแก้ไขเสียง'}</li>
                </ul>
              </Box>
            </Box>
            <Box className="flex w-full justify-between rounded-lg bg-[#F5F5F5] p-5 shadow-md">
              <FooterForm
                academicLevel={academicLevel}
                onPrevious={handlePrevious}
                loading={loading}
                disableCancel={true}
              />
            </Box>
          </div>
          <div className="flex h-fit w-1/3 flex-col gap-6">
            <Box>
              <BaseInformation academicLevel={academicLevel} onOkPublic={handlePublish} />
            </Box>
          </div>
        </div>
      </div>
    </LayoutDefault>
  );
};

export default DomainJSX;

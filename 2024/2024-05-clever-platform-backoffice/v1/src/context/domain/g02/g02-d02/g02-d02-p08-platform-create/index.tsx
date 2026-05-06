import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from '@tanstack/react-router';
import ConfigJson from './config/index.json';
import CWFormLayout from '../local/components/cw-platform-form-layout';
import { ICurriculum } from '@domain/g01/g01-d03/local/type';
import StoreGlobalPersist from '@store/global/persist';
import showMessage from '@global/utils/showMessage';
import API from '../local/api';
import { IPlatform } from '../local/type';
import { useEffect } from 'react';
import StoreGlobal from '@store/global';

const DomainJSX = () => {
  const { t } = useTranslation([ConfigJson.key]);
  const navigate = useNavigate();

  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  const curriculum: ICurriculum =
    StoreGlobalPersist.StateGetAllWithUnsubscribe().curriculumData;
  if (!curriculum) {
    showMessage('กรุณาเลือกหลักสูตร', 'error');
    window.location.href = `/curriculum`;
  }

  function onSubmit(record: Pick<IPlatform, 'seed_platform_id' | 'status'>) {
    API.platform
      .Create({
        ...record,
        curriculum_group_id: curriculum.id,
      })
      .then((res) => {
        if (res.status_code == 201 || res.status_code == 200) {
          showMessage('สร้างแพลตฟอร์มสำเร็จ', 'success');
          navigate({ to: '/content-creator/course/platform' });
        } else if (res.status_code == 409) {
          showMessage('ไม่สามารถสร้างได้ มีการสร้างแพลตฟอร์มนี้อยู่แล้ว', 'warning');
        } else {
          showMessage(res.message, 'error');
        }
      });
  }

  return (
    <CWFormLayout
      onSubmit={(record) => {
        onSubmit(record);
      }}
    />
  );
};

export default DomainJSX;

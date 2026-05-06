import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from '@tanstack/react-router';
import ConfigJson from './config/index.json';
import CWFormLayout from '../local/components/cw-platform-form-layout';
import { useEffect, useState } from 'react';
import { IPlatform } from '../local/type';
import API from '../local/api';
import showMessage from '@global/utils/showMessage';
import StoreGlobalPersist from '@store/global/persist';
import { ICurriculum } from '@domain/g01/g01-d03/local/type';
import StoreGlobal from '@store/global';

const DomainJSX = () => {
  const { t } = useTranslation([ConfigJson.key]);
  const { platformId } = useParams({ strict: false });
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

  const [platform, setPlatform] = useState<IPlatform>();
  const [fetching, setFetching] = useState(false);

  function onSubmit(record: Pick<IPlatform, 'seed_platform_id' | 'status'>) {
    API.platform
      .Update(platformId, {
        ...record,
        curriculum_group_id: curriculum.id,
      })
      .then((res) => {
        if (res.status_code == 201 || res.status_code == 200) {
          showMessage('บันทึกแพลตฟอร์มสำเร็จ', 'success');
          navigate({ to: '../../' });
        } else if (
          res.message === 'Cannot change status from disabled to draft' ||
          'Cannot change status from enabled to draft'
        ) {
          showMessage('ไม่สามารถตั้งสถานะแบบร่างได้', 'warning');
        } else {
          showMessage(res.message, 'error');
        }
      });
  }

  useEffect(() => {
    if (platformId) {
      setFetching(true);
      API.platform.GetById(platformId).then((res) => {
        if (res.status_code == 200) {
          setPlatform(res.data);
        } else {
          showMessage(res.message, 'error');
        }
        setFetching(false);
      });
    }
  }, [platformId]);

  return (
    <>
      {fetching ? (
        <div>กำลังโหลด...</div>
      ) : platform ? (
        <CWFormLayout platform={platform} onSubmit={onSubmit} />
      ) : (
        <div>ไม่พบข้อมูล</div>
      )}
    </>
  );
};

export default DomainJSX;

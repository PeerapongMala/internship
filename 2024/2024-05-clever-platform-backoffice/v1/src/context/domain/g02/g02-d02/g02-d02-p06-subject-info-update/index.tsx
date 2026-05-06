import { useTranslation } from 'react-i18next';
import StoreGlobal from '@global/store/global';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { ISubject } from '../local/type';
import ConfigJson from './config/index.json';
import API from '../local/api';
import StoreGlobalVolatile from '@store/global/volatile';
import showMessage from '@global/utils/showMessage';
import CWSubjectFormLayout from '../local/components/cw-subject-from-layout';

const DomainJSX = () => {
  const { t } = useTranslation([ConfigJson.key]);
  const navigate = useNavigate();

  const { yearId, subjectId } = useParams({ strict: false });
  const [subject, setSubject] = useState<ISubject>();
  const [fetching, setFetching] = useState(false);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);

    API.manageYear.GetById(yearId).then(async (res) => {
      if (res.status_code === 200) {
        StoreGlobalVolatile.MethodGet().setYearData(res.data);
      }
    });
  }, []);

  useEffect(() => {
    fetchRecord();
  }, [subjectId]);

  function fetchRecord() {
    setFetching(true);
    API.subject
      .GetById(subjectId)
      .then((res) => {
        if (res.status_code == 200) {
          setSubject(res.data);
        }
      })
      .finally(() => {
        setFetching(false);
      });
  }

  function onSubmit(data: Partial<ISubject>) {
    data = {
      ...subject,
      ...data,
    };
    API.subject.Update(subjectId, data).then((res) => {
      if (res.status_code === 201 || res.status_code == 200) {
        showMessage('บันทึกสําเร็จ');
        navigate({ to: '../' });
        fetchRecord();
      } else if (
        res.message === 'Cannot change status from disabled to draft' ||
        'Cannot change status from enabled to draft'
      ) {
        showMessage('ไม่สามารถตั้งสถานะแบบร่างได้', 'warning');
      } else if (res.status_code === 401) {
        navigate({ to: '/' });
      } else {
        showMessage(res.message, 'error');
      }
    });
  }

  return fetching ? (
    <div>กำลังโหลด...</div>
  ) : subject ? (
    <CWSubjectFormLayout
      subject={subject}
      refresh={refresh}
      onSubmit={onSubmit}
      onTagGroupChange={(data) => {
        if (data.id && data.name) {
          API.tagGroup
            .Patch({
              id: +data.id,
              name: data.name,
            })
            .then((res) => {
              if (res.status_code == 200 || res.status_code == 201) {
                showMessage('แก้ไขชื่อกลุ่ม Tag สำเร็จ', 'success');
                setRefresh((prev) => !prev);
              } else {
                showMessage(res.message, 'error');
              }
            });
        }
      }}
      onTagCreate={(data) => {
        if (data.tag_group_id && data.name) {
          API.tag
            .Create({
              tag_group_id: +data.tag_group_id,
              name: data.name,
            })
            .then((res) => {
              if (res.status_code == 200 || res.status_code == 201) {
                showMessage('เพิ่ม Tag สำเร็จ', 'success');
                setRefresh((prev) => !prev);
              } else {
                showMessage(res.message, 'error');
              }
            });
        }
      }}
      onTagUpdate={(data) => {
        if (data.id && data.name && data.status) {
          API.tag
            .Patch({
              id: +data.id,
              name: data.name,
              status: data.status,
            })
            .then((res) => {
              if (res.status_code == 200 || res.status_code == 201) {
                showMessage('เพิ่ม Tag สำเร็จ', 'success');
                setRefresh((prev) => !prev);
              } else {
                showMessage(res.message, 'error');
              }
            });
        }
      }}
      onTagArchive={(status, data) => {
        if (data.id && data.name) {
          API.tag
            .Patch({
              id: +data.id,
              name: data.name,
              status,
            })
            .then((res) => {
              if (res.status_code == 200 || res.status_code == 201) {
                showMessage(
                  (status == 'disabled' ? 'จััดเก็บ' : 'เปิดใช้งาน') + ' Tag สำเร็จ',
                  'success',
                );
                setRefresh((prev) => !prev);
              } else {
                showMessage(res.message, 'error');
              }
            });
        }
      }}
    />
  ) : (
    <div>ไม่พบข้อมูล</div>
  );
};

export default DomainJSX;

import StoreGlobal from '@global/store/global';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import ConfigJson from './config/index.json';
import ConfigJsonGlobal from '../local/config/index.json';
import { useNavigate, useParams } from '@tanstack/react-router';
import CWItemFormPage from '@domain/g04/g04-d02/local/component/web/cw-item-form-page';
import API from '../local/api';
import showMessage from '@global/utils/showMessage';
import StoreGlobalPersist from '@store/global/persist';
import { Subject } from '../local/api/type';

const DomainJSX = () => {
  const { t: tG } = useTranslation([ConfigJsonGlobal.key]);
  const { t } = useTranslation([ConfigJson.key]);
  const navigate = useNavigate();
  const {
    subjectId,
    itemId,
    itemType,
  }: { itemType: ItemType; subjectId: string; itemId: string } = useParams({
    strict: false,
  });
  const { userData } = StoreGlobalPersist.StateGet(['userData']);
  const { targetData } = StoreGlobalPersist.StateGet(['targetData']);

  const schoolId = userData?.school_id ?? targetData?.school_id;
  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  const [reload, setReload] = useState(false);
  const [item, setItem] = useState<Item>();
  const [templates, setTemplates] = useState<Item[]>([]);

  const [subject, setSubject] = useState<Subject>();

  useEffect(() => {
    API.item.GetTemplate(itemType).then((res) => {
      if (res.status_code == 200) {
        setTemplates(res.data);
      }
    });
  }, [itemType]);

  useEffect(() => {
    API.item.GetGroupById(+subjectId).then((res) => {
      if (res.status_code == 200) {
        setSubject(res.data);
      } else {
        navigate({ to: '/teacher/item' });
      }
    });
  }, [subjectId]);

  useEffect(() => {
    if (itemId) {
      API.item.GetById(+itemId, { school_id: schoolId }).then((res) => {
        if (res.status_code == 200) {
          setItem(res.data);
        } else {
          showMessage(res.message, 'error');
        }
      });
    }
  }, [itemId, reload]);

  function onSubmit(data: Partial<Item>) {
    if (itemId) {
      if (item?.image_url === data.image_url) {
        data.image_url = undefined;
      }

      API.item.Update(+itemId, { ...data, school_id: schoolId }).then((res) => {
        if (res.status_code == 200 || res.status_code == 201) {
          showMessage('บันทึกสำเร็จ', 'success');
          setReload((prev) => !prev);
          navigate({ to: '../' });
        } else {
          showMessage(res.message, 'error');
        }
      });
    } else {
      API.item.Create(+subjectId, data).then((res) => {
        if (res.status_code == 200 || res.status_code == 201) {
          showMessage('บันทึกสำเร็จ', 'success');
          navigate({ to: '..' });
        } else {
          showMessage(res.message, 'error');
        }
      });
    }
  }

  return (
    <CWItemFormPage
      view="teacher"
      translationKey={ConfigJson.key}
      breadcrumbs={[
        { text: 'ระบบเกม', href: '' },
        { text: 'จัดการไอเทม', href: '' },
        ...(subject?.year ? [{ text: subject.year, href: '' }] : []),
        { text: subjectId ? 'แก้ไขไอเทม' : 'สร้างไอเทม', href: '' },
      ]}
      itemType={itemType}
      onSubmit={onSubmit}
      item={item}
      templates={templates}
      disbledRole="teacher"
      school_id={schoolId}
    />
  );
};

export default DomainJSX;

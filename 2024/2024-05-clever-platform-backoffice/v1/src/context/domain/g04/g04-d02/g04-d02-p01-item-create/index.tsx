import StoreGlobal from '@global/store/global';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import ConfigJson from './config/index.json';
import ConfigJsonGlobal from '../local/config/index.json';
import { useNavigate, useParams } from '@tanstack/react-router';
import CWItemFormPage from '../local/component/web/cw-item-form-page';
import API from '../local/api';
import showMessage from '@global/utils/showMessage';

const DomainJSX = () => {
  const { t: tG } = useTranslation([ConfigJsonGlobal.key]);
  const { t } = useTranslation([ConfigJson.key]);
  const { itemType, itemId }: { itemType: ItemType; itemId: string } = useParams({
    strict: false,
  });
  const navigate = useNavigate();

  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  const [record, setRecord] = useState<Item>();
  const [reload, setReload] = useState(false);

  useEffect(() => {
    if (itemId) {
      API.item.GetById(+itemId, itemType).then((res) => {
        if (res.status_code == 200) {
          setRecord(res.data);
        } else {
          showMessage(res.message, 'error');
        }
      });
    }
  }, [itemId, reload]);

  function onSubmit(formData: Partial<Item>) {
    if (record) {
      if (record.image_url === formData.image_url) {
        formData.image_url = undefined;
      }

      API.item.Update(record.id, formData).then((res) => {
        if (res.status_code == 200 || res.status_code == 201) {
          showMessage('บันทึกสำเร็จ', 'success');
          setReload((prev) => !prev);
        } else {
          showMessage(res.message, 'error');
        }
      });
    } else {
      API.item.Create(formData).then((res) => {
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
      translationKey={ConfigJson.key}
      itemType={itemType}
      item={record}
      breadcrumbs={[
        { text: 'ระบบเกม', href: '' },
        { text: 'จัดการไอเทม', href: '' },
        { text: 'สร้างไอเทม', href: '' },
      ]}
      onSubmit={onSubmit}
    />
  );
};

export default DomainJSX;

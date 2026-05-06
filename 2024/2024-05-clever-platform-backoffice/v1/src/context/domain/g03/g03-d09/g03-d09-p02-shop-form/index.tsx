import StoreGlobal from '@global/store/global';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import ConfigJson from './config/index.json';
import { Item, StoreItem, SubjectShop } from '../local/api/type';
import { useNavigate, useParams } from '@tanstack/react-router';
import CWShopFormLayout from '@domain/g04/g04-d03/local/component/web/cw-shop-form-layout';
import API from '../local/api';
import showMessage from '@global/utils/showMessage';

const DomainJSX = () => {
  const { t } = useTranslation([ConfigJson.key]);
  const navigate = useNavigate();
  const {
    itemType,
    subjectId,
    storeItemId,
  }: { itemType: 'coupon'; subjectId: string; storeItemId: string } = useParams({
    strict: false,
  });

  if (itemType != 'coupon') {
    navigate({ to: `/teacher/shop/${subjectId}/frame` });
  }

  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  const [items, setItems] = useState<Item[]>([]);
  const [storeItem, setStoreItem] = useState<StoreItem>();
  const [reload, setReload] = useState(false);
  const [subject, setSubject] = useState<SubjectShop>();
  const [isSubmit, setIsSubmit] = useState(false);
  useEffect(() => {
    if (subjectId) {
      API.item.Get(+subjectId, itemType).then((res) => {
        if (res.status_code == 200) {
          setItems(res.data);
        }
      });
    }
  }, [itemType]);

  const type = storeItemId ? 'edit' : 'create';

  function onSubmit(
    data: Pick<
      StoreItem,
      'item_id' | 'initial_stock' | 'price' | 'open_date' | 'closed_date' | 'status'
    >,
  ) {
    setIsSubmit(true);
    if (type == 'edit') {
      API.store.Update(+subjectId, +storeItemId, data).then((res) => {
        setIsSubmit(false);
        if (res.status_code == 200 || res.status_code == 201) {
          showMessage('บันทึกสำเร็จ', 'success');
          setReload((prev) => !prev);
        } else {
          showMessage(res.message, 'error');
        }
      });
    } else {
      API.store.Create(+subjectId, data).then((res) => {
        setIsSubmit(false);
        if (res.status_code == 200 || res.status_code == 201) {
          showMessage('บันทึกสำเร็จ', 'success');
          navigate({ to: '..' });
        } else {
          showMessage(res.message, 'error');
        }
      });
    }
  }

  useEffect(() => {
    if (storeItemId) {
      API.store.GetById(+subjectId, +storeItemId).then((res) => {
        if (res.status_code == 200) {
          setStoreItem(res.data);
        } else {
          navigate({ to: '..' });
          showMessage(res.message, 'error');
        }
      });
    }
  }, [storeItemId, reload]);

  useEffect(() => {
    API.subject.GetById(+subjectId).then((res) => {
      if (res.status_code == 200) {
        setSubject(res.data);
      } else {
        navigate({ to: '/teacher/shop' });
      }
    });
  }, []);

  return (
    <CWShopFormLayout
      breadcrumbs={[
        {
          label: 'ระบบเกม',
          href: '#',
        },
        {
          label: 'จัดการร้านค้า',
          href: '#',
        },
        {
          label: subject?.short_year.toString() ?? '',
          href: '#',
        },
        {
          label: subject?.subject_name ?? '',
          href: '#',
        },
        {
          label: (storeItem ? 'แก้ไข' : 'สร้าง') + 'สินค้า',
          href: '#',
        },
      ]}
      type={itemType}
      items={items}
      onSubmit={onSubmit}
      storeItem={storeItem}
      disbledRole="teacher"
      isSubmitting={isSubmit}
    />
  );
};

export default DomainJSX;

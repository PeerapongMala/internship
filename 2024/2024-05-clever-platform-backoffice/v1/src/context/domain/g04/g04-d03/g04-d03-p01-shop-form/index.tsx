import StoreGlobal from '@global/store/global';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import ConfigJson from './config/index.json';
import { Item, StoreItem } from '../local/api/type';
import { useNavigate, useParams } from '@tanstack/react-router';
import CWShopFormLayout from '../local/component/web/cw-shop-form-layout';
import API from '../local/api';
import showMessage from '@global/utils/showMessage';

const DomainJSX = () => {
  const { t } = useTranslation([ConfigJson.key]);
  const navigate = useNavigate();
  const {
    itemType,
    storeItemId,
  }: { itemType: 'frame' | 'badge' | 'coupon'; storeItemId: string } = useParams({
    strict: false,
  });

  if (itemType != 'frame' && itemType != 'badge' && itemType != 'coupon') {
    navigate({ to: '/gamemaster/shop/$itemType' });
  }

  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  const [items, setItems] = useState<Item[]>([]);
  const [storeItem, setStoreItem] = useState<StoreItem>();
  const [reload, setReload] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  useEffect(() => {
    API.item.Get(itemType).then((res) => {
      if (res.status_code == 200) {
        setItems(res.data);
      } else {
        showMessage(res.message, 'error');
      }
    });
  }, [itemType]);

  function onSubmit(
    data: Pick<
      StoreItem,
      'item_id' | 'initial_stock' | 'price' | 'open_date' | 'closed_date' | 'status'
    >,
  ) {
    setIsSubmit(true);

    if (storeItemId) {
      return API.store
        .Update(+storeItemId, data)
        .then((res) => {
          if (res.status_code == 200 || res.status_code == 201) {
            showMessage('บันทึกสำเร็จ', 'success');
            setReload((prev) => !prev);
          } else {
            showMessage(res.message, 'error');
          }
        })
        .finally(() => {
          setIsSubmit(false);
        });
    } else {
      return API.store
        .Create(data)
        .then((res) => {
          if (res.status_code == 200 || res.status_code == 201) {
            showMessage('บันทึกสำเร็จ', 'success');
            navigate({ to: '/gamemaster/shop/' + itemType });
          } else {
            showMessage(res.message, 'error');
          }
        })
        .finally(() => {
          setIsSubmit(false);
        });
    }
  }

  useEffect(() => {
    if (storeItemId) {
      API.store.GetById(+storeItemId).then((res) => {
        if (res.status_code == 200) {
          setStoreItem(res.data);
        } else {
          showMessage(res.message, 'error');
        }
      });
    }
  }, [storeItemId, reload]);

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
          label: 'สร้างสินค้า',
          href: '#',
        },
      ]}
      type={itemType}
      items={items}
      onSubmit={onSubmit}
      storeItem={storeItem}
      isSubmitting={isSubmit}
    />
  );
};

export default DomainJSX;

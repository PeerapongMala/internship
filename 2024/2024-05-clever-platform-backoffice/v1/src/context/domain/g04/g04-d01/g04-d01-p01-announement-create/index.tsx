import StoreGlobal from '@global/store/global';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import ConfigJson from './config/index.json';
import CWAnnounceCreateLayout from '../local/component/web/cw-announce-create-layout';
import { useNavigate, useParams } from '@tanstack/react-router';
import API from '../local/api';
import showMessage from '@global/utils/showMessage';

const DomainJSX = () => {
  const { t } = useTranslation([ConfigJson.key]);
  const {
    announceType,
    announceId,
  }: {
    announceType: AnnouncementType;
    announceId: string;
  } = useParams({ strict: false });
  const navigate = useNavigate();

  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  if (!['system', 'event', 'reward', 'notification'].includes(announceType)) {
    navigate({ to: `/gamemaster/announcement/system/create` });
  }

  const [announce, setAnnounce] = useState<Announcement>();
  const type = announceId != 'create' && announceId ? 'update' : 'create';

  function onSubmit(formData: Record<string, any>) {
    if (type == 'update') {
      let data = formData;
      if (announce && 'item_list' in announce) {
        data.item_list = announce.item_list;
      }
      API.announce[announceType].Update(+announceId, formData).then((res) => {
        if (res.status_code == 200 || res.status_code == 201) {
          showMessage('บันทึกสำเร็จ', 'success');
          navigate({ to: '/gamemaster/announcement/$announceType' });
        } else {
          showMessage(res.message, 'error');
        }
      });
    } else {
      API.announce[announceType].Create(formData).then((res) => {
        if (res.status_code == 200 || res.status_code == 201) {
          showMessage('บันทึกสำเร็จ', 'success');
          navigate({ to: '/gamemaster/announcement/$announceType' });
        } else {
          showMessage(res.message, 'error');
        }
      });
    }
  }

  function onItemSubmit(
    formData: Pick<AnnounceRewardItem, 'type' | 'item_name' | 'expired_at' | 'amount'> & {
      item_id: number | string;
    },
  ) {
    if (announce && announce?.type == 'reward' && 'item_list' in announce) {
      if (formData.type == 'coin') {
        const coinType = (['gold_coin', 'arcade_coin'] as const).find(
          (t) => t == formData.item_id,
        );

        if (coinType) {
          API.announce.reward
            .Update(+announceId, {
              ...announce,
              [coinType]: formData.amount,
            })
            .then((res) => {
              if (res.status_code == 200 || res.status_code == 201) {
                showMessage('เพิ่มเหรียญสำเร็จ', 'success');
                fetchRecord();
              } else {
                showMessage(res.message, 'error');
              }
            });
        } else {
          showMessage('ไม่พบเหรียญที่เลือก', 'error');
        }
      } else {
        API.announce.reward
          .Update(+announceId, {
            ...announce,
            item_list: [
              ...announce.item_list,
              {
                item_id: +formData.item_id,
                amount: formData.amount,
                expired_at: formData.expired_at || null,
              },
            ],
          })
          .then((res) => {
            if (res.status_code == 200 || res.status_code == 201) {
              showMessage('บันทึกสำเร็จ', 'success');
              fetchRecord();
            } else {
              showMessage(res.message, 'error');
            }
          });
      }
    }
  }

  function fetchRecord() {
    API.announce[announceType].GetById(+announceId).then((res) => {
      if (res.status_code == 200) {
        setAnnounce(res.data);
      } else {
        showMessage(res.message, 'error');
      }
    });
  }

  useEffect(() => {
    if (type == 'update') {
      fetchRecord();
    }
  }, [announceId]);

  function onRemove(record: AnnounceRewardItem): void {
    if (record.type == 'coin') {
      API.announce.reward
        .DeleteCoin(+announceId, record.item_id.toString())
        .then((res) => {
          if (res.status_code == 200 || res.status_code == 201) {
            showMessage('ลบเหรียญสำเร็จ', 'success');
            fetchRecord();
          } else {
            showMessage(res.message, 'error');
          }
        });
    } else {
      API.announce.reward.DeleteItem(+announceId, record.item_id).then((res) => {
        if (res.status_code == 200 || res.status_code == 201) {
          showMessage('ลบไอเทมสำเร็จ', 'success');
          fetchRecord();
        } else {
          showMessage(res.message, 'error');
        }
      });
    }
  }

  return announceId != 'create' && announceId ? (
    announce ? (
      <CWAnnounceCreateLayout
        announce={announce}
        type={announceType as any}
        backHref="/gamemaster/announcement/$announceType"
        onSubmit={onSubmit}
        onRemove={onRemove}
        onItemSubmit={onItemSubmit}
      />
    ) : (
      <div>ไม่พบข้อมูล</div>
    )
  ) : (
    <CWAnnounceCreateLayout
      type={announceType}
      backHref="/gamemaster/announcement/$announceType"
      onSubmit={onSubmit}
    />
  );
};

export default DomainJSX;

import { useTranslation } from 'react-i18next';
import ConfigJson from '../../../config/index.json';

import CWTCreateLayout from '@domain/g04/g04-d02/local/component/web/template/cw-t-create-layout';
import { toDateTimeTH } from '@global/utils/date';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import CWImageUploadPreview from '../cw-image-upload-preview';
import CWFormInput from '../cw-form-input';
import { useNavigate } from '@tanstack/react-router';
import API from '../../../api';
import CWAddedItemRecords from '../cw-added-item-records';
import showMessage from '@global/utils/showMessage';
import { IPagination } from '@domain/g00/g00-d00/local/type';

type CWAnnounceCreateLayoutProps = (
  | {
      type: 'system';
      announce?: AnnouceSystem;
      onSubmit?: (announce: Partial<AnnouceSystem>) => void;
    }
  | {
      type: 'event';
      announce?: AnnouceEvent;
      onSubmit?: (announce: Partial<AnnouceEvent>) => void;
    }
  | {
      type: 'reward';
      announce?: AnnouceReward;
      onSubmit?: (announce: Partial<AnnouceReward>) => void;
    }
  | {
      type: 'notification';
      announce?: AnnouceNotification;
      onSubmit?: (announce: Partial<AnnouceNotification>) => void;
    }
) & {
  backHref: string;
  tabs?: { key: string; label: string; children?: React.ReactNode }[];
  setCurrentTabIndex?: (index: number) => void;
  onRemove?: (record: AnnounceRewardItem, index: number) => void;
  onItemSubmit?: (
    record: Pick<AnnounceRewardItem, 'type' | 'item_name' | 'expired_at' | 'amount'> & {
      item_id: number | string;
    },
  ) => void;
};

const CWAnnounceCreateLayout: React.FC<CWAnnounceCreateLayoutProps> = ({
  type,
  backHref,
  announce,
  onSubmit,
  onRemove = () => {},
  onItemSubmit = () => {},
  ...props
}) => {
  const { t } = useTranslation([ConfigJson.key]);
  const navigate = useNavigate();

  const [schools, setSchools] = useState<DropdownSchool[]>([]);
  const [subjects, setSubjects] = useState<DropdownSubject[]>([]);
  const [years, setYears] = useState<DropdownYear[]>([]);
  const [academicYears, setAcademicYears] = useState<number[]>([]);
  const [arcadeGames, setArcadeGames] = useState<DropdownArcadeGame[]>([]);

  const [formData, setFormData] = useState<Partial<Announcement>>({
    ...announce,
    type,
  });

  useEffect(() => {
    if (announce) setFormData(announce);
  }, [announce]);

  useEffect(() => {
    API.other.GetSchools({ limit: -1 }).then((res) => {
      if (res.status_code == 200) {
        setSchools(res.data);
      }
    });
    API.other.GetArcadeGames().then((res) => {
      if (res.status_code == 200) {
        setArcadeGames(res.data);
      }
    });
  }, []);

  useEffect(() => {
    API.other
      .GetYears({
        school_id: formData?.school_id || undefined,
        limit: -1,
      })
      .then((res) => {
        if (res.status_code == 200) {
          setYears(res.data);
        }
      });
    if (formData.school_id) {
      API.other
        .GetAcademicYearsBySchoolId(formData?.school_id, { limit: -1 })
        .then((res) => {
          if (res.status_code == 200) {
            setAcademicYears(res.data.map((d) => d.academic_year));
          }
        });
    }
  }, [formData?.school_id]);

  useEffect(() => {
    if (formData && (type == 'event' || type == 'reward' || type == 'notification')) {
      API.other
        .GetSubjects({
          school_id: formData?.school_id || undefined,
          year_id:
            'year_id' in formData && formData?.year_id
              ? parseInt(formData?.year_id.toString())
              : undefined,
          limit: -1,
        })
        .then((res) => {
          if (res.status_code == 200) {
            setSubjects(res.data);
          }
        });
    }
  }, [
    formData?.school_id,
    formData && 'year_id' in formData ? formData?.year_id : undefined,
  ]);

  function onInput(value: Record<string, any>) {
    setFormData((prev) => ({
      ...prev,
      ...value,
    }));
  }

  const accesses = [
    {
      label: 'ระดับโรงเรียน',
      key: 'School',
    },
    {
      label: 'ระดับวิชา',
      key: 'Subject',
    },
  ];

  const types = [
    {
      label: 'ประกาศจากระบบ',
      key: 'system',
    },
    {
      label: 'กิจกรรม',
      key: 'event',
    },
    {
      label: 'แจกไอเทม',
      key: 'reward',
    },
    {
      label: 'แจ้งเตือนจากระบบ',
      key: 'notification',
    },
  ];

  const accessOptions = accesses.map((access) => ({
    label: access.label,
    value: access.key,
  }));
  const typeOptions = types.map((type) => ({
    label: type.label,
    value: type.key,
  }));

  useEffect(() => {
    onInput({
      scope: formData?.type == 'system' ? 'School' : 'Subject',
    });
  }, [formData?.type]);

  const formRef = useRef<HTMLFormElement>(null);
  const isViewed = useMemo(() => {
    return announce && type == 'event';
  }, [type, announce]);

  return (
    <CWTCreateLayout
      {...announce}
      breadcrumbs={[
        { text: 'รายงานและการประกาศ', href: '' },
        { text: 'จัดการประกาศ', href: '' },
        { text: announce ? announce.id.toString() : 'สร้างประกาศ', href: '' },
      ]}
      navigateLabel={announce ? (isViewed ? 'ดูประกาศ' : 'แก้ไขประกาศ') : 'สร้างประกาศ'}
      navigateTo={backHref}
      buttonDisabled={isViewed}
      sideItems={[
        {
          type: 'label',
          key: 'id',
          label: formData?.type == 'event' ? 'รหัสกิจกรรม' : 'รหัสประกาศ',
          value: announce?.id,
        },
        {
          type: 'toggle',
          key: 'active',
          label: 'สถานะ',
          value: announce?.status == 'enabled' ? true : false,
          offLabel: 'ปิดใช้งาน',
          onLabel: 'เปิดใช้งาน',
        },
        {
          type: 'label',
          key: 'update_at',
          label: 'แก้ไขล่าสุด',
          value: announce?.updated_at,
          render() {
            return announce?.updated_at ? toDateTimeTH(announce.updated_at) : '-';
          },
        },
        {
          type: 'label',
          key: 'update_by',
          label: 'แก้ไขล่าสุดโดย',
          value: announce?.updated_by,
        },
      ]}
      onDataChange={(data) => {
        onInput({
          ...data,
          status: data.active ? 'enabled' : 'disabled',
        });
      }}
      onSubmit={() => {
        if (formData && formRef.current?.reportValidity()) onSubmit?.(formData);
      }}
      tabs={
        type == 'reward'
          ? [
              {
                key: 'announcement',
                label: 'เนื้อหาประกาศ',
              },
              {
                key: 'prize',
                label: 'ของรางวัล',
                onBeforeClick() {
                  if (!announce) {
                    showMessage('กรุณาบันทึกก่อน', 'warning');
                  }
                  return !!announce;
                },
                children: (
                  <CWAddedItemRecords
                    onRemove={onRemove}
                    records={announce?.item_list || []}
                    coins={announce?.coin_list || undefined}
                    onItemSubmit={onItemSubmit}
                  />
                ),
              },
            ]
          : undefined
      }
      setCurrentTabIndex={props.setCurrentTabIndex}
    >
      <form ref={formRef} className="flex flex-col gap-4 xl:flex-row">
        <div className="flex flex-1 justify-center">
          <CWImageUploadPreview
            value={announce?.image_url ?? ''}
            onChange={(image) => onInput({ announcement_image: image })}
            disabled={isViewed}
          />
        </div>
        <CWFormInput
          data={formData}
          onDataChange={setFormData}
          className="overflow-auto"
          fields={[
            [
              {
                key: 'scope',
                type: 'select',
                label: 'การเข้าถึง',
                disabled: true,
                options: accessOptions,
              },
              {
                key: 'type',
                type: 'select',
                label: 'ประเภท',
                options: typeOptions,
                required: true,
                disabled: !!announce,
                value: announce?.type ?? type,
                onChange(value) {
                  if (value)
                    navigate({
                      to: `/gamemaster/announcement/${value}/create`,
                    });
                },
              },
            ],
            [
              {
                key: 'school_id',
                type: 'select',
                label: 'โรงเรียน',
                options: schools.map((s) => ({
                  label: s.name,
                  value: s.id.toString(),
                })),
                required: true,
                value: announce?.school_id ?? '',
                disabled: isViewed,
              },
              {
                key: 'academic_year',
                type: 'select',
                label: 'ปีการศึกษา',
                options: academicYears.map((a) => ({
                  label: a.toString(),
                  value: a.toString(),
                })),
                required: true,
                value: announce
                  ? 'academic_year' in announce
                    ? (announce?.academic_year ?? '')
                    : ''
                  : '',
                hidden: !['event', 'reward', 'notification'].includes(
                  formData?.type ?? '',
                ),
                disabled: isViewed,
              },
              { type: 'blank', hidden: !['system'].includes(formData?.type ?? '') },
            ],
            [
              {
                key: 'year_id',
                type: 'select',
                label: 'ชั้นปี',
                options: years.map((y) => ({
                  label: y.name,
                  value: y.id.toString(),
                })),
                required: true,
                value: announce
                  ? 'year_id' in announce
                    ? (announce?.year_id ?? '')
                    : ''
                  : '',
                hidden: !['event', 'reward', 'notification'].includes(
                  formData?.type ?? '',
                ),
                disabled: isViewed,
              },
              {
                key: 'subject_id',
                type: 'select',
                label: 'วิชา',
                options: subjects.map((s) => ({
                  label: s.SubjectName,
                  value: s.id.toString(),
                })),
                required: true,
                value: announce
                  ? 'subject_name' in announce
                    ? (announce?.subject_name ?? '')
                    : ''
                  : '',
                hidden: !['event', 'reward', 'notification'].includes(
                  formData?.type ?? '',
                ),
                disabled: isViewed,
              },
            ],
            [{ type: 'border' }],
            [
              {
                key: 'started_at',
                type: 'datetime',
                label:
                  formData?.type == 'event'
                    ? 'วันที่เริ่มกิจกรรม'
                    : 'วันที่เริ่มเผยเเพร่',
                required: true,
                value: announce?.started_at,
                hidden: !['system', 'event', 'notification'].includes(
                  formData?.type ?? '',
                ),
                disabled: isViewed,
              },
            ],
            [
              {
                key: 'ended_at',
                type: 'datetime',
                label:
                  formData?.type == 'event' ? 'วันที่จบกิจกรรม' : 'วันที่หยุดเผยเเพร่',
                hidden: !['system', 'event', 'notification'].includes(
                  formData?.type ?? '',
                ),
                required: true,
                value: announce?.ended_at,
                disabled: isViewed,
              },
            ],
            [
              {
                key: 'title',
                type: 'text',
                label: formData?.type == 'event' ? 'หัวข้อกิจกรรม' : 'หัวข้อประกาศ',
                required: true,
                value: announce?.title,
                disabled: isViewed,
              },
            ],
            [
              {
                key: 'started_at',
                type: 'datetime',
                label: 'วันที่แจกไอเทม',
                required: true,
                value: announce?.started_at,
                hidden: !['reward'].includes(formData?.type ?? ''),
                disabled: isViewed,
              },
            ],
            [
              {
                key: 'description',
                type: 'editor',
                inputClassName: 'overflow-auto w-full',
                label: 'เนื้อหา',
                required: true,
                value: announce?.description,
                disabled: isViewed,
              },
            ],
            [
              {
                key: 'arcade_game_id',
                type: 'select',
                label: 'เลือกกิจกรรม',
                options: arcadeGames.map((a) => ({
                  label: a.ArcadeGameName,
                  value: a.ArcadeGameId.toString(),
                })),
                required: true,
                value: announce
                  ? 'arcade_game_id' in announce
                    ? announce?.arcade_game_id
                    : ''
                  : '',
                hidden: type != 'event',
                disabled: isViewed,
              },
            ],
          ]}
        />
      </form>
    </CWTCreateLayout>
  );
};

export default CWAnnounceCreateLayout;

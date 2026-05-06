import CWButton from '@component/web/cw-button';
import CWModalSelect from '@component/web/cw-modal/cw-modal-select';

import CWMTab from '@component/web/molecule/cw-m-tab';
import IconArrowBackward from '@core/design-system/library/component/icon/IconArrowBackward.tsx';
import API from '@domain/g01/g01-d08/local/api';
import StoreGlobal from '@global/store/global';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { FamilyListResponse } from '../local/api/group/admin-family/type';
import showMessage from '@global/utils/showMessage';
import CWBreadcrumbs from '@component/web/cw-breadcrumbs';

const FamilyInfo = () => {
  const navigator = useNavigate();
  const { familyId } = useParams({ from: '' });

  const [data, setData] = useState<FamilyListResponse>();

  const fetchFamilyInfo = async () => {
    try {
      const response = await API.adminFamily.GetFamilyInfo(familyId);
      if (response?.status_code === 200) setData(response.data);
    } catch (err) {
      console.error('Error fetching family info:', err);
    }
  };

  // Sidebar
  useEffect((): void => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  useEffect(() => {
    fetchFamilyInfo();
  }, []);

  // Modal Family Member Owner
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState<string>('');
  const [optionsList, setOptionsList] = useState<{ id: number; name: string }[]>([]);
  const [rawDataFamilyMemberOwner, setRawDataFamilyMemberOwner] = useState<
    FamilyListResponse[]
  >([]);

  useEffect(() => {
    // GetFamilyMemberOwner
    const fetchFamilyMemberOwner = async () => {
      try {
        const response = await API.adminFamily.GetFamilyMemberOwner(familyId);
        if (response?.status_code === 200) {
          if (response.data.length === 0) {
            setOptionsList([]);
            setRawDataFamilyMemberOwner([]);
          } else {
            setOptionsList(
              response?.data?.map((member: FamilyListResponse, index) => ({
                id: index,
                name: `${member.first_name} ${member.last_name}`,
              })),
            );
            setRawDataFamilyMemberOwner(
              response?.data?.map((member: FamilyListResponse, index) => ({
                ...member,
                id: index,
              })),
            );
          }
        }
      } catch (err) {
        console.error('Error fetching family member owner:', err);
      }
    };
    if (isModalOpen) {
      fetchFamilyMemberOwner();
    }
  }, [familyId, isModalOpen]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleOwnerSelect = async (owner: string) => {
    const selectedOption = optionsList.find((option) => option.name === owner);
    if (selectedOption) {
      const selectedMemberData = rawDataFamilyMemberOwner.find(
        (item) => item?.id === selectedOption.id,
      );

      try {
        const response = await API.adminFamily.UpdateFamilyOwner(
          familyId,
          selectedMemberData?.user_id || '',
        );
        if (response?.status_code === 200) {
          closeModal();
          showMessage('เปลี่ยนเจ้าของบัญชีครอบครัวสำเร็จ', 'success');
          fetchFamilyInfo();
        }
      } catch (err) {
        showMessage('บันทึกข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง', 'error');
      }
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <CWBreadcrumbs
        links={[
          {
            label: 'สำหรับแอดมิน',
            href: '/',
            disabled: true,
          },
          {
            label: 'จัดการครอบครัว',
            href: '/admin/family',
          },
          {
            label: `แก้ไขครอบครัว ${familyId}`,
          },
        ]}
      />

      <div className={'flex items-center gap-2.5'}>
        <div
          className="cursor-pointer p-2"
          onClick={() => {
            navigator({ to: '/admin/family' });
          }}
        >
          <IconArrowBackward />
        </div>
        <span className={'text-2xl font-bold'}>แก้ไขครอบครัว</span>
      </div>

      <div className="panel flex flex-col gap-5">
        <CWMTab
          tabs={[
            {
              name: 'ข้อมูลครอบครัว',
              to: '/admin/family/$familyId/info',
              checkActiveUrl: '/admin/family/*/info',
            },
            {
              name: 'ผู้ปกครอง',
              to: '/admin/family/$familyId/parent',
              checkActiveUrl: '/admin/family/*/parent',
            },
            {
              name: 'นักเรียน',
              to: '/admin/family/$familyId/student',
              checkActiveUrl: '/admin/family/*/student',
            },
          ]}
        />

        {!data ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-lg text-gray-500">ข้อมูลไม่พบ</p>{' '}
            {/* Show a message or loading state */}
          </div>
        ) : (
          <div className="grid w-fit grid-cols-[auto_auto] items-center gap-x-5 gap-y-5">
            <span>รหัสครอบครัว:</span>
            <span>{data.family_id}</span>

            {/* <span>LINE ID เจ้าของ</span>
            <span>{data.line_id || '-'}</span> */}

            <span>เจ้าของบัญชีครอบครัว:</span>
            <div className="flex items-center justify-end gap-5">
              <span>
                {data.first_name} {data.last_name}
              </span>
              <CWButton
                variant={'primary'}
                title={'เปลี่ยนเจ้าของ'}
                onClick={openModal}
                outline={true}
              />
            </div>

            <span>จำนวนสมาชิก:</span>
            <span>{data.member_count}</span>
          </div>
        )}
      </div>

      <CWModalSelect
        title={'เปลี่ยนเจ้าของ'}
        label={'เจ้าของบัญชีครอบครัว:'}
        open={isModalOpen}
        onClose={closeModal}
        onSelect={handleOwnerSelect}
        optionsList={optionsList}
      />
    </div>
  );
};

export default FamilyInfo;

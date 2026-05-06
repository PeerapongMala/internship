import { useEffect, useState, FormEvent } from 'react';
import { CouponStatus, Curriculum } from '../local/type';
import { useNavigate } from '@tanstack/react-router';
import StoreGlobalPersist from '@store/global/persist';
import StoreGlobal from '@store/global';
import CWBreadcrumbs from '@component/web/cw-breadcrumbs';
import CWTitleBack from '@component/web/cw-title-back';
import CWWhiteBox from '@component/web/cw-white-box';
import SidePanel from '../local/components/web/organism/Sidepanel';
import CWDetail from './components/web/template/cw-detail';
import API from '../local/api';
import { TCreateCouponBody } from '../local/api/helper/redeem';
import dayjs from '../../../../global/utils/dayjs';
import { TGetListPetRes, TGetListPetReq } from '../local/api/helper/pet';
import { TGetListAvatarRes, TGetListAvatarReq } from '../local/api/helper/avatar';
import showMessage from '@global/utils/showMessage';

const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  return { isOpen, open: () => setIsOpen(true), close: () => setIsOpen(false) };
};

const DomainJSX = () => {
  const navigate = useNavigate();
  const [redeemData, setRedeemData] = useState<any[]>([]);
  const [status, setStatus] = useState<CouponStatus>(CouponStatus.WAITING);

  const handleSave = (newData: any) => {
    console.log('New data received:', newData);
    setRedeemData((prevData) => [...prevData, newData]);
  };

  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  const [petList, setPetList] = useState<{ id: number; model_id: string }[]>([]);
  const [avatarList, setAvatarList] = useState<
    { id: number; model_id: string; level: number }[]
  >([]);

  const fetchPets = async () => {
    try {
      const response: TGetListPetRes = await API.redeem.GetPet({} as TGetListPetReq);
      setPetList(response.data || []);
    } catch (error) {
      console.error('Failed to fetch pet data:', error);
    }
  };

  const fetchAvatars = async () => {
    try {
      const response: TGetListAvatarRes = await API.redeem.GetAvatar(
        {} as TGetListAvatarReq,
      );
      setAvatarList(response.data || []);
    } catch (error) {
      console.error('Failed to fetch avatar data:', error);
    }
  };

  useEffect(() => {
    fetchPets();
    fetchAvatars();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const couponCode = formData.get('coupon_code')?.toString().trim();
    const startDate = formData.get('start_date')?.toString();
    const startTime = formData.get('start_time')?.toString();
    const endDate = formData.get('end_date')?.toString();
    const endTime = formData.get('end_time')?.toString();
    const stock = formData.get('stock')?.toString();

    if (!couponCode) {
      showMessage('กรุณากรอกรหัสคูปอง', 'warning');
      return;
    }

    if (!startDate) {
      showMessage('กรุณาเลือกวันที่เริ่มเผยแพร่', 'warning');
      return;
    }
    if (!startTime) {
      showMessage('กรุณาเลือกเวลาเริ่มเผยแพร่', 'warning');
      return;
    }

    if (!endDate) {
      showMessage('กรุณาเลือกวันที่หมดอายุ', 'warning');
      return;
    }
    if (!endTime) {
      showMessage('กรุณาเลือกเวลาหมดอายุ', 'warning');
      return;
    }

    const startAt = dayjs(`${startDate} ${startTime}`, 'DD/MM/YYYY HH:mm');
    const endAt = dayjs(`${endDate} ${endTime}`, 'DD/MM/YYYY HH:mm');

    if (endAt.isBefore(startAt)) {
      showMessage('วันที่สิ้นสุดต้องไม่น้อยกว่าวันที่เริ่มต้น', 'warning');
      return;
    }

    const payload: TCreateCouponBody = {
      code: formData.get('coupon_code') as string,
      started_at: startAt.toISOString(),
      ended_at: endAt.toISOString(),
      status: CouponStatus.PUBLISH,
      stock: Number(stock) || 0,
      initial_stock: Number(stock),
      gold_coin_amount: Number(formData.get('gold_coin_amount')) ?? 0,
      arcade_coin_amount: Number(formData.get('arcade_coin_amount')) ?? 0,
      ice_amount: Number(formData.get('ice_amount')) || 0,
      avatar_id: formData.get('avatar_id')
        ? Number(formData.get('avatar_id'))
        : undefined,
      pet_id: formData.get('pet_id') ? Number(formData.get('pet_id')) : undefined,
    };

    console.log(payload);

    try {
      await API.redeem.Post({ Body: payload });
      showMessage('คูปองถูกสร้างสำเร็จ!', 'success');
      navigate({ to: '/gamemaster/redeem' });
      handleSave(payload);
    } catch (error) {
      showMessage('เกิดข้อผิดพลาดในการดึงข้อมูล', 'error');
    }
  };

  return (
    <div className="w-full">
      <CWBreadcrumbs
        links={[
          { label: 'ระบบเกม', href: '#' },
          { label: 'ข้อมูลการตลาด', href: '#' },
          { label: 'เพิ่มคูปอง', href: '#' },
        ]}
      />
      <div className="my-5">
        <CWTitleBack label="เพิ่มคูปอง" href="../" />
      </div>
      <form onSubmit={handleSubmit} className="flex gap-5">
        <CWWhiteBox className="flex w-[70%] flex-col gap-5">
          <div className="w-full">
            <CWDetail petList={petList} avatarList={avatarList} />
          </div>
        </CWWhiteBox>

        <SidePanel
          titleName="รหัสคูปอง"
          statusValue={status}
          status={(newStatus) => {
            setStatus(newStatus);
          }}
        />
      </form>
    </div>
  );
};

export default DomainJSX;

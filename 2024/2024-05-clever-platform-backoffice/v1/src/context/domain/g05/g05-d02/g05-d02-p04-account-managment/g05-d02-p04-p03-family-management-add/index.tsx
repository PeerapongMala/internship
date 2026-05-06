import { useNavigate, useParams, useSearch } from '@tanstack/react-router';
import FooterMenu from '../../local/component/web/organism/cw-o-footer-menu';
import FamilyTemplate from '../local/component/web/template/FamilyTemplate';
import { useEffect, useState } from 'react';
import showMessage from '@global/utils/showMessage';
import API from '../../local/api';
import { AxiosError, AxiosResponse } from 'axios';
import { TPostAddFamilyRes } from '../../local/api/helper/family';
import StoreGlobal from '@store/global';

const DomainJsx = () => {
  const navigate = useNavigate();
  const query: { user_id?: string; expired_at?: string } = useSearch({ strict: false });

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateLayout = () => {
      const isMobile = window.innerWidth > 768;
      StoreGlobal.MethodGet().TemplateSet(isMobile);
      StoreGlobal.MethodGet().BannerSet(isMobile);
      setIsMobile(false);
      if (!isMobile) {
        StoreGlobal.MethodGet().TemplateSet(false);
        StoreGlobal.MethodGet().BannerSet(false);
        setIsMobile(true);
      }
    };
    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, [navigate]);
  useEffect(() => {
    if (!query.user_id) {
      showMessage('no user id provide! error', 'error');
      navigate({ to: `/line/parent/family` });
      return;
    }

    if (query.expired_at) {
      const expiredDate = new Date(query.expired_at);
      const now = new Date();

      if (isNaN(expiredDate.getTime())) {
        showMessage('Invalid expiration date!', 'error');
        navigate({ to: `/line/parent/family` });
        return;
      }

      if (now > expiredDate) {
        const expiredTime = expiredDate.toLocaleString('th-TH');
        showMessage(`QR Code หมดอายุแล้ว (หมดอายุเมื่อ: ${expiredTime})`, 'error');
        navigate({ to: `/line/parent/family` });
        return;
      }
    }

    handleAddFamilyMember(query.user_id);
  }, [query]);

  const handleAddFamilyMember = async (userID: string) => {
    try {
      const family = await getFamily();
      const familyID = Number(family.family_id);

      const response = await API.Family.AddFamilyMember({
        family_id: familyID,
        user_id: userID,
      });

      showMessage('เพิ่มสมาชิกสำเร็จ');
      navigate({ to: `/line/parent/family/${familyID}/management` });
    } catch (error) {
      const err = error as AxiosError;

      if (err.response?.status === 409) {
        showMessage('สมาชิกนี้ผูกกับครอบครัวอื่นแล้ว', 'warning');
        const family = await getFamily();
        navigate({ to: `/line/parent/family/${family.family_id}/management` });
        return;
      }

      showMessage(err.message || 'เกิดข้อผิดพลาดในการเพิ่มสมาชิก', 'error');
      throw error;
    }
  };

  const getFamily = async () => {
    try {
      const response = await API.Family.GetFamily({});

      if (isNaN(Number(response.data.data.family_id))) {
        throw new Error('family_id is NaN');
      }

      return response.data.data;
    } catch (error) {
      showMessage(`Invalid Family ID: ${(error as Error).message}`, 'error');
      navigate({ to: `/line/parent/family` });
      throw error;
    }
  };

  return (
    <FamilyTemplate>
      <span> user: {query.user_id}</span>

      <FooterMenu />
    </FamilyTemplate>
  );
};

export default DomainJsx;

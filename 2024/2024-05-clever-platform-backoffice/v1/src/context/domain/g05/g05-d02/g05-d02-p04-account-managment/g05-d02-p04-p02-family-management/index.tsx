import { useFamilyEditStore, useFamilyStore } from '../../local/stores/family-store';
import { EManageFamilyType } from '../../local/enums/family';
import { useEffect, useState } from 'react';
import FamilyCreateMenu from './component/web/organism/cw-o-family-manage-menu';
import FamilyListTemplate from './component/web/template/cw-t-family-list';
import { useLocation, useNavigate, useParams } from '@tanstack/react-router';
import FooterMenu from '../../local/component/web/organism/cw-o-footer-menu';
import ButtonText from '../local/component/web/atom/cw-a-button-text';
import MyQrCodeTemplate from '../local/component/web/template/cw-t-my-qr-code';
import FamilyTemplate from '../local/component/web/template/FamilyTemplate';
import API from '../../local/api';
import IconArrowBackward from '@core/design-system/library/component/icon/IconArrowBackward';
import router from '@global/utils/router-global';
import StoreGlobal from '@store/global';

const DomainJsx = () => {
  const location = useLocation();
  const params: { family_id: string } = useParams({ strict: false });
  const [selectedTab, setSelectedTab] = useState(0);

  const editStore = useFamilyEditStore((state) => state);
  const [isEdit, setIsEdit] = [editStore.isEdit, editStore.setEdit];
  const navigate = useNavigate();
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
  const {
    family,
    setFamily,
    updateMemberTask,
    clearUpdateMemberTask,
    addUpdateMemberTask,
  } = useFamilyStore((state) => state);

  const [isSaving, setIsSaving] = useState(false);

  // set edit when have is_edit in query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const isEdit = params.get('is_edit');

    if (isEdit) {
      setIsEdit(true);
    }
  }, []);

  useEffect(() => {
    fetchFamily();
  }, []);

  const fetchFamily = async () => {
    try {
      const res = await API.Family.GetFamily({ family_id: params.family_id });
      const data = res.data;
      setFamily(data.data);
      console.log(data);
    } catch (error) {
      console.error('Error fetching family:', error);
    }
  };

  const handleSave = async () => {
    setIsEdit(false);
    setIsSaving(true);
    try {
      const payload = {
        Body: {
          users: family?.members.map((member) => ({
            ...member,
          })),
          manage_family: 'manage',
        },
      };

      const response = await API.Family.PostUpdateData({
        Body: {
          users: updateMemberTask,
          manage_family: EManageFamilyType.MANAGE,
          family_id: Number(params.family_id),
        },
      });

      clearUpdateMemberTask();
      console.log('Update success:', response);

      setIsEdit(false);
    } catch (error) {
      setIsSaving(false);
      console.error('Failed to update family:', error);
    }
  };

  return (
    <FamilyTemplate
      className="mt-[5px] gap-[18px] font-noto-sans-thai"
      familyMenu={<FamilyCreateMenu onTabChange={(tab) => setSelectedTab(tab)} />}
    >
      <div className="px-5">
        <div className="fixed left-5 top-[0.5rem] z-10">
          <a
            href="/line/parent/family"
            onClick={(e) => {
              e.preventDefault();
              router.history.back();
            }}
          >
            <IconArrowBackward />
          </a>
        </div>

        {isEdit && (
          <ButtonText
            className="fixed bottom-[21px] left-1/2 -translate-x-1/2 -translate-y-1/2 transform md:left-[55%]"
            onClick={handleSave}
            label="บันทึก"
          />
        )}
        {selectedTab === 0 && (
          <FamilyListTemplate
            family={family}
            onAddMemberSuccess={() => {
              fetchFamily();
            }}
          />
        )}
        {selectedTab === 1 && <MyQrCodeTemplate />}
        {!isEdit && (
          <div className="mt-4 flex w-full justify-center">
            <FooterMenu />
          </div>
        )}
      </div>
    </FamilyTemplate>
  );
};

export default DomainJsx;

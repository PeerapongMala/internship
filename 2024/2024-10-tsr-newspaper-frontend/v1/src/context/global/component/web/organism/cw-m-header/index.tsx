import { useTranslation } from 'react-i18next';
import StoreGlobal from '../../../../store/global';
import CWMHeaderResponsiveFreesize from './responsive/freesize';
import CWMHeaderResponsiveMobile from './responsive/mobile';
import StoreGlobalPersist from '@store/global/persist';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Profiler } from 'node:inspector';
import { GetProfile } from './api/GetProfile';
const CWMHeader = (props: {
  userRole: number | string;
  
}) => {
  const { t } = useTranslation(['global']);

  const menuList: { name: string; path: string }[] = [
    {
      name: t('header.menu.main'),
      path: '/main',
    },
    {
      name: t('header.menu.post'),
      path: '/post',
    },
    {
      name: t('header.menu.download'),
      path: '/download',
    },
    {
      name: t('header.menu.about'),
      path: '/about-us',
    },
    {
      name: t('header.menu.faq'),
      path: '/faq',
    },
    {
      name: t('header.menu.contact'),
      path: '/contact',
    },
  ];

  // if (props.userRole === '1') {
  //   menuList.push(
  //     {
  //       name: 'จัดการแอดมิน',
  //       path: '/admin/announcement',
  //     }
  //   );
  // } else if (props.userRole === "2") {
  // }
  const { userData: globalUserData } = StoreGlobalPersist.StateGet(['userData']);
  const [user, setUser] = useState({ username: '', first_name: '', last_name: '', profile_image: '' });
  useEffect(() => {
    if (globalUserData) {
      setUser({
        username: globalUserData.username,
        first_name: globalUserData.first_name || '',
        last_name: globalUserData.last_name || '',
        profile_image: globalUserData.profile_image || ''
      });
    } else {
      setUser({
        username: '',
        first_name: '',
        last_name: '',
        profile_image: ''
      });
    }
  }, [globalUserData]);
  interface Profile {
    email?: string;
    username?: string;
    first_name?: string;
    last_name?: string;
    company?: string;
    branch?: string;
    tax_id?: string;
    phone?: string;
    address?: string;
    district?: string;
    sub_district?: string;
    province?: string;
    postal_code?: string;
    profile_image_url?: string
  };

  const [profileData, setProfileData] = useState<Profile>({
    email: '',
    username: '',
    first_name: '',
    last_name: '',
    company: '',
    branch: '',
    tax_id: '',
    phone: '',
    address: '',
    district: '',
    sub_district: '',
    province: '',
    postal_code: '',
    profile_image_url: ''
  });

  useEffect(() => {
    GetProfile()
      .then((res) => {

        setProfileData(res.data);
      })
      .catch((error) => {
        console.log(`Cant not Fetching ${error}`);
      });
  }, [globalUserData,user]);




  const { responsiveEvent } = StoreGlobal.StateGet(['responsiveEvent']);

  return (
    <header>
      {responsiveEvent.mobileIs ? (
        <CWMHeaderResponsiveMobile userRole={props.userRole || ''} menuList={menuList} userData={user} imageData={{ image_url_list: profileData?.profile_image_url || '' }}/>
      ) : (
        <CWMHeaderResponsiveFreesize userRole={props.userRole || ''} menuList={menuList} userData={user}  imageData={{ image_url_list: profileData?.profile_image_url || '' }} />
      )}
    </header>
  );
};

export default CWMHeader;

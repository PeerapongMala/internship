import { useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ResponsiveScaler from 'skillvir-architecture-helper/library/game-core/helper/responsive-scaler';

import SafezonePanel from '@component/web/atom/wc-a-safezone-panel';
import ModalChangeLanguage from '@global/component/web/molecule/wc-m-modal-change-language';
import ModalOfflineConfirm from '@global/component/web/molecule/wc-m-modal-offline-confirm';
import ModalSocialLogin from '@global/component/web/molecule/wc-m-modal-social-login';
import { cn } from '@global/helper/cn';
import { hashUserDataToNumber } from '@global/helper/hash';
import StoreGame from '@global/store/game';
import StoreGlobalPersist from '@store/global/persist';
import API from '../local/api';
import { UserData } from '../local/type';
import ContainerLeft from './component/web/templates/wc-a-container-left';
import ContainerRight from './component/web/templates/wc-a-container-right';
import Debug from './component/web/templates/wc-a-debug';
import ConfigJson from './config/index.json';
import { STATEFLOW } from './interfaces/stateflow.interface';

const DomainJSX = () => {
  const navigate = useNavigate();
  const accessToken = StoreGlobalPersist.StateGetAllWithUnsubscribe().accessToken;
  const { stateFlow } = StoreGame.StateGet(['stateFlow']);

  const { t, i18n } = useTranslation([ConfigJson.key]);

  const [showModalSocialLogin, setShowModalSocialLogin] = useState(false);
  const [showModalChangeLanguage, setShowModalChangeLanguage] = useState(false);
  const [showModalOfflineMode, setShowModalOfflineMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [offLineMode, setOffLineMode] = useState(false);
  const [schoolID, setSchoolID] = useState('');
  const [userID, setUserID] = useState('');
  const [inputFailed, setInputFailed] = useState(false);
  const [classNameStateFlowLeft, setClassNameStateFlowLeft] = useState('');
  const [classNameStateFlowRight, setClassNameStateFlowRight] = useState('');

  // admin mode
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const enableEnterAdminMode = 'clicked'; // "pressed" | "clicked" | undefined

  const checkSchoolID = async () => {
    return await API.Auth.CheckSchoolId(schoolID)
      .then((res) => {
        if (res.status_code === 200) {
          return res.data.is_exists;
        }
        return false;
      })
      .catch((err) => {
        console.error(err);
        return false;
      });
  };

  const checkStudentID = async () => {
    return await API.Auth.CheckStudentId(schoolID, userID);
  };

  const handleNext = async () => {
    if (stateFlow == STATEFLOW.SchoolID) {
      const check = await checkSchoolID();
      if (check) {
        StoreGame.MethodGet().State.Flow.Set(STATEFLOW.UserID);
        setInputFailed(false);
        setClassNameStateFlowLeft('transition-opacity ease-in duration-200 opacity-0');
        setClassNameStateFlowRight('left-[22rem] transition-all duration-300');
      } else {
        setInputFailed(true);
      }
    }
    if (stateFlow == STATEFLOW.UserID) {
      const response = await checkStudentID();

      if (response && response.status_code === 200) {
        const targetUser = response.data;
        const targetLocalUser = StoreGlobalPersist.MethodGet().getUserDataByUniqueId(
          userID,
          schoolID,
        );

        // check if user is known from the current device
        if (!targetLocalUser) {
          // choose an temporary avatar for user based on their school code and student id
          const hashingUserNumber = hashUserDataToNumber({
            first_name: targetUser.first_name,
            last_name: targetUser.last_name,
          });
          // according to the avatar number on public assets
          // icon-avatar-1.svg, icon-avatar-2.svg, icon-avatar-3.svg
          const avatarNumber = Math.abs(hashingUserNumber % 3) + 1; // should be 1, 2, or 3
          const tempImage = `/assets/character/icon-avatar-${avatarNumber}.svg`;

          // create new user data
          const newUser: Partial<UserData> = {
            ...targetUser,
            student_id: userID,
            school_code: schoolID,
            image_url: targetUser.image_path ?? tempImage,
            temp_image: tempImage,
          };
          StoreGlobalPersist.MethodGet().addUserData(newUser);
        } else {
          // update user data if user is already known
          StoreGlobalPersist.MethodGet().updateUserData({
            ...targetLocalUser,
            ...targetUser,
          });
        }

        setInputFailed(false);
        navigate({ to: '/pin', viewTransition: true });
      } else {
        setInputFailed(true);
      }
    }
  };

  const checkAdminEmail = () => {
    // check is email valid
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(adminEmail);
  };

  const checkStringHasLength = (text: string) => {
    return text.length > 0;
  };

  const handleAdminNext = async () => {
    if (stateFlow === STATEFLOW.AdminEmail) {
      const check = await checkAdminEmail();
      if (check) {
        StoreGame.MethodGet().State.Flow.Set(STATEFLOW.AdminPassword);
        setInputFailed(false);
      } else {
        setInputFailed(true);
      }
    } else if (stateFlow === STATEFLOW.AdminPassword) {
      const checkValidPassword = checkStringHasLength(adminPassword);
      // check if email and password are valid
      const response = await API.Auth.CheckAdmin({
        email: adminEmail,
        password: adminPassword,
      });
      const isValidAdminAccount = response.status_code === 200 && response.data?.is_admin;
      if (checkValidPassword && isValidAdminAccount) {
        StoreGame.MethodGet().State.Flow.Set(STATEFLOW.AdminSchoolID);
        setInputFailed(false);
      } else {
        setInputFailed(true);
      }
    } else if (stateFlow === STATEFLOW.AdminSchoolID) {
      const checkIsSchoolIDNotEmpty = checkStringHasLength(schoolID);
      const checkSchoolIDValid = checkIsSchoolIDNotEmpty && (await checkSchoolID());
      if (checkSchoolIDValid) {
        StoreGame.MethodGet().State.Flow.Set(STATEFLOW.AdminUserID);
        setInputFailed(false);
      } else {
        setInputFailed(true);
      }
    } else if (stateFlow === STATEFLOW.AdminUserID) {
      if (!checkStringHasLength(userID)) {
        setInputFailed(true);
      }

      const response = await API.Auth.LoginAsAdmin({
        email: adminEmail,
        password: adminPassword,
        school_code: schoolID,
        student_id: userID,
      });

      if (response && response.status_code === 200) {
        setInputFailed(false);
        const {
          access_token,
          admin_id,
          admin_title,
          admin_first_name,
          admin_last_name,
          ...user
        } = response.data;
        StoreGlobalPersist.MethodGet().login(user, access_token, {
          adminId: admin_id,
          adminFullname: `${admin_title} ${admin_first_name} ${admin_last_name}`,
        });
        navigate({ to: '/terms', viewTransition: true });
      } else {
        setInputFailed(true);
      }
    }
  };

  const handleToggleInternet = () => {
    if (offLineMode) {
      setOffLineMode(false);
    } else {
      setShowModalOfflineMode(true);
    }
  };

  const handleOk = () => {
    setShowModalOfflineMode(false);
    setOffLineMode(true);
  };

  const handleClickBack = () => {
    if (stateFlow == STATEFLOW.UserID) {
      StoreGame.MethodGet().State.Flow.Set(STATEFLOW.SchoolID);
      setClassNameStateFlowLeft('transition-opacity ease-in duration-200 opacity-100');
      setClassNameStateFlowRight('left-[42rem] transition-all duration-300');
    }
  };

  const handleAdminClickBack = async () => {
    setInputFailed(false);
    if (stateFlow === STATEFLOW.AdminEmail) {
      StoreGame.MethodGet().State.Flow.Set(STATEFLOW.SchoolID);
      setClassNameStateFlowLeft('transition-opacity ease-in duration-200 opacity-100');
      setClassNameStateFlowRight('left-[42rem] transition-all duration-300');
    } else if (stateFlow === STATEFLOW.AdminPassword) {
      StoreGame.MethodGet().State.Flow.Set(STATEFLOW.AdminEmail);
    } else if (stateFlow === STATEFLOW.AdminSchoolID) {
      StoreGame.MethodGet().State.Flow.Set(STATEFLOW.AdminPassword);
    } else if (stateFlow === STATEFLOW.AdminUserID) {
      StoreGame.MethodGet().State.Flow.Set(STATEFLOW.AdminSchoolID);
    }
  };

  useEffect(() => {
    switch (stateFlow) {
      case STATEFLOW.AdminEmail:
      case STATEFLOW.AdminPassword:
      case STATEFLOW.AdminSchoolID:
        setClassNameStateFlowLeft('transition-opacity ease-in duration-200 opacity-0');
        setTimeout(() => {
          setClassNameStateFlowLeft('hidden opacity-0');
        }, 200);
        setClassNameStateFlowRight('left-[22rem] transition-all duration-300');
        break;
      case STATEFLOW.SchoolID:
      case STATEFLOW.UserID:
        break;
      default:
        break;
    }
  }, [stateFlow]);

  useEffect(() => {
    if (stateFlow !== STATEFLOW.SchoolID && schoolID === '') {
      console.log('Resetting schoolID due to stateFlow change');
      StoreGame.MethodGet().State.Flow.Set(STATEFLOW.SchoolID);
    }
  }, [stateFlow, schoolID]);

  useEffect(() => {
    StoreGame.MethodGet().GameCanvasEnableSet(false);
    StoreGame.MethodGet().State.Flow.Set(STATEFLOW.SchoolID);
    localStorage.removeItem('newUser');
  }, []); // Make sure to provide an appropriate dependency array

  // to-do: after finish login by admin, uncomment this code
  // useEffect(() => {
  //   if (accessToken) {
  //     navigate({ to: '/annoucement' });
  //   }
  // }, [accessToken]);

  const isModalActive =
    showModalSocialLogin || showModalChangeLanguage || showModalOfflineMode || showModal;

  return (
    <ResponsiveScaler
      scenarioSize={{ width: 1280, height: 720 }}
      deBugVisibleIs={false}
      className="flex-1"
    >
      {isModalActive && <div className="absolute inset-0 bg-black opacity-70 z-10"></div>}
      <SafezonePanel
        id="main-modal"
        className={cn('relative inset-0 h-full w-full', isModalActive && 'z-50')}
      >
        <ModalSocialLogin
          showModal={showModalSocialLogin}
          setShowModal={setShowModalSocialLogin}
        />
        <ModalChangeLanguage
          showModal={showModalChangeLanguage}
          setShowModal={setShowModalChangeLanguage}
          disableClose={false}
        />
        <ModalOfflineConfirm
          showModal={showModalOfflineMode}
          setShowModal={setShowModalOfflineMode}
          onOk={handleOk}
        />
      </SafezonePanel>
      <SafezonePanel className="flex items-center inset-0">
        <Debug />
        <div
          className={`absolute h-[calc(100%-220px)] w-[calc(100%-580px)] top-[120px] left-[30px] ${classNameStateFlowLeft}`}
        >
          <ContainerLeft
            enableEnterAdminMode={enableEnterAdminMode}
            setShowModalSocialLogin={setShowModalSocialLogin}
            setShowModalChangeLanguage={setShowModalChangeLanguage}
          />
        </div>
        <div
          className={`absolute h-[calc(100%-170px)] w-[calc(100%-716px)] top-[104px] ${classNameStateFlowRight ? classNameStateFlowRight : 'left-[42rem]'}`}
        >
          <ContainerRight
            schoolID={schoolID}
            setSchoolID={setSchoolID}
            userID={userID}
            setUserID={setUserID}
            adminEmail={adminEmail}
            setAdminEmail={setAdminEmail}
            adminPassword={adminPassword}
            setAdminPassword={setAdminPassword}
            handleNext={handleNext}
            inputFailed={inputFailed}
            handleAdminNext={handleAdminNext}
            offLineMode={offLineMode}
            handleToggleInternet={handleToggleInternet}
            handleClickBack={handleClickBack}
            handleAdminClickBack={handleAdminClickBack}
            setShowModal={setShowModal}
          />
        </div>
      </SafezonePanel>
    </ResponsiveScaler>
  );
};

export default DomainJSX;

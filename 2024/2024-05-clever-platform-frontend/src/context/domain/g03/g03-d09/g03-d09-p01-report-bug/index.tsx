import ButtonBack from '@component/web/atom/wc-a-button-back';
import ButtonWithIcon from '@component/web/atom/wc-a-button-with-icon';
import { Icon } from '@component/web/atom/wc-a-icon';
import SafezonePanel from '@component/web/atom/wc-a-safezone-panel';
import Modal from '@component/web/molecule/wc-m-modal-overlay';
import IconLineApp from '@global/assets/icon-lineapp.png';
import StoreGame from '@global/store/game';
import StoreGlobal from '@store/global';
import StoreBackgroundMusic from '@store/global/background-music';
import StoreSubjects from '@store/global/subjects';
import { useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ResponsiveScaler from 'skillvir-architecture-helper/library/game-core/helper/responsive-scaler';
import API from './api';
import IconReport from './assets/icon-report.svg';
import WelcomeAnnounceBody from './component/template/infodialog-body';
import ConfigJson from './config/index.json';
import { BugReportItem } from './type';

const transformBugReportsToAnnouncements = (bugReports: BugReportItem[], t: any) => {
  return bugReports.map((bug) => {
    const date = new Date(bug.created_at);
    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    let statusCode = 2;

    if (bug.status === 'pending') {
      statusCode = 1;
    } else if (bug.status === 'in-progress') {
      statusCode = 2;
    } else if (bug.status === 'resolved') {
      statusCode = 3;
    } else if (bug.status === 'closed') {
      statusCode = 4;
    }

    return {
      id: bug.bug_id,
      header: `${t('bugReport.topic')}: ${bug.bug_id}`,
      shortTitle: bug.description,
      announceDate: formattedDate,
      content: bug.description,
      showDate: true,
      IsRead: false,
      IsDeleted: false,
      status: statusCode,
      announceContent: {
        // Report: `รายละเอียด: ${bug.description}\nสถานะ: ${bug.status}\nรายงานโดย: ${bug.created_by}\nประเภท: ${bug.type}`,
        Report: `${t('bugReport.details')}: ${bug.description}`,
      },
    };
  });
};

const DomainJSX = () => {
  const { t, i18n } = useTranslation([ConfigJson.key]);

  const [bugReportData, setBugReportData] = useState<any | null>(null);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [selectedAnnounce, setSelectedAnnounce] = useState<number>(0);

  const [isReportModalVisible, setReportModalVisible] = useState(false);

  const { currentSubject } = StoreSubjects.StateGet(['currentSubject']);

  useEffect(() => {
    // set background image by subject group id
    if (currentSubject?.seed_subject_group_id) {
      StoreGlobal.MethodGet().imageBackgroundUrlBySubjectGroupSet(
        currentSubject.seed_subject_group_id,
      );
    }
  }, [currentSubject]);

  useEffect(() => {
    StoreBackgroundMusic.MethodGet().playSound('cartoon_intro_3');
  }, []);

  useEffect(() => {
    StoreGame.MethodGet().GameCanvasEnableSet(false);
    StoreGame.MethodGet().State.Flow.Set(1);
    // i18n.changeLanguage('th');
  }, [i18n]);

  useEffect(() => {
    API.Global.ReportBug.Get()
      .then((response: any) => {
        if (response.status_code === 200 && response.data) {
          console.log('API Response:', response);
          setBugReportData(response);
          const transformedData = transformBugReportsToAnnouncements(response.data, t);
          setAnnouncements(transformedData);
        }
      })
      .catch((err: any) => console.error(err));
  }, [t]);

  const handleSlotClick = (announceKey: number) => {
    setSelectedAnnounce(announceKey);
  };

  const navigate = useNavigate();

  const AnnouncementContent: React.CSSProperties = {
    transform: 'translate(-50%, -50%)',
    left: '50%',
    top: '50%',
    position: 'absolute',
    width: 560 * 2,
    height: 301 * 2,
    display: `flex`,
    flexDirection: `column`,
    justifyContent: 'start',
    alignItems: `flex-start`,
    border: '4px solid var(--white, #ffffff)',
    borderRadius: '32px',
    boxShadow:
      '0px 4px 8px 0px rgba(0, 0, 0, 0.30), 0px 8px 32px 0px rgba(0, 0, 0, 0.15)',
    overflow: 'hidden',
    background: `rgba(255, 255, 255, 0.2)`,
  };

  return (
    <ResponsiveScaler scenarioSize={{ width: 1280, height: 720 }} className="flex-1">
      <SafezonePanel className="absolute inset-0 bg-white bg-opacity-0">
        <div className="inset-0" style={AnnouncementContent}>
          <div className="flex items-center justify-between w-full bg-white bg-opacity-60 p-4">
            <ButtonBack className="w-[64px] h-[64px]" />
            <p className="text-5xl flex-grow text-center">{t('bugReport.title')}</p>
            <div onClick={() => setReportModalVisible(true)} className="cursor-pointer">
              <Icon src={IconReport} className="w-[24px] h-[24px]" />
            </div>
          </div>

          {announcements.length > 0 ? (
            <WelcomeAnnounceBody
              t={t}
              announcedata={announcements}
              selectedannounce={selectedAnnounce}
              onSlotsClick={handleSlotClick}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl bg-white opacity-80">
              {bugReportData === null ? t('bugReport.notFound') : t('bugReport.loading')}
            </div>
          )}
        </div>
      </SafezonePanel>
      <Modal
        title={t('bugReport.modal.title')}
        isVisible={isReportModalVisible}
        setVisibleModal={setReportModalVisible}
        className="w-1/2 min-h-content bg-white"
        customBody={
          <div className="flex items-center justify-center w-full py-8 border-dashed border-secondary border-t-2">
            <a href="https://lin.ee/5OpvRTO" className="w-2/3" target="_blank">
              <ButtonWithIcon
                icon={IconLineApp}
                className="w-full"
                iconPosition="left"
                variant="success"
              >
                Line
              </ButtonWithIcon>
            </a>
          </div>
        }
        overlay={true}
        openOnLoad={false}
      />
    </ResponsiveScaler>
  );
};

export default DomainJSX;

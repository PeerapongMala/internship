import './index-module.css';

import SafezonePanel from '@component/web/atom/wc-a-safezone-panel';
import StoreGlobal from '@store/global';
import { SubjectListItem } from '@domain/g02/g02-d02/local/type';
import StoreBackgroundMusic from '@store/global/background-music';
import StoreSubjects from '@store/global/subjects';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ResponsiveScaler from 'skillvir-architecture-helper/library/game-core/helper/responsive-scaler';
import { ButtonBack } from './component/web/atom/wc-a-back-btn';
import ConfigJson from './config/index.json';

const loadFonts = () => {
  const linkIBM = document.createElement('link');
  linkIBM.href =
    'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;700&display=swap';
  linkIBM.rel = 'stylesheet';

  const linkNoto = document.createElement('link');
  linkNoto.href =
    'https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@400;700&display=swap';
  linkNoto.rel = 'stylesheet';

  const linkPrompt = document.createElement('link');
  linkPrompt.href =
    'https://fonts.googleapis.com/css2?family=Prompt:wght@400;700&display=swap';
  linkPrompt.rel = 'stylesheet';

  document.head.appendChild(linkIBM);
  document.head.appendChild(linkNoto);
  document.head.appendChild(linkPrompt);
};

const DomainJSX = () => {
  useEffect(() => {
    loadFonts();
    StoreBackgroundMusic.MethodGet().playSound('cartoon_intro_4');
  }, []);
  const { t } = useTranslation([ConfigJson.key]);
  const [dropdown, setDropdown] = useState(false);
  const [selectedItem, setSelectedItem] = useState(t('filter.all')); // เปลี่ยนจาก 'ทั้งหมด' เป็น t('filter.all')

  const { currentSubject: subject } = StoreSubjects.StateGet(['currentSubject']);

  useEffect(() => {
    loadFonts();
    StoreBackgroundMusic.MethodGet().playSound('cartoon_intro_4');
  }, []);

  useEffect(() => {
    // set background image by subject group id
    if (subject?.seed_subject_group_id) {
      StoreGlobal.MethodGet().imageBackgroundUrlBySubjectGroupSet(
        subject.seed_subject_group_id,
      );
    }
  }, [subject]);

  const toggleDropdown = () => {
    setDropdown(!dropdown);
  };

  const handleSelectItem = (item: any) => {
    setSelectedItem(item);
    setDropdown(false);
  };

  const cards = [
    {
      id: 1,
      title: t('lessons.lesson1.title'),
      description: t('lessons.lesson1.description'),
      iconClass: 'card-icon-dowload-done',
    },
    {
      id: 2,
      title: t('lessons.lesson2.title'),
      description: t('lessons.lesson2.description'),
      iconClass: 'card-icon-dowload-done',
    },
    {
      id: 3,
      title: t('lessons.lesson3.title'),
      description: t('lessons.lesson3.description'),
      iconClass: 'card-icon-done',
    },
    {
      id: 4,
      title: t('lessons.lesson4.title'),
      description: t('lessons.lesson4.description'),
      iconClass: 'card-icon-done',
    },
    {
      id: 5,
      title: t('lessons.lesson5.title'),
      description: t('lessons.lesson5.description'),
      iconClass: 'card-icon-Downloading',
    },
    {
      id: 6,
      title: t('lessons.lesson6.title'),
      description: t('lessons.lesson6.description'),
      iconClass: 'card-icon-Downloading-offline',
    },
    {
      id: 7,
      title: t('lessons.lesson7.title'),
      description: t('lessons.lesson7.description'),
      iconClass: 'card-icon-Downloading-offline',
    },
    {
      id: 8,
      title: t('lessons.lesson8.title'),
      description: t('lessons.lesson8.description'),
      iconClass: 'card-icon-Downloading-offline',
    },
  ];

  // สร้างตัวแปรสำหรับคำภาษาของตัวกรอง
  const filterOptions = {
    all: t('filter.all'),
    downloaded: t('filter.downloaded'),
    notDownloaded: t('filter.notDownloaded'),
  };

  const filteredCards = cards.filter((card) => {
    if (selectedItem === filterOptions.all) return true;
    if (selectedItem === filterOptions.downloaded) {
      return (
        card.iconClass === 'card-icon-dowload-done' || card.iconClass === 'card-icon-done'
      );
    }
    if (selectedItem === filterOptions.notDownloaded) {
      return (
        card.iconClass === 'card-icon-Downloading-offline' ||
        card.iconClass === 'card-icon-Downloading'
      );
    }
    return false;
  });

  return (
    <ResponsiveScaler scenarioSize={{ width: 1280, height: 720 }} className="flex-1">
      <SafezonePanel className="absolute inset-0">
        <div className="page1">
          <div className="cloud1"></div>
          <div className="cloud2"></div>
          <div className="cloud3"></div>
          <div className="cloud4"></div>
          <div className="buttonback">
            <ButtonBack
              onClick={() => {
                console.log('back button clicked!');
              }}
            ></ButtonBack>
          </div>
          <div className="Toppic-text">
            {subject && `วิชา ${subject.subject_name} / ${subject.year_name}`}
          </div>

          <div className="dropdown">
            <div className="button-dropdowdatalist" onClick={toggleDropdown}></div>
            <div className="text-dropdown">{selectedItem}</div>

            {dropdown && (
              <div className="dropdown-list">
                <div
                  className="dropdown-item"
                  onClick={() => handleSelectItem(filterOptions.downloaded)}
                >
                  {t('filter.downloaded')}
                </div>
                <div
                  className="dropdown-item"
                  onClick={() => handleSelectItem(filterOptions.notDownloaded)}
                >
                  {t('filter.notDownloaded')}
                </div>
                <div
                  className="dropdown-item"
                  onClick={() => handleSelectItem(filterOptions.all)}
                >
                  {t('filter.all')}
                </div>
              </div>
            )}
          </div>
          <div className="card-container">
            {filteredCards.map((card) => (
              <div key={card.id} className="card">
                <div className="card-icon" />
                <div className="card-content">
                  <strong>{card.title}</strong>
                  <p>{card.description}</p>
                </div>
                <div className="card-actions">
                  <button className={card.iconClass}></button>
                  <button
                    className="card-icon-delete"
                    disabled={
                      card.iconClass === 'card-icon-Downloading-offline' ||
                      card.iconClass === 'card-icon-Downloading'
                    }
                  ></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SafezonePanel>
    </ResponsiveScaler>
  );
};

export default DomainJSX;

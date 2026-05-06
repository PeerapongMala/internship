import { useNavigate, useParams, useRouter } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import ResponsiveScaler from 'skillvir-architecture-helper/library/game-core/helper/responsive-scaler';

import Button from '@component/web/atom/wc-a-button';
import ScrollableContainer from '@global/component/web/atom/wc-a-scrollable-container';
import StoreGame from '@global/store/game';
import StoreGlobal from '@store/global';
import StoreBackgroundMusic from '@store/global/background-music';
import StoreSubjects from '@store/global/subjects';
import StoreSublessons, { type FailedAsset } from '@store/global/sublessons';
import API from '../local/api';
import { useSublessonCache } from '../local/hooks/use-sublesson-cache';
import { SublessonEntity, SublessonLanguageSoundPack, SublessonLanguageSoundType } from '../local/type';
import ImageIconArrowGlyphRightWhite from './assets/icon-arrow-glyph-right-white.svg';
import ImageIconDownloadForOfflineBlue from './assets/icon-download-for-offline-blue.svg';
import ImageIconDownloadForOfflineWhite from './assets/icon-download-for-offline-white.svg';
import ImageIconDownloadForOffline from './assets/icon-download-for-offline.svg';
import ImageIconTrashWhite from './assets/icon-trash-white.svg';
import { Icon } from './component/web/atoms/wc-a-icon';
import SafezonePanel from './component/web/atoms/wc-a-safezone-panel';
import { TextHeader, TextNormal } from './component/web/atoms/wc-a-text';
import CheckboxWithLabel from './component/web/molecules/wc-m-checkbox-with-label';
import Modal from './component/web/molecules/wc-m-modal';
import DownloadWarningModal from '../g04-d01-p02-lesson-state/component/web/molecules/wc-a-download-warning-modal'; // 🆕 Import warning modal
import ConfigJson from './config/index.json';
import { StateFlow } from './type';

interface DomainPathParams {
  subjectId: string;
  lessonId: string;
  sublessonId: string;
}

const DomainJSX = () => {
  const { t } = useTranslation([ConfigJson.key]);

  const { sublessonId } = useParams({
    strict: false,
  }) as DomainPathParams;
  const navigate = useNavigate();
  const router = useRouter();

  const {
    sublesson,
    sublessonLanguageSoundPacks,
    isSublessonInStore,
    isSublessonDownloading,
    isSublessonDeleting,
    downloadSublessonSounds,
    deleteSublessonSounds,
    // 🆕 Audio download management
    downloadAudioFiles,
    getAudioFilesCount,
  } = useSublessonCache({ sublessonId });
  const [languageSoundPackState, setLanguageSoundPackState] =
    useState<SublessonLanguageSoundPack>(sublessonLanguageSoundPacks);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showWarningModal, setShowWarningModal] = useState<boolean>(false); // 🆕 Warning modal for incomplete downloads
  const [sublessonDetails, setSublessonDetails] = useState<SublessonEntity | null>(null);
  const [loading, setLoading] = useState(true);
  const { isReady: sublessonStoreIsReady } = StoreSublessons.StateGet(['isReady']);

  // 🆕 Track audio files count
  const audioFilesCount = getAudioFilesCount();

  const { currentSubject } = StoreSubjects.StateGet(['currentSubject']);

  useEffect(() => {
    StoreGame.MethodGet().GameCanvasEnableSet(false);
    StoreGame.MethodGet().State.Flow.Set(StateFlow.DEFAULT);
    StoreBackgroundMusic.MethodGet().playSound('cartoon_intro_4');
  }, []);

  useEffect(() => {
    // set background image by subject group id
    if (currentSubject?.seed_subject_group_id) {
      StoreGlobal.MethodGet().imageBackgroundUrlBySubjectGroupSet(
        currentSubject.seed_subject_group_id,
      );
    }
  }, [currentSubject]);

  useEffect(() => {
    const fetchSublessonDetails = async () => {
      try {
        setLoading(true);
        const response = await API.Sublesson.SublessonById.Get(sublessonId);

        if (response.status_code === 200 && response.data) {
          setSublessonDetails(response.data);
        } else {
          throw new Error('Failed to fetch sublesson details');
        }
      } catch (err) {
        console.error('Error fetching sublesson details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSublessonDetails();
  }, [sublessonId]);

  useEffect(() => {
    setTimeout(() => {
      setShowModal(true);
    }, 500);
  }, [sublessonId]);

  useEffect(() => {
    if (sublessonStoreIsReady && !sublesson) {
      navigate({
        to: '/main-menu',
        replace: true,
      });
    }
  }, [sublessonStoreIsReady]);

  useEffect(() => {
    setLanguageSoundPackState(sublessonLanguageSoundPacks);
  }, [sublessonLanguageSoundPacks]);

  const isActionInProgress = isSublessonDownloading || isSublessonDeleting;

  const isLanguageSoundChecked = (language: SublessonLanguageSoundType) => {
    return (
      languageSoundPackState[language] &&
      ['DOWNLOADED', 'PENDING'].includes(languageSoundPackState[language])
    );
  };

  const isLanguageSoundDisabled = (language: SublessonLanguageSoundType) => {
    // if we are downloading or deleting some language sound
    if (isActionInProgress) return true;
    // otherwise, check if language sound is downloaded
    const targetLanguage = languageSoundPackState[language];
    return !targetLanguage || targetLanguage === 'DOWNLOADED';
  };

  const handlePendingDownloadLanguageSound = (language: SublessonLanguageSoundType) => {
    setLanguageSoundPackState((prev) => {
      const status = prev[language];
      if (!status || status === 'DOWNLOADED') return prev;
      if (status === 'PENDING') return { ...prev, [language]: 'UNDOWNLOADED' };
      return { ...prev, [language]: 'PENDING' };
    });
  };

  const handleDownloadLanguageSoundPack = () => {
    if (!isActionInProgress) {
      // get all pending languages
      const pendingLanguages = Object.entries(languageSoundPackState)
        .filter(([_, status]) => status === 'PENDING')
        .map(([lang, _]) => lang as SublessonLanguageSoundType);
      // download all pending languages
      downloadSublessonSounds(pendingLanguages);
      setLanguageSoundPackState(sublesson?.languages ?? {});
    }
  };

  // 🆕 Handler สำหรับดาวน์โหลดไฟล์เสียงแยกต่างหาก
  const handleDownloadAudioFiles = async () => {
    if (!isActionInProgress && audioFilesCount > 0) {
      console.log(`🎵 Starting download of ${audioFilesCount} audio files...`);
      await downloadAudioFiles();
      console.log(`✅ Audio files download completed`);
    }
  };

  const handleDeleteContentBtnClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteLocalLanguageSoundPack = async () => {
    if (!isActionInProgress) {
      // delete all languages
      await deleteSublessonSounds(['th', 'en', 'zh']);
    }
  };

  const displaySublesson = sublessonDetails || sublesson;

  return (
    <>
      <ResponsiveScaler scenarioSize={{ width: 1280, height: 720 }} className="flex-1">
        {/* Safezone */}
        <SafezonePanel
          className="flex items-center inset-0"
          onClick={() => {
            setShowModal(true);
          }}
        >
          <Modal
            isVisible={showModal}
            setVisibleModal={setShowModal}
            className="w-11/12 h-5/6"
            title={t('about_sublesson_title')}
            onClose={() => {
              setShowModal(false);
              setTimeout(() => {
                router.history.back();
              }, 500);
            }}
            customBody={
              <ScrollableContainer className="flex flex-col gap-6 p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-4">
                    <div className="flex gap-2.5">
                      <div className="rounded-full border-2 border-white bg-gradient-to-t from-[#FB9D30] via-[#FFC800] to-[#FFF257] px-2 text-black font-bold">
                        {displaySublesson?.subject_name ?? ''}
                      </div>
                      <div className="rounded-full border-2 border-white bg-gradient-to-t from-[#FB9D30] via-[#FFC800] to-[#FFF257] px-2 text-black font-bold">
                        {displaySublesson?.year_name ?? ''}
                      </div>
                    </div>
                    <TextHeader>{displaySublesson?.name}</TextHeader>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 auto-rows-min">
                    <TextNormal>{t('amount_of_level_label')}</TextNormal>
                    <TextNormal>{displaySublesson?.level_count}</TextNormal>
                    {/* todo: determine sublesson level size */}
                    {/* <TextNormal>{t('amount_of_sublesson_file_size_label')}</TextNormal> */}
                    {/* <TextNormal> convertBytesToString(sublesson?.file_size ?? 0)</TextNormal> */}
                  </div>
                </div>

                <div className="flex flex-col gap-3 mt-auto">
                  {/* 🆕 Download Audio Files Button - แสดงเมื่อมีไฟล์เสียงรอดาวน์โหลด */}
                  {audioFilesCount > 0 && (
                    <div className="flex justify-between items-center px-6 py-4 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 w-full shadow-md">
                      <div
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={handleDownloadAudioFiles}
                      >
                        <Icon
                          src={
                            isSublessonDownloading
                              ? ImageIconDownloadForOffline
                              : ImageIconDownloadForOfflineWhite
                          }
                        />
                        <TextNormal className="!font-bold text-white">
                          {t('download_audio_files_btn_label', { count: audioFilesCount })}
                        </TextNormal>
                      </div>
                      <div className="flex items-center">
                        <span className="text-white text-sm bg-blue-700 px-3 py-1 rounded-full">
                          {audioFilesCount} {t('files_label')}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center px-6 py-4 rounded-full bg-white w-full">
                    <div
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={handleDownloadLanguageSoundPack}
                    >
                      <Icon
                        src={
                          isSublessonDownloading
                            ? ImageIconDownloadForOffline
                            : ImageIconDownloadForOfflineBlue
                        }
                      />
                      <TextNormal className="!font-bold">
                        {t('download_sublesson_sound_btn_label')}
                      </TextNormal>
                    </div>
                    <div className="flex gap-4 items-center">
                      <div className="flex gap-3 items-center">
                        <CheckboxWithLabel
                          id="lang-th-checkbox"
                          checked={isLanguageSoundChecked('th')}
                          disabled={isLanguageSoundDisabled('th')}
                          onChange={() => handlePendingDownloadLanguageSound('th')}
                          label={t('checkbox_language_th_label')}
                        />
                      </div>
                      <div className="flex gap-3 items-center">
                        <CheckboxWithLabel
                          id="lang-en-checkbox"
                          checked={isLanguageSoundChecked('en')}
                          disabled={isLanguageSoundDisabled('en')}
                          onChange={() => handlePendingDownloadLanguageSound('en')}
                          label={t('checkbox_language_en_label')}
                        />
                      </div>
                      <div className="flex gap-3 items-center">
                        <CheckboxWithLabel
                          id="lang-cn-checkbox"
                          checked={isLanguageSoundChecked('zh')}
                          disabled={isLanguageSoundDisabled('zh')}
                          onChange={() => handlePendingDownloadLanguageSound('zh')}
                          label={t('checkbox_language_cn_label')}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollableContainer>
            }
            customFooter={
              <div className="flex relative w-full justify-around rounded-b-[55px] border-[#FCD401] border-t-2 border-dashed pt-6 pb-4 gap-8 px-12">
                <Button
                  prefix={<Icon src={ImageIconTrashWhite} className="ml-2" />}
                  variant="danger"
                  className="w-full"
                  textClassName={`font-bold text-xl justify-center items-center`}
                  disabled={isActionInProgress}
                  onClick={handleDeleteContentBtnClick}
                >
                  {t('delete_local_sublesson_data_btn_label')}
                </Button>
                <Button
                  prefix={
                    <Icon src={ImageIconDownloadForOfflineWhite} className="ml-2" />
                  }
                  variant="tertiary"
                  className="w-full"
                  textClassName="text-xl justify-center items-center"
                  disabled={isActionInProgress}
                  onClick={handleDownloadLanguageSoundPack}
                >
                  {t('download_sublesson_btn_label')}
                </Button>
                <Button
                  suffix={<Icon src={ImageIconArrowGlyphRightWhite} className="mr-2" />}
                  className="w-full"
                  textClassName="text-xl justify-center items-center"
                  // todo: check if we have sublesson in store
                  // disabled={!enableDeleteBtn}
                  onClick={() => {
                    if (isSublessonInStore) {
                      // 🆕 Check for failed IMAGE downloads before playing (audio failures are skipped silently)
                      const downloadState = StoreSublessons.MethodGet().getSublessonDownloadState(sublessonId);

                      // 🔍 Debug: Log download state
                      console.log('🔍 [Play Button] Checking download state for sublesson:', sublessonId);
                      console.log('🔍 [Play Button] Download state:', downloadState);
                      console.log('🔍 [Play Button] Failed assets:', downloadState?.failedAssets);

                      const failedAssets = downloadState?.failedAssets || [];
                      const imageFailures = failedAssets.filter((f: FailedAsset) => f.assetType === 'image');
                      const audioFailures = failedAssets.filter((f: FailedAsset) => f.assetType === 'audio');

                      console.log('🔍 [Play Button] Analysis:', {
                        totalFailures: failedAssets.length,
                        imageFailures: imageFailures.length,
                        audioFailures: audioFailures.length,
                      });

                      if (imageFailures.length > 0) {
                        // Show warning modal ONLY if images failed (audio failures are ignored)
                        console.log('⚠️ Found failed image assets, showing warning modal:', imageFailures);
                        setShowWarningModal(true);
                      } else {
                        // No image issues (audio failures don't matter), navigate directly
                        console.log('✅ No image failures, navigating to lesson');
                        if (audioFailures.length > 0) {
                          console.log(`ℹ️ ${audioFailures.length} audio files failed but skipping silently`);
                        }
                        navigate({
                          to: '/level/$sublessonId',
                          params: {
                            sublessonId: sublessonId,
                          },
                          viewTransition: true,
                        });
                      }
                    }
                  }}
                >
                  {t('play_btn_label')}
                </Button>
              </div>
            }
          />
        </SafezonePanel>

        <Modal
          isVisible={showDeleteModal}
          setVisibleModal={setShowDeleteModal}
          className="w-5/12 h-4/6 bg-white"
          title={t('delete_local_sublesson_data_modal_title')}
          onClose={() => {
            setShowDeleteModal(false);
          }}
          customBody={
            <ScrollableContainer className="flex flex-col p-6 gap-4 overflow-y-auto z-20">
              <div className="text-2xl text-center">
                <Trans
                  t={t}
                  i18nKey="delete_local_sublesson_data_modal_message"
                  className="text-normal"
                >
                  {t('delete_local_sublesson_data_modal_message')}
                </Trans>
              </div>
            </ScrollableContainer>
          }
          customFooter={
            <div className="flex relative w-full justify-around rounded-b-[55px] border-[#FCD401] border-t-2 border-dashed pt-6 pb-4 gap-8 px-12">
              <Button
                prefix={<Icon src={ImageIconTrashWhite} className={`ml-2`} />}
                variant="danger"
                className="w-full"
                textClassName={`font-bold text-xl justify-center items-center`}
                disabled={!isSublessonInStore || isActionInProgress}
                onClick={() => {
                  handleDeleteLocalLanguageSoundPack().then(() => {
                    setShowDeleteModal(false);
                  });
                }}
              >
                {t('confirm_delete_local_sublesson_data_modal_btn_label')}
              </Button>
            </div>
          }
          openOnLoad={false}
          overlay={true}
          zIndex={100}
        />

        {/* 🆕 Warning Modal for Incomplete Downloads */}
        <DownloadWarningModal
          isOpen={showWarningModal}
          failedAssets={
            StoreSublessons.MethodGet().getSublessonDownloadState(sublessonId)?.failedAssets || []
          }
          onContinue={() => {
            // User wants to play despite missing files
            console.log('✅ User chose to continue playing despite warnings');
            setShowWarningModal(false);
            navigate({
              to: '/level/$sublessonId',
              params: {
                sublessonId: sublessonId,
              },
              viewTransition: true,
            });
          }}
          onCancel={() => {
            // User canceled, stay on current page
            console.log('❌ User canceled playing');
            setShowWarningModal(false);
          }}
        />
      </ResponsiveScaler>
    </>
  );
};

export default DomainJSX;

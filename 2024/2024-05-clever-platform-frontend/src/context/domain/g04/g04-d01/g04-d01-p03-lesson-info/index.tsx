import { useNavigate, useParams, useRouter } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import ResponsiveScaler from 'skillvir-architecture-helper/library/game-core/helper/responsive-scaler';

import Button from '@component/web/atom/wc-a-button';
import ScrollableContainer from '@global/component/web/atom/wc-a-scrollable-container';
import StoreGame from '@global/store/game';
import { useLessonCache } from '../local/hooks';
import { Icon } from './component/web/atoms/wc-a-icon';
import SafezonePanel from './component/web/atoms/wc-a-safezone-panel';
import { TextHeader, TextNormal } from './component/web/atoms/wc-a-text';
import Modal from './component/web/molecules/wc-m-modal';
import ConfigJson from './config/index.json';

import CWModalUpdateLesson from '@component/web/molecule/cw-model-sublesson-update';
import ModalOffLineWarning from '@component/web/molecule/wc-m-modal-offline-warning';
import { useOnlineStatus } from '@global/helper/online-status';
import StoreGlobal from '@store/global';
import StoreBackgroundMusic from '@store/global/background-music';
import StoreLessons from '@store/global/lessons';
import StoreSubjects from '@store/global/subjects';
import { CircleSpinner } from 'react-spinners-kit';
import ImageIconArrowGlyphRightWhite from './assets/icon-arrow-glyph-right-white.svg';
import ImageIconDownloadForOfflineWhite from './assets/icon-download-for-offline-white.svg';
import ImageIconTrashWhite from './assets/icon-trash-white.svg';
import { StateFlow } from './type';

interface DomainPathParams {
  lessonId: string;
}

const DomainJSX = () => {
  const { t } = useTranslation([ConfigJson.key]);

  const { lessonId } = useParams({
    strict: false,
  }) as DomainPathParams;
  const navigate = useNavigate();
  const router = useRouter();


  const {
    lesson,
    isLessonInStore,
    isLessonDownloading,
    downloadLessonToStore,
    deleteLessonFromStore,
    downloadProgress,
    checkUpdate,
    processUpdateUrls,
  } = useLessonCache({
    lessonId,
  });

  const { currentSubject } = StoreSubjects.StateGet(['currentSubject']);

  const [showModal, setShowModal] = useState<boolean>(true);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const enableDownloadingBtn = !isLessonInStore || isLessonDownloading;
  const enableDeleteBtn = isLessonInStore && !isLessonDownloading;

  const { loadingIs } = StoreLessons.StateGet(['loadingIs']);
  const [isPlaying, setIsPlaying] = useState(false);

  const [actionType, setActionType] = useState<'download' | 'update'>('download');

  const [showOfflineModal, setShowOfflineModal] = useState(false);
  const online = useOnlineStatus();

  const offlineTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!online) {
      // ตั้งเวลา 5 วินาทีก่อนแสดง Modal
      offlineTimerRef.current = setTimeout(() => {
        setShowOfflineModal(true);
      }, 5000);
    } else {

      if (offlineTimerRef.current) {
        clearTimeout(offlineTimerRef.current);
        offlineTimerRef.current = null;
      }
      setShowOfflineModal(false);
    }
    return () => {
      if (offlineTimerRef.current) {
        clearTimeout(offlineTimerRef.current);
      }
    };
  }, [online]);

  useEffect(() => {
    StoreGame.MethodGet().GameCanvasEnableSet(false);
    StoreGame.MethodGet().State.Flow.Set(StateFlow.DEFAULT);
    StoreBackgroundMusic.MethodGet().playSound('cartoon_intro_4');

    setTimeout(() => {
      setShowModal(true);
    }, 500);
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
    if (isLessonInStore && !isLessonDownloading && showUpdateModal) {
      setShowUpdateModal(false);
    }
  }, [isLessonInStore, isLessonDownloading, showUpdateModal]);

  const handleDownloadContent = async () => {
    if (!isLessonInStore && !isLessonDownloading) {
      setActionType('download');
      setShowUpdateModal(true);
      await downloadLessonToStore();
      setShowUpdateModal(false);
    }

  };

  const handleDeleteContentBtnClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteContent = async () => {
    if (isLessonInStore) {
      // delete lesson from store
      await deleteLessonFromStore();
    }
  };

  const handleRetry = () => {
    setShowOfflineModal(false);
    if (online) {
      if (!isLessonInStore && !isLessonDownloading) {
        setActionType('download');
        setShowUpdateModal(true);
        downloadLessonToStore();
        setShowUpdateModal(false);
      }
    } else {
      setTimeout(() => {
        setShowOfflineModal(true);
      }, 5000);
    }
  };


  const handleContinueOffline = () => {
    setShowOfflineModal(false);
  };

  const handlePlay = async () => {
    if (!online || loadingIs || isPlaying) return;

    try {
      setIsPlaying(true);
      const { needsUpdate, updatedUrls } = await checkUpdate();

      if (needsUpdate) {
        console.log('Update available - processing...');
        setActionType('update');
        setShowUpdateModal(true);

        // Process update immediately
        const result = await processUpdateUrls(updatedUrls);
        if (result.success) {
          setShowUpdateModal(false);
          await navigate({
            to: '/sublesson/$lessonId',
            params: { lessonId: lesson?.id },
            viewTransition: true,
          });
        } else {
          console.error('Update failed:', {
            failedFiles: result.failedFiles,
            totalProcessed: result.totalProcessed,
            successCount: result.successCount,
          });
          console.error(
            `Failed files: ${result.failedFiles?.map((f) => f.fileName).join(', ')}`,
          );
          setShowUpdateModal(false);
          // TODO: Add error modal to display all failed files to user
        }
        return;
      }

      await navigate({
        to: '/sublesson/$lessonId',
        params: { lessonId: lesson?.id },
        viewTransition: true,
      });
    } catch (error) {
      console.error('Error during play:', error);
    } finally {
      setIsPlaying(false);
    }
  };


  return (
    <>
      <ResponsiveScaler scenarioSize={{ width: 1280, height: 720 }} className="flex-1">
        {(showUpdateModal) && (
          <div className="fixed inset-0 bg-black opacity-70 z-40" />
        )}
        {/* Safezone */}
        <CWModalUpdateLesson
          showModal={showUpdateModal}
          setShowModal={setShowUpdateModal}
          onConfirm={() => { }}
          mode={actionType}
          progress={downloadProgress.total > 0 ? Math.round((downloadProgress.completed / downloadProgress.total) * 100) : 0}
          current={downloadProgress.completed}
          total={downloadProgress.total}
        />
        <ModalOffLineWarning
          isVisible={showOfflineModal}
          setVisible={setShowOfflineModal}
          onOk={handleRetry}
          onCancel={handleContinueOffline}
          enablePlayOffline={true}
        />
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
            title={t('about_lesson')}
            onClose={() => {
              setShowModal(false);
              setTimeout(() => {
                router.history.back();
              }, 500);
            }}
            customBody={
              <ScrollableContainer className="flex flex-col p-6 gap-4 overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-4">
                    <div className="flex gap-2.5">
                      <div className="rounded-full border-2 border-white bg-gradient-to-t from-[#FB9D30] via-[#FFC800] to-[#FFF257] px-2 text-black font-bold">
                        {lesson?.subject_name}
                      </div>
                      <div className="rounded-full border-2 border-white bg-gradient-to-t from-[#FB9D30] via-[#FFC800] to-[#FFF257] px-2 text-black font-bold">
                        {lesson?.year_name}
                      </div>
                    </div>
                    <TextHeader>{lesson?.name}</TextHeader>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 auto-rows-min">
                    <TextNormal>{t('amount_of_sublesson_label')}</TextNormal>
                    <TextNormal>{lesson?.sub_lesson_count ?? 0}</TextNormal>
                    {/* todo: determine lesson file size */}
                    {/* <TextNormal>{t('amount_of_lesson_file_size_label')}</TextNormal> */}
                    {/* <TextNormal> convertBytesToString(lesson?.file_size ?? 0)</TextNormal> */}
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
                  disabled={!enableDeleteBtn}
                  onClick={handleDeleteContentBtnClick}
                >
                  {t('delete_local_lesson_data_btn_label')}
                </Button>
                <Button
                  prefix={
                    isLessonDownloading ? (
                      <CircleSpinner size={32} color="white" />
                    ) : (
                      <Icon src={ImageIconDownloadForOfflineWhite} className="ml-2" />
                    )
                  }
                  variant="tertiary"
                  className="w-full"
                  textClassName="text-xl justify-center items-center"
                  disabled={!enableDownloadingBtn}
                  onClick={handleDownloadContent}
                >
                  {t('download_lesson_btn_label')}
                </Button>
                <Button
                  suffix={<Icon src={ImageIconArrowGlyphRightWhite} className="mr-2" />}
                  className="w-full"
                  textClassName="text-xl justify-center items-center"
                  disabled={!enableDeleteBtn}
                  onClick={handlePlay}

                >
                  {t('view_sublesson_btn_label')}
                </Button>
              </div>
            }
          />
        </SafezonePanel>
        <Modal
          isVisible={showDeleteModal}
          setVisibleModal={setShowDeleteModal}
          className="w-5/12 h-4/6 bg-white"
          title={t('delete_local_lesson_data_modal_title')}
          onClose={() => {
            setShowDeleteModal(false);
          }}
          customBody={
            <ScrollableContainer className="flex flex-col p-6 gap-4 overflow-y-auto z-20">
              <div className="text-2xl text-center">
                <Trans t={t} i18nKey="delete_local_lesson_data_modal_message">
                  {t('delete_local_lesson_data_modal_message')}
                </Trans>
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
                disabled={!enableDeleteBtn}
                onClick={() => {
                  handleDeleteContent();
                  setShowDeleteModal(false);
                }}
              >
                {t('confirm_delete_local_lesson_data_modal_btn_label')}
              </Button>
            </div>
          }
          openOnLoad={false}
          overlay={true}
          zIndex={100}
        />

      </ResponsiveScaler>
    </>
  );
};

export default DomainJSX;

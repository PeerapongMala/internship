import ImageIconTrashWhite from '@assets/icon-trash.svg';
import Button from '@component/web/atom/wc-a-button';
import { Icon } from '@component/web/atom/wc-a-icon';
import CWModalUploadError from '@component/web/molecule/cw-modal-upload-error';
import CWModalUpdateLesson from '@component/web/molecule/cw-model-sublesson-update';
import ModalCommon from '@component/web/molecule/wc-m-modal-common';
import ModalOffLineWarning from '@component/web/molecule/wc-m-modal-offline-warning';
import ScrollableContainer from '@global/component/web/atom/wc-a-scrollable-container';
import { useOnlineStatus } from '@global/helper/online-status';
import StoreGame from '@global/store/game';
import StoreGlobal from '@store/global';
import StoreBackgroundMusic from '@store/global/background-music';
import StoreLessons from '@store/global/lessons';
import StoreSubjects from '@store/global/subjects';
import { useParams } from '@tanstack/react-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import ResponsiveScaler from 'skillvir-architecture-helper/library/game-core/helper/responsive-scaler';
import API from '../local/api';
import { LessonItemList } from '../local/type';
import Dialog from './component/web/atoms/wc-a-dialog';
import SafezonePanel from './component/web/atoms/wc-a-safezone-panel';
import LessonListItem from './component/web/organisms/wc-a-lesson-list-item';
import MenuHeader from './component/web/templates/wc-a-menu-header';
import ConfigJson from './config/index.json';
import { StateFlow } from './type';
// import { useLessonCache } from '@domain/g04/g04-d01/local/hooks';

interface DomainPathParams {
  subjectId: string;
}

const DomainJSX = () => {
  const { t } = useTranslation([ConfigJson.key]);
  const { subjectId } = useParams({ strict: false }) as DomainPathParams;
  const { currentSubject: subject } = StoreSubjects.StateGet(['currentSubject']);
  const [lessons, setLessons] = useState<LessonItemList[]>();

  const [showOfflineModal, setShowOfflineModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateConfirm, setUpdateConfirm] = useState(false);

  // 🗑️ Delete modal states
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [showDeleteLoading, setShowDeleteLoading] = useState(false); // 🆕 Loading modal
  const [lessonDeleteConfirmed, setLessonDeleteConfirmed] = useState<string>('');
  const [deletingLesson, setDeletingLesson] = useState<LessonItemList>();
  const [isDeletingLessonDownloadComplete, setDeletingLessonDownloadComplete] = useState<boolean | undefined>();

  // ⚠️ Error modal states
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorList, setErrorList] = useState<Array<{ id: string; filename: string; message: string, type: 'error' | 'warning' | 'info' }>>([]);
  const [updateSuccessCount, setUpdateSuccessCount] = useState(0);
  const [updateTotalCount, setUpdateTotalCount] = useState(0);
  //

  const [actionType, setActionType] = useState<'download' | 'update'>('download');
  const [downloadProgress, setDownloadProgress] = useState<{
    total: number;
    completed: number;
  }>({ total: 0, completed: 0 });
  const online = useOnlineStatus();

  // 🔄 Fetch lessons from API
  const fetchLessons = useCallback(() => {
    if (!online) return;
    StoreGlobal.MethodGet().loadingSet(true);
    API.Lesson.LessonAll.Get(subjectId)
      .then((res) => {
        if (res.status_code === 200) {
          setLessons(res.data);
        }
      })
      .catch((error) => {
        console.error('Error fetching lessons:', error);
        setShowOfflineModal(true);
      })
      .finally(() => {
        StoreGlobal.MethodGet().loadingSet(false);
      });
  }, [subjectId, online]);

  // 🗑️ Callback to refresh lesson list after deletion
  const handleDeleteSuccess = useCallback(() => {
    fetchLessons();
  }, [fetchLessons]);

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
    StoreGame.MethodGet().State.Flow.Set(StateFlow.ALL);
    StoreGlobal.MethodGet().imageBackgroundUrlSet(
      '/assets/images/background/map/map1.png',
    );
    StoreBackgroundMusic.MethodGet().playSound('cartoon_intro_4');
    StoreLessons.MethodGet().setLessonLoading(false);
  }, []);



  useEffect(() => {
    // set background image by subject group id
    if (subject?.seed_subject_group_id) {
      StoreGlobal.MethodGet().imageBackgroundUrlBySubjectGroupSet(
        subject.seed_subject_group_id,
      );
    }
  }, [subject]);

  useEffect(() => {
    fetchLessons();
  }, [fetchLessons]);

  const handleRetry = () => {
    setShowOfflineModal(false);
    fetchLessons();
  };
  const handleContinueOffline = () => {
    setShowOfflineModal(false);

  };

  const displayedTitle = subject
    ? t('lesson_title', {
      subjectName: subject.subject_name,
      subjectShortYear: subject.year_short_name ?? '',
    })
    : '';

  const progressPercentage = useMemo(() => {
    if (downloadProgress.total === 0) return 0;
    return Math.round((downloadProgress.completed / downloadProgress.total) * 100);
  }, [downloadProgress]);

  const handleCloseDeleteSuccessModal = () => {
    setShowDeleteSuccess(false);
    setDeletingLesson(undefined);
  };

  return (
    <ResponsiveScaler scenarioSize={{ width: 1280, height: 720 }} className="flex-1">
      {(showUpdateModal) && (
        <div className="fixed inset-0 bg-black opacity-70 z-40" />
      )}
      <ModalOffLineWarning
        isVisible={showOfflineModal}
        setVisible={setShowOfflineModal}
        onOk={handleRetry}
        onCancel={handleContinueOffline}
        enablePlayOffline={true}
      />
      <CWModalUpdateLesson
        showModal={showUpdateModal}
        setShowModal={setShowUpdateModal}
        onConfirm={() => setUpdateConfirm(true)}
        mode={actionType}
        progress={progressPercentage}
        current={downloadProgress.completed}
        total={downloadProgress.total}
      />

      {/* 🗑️ Delete Confirmation Modal */}
      <ModalCommon
        isVisible={showDeleteConfirm}
        setVisibleModal={setShowDeleteConfirm}
        title={isDeletingLessonDownloadComplete ? t('delete_lesson_modal_title') : t('clear_lesson_data_modal_title')}
        onClose={() => {
          if (!showDeleteLoading) { // ป้องกันการปิด modal ระหว่างลบ
            setShowDeleteConfirm(false);
          }
        }}
        customBody={
          <ScrollableContainer className="flex flex-col p-6 gap-4 overflow-y-auto z-20 bg-white border-[#FCD401] border-y-2 border-dashed">
            <div className="text-2xl text-center">
              <p className="font-bold my-2">"{deletingLesson?.name}"</p>
              {isDeletingLessonDownloadComplete ? (
                <>
                  <p>{t('delete_lesson_confirm_message')}</p>
                </>
              ) : (
                <>
                  <p>{t('clear_lesson_incomplete_download_message')}</p>
                </>
              )}
              <br />
              <Trans t={t} i18nKey="delete_lesson_info_message">
                {t('delete_lesson_info_message')}
              </Trans>
            </div>
          </ScrollableContainer>
        }
        customFooter={
          <div className="flex relative w-full justify-around rounded-b-[55px] pt-6 pb-4 gap-8 px-12 bg-white">
            <Button
              prefix={showDeleteLoading
                ?
                <div className="ml-2 w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
                : <Icon src={ImageIconTrashWhite} className="ml-2" />
              }
              variant="danger"
              className="w-full"
              textClassName={`font-bold text-xl justify-center items-center`}
              disabled={showDeleteLoading} // ปิดการกดปุ่มระหว่างลบ
              onClick={() => {
                setLessonDeleteConfirmed(deletingLesson?.id || '');
              }}
            >
              {showDeleteLoading ? t('deleting', { defaultValue: 'กำลังลบ...' }) : t('delete_lesson_confirm_btn')}
            </Button>
          </div>
        }
        openOnLoad={false}
        overlay={true}
        zIndex={100}
      />

      {/* Delete Success Modal */}
      <ModalCommon
        isVisible={showDeleteSuccess}
        setVisibleModal={setShowDeleteSuccess}
        title={t('delete_lesson_success_title')}
        onClose={handleCloseDeleteSuccessModal}
        customBody={
          <ScrollableContainer className="flex flex-col p-6 gap-4 overflow-y-auto z-20 bg-white border-[#FCD401] border-y-2 border-dashed">
            <div className="text-2xl text-center">
              <p className="font-bold my-2">"{deletingLesson?.name}"</p>
              <br />
              {t('delete_lesson_success_message', { lessonName: deletingLesson?.name })}
            </div>
          </ScrollableContainer>
        }
        customFooter={
          <div className="flex relative w-full justify-around rounded-b-[55px] pt-6 pb-4 gap-8 px-12 bg-white">
            <Button
              variant="primary"
              className="w-full"
              textClassName={`font-bold text-xl justify-center items-center`}
              onClick={handleCloseDeleteSuccessModal}
            >
              {t('delete_lesson_ok')}
            </Button>
          </div>
        }
        openOnLoad={false}
        overlay={true}
        zIndex={100}
      />

      {/* ⚠️ Error Modal */}
      <CWModalUploadError
        showModal={showErrorModal}
        setShowModal={setShowErrorModal}
        errorList={errorList}
        successCount={updateSuccessCount}
        totalCount={updateTotalCount}
        onClose={() => {
          setShowErrorModal(false);
          setErrorList([]);
          setUpdateSuccessCount(0);
          setUpdateTotalCount(0);
        }}
        mode='download'
      />

      {/* Safezone */}
      <SafezonePanel className="flex items-center inset-0">
        <Dialog className="!gap-0">
          {/* header menu */}
          <MenuHeader subjectTitle={displayedTitle} />
          <ScrollableContainer className="flex flex-col divide-y-4 divide-white overflow-x-hidden">
            {lessons?.map((lesson, index) => (
              <LessonListItem
                lessonId={lesson.id}
                key={index}
                isOnline={online}
                updateConfirmed={updateConfirm}
                onUpdateComplete={() => {
                  setUpdateConfirm(false);
                }}
                activeType={(mode) => setActionType(mode)}
                downloadProgressValue={(total, completed) => {
                  setDownloadProgress({ total, completed });
                }}
                onShowUpdateModal={(show) => setShowUpdateModal(show)}
                onShowErrorModal={(show, failedFiles, successCount, totalCount) => {
                  setShowErrorModal(show);
                  if (failedFiles && failedFiles.length > 0) {
                    // แปลง failedFiles เป็น errorList format
                    setErrorList(
                      failedFiles.map((file, index) => ({
                        id: file.sublessonId || `error-${index}`,
                        filename: file.fileName,
                        message: 'ไม่พบไฟล์หรือไฟล์เสียหาย กรุณาลองใหม่อีกครั้ง',
                        type: 'error' as const,
                      }))
                    );
                    setUpdateSuccessCount(successCount || 0);
                    setUpdateTotalCount(totalCount || failedFiles.length);
                  }
                }}

                /// Delete modal handlers
                onShowDeleteConfirmModal={(show, isDownloadComplete) => {
                  setDeletingLesson(lesson);
                  setDeletingLessonDownloadComplete(isDownloadComplete);
                  setShowDeleteConfirm(show);
                }}
                lessonDeleteConfirmed={lessonDeleteConfirmed}
                onShowDeleteLoadingModal={(show) => {
                  setShowDeleteLoading(show);
                }}
                onShowDeleteSuccessModal={(show) => {
                  setDeletingLesson(lesson);
                  setDeletingLessonDownloadComplete(undefined);
                  setShowDeleteSuccess(show);
                }}
                onDeleteSuccess={handleDeleteSuccess}
              />
            ))}
          </ScrollableContainer>
        </Dialog>

      </SafezonePanel>

    </ResponsiveScaler>
  );
};

export default DomainJSX;

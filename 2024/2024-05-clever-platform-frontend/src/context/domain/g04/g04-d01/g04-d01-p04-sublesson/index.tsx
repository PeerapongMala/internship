import ImageIconTrashWhite from '@assets/icon-trash.svg';
import Button from '@component/web/atom/wc-a-button';
import { Icon } from '@component/web/atom/wc-a-icon';
import CWModalUploadError from '@component/web/molecule/cw-modal-upload-error';
import CWModalUpdateLesson from '@component/web/molecule/cw-model-sublesson-update';
import ModalCommon from '@component/web/molecule/wc-m-modal-common';
import ScrollableContainer from '@global/component/web/atom/wc-a-scrollable-container';
import { useFakeProgress } from '@global/helper/use-fake-progress';
import { SubLessonUrlDataResponse } from '@global/helper/zipDownload';
import StoreGame from '@global/store/game';
import StoreGlobal from '@store/global';
import StoreBackgroundMusic from '@store/global/background-music';
import StoreLessons from '@store/global/lessons';
import StoreSubjects from '@store/global/subjects';
import StoreSublessons from '@store/global/sublessons';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import ResponsiveScaler from 'skillvir-architecture-helper/library/game-core/helper/responsive-scaler';
import API from '../local/api';
import { useLessonCache } from '../local/hooks';
import { SublessonItemList } from '../local/type';
import { withRetry } from '../local/utils/with-retry';
import Dialog from './component/web/atoms/wc-a-dialog';
import SafezonePanel from './component/web/atoms/wc-a-safezone-panel';
import SubLessonListItem from './component/web/organisms/wc-a-sublesson-list-item';
import MenuHeader from './component/web/templates/wc-a-menu-header';
import ConfigJson from './config/index.json';
import { StateFlow } from './type';

interface DomainPathParams {
  subjectId: string;
  lessonId: string;
}

const DomainJSX = () => {
  const { t } = useTranslation([ConfigJson.key]);
  const navigate = useNavigate();
  const { lessonId } = useParams({ strict: false }) as DomainPathParams;

  const { currentSubject: subject } = StoreSubjects.StateGet(['currentSubject']);
  const { lesson, sublessons, syncSublessonsToStore, isLessonDownloading } =
    useLessonCache({ lessonId });
  const { isReady: lessonStoreIsReady } = StoreLessons.StateGet(['isReady']);
  const [sublessonData, setSublessonData] = useState<SublessonItemList[]>([]);
  const [isSyncing, setIsSyncing] = useState(true); // Track sync status

  // 🔄 Track update data for all sublessons (array converted to map for easier lookup)
  const [sublessonUpdateUrls, setSublessonUpdateUrls] = useState<Record<string, SubLessonUrlDataResponse>>({});

  // 🆕 Track sublessons that just updated (to prevent showing update button immediately after update)
  const [justUpdatedSublessons, setJustUpdatedSublessons] = useState<Set<string>>(new Set());

  // 🔒 Prevent duplicate API calls during re-check
  const isCheckingUpdatesRef = useRef(false);
  // 🔒 Track ongoing updates to prevent race conditions
  const ongoingUpdatesRef = useRef<Set<string>>(new Set());
  // ⏱️ Debounce timer for re-checking updates
  const recheckTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 📥 Download modal states
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadingSublessonName, setDownloadingSublessonName] = useState('');

  // 🔄 Update modal states
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateProgress, setUpdateProgress] = useState(0);
  const [updatingSublessonName, setUpdatingSublessonName] = useState('');

  // ⚠️ Error modal states
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorList, setErrorList] = useState<Array<{ id: string; filename: string; message: string, type: 'error' | 'warning' | 'info' }>>([]);
  const [downloadSuccessCount, setDownloadSuccessCount] = useState(0);
  const [downloadTotalCount, setDownloadTotalCount] = useState(0);

  //  Use custom hook for fake progress
  const fakeDownloadProgress = useFakeProgress(showDownloadModal, downloadProgress);
  const fakeUpdateProgress = useFakeProgress(showUpdateModal, updateProgress);
  //

  // 🗑️ Delete modal states
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [lessonDeleteConfirmed, setLessonDeleteConfirmed] = useState<string>('');
  const [deletingLesson, setDeletingLesson] = useState<SublessonItemList>();
  // const [isDeletingLessonDownloadComplete, setDeletingLessonDownloadComplete] = useState<boolean | undefined>();
  //

  // 🔍 Debug logging - DETAILED
  console.log('🔍 SublessonListPage RENDER:', {
    lessonId,
    lesson: lesson ? 'exists' : 'null',
    sublessons,
    sublessonsCount: sublessons?.length,
    isLessonDownloading,
    sublessonData,
    sublessonDataCount: sublessonData?.length,
  });

  console.log('🔍 Will render list?', {
    condition: !isLessonDownloading,
    isLessonDownloading,
    hasSublessons: !!sublessons,
    sublessonsLength: sublessons?.length,
  });

  useEffect(() => {
    StoreGame.MethodGet().GameCanvasEnableSet(false);
    StoreGame.MethodGet().State.Flow.Set(StateFlow.ALL);
    StoreBackgroundMusic.MethodGet().playSound('cartoon_intro_4');
    StoreGlobal.MethodGet().loadingSet(true);
    setIsSyncing(true); // Start syncing
    console.log('📋 Calling syncSublessonsToStore for lesson:', lessonId);
    syncSublessonsToStore().finally(() => {
      StoreGlobal.MethodGet().loadingSet(false);
      setIsSyncing(false); // Sync completed
      console.log('✅ syncSublessonsToStore completed. sublessons:', sublessons?.length);
    });

    // 🆕 Re-check updates when page comes into focus (e.g., returning from level play)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('👁️ Page is now visible - re-checking updates...');
        // 🔒 Clear previous timer and debounce to prevent API spam
        if (recheckTimerRef.current) {
          clearTimeout(recheckTimerRef.current);
        }
        recheckTimerRef.current = setTimeout(() => {
          checkAllSublessonsForUpdates();
        }, 1000); // Debounce 1s to prevent multiple calls
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 🆕 Also re-check on focus event for extra safety
    const handleFocus = () => {
      console.log('🎯 Window focused - re-checking updates...');
      // 🔒 Clear previous timer and debounce to prevent API spam
      if (recheckTimerRef.current) {
        clearTimeout(recheckTimerRef.current);
      }
      recheckTimerRef.current = setTimeout(() => {
        checkAllSublessonsForUpdates();
      }, 1000); // Debounce 1s to prevent multiple calls
    };

    window.addEventListener('focus', handleFocus);

    // 🧹 Cleanup: Remove event listeners and clear debounce timer on unmount
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      if (recheckTimerRef.current) {
        clearTimeout(recheckTimerRef.current);
        recheckTimerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    // set background image by subject group id
    if (subject?.seed_subject_group_id) {
      StoreGlobal.MethodGet().imageBackgroundUrlBySubjectGroupSet(
        subject.seed_subject_group_id,
      );
    }
  }, [subject]);

  // 🆕 REMOVED: Don't redirect to main-menu if lesson not in store
  // Allow viewing sublessons even when lesson is not downloaded
  // This enables selective sublesson download feature
  // useEffect(() => {
  //   if (lessonStoreIsReady && !lesson) {
  //     navigate({ to: '/main-menu', replace: true });
  //   }
  // }, [lessonStoreIsReady]);

  const displayedTitle = subject
    ? t('sublesson_title', {
      subjectName: subject.subject_name,
      subjectShortYear: subject.year_short_name ?? '',
      lessonName: lesson?.name ?? '',
    })
    : '';

  useEffect(() => {
    const fetchSublessonData = async () => {
      try {
        const [sublessonResponse] = await Promise.all([
          withRetry(() => API.Sublesson.SublessonAll.Get(lessonId, true)),
        ]);
        if (sublessonResponse.status_code === 200 && sublessonResponse.data) {
          setSublessonData(sublessonResponse.data);
        }
      } catch (err) {
        console.error('Failed to fetch sublesson data:', err);
      }
    };
    fetchSublessonData();
  }, [lessonId,]);

  // 🔄 Check for updates for all sublessons at once
  const checkAllSublessonsForUpdates = async () => {
    // 🔒 Guard: Don't check updates during download to avoid store mutation conflict
    if (isLessonDownloading) {
      console.log('⏳ Download in progress, skipping update check');
      return;
    }

    // 🔒 Prevent duplicate calls
    if (isCheckingUpdatesRef.current) {
      console.log('⚠️ Already checking updates, skipping...');
      return;
    }

    // 🔒 Wait if there are ongoing updates
    if (ongoingUpdatesRef.current.size > 0) {
      console.log(`⏳ Waiting for ${ongoingUpdatesRef.current.size} ongoing updates to complete...`);
      return;
    }

    // Only check if we have sublessons in store
    if (!sublessons || sublessons.length === 0) {
      console.log('🔍 No sublessons to check for updates');
      return;
    }

    try {
      isCheckingUpdatesRef.current = true;
      console.log('🔍 Checking updates for all sublessons...');


      const subLessonCheckList = sublessons
        .filter(sub => {
          const isComplete = StoreSublessons.MethodGet().isSublessonComplete(sub.id);
          return isComplete;
        })
        .map(sub => {
          // 🆕 ดึงข้อมูลล่าสุดจาก store และ debug
          const freshSublesson = StoreSublessons.MethodGet().get(sub.id);
          const updated_at = freshSublesson?.updated_at || sub.updated_at || '';

          console.log(`🔍 Sublesson ${sub.id} updated_at: ${updated_at}`);

          return {
            sub_lesson_id: Number(sub.id), // Convert string to number
            updated_at: updated_at,
          };
        });

      console.log('🔍 Checking updates for sublessons:', subLessonCheckList);

      // Skip if no downloaded sublessons
      if (subLessonCheckList.length === 0) {
        console.log('🔍 No downloaded sublessons to check');
        setSublessonUpdateUrls({}); // Clear any previous update URLs
        return;
      }

      // Call API v2 once with all sublessons (returns array with metadata)
      const updateResponse = await withRetry(() =>
        API.Level.LevelSubLessonUrl.PostV2(lessonId, subLessonCheckList)
      );

      console.log('🔍 Update response (v2):', updateResponse);

      if (updateResponse?.status_code === 200 && updateResponse?.data) {
        const urlArray = updateResponse.data as SubLessonUrlDataResponse[];
        console.log('✅ Update response received with', urlArray.length, 'items');
        console.log('📊 Full update response:', urlArray.map(item => ({
          sub_lesson_id: item.sub_lesson_id,
          hasUrl: !!item.url,
          url: item.url ? '(present)' : '(empty)',
          new_updated_at: item.new_updated_at
        })));

        // Convert array to map for easier lookup by sub_lesson_id
        // ⚠️ CRITICAL: Only include items that have a valid URL (indicating actual update available)
        const updatedUrls: Record<string, SubLessonUrlDataResponse> = {};
        const sublessonsWithUpdates = new Set<string>();

        urlArray.forEach((item: SubLessonUrlDataResponse) => {
          // 🆕 Only treat as "has update" if URL is present and non-empty
          const hasValidUrl = item.url && item.url.trim().length > 0;

          console.log(`🔍 Sublesson ${item.sub_lesson_id}: URL="${item.url}" → hasValidUrl=${hasValidUrl}`);

          if (hasValidUrl) {
            updatedUrls[item.sub_lesson_id.toString()] = item;
            sublessonsWithUpdates.add(item.sub_lesson_id.toString());
            console.log(`✅ Sublesson ${item.sub_lesson_id} HAS UPDATE available`);
          } else {
            console.log(`❌ Sublesson ${item.sub_lesson_id} NO UPDATE (URL is empty)`);
          }

          // 🆕 Sync new_updated_at to store for each sublesson (whether it has update or not)
          if (item.new_updated_at) {
            const sublessonToSync = sublessons?.find(sub => sub.id === item.sub_lesson_id.toString());
            if (sublessonToSync) {
              console.log(`📝 Syncing timestamp for sublesson ${item.sub_lesson_id}:`, item.new_updated_at);
              StoreSublessons.MethodGet().updateSublessonUpdatedAt(
                item.sub_lesson_id.toString(),
                new Date(item.new_updated_at)
              );
            }
          }
        });

        console.log('🎯 Final result: Sublessons with updates:', Array.from(sublessonsWithUpdates));
        console.log('📊 Total update URLs set:', Object.keys(updatedUrls).length);
        setSublessonUpdateUrls(updatedUrls);

        // 🆕 Reconcile just-updated flags based on server response
        // Only keep flags for sublessons that still have updates
        setJustUpdatedSublessons((prev) => {
          if (!prev.size) return prev;
          const next = new Set<string>();
          prev.forEach((id) => {
            if (sublessonsWithUpdates.has(id)) {
              next.add(id);
            }
          });
          console.log('🧹 After reconciliation, justUpdatedSublessons:', Array.from(next));
          return next;
        });
      } else {
        console.log('⚠️ Invalid update response:', updateResponse);
        // Clear all update URLs if response is invalid
        setSublessonUpdateUrls({});
        setJustUpdatedSublessons(new Set());
      }
    } catch (err) {
      console.error('Failed to check sublesson updates:', err);
    } finally {
      isCheckingUpdatesRef.current = false;
    }
  };

  // Run initial check after sublessons are loaded
  useEffect(() => {
    if (!isSyncing && sublessons && sublessons.length > 0) {
      // 🆕 Add small delay to ensure store is fully persisted before checking
      // This prevents race conditions where update buttons appear due to timing issues
      const delayTimer = setTimeout(() => {
        console.log('⏳ Initial update check starting (after 500ms delay for store sync)');
        checkAllSublessonsForUpdates();
      }, 500); // Small delay for store persistence

      return () => clearTimeout(delayTimer);
    }
  }, [lessonId, sublessons, isSyncing]);

  // 📥 Download handlers
  const handleDownloadStart = (sublessonName: string) => {
    console.log('📥 Download started for:', sublessonName);
    setDownloadingSublessonName(sublessonName);
    setShowDownloadModal(true);
  };

  const handleDownloadProgress = (progress: number) => {
    setDownloadProgress(progress);
  };

  const handleDownloadComplete = () => {
    console.log('✅ Download completed');
    setShowDownloadModal(false);
    setDownloadProgress(0);
    setDownloadingSublessonName('');
  };

  // const { stateFlow } = StoreGame.StateGet(['stateFlow']);
  // const displayedSublessons = useMemo(() => {
  //   if (stateFlow === StateFlow.ALL) return sublessons;
  //   return sublessons.filter((lesson) => {
  //     if (stateFlow === StateFlow.DOWNLOADED)
  //       return lesson.download_status === 'DOWNLOADED';
  //     if (stateFlow === StateFlow.UNDOWNLOADED)
  //       return lesson.download_status === 'UNDOWNLOADED';
  //     return false;
  //   });
  // }, [sublessons, stateFlow]);

  // 🔄 Update handlers
  const handleUpdateStart = (sublessonName: string) => {
    console.log('🔄 Update started for:', sublessonName);
    setUpdatingSublessonName(sublessonName);
    setShowUpdateModal(true);
  };

  const handleUpdateProgress = (progress: number) => {
    setUpdateProgress(progress);
  };

  const handleUpdateComplete = () => {
    console.log('✅ Update completed');
    setShowUpdateModal(false);
    setUpdateProgress(0);
    setUpdatingSublessonName('');
  };

  const handleCloseDeleteSuccessModal = () => {
    setShowDeleteSuccess(false);
    setDeletingLesson(undefined);
  };

  return (
    <ResponsiveScaler scenarioSize={{ width: 1280, height: 720 }} className="flex-1">
      {/* Download Modal Overlay */}
      {showDownloadModal && (
        <div className="fixed inset-0 bg-black opacity-70 z-40" />
      )}

      {/* Download Progress Modal */}
      <CWModalUpdateLesson
        showModal={showDownloadModal}
        setShowModal={setShowDownloadModal}
        onConfirm={() => { }}
        mode='download'
        progress={fakeDownloadProgress}
        current={0}
        total={1}
      />

      {/* Update Modal Overlay */}
      {showUpdateModal && (
        <div className="fixed inset-0 bg-black opacity-70 z-40" />
      )}

      {/* Update Progress Modal */}
      <CWModalUpdateLesson
        showModal={showUpdateModal}
        setShowModal={setShowUpdateModal}
        onConfirm={() => { }}
        mode='update'
        progress={fakeUpdateProgress}
        current={0}
        total={1}
      />

      {/* ⚠️ Error Modal */}
      <CWModalUploadError
        showModal={showErrorModal}
        setShowModal={setShowErrorModal}
        errorList={errorList}
        successCount={downloadSuccessCount}
        totalCount={downloadTotalCount}
        onClose={() => {
          setShowErrorModal(false);
          setErrorList([]);
          setDownloadSuccessCount(0);
          setDownloadTotalCount(0);
        }}
        mode='download'
      />

      {/* 🗑️ Delete Confirmation Modal */}
      <ModalCommon
        isVisible={showDeleteConfirm}
        setVisibleModal={setShowDeleteConfirm}
        title={t('delete_sublesson_modal_title')}
        onClose={() => {
          setShowDeleteConfirm(false);
        }}
        customBody={
          <ScrollableContainer className="flex flex-col p-6 gap-4 overflow-y-auto z-20 bg-white border-[#FCD401] border-y-2 border-dashed">
            <div className="text-2xl text-center">
              <p className="font-bold my-2">"{deletingLesson?.name}"</p>
              <p>{t('delete_sublesson_confirm_message')}</p>
              <br />
              <Trans t={t} i18nKey="delete_sublesson_info_message">
                {t('delete_sublesson_info_message')}
              </Trans>
            </div>
          </ScrollableContainer>
        }
        customFooter={
          <div className="flex relative w-full justify-around rounded-b-[55px] pt-6 pb-4 gap-8 px-12 bg-white">
            <Button
              prefix={<Icon src={ImageIconTrashWhite} className="ml-2" />}
              variant="danger"
              className="w-full"
              textClassName={`font-bold text-xl justify-center items-center`}
              onClick={() => {
                setLessonDeleteConfirmed(deletingLesson?.id || '');
                setShowDeleteConfirm(false);
              }}
            >
              {t('delete_sublesson_confirm_btn')}
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
        title={t('delete_sublesson_success_title')}
        onClose={handleCloseDeleteSuccessModal}
        customBody={
          <ScrollableContainer className="flex flex-col p-6 gap-4 overflow-y-auto z-20 bg-white border-[#FCD401] border-y-2 border-dashed">
            <div className="text-2xl text-center">
              <p className="font-bold my-2">"{deletingLesson?.name}"</p>
              <br />
              {t('delete_sublesson_success_message', { lessonName: deletingLesson?.name })}
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
              {t('delete_sublesson_ok')}
            </Button>
          </div>
        }
        openOnLoad={false}
        overlay={true}
        zIndex={100}
      />



      {/* Safezone */}
      <SafezonePanel className="flex items-center inset-0">
        <Dialog className="!gap-0">
          {/* header menu */}
          <MenuHeader title={displayedTitle} subjectId={lesson?.subject_id ?? ''} />
          <ScrollableContainer className="flex flex-col divide-y-4 divide-white overflow-x-hidden">
            {/* Loading state: Show while syncing */}
            {(isLessonDownloading || isSyncing) && (
              <div className="p-4 text-center text-gray-500">
                {t('sublesson_loading')}
              </div>
            )}

            {/* Empty state: Show only after sync completed AND no sublessons */}
            {!isLessonDownloading && !isSyncing && (!sublessons || sublessons.length === 0) && (
              <div className="p-4 text-center text-gray-500">
                {t('sublesson_not_available')}
              </div>
            )}

            {/* Success state: Show sublessons list */}
            {!isLessonDownloading && !isSyncing && sublessons && sublessons.length > 0 && (
              <>
                {/* {sublessons.map((sublesson, index) => {
                  const sublessonInfo = sublessonData.find(s => s.id === sublesson.id); */}
                {sublessonData.map((sublesson, index) => {
                  return (
                    <SubLessonListItem
                      sublessonId={sublesson.id}
                      lessonId={lessonId}
                      key={index}
                      allSublessons={sublessonData}
                      // Download handlers
                      onDownloadStart={() => handleDownloadStart(sublesson?.name || '')}
                      onDownloadProgress={handleDownloadProgress}
                      onDownloadComplete={handleDownloadComplete}

                      // Update handlers
                      updateData={sublessonUpdateUrls[sublesson.id]}
                      hasJustUpdated={justUpdatedSublessons.has(sublesson.id)}
                      onUpdateStart={() => {
                        handleUpdateStart(sublesson?.name || '');
                        // 🔒 Mark as updating
                        ongoingUpdatesRef.current.add(sublesson.id);
                      }}
                      onUpdateProgress={handleUpdateProgress}
                      onUpdateComplete={handleUpdateComplete}

                      // Error modal handler (เหมือน lesson pattern)
                      onShowErrorModal={(show, failedFiles, successCount, totalCount) => {
                        setShowErrorModal(show);
                        if (failedFiles && failedFiles.length > 0) {
                          setErrorList(
                            failedFiles.map((file, index) => ({
                              id: file.sublessonId || `error-${index}`,
                              filename: file.fileName,
                              message: 'ไม่พบไฟล์หรือไฟล์เสียหาย กรุณาลองใหม่อีกครั้ง',
                              type: 'error' as const,
                            }))
                          );
                          setDownloadSuccessCount(successCount || 0);
                          setDownloadTotalCount(totalCount || failedFiles.length);
                        }
                      }}

                      onUpdateCheckComplete={() => {
                        const sublessonIdToUpdate = sublesson.id;

                        // 🆕 Mark as just updated (prevents immediate re-show)
                        setJustUpdatedSublessons(prev => new Set(prev).add(sublessonIdToUpdate));

                        // 🆕 Clear this sublesson's URL immediately (optimistic update)
                        setSublessonUpdateUrls(prev => {
                          const newUrls = { ...prev };
                          delete newUrls[sublessonIdToUpdate];
                          return newUrls;
                        });

                        // 🔒 Remove from ongoing updates
                        ongoingUpdatesRef.current.delete(sublessonIdToUpdate);

                        // ⏱️ Debounced re-check with EXTENDED delay
                        // This allows store persistence and timestamp sync to complete
                        // before checking for updates again (prevents race conditions)
                        if (recheckTimerRef.current) {
                          clearTimeout(recheckTimerRef.current);
                        }

                        recheckTimerRef.current = setTimeout(() => {
                          // Re-check for updates after store is fully synced
                          checkAllSublessonsForUpdates();
                        }, 3000); // 🆕 Increased from 2s to 3s for stability
                      }}

                      /// Delete modal handler
                      onShowDeleteConfirmModal={(show) => {
                        setDeletingLesson(sublesson);
                        setShowDeleteConfirm(show);
                      }}
                      sublessonDeleteConfirmed={lessonDeleteConfirmed}
                      onShowDeleteSuccessModal={(show) => {
                        setDeletingLesson(sublesson);
                        setShowDeleteSuccess(show);
                      }}
                    />
                  );
                })}
              </>
            )}
          </ScrollableContainer>
        </Dialog>
      </SafezonePanel>
    </ResponsiveScaler>
  );
};

export default DomainJSX;

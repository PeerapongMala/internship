import CWDialog from '@component/web/atom/cw-dialog';
import CWSafezonePanel from '@component/web/atom/cw-safezone-panel';
import ScrollableContainer from '@component/web/atom/wc-a-scrollable-container';
import CWModalConfirmDeleteModal from '@component/web/molecule/cw-modal-confirm-delete-modal';
import CWModalConfirmUpload from '@component/web/molecule/cw-modal-confirm-upload';
import CWModalCustomSuccess, { ESuccessModalMode } from '@component/web/molecule/cw-modal-custom-success';
import CWModalUploadError from '@component/web/molecule/cw-modal-upload-error';
import CWModalUpdateLesson from '@component/web/molecule/cw-model-sublesson-update';
import IconDonwloadDone from '@global/assets/download-done.svg';
import StoreGame from '@global/store/game';
import StoreGlobal from '@store/global';
import StoreBackgroundMusic from '@store/global/background-music';
import StoreLessons from '@store/global/lessons';
import StoreGlobalPersist from '@store/global/persist';
import StoreSublessons from '@store/global/sublessons';
import StoreLoadingScene from '@store/web/loading-scene';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ResponsiveScaler from 'skillvir-architecture-helper/library/game-core/helper/responsive-scaler';
import CWHeader from '../g01-d04-p01-upload/component/organisms/cw-header';
import { useDeleteOperations } from '../local/hook/use-delete-operations';
import { useModalState } from '../local/hook/use-modal-state';
import { useUploadOperations } from '../local/hook/use-upload-operations';
import { TLessonMeta } from '../local/types/lesson-meta';
import CWTabBar, { TabConfig } from './component/organisms/cw-tab-bar';
import CWLessonList, { CWLessonListRef, LessonListItemData } from './component/template/cw-lesson-list';
import CWSublessonList, { CWSublessonListRef, SublessonListItemData } from './component/template/cw-sublesson-list';
import ConfigJson from './config/index.json';
import { StateFlow } from './types';



const DomainJSX = () => {
  const { t } = useTranslation([ConfigJson.key]);
  const navigate = useNavigate();
  const searchParams = useSearch({ strict: false }) as {
    tab?: string;
    lessonId?: number;
    subjectName?: string;
    yearName?: string;
  };

  // Get user settings
  const settings = StoreGlobalPersist.MethodGet().getSettings();

  // Check if stores are ready (rehydrated from IndexedDB)
  const { isReady: lessonsReady } = StoreLessons.StateGet(['isReady']);
  const { isReady: sublessonsReady } = StoreSublessons.StateGet(['isReady']);

  // Determine mode from URL params
  const isSublessonMode = searchParams.tab === 'sublesson' && searchParams.lessonId !== undefined;

  // Local state for active tab (All/Downloaded) - resets to ALL on refresh
  const [activeTab, setActiveTab] = useState<StateFlow>(
    isSublessonMode ? StateFlow.SUBLESSON_ALL : StateFlow.LESSON_ALL
  );

  // State to store lesson data when in sublesson mode
  const [selectedLesson, setSelectedLesson] = useState<LessonListItemData | null>(null);


  // Custom hooks
  const modal = useModalState();
  const upload = useUploadOperations();
  const deleteOps = useDeleteOperations();

  // 🔄 Deletion loading state
  const [isDeleting, setIsDeleting] = useState(false);
  const { lessonMeta }: { lessonMeta: TLessonMeta[] } = StoreLessons.StateGet(['lessonMeta']);
  // Refs for child components
  const lessonListRef = useRef<CWLessonListRef>(null);
  const sublessonListRef = useRef<CWSublessonListRef>(null);

  // Initialize page
  useEffect(() => {
    StoreGame.MethodGet().GameCanvasEnableSet(false);
    StoreGlobal.MethodGet().imageBackgroundUrlSet('/assets/images/background/map/map1.png');
    StoreBackgroundMusic.MethodGet().playSound('cartoon_intro_4');
    StoreLessons.MethodGet().setLessonLoading(false);
  }, []);

  const { loadingIs } = StoreLoadingScene.StateGet(['loadingIs']);

  const LoadingSceneUI = useCallback(
    () => StoreLoadingScene.MethodGet().uiGet(),
    [loadingIs],
  );

  // Get subject and year info from URL params or lesson metadata
  const headerSubjectYear = useMemo(() => {
    // Priority 1: Use from URL params (passed from upload page)
    if (selectedLesson && searchParams.subjectName && searchParams.yearName) {
      return `${searchParams.subjectName}  ${searchParams.yearName} ${selectedLesson.lessonName} `;
    }

    // Priority 2: Find from lesson metadata (for refresh or direct access)
    if (selectedLesson && lessonMeta.length > 0) {
      const meta = lessonMeta.find(apiItem =>
        apiItem.lessons.some((l: any) => l.lesson_id === selectedLesson.lessonId)
      );
      if (meta) {
        return `${meta.subject_name} ${meta.year_name}`;
      }
    }

    // Priority 3: Use from any available metadata (lesson mode)
    if (!selectedLesson && lessonMeta.length > 0) {
      const meta = lessonMeta[0];
      return `${meta.subject_name}  ${meta.year_name}`;
    }

    return null;
  }, [searchParams.subjectName, searchParams.yearName, selectedLesson, lessonMeta]);

  // Sync activeTab with URL params when mode changes
  useEffect(() => {
    if (isSublessonMode) {
      // Switch to sublesson mode - reset to SUBLESSON_ALL
      setActiveTab(StateFlow.SUBLESSON_ALL);
    } else {
      // Switch to lesson mode - reset to LESSON_ALL
      setActiveTab(StateFlow.LESSON_ALL);
    }
  }, [isSublessonMode]);

  // Load lesson data when in sublesson mode
  useEffect(() => {
    // Wait for stores to be ready (rehydrated from IndexedDB)
    if (!lessonsReady || !sublessonsReady) {
      console.log('⏳ Waiting for stores to be ready...', { lessonsReady, sublessonsReady });
      return;
    }

    if (isSublessonMode && searchParams.lessonId) {
      // Fetch lesson data from IndexedDB
      // Convert to number first (URL params are strings), then to string for store key
      const lessonId = typeof searchParams.lessonId === 'string'
        ? parseInt(searchParams.lessonId, 10)
        : searchParams.lessonId;

      console.log('🔍 Loading lesson:', { lessonId, type: typeof lessonId });
      const lessonEntity = StoreLessons.MethodGet().get(lessonId);
      console.log('📦 Lesson entity:', lessonEntity);

      if (lessonEntity) {
        // Transform to LessonListItemData format
        const sublessons = StoreSublessons.MethodGet().getFromLessonId(lessonEntity.id);
        console.log('📚 Sublessons found:', sublessons.length);

        const downloadedSublessonsCount = sublessons.filter((sub: any) =>
          StoreSublessons.MethodGet().isSublessonComplete(sub.id)
        ).length;

        const lessonData: LessonListItemData = {
          lessonId: lessonEntity.id,
          lessonName: lessonEntity.name,
          downloadedSublessonsCount,
          totalSublessonsCount: sublessons.length,
          isComplete: downloadedSublessonsCount === sublessons.length && sublessons.length > 0,
        };

        setSelectedLesson(lessonData);
      } else {
        // Lesson not found - stay in sublesson mode but selectedLesson will be null
        console.warn('⚠️ Lesson not found in store');
        setSelectedLesson(null);
      }
    } else {
      setSelectedLesson(null);
    }
  }, [isSublessonMode, searchParams.lessonId, lessonsReady, sublessonsReady]);

  // Tab configuration - show sub-tabs when in sublesson mode
  const tabs: TabConfig[] = isSublessonMode ? [
    {
      key: StateFlow.SUBLESSON_ALL,
      labelI18nKey: 'tab-all',
      isActive: activeTab === StateFlow.SUBLESSON_ALL,
      onClick: () => setActiveTab(StateFlow.SUBLESSON_ALL),
    },
    {
      key: StateFlow.SUBLESSON_DOWNLOADED,
      labelI18nKey: 'tab-downloaded',
      isActive: activeTab === StateFlow.SUBLESSON_DOWNLOADED,
      onClick: () => setActiveTab(StateFlow.SUBLESSON_DOWNLOADED),
      icon: IconDonwloadDone
    },
  ] : [
    {
      key: StateFlow.LESSON_ALL,
      labelI18nKey: 'tab-all',
      isActive: activeTab === StateFlow.LESSON_ALL,
      onClick: () => {
        setActiveTab(StateFlow.LESSON_ALL);
        // No need to navigate - we're already in lesson mode
      },
    },
    {
      key: StateFlow.LESSON_DOWNLOADED,
      labelI18nKey: 'tab-downloaded',
      isActive: activeTab === StateFlow.LESSON_DOWNLOADED,
      onClick: () => {
        setActiveTab(StateFlow.LESSON_DOWNLOADED);
        // No need to navigate - we're already in lesson mode
      },
      icon: IconDonwloadDone
    },
  ];

  // Lesson click handler - switch to sublesson view
  const handleLessonClick = (lesson: LessonListItemData) => {
    console.log('Lesson clicked:', lesson);
    navigate({
      search: {
        tab: 'sublesson',
        lessonId: lesson.lessonId,
        // Keep subject/year params
        subjectName: searchParams.subjectName,
        yearName: searchParams.yearName,
      } as any
    });
  };

  // Delete handlers
  const handleLessonDeleteClick = (lesson: LessonListItemData) => {
    modal.openDeleteModal(
      {
        name: lesson.lessonName,
        id: lesson.lessonId,
        lessonIds: [lesson.lessonId], // Array with lesson IDs to delete
      },
      'sublesson'
    );
  };

  // Sublesson delete handler
  const handleSublessonDeleteClick = (sublesson: SublessonListItemData) => {
    modal.openDeleteModal(
      {
        id: sublesson.sublessonId,
        name: sublesson.sublessonName,
        lessonIds: [], // Empty array = sublesson delete
      },
      'sublesson'
    );
  };

  const handleConfirmDelete = async () => {
    if (!modal.itemToDelete) return;

    const itemToDelete = modal.itemToDelete as { name: string; id: number; lessonIds: number[] };

    // 🔄 Show loading spinner on button
    setIsDeleting(true);

    // Check by lessonIds array length
    if (itemToDelete.lessonIds && itemToDelete.lessonIds.length > 0) {
      // Deleting lesson(s) - use deleteLessons
      const result = await deleteOps.deleteLessons(itemToDelete.lessonIds);

      // 🔄 Hide loading and close modal
      setIsDeleting(false);
      modal.closeDeleteModal();

      if (result.successCount > 0) {
        lessonListRef.current?.refreshLessons();
        modal.openSuccessModal(ESuccessModalMode.DeleteSublesson, result.successCount);
      }
    } else {
      // Deleting sublesson - use deleteSublesson
      const success = await deleteOps.deleteSublesson(itemToDelete.id);

      // 🔄 Hide loading and close modal
      setIsDeleting(false);
      modal.closeDeleteModal();

      if (success) {
        sublessonListRef.current?.refreshSublessons();
        lessonListRef.current?.refreshLessons(); // Also refresh lesson list to update counts
        modal.openSuccessModal(ESuccessModalMode.DeleteSublesson, 1);
      }
    }
  };

  // Upload handlers
  const handleUploadClick = () => {
    modal.openUploadModal('sublesson');
  };

  const handleConfirmUpload = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.zip';
    input.multiple = true;

    input.onchange = async (e) => {
      const target = e.target as HTMLInputElement;
      const files = Array.from(target.files || []);

      if (files.length === 0) {
        input.remove();
        return;
      }

      modal.closeUploadModal();
      modal.setShowUploadProgress(true);

      const result = await upload.uploadFiles(
        files,
        'sublesson',
        settings.soundLanguage
      );

      modal.setShowUploadProgress(false);

      // Refresh lesson list if successful
      if (result.successCount > 0) {
        lessonListRef.current?.refreshLessons();
      }

      // Show result modals
      if (result.failCount > 0 && result.errors.length > 0) {
        modal.openErrorModal(result.errors, result.successCount, files.length);
      } else if (result.successCount > 0) {
        modal.openSuccessModal(ESuccessModalMode.UploadSublesson, result.successCount);
      }

      input.remove();
    };

    input.click();
  };

  // Render tab content based on current state
  const renderTabContent = () => {
    // If in sublesson mode but lesson not found, show error
    if (isSublessonMode && !selectedLesson) {
      return (
        <div className="flex flex-col items-center justify-center h-full py-8">
          <p className="text-gray-600 text-center">{t('error-lesson-not-found')}</p>
        </div>
      );
    }

    switch (activeTab) {
      case StateFlow.SUBLESSON_ALL:
        if (!selectedLesson) return null;
        return (
          <CWSublessonList
            ref={sublessonListRef}
            activeTab={activeTab}
            lessonId={selectedLesson.lessonId}
            showDownloadedOnly={false}
            onDeleteClick={handleSublessonDeleteClick}
          />
        );
      case StateFlow.SUBLESSON_DOWNLOADED:
        if (!selectedLesson) return null;
        return (
          <CWSublessonList
            ref={sublessonListRef}
            activeTab={activeTab}
            lessonId={selectedLesson.lessonId}
            showDownloadedOnly={true}
            onDeleteClick={handleSublessonDeleteClick}
          />
        );
      case StateFlow.LESSON_ALL:
      case StateFlow.LESSON_DOWNLOADED:
      default:
        return (
          <CWLessonList
            ref={lessonListRef}
            activeTab={activeTab}
            subjectName={searchParams.subjectName}
            yearName={searchParams.yearName}
            onLessonClick={handleLessonClick}
            onDeleteClick={handleLessonDeleteClick}
          />
        );
    }
  };

  if (loadingIs) {
    return <LoadingSceneUI />;
  }

  return (
    <ResponsiveScaler scenarioSize={{ width: 1280, height: 720 }} className="flex-1">
      {modal.showUploadProgress && (
        <div className="fixed inset-0 bg-black opacity-70 z-40" />
      )}

      <CWSafezonePanel className="flex items-center inset-0">
        <CWDialog className="!gap-0">
          <CWHeader
            title={headerSubjectYear || t('header-title')}
            onUploadClick={handleUploadClick}
            onBack={() => {
              // If in sublesson mode, go back to lessons
              if (isSublessonMode) {
                navigate({
                  search: {
                    // Clear tab and lessonId, but keep subject/year
                    subjectName: searchParams.subjectName,
                    yearName: searchParams.yearName,
                  } as any
                });
              } else {
                navigate({ to: `/upload`, replace: true });
              }
            }}
          />
          <CWTabBar tabs={tabs} />
          <ScrollableContainer className="flex flex-col overflow-x-hidden bg-white">
            {renderTabContent()}
          </ScrollableContainer>
        </CWDialog>
      </CWSafezonePanel>

      {/* Modals */}
      <CWModalConfirmUpload
        showModal={modal.showUploadModal}
        setShowModal={modal.closeUploadModal}
        onConfirm={handleConfirmUpload}
        onClose={modal.closeUploadModal}
        mode="sublesson"
      />

      <CWModalUpdateLesson
        showModal={modal.showUploadProgress}
        setShowModal={modal.setShowUploadProgress}
        onConfirm={() => { }}
        mode="download"
        progress={upload.uploadProgress}
        current={upload.currentFileIndex}
        total={upload.totalFiles}
      />

      <CWModalCustomSuccess
        showModal={modal.showSuccessModal}
        setShowModal={modal.closeSuccessModal}
        onClose={modal.closeSuccessModal}
        mode={modal.successModalMode}
        count={modal.successCount}
      />

      <CWModalUploadError
        showModal={modal.showUploadErrorModal}
        setShowModal={modal.closeErrorModal}
        onClose={modal.closeErrorModal}
        errorList={modal.uploadErrors}
        successCount={modal.uploadErrorSuccessCount}
        totalCount={modal.uploadErrorTotalCount}
      />

      <CWModalConfirmDeleteModal
        showModal={modal.showDeleteModal}
        setShowModal={modal.closeDeleteModal}
        onConfirm={handleConfirmDelete}
        onClose={modal.closeDeleteModal}
        itemName={modal.itemToDelete?.name || ''}
        mode="sublesson"
        isLoading={isDeleting}
      />
    </ResponsiveScaler>
  );
};

export default DomainJSX;

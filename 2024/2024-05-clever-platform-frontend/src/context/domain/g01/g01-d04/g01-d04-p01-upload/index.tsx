import CWDialog from '@component/web/atom/cw-dialog';
import CWSafezonePanel from '@component/web/atom/cw-safezone-panel';
import ScrollableContainer from '@component/web/atom/wc-a-scrollable-container';
import CWModalConfirmDeleteModel from '@component/web/molecule/cw-modal-confirm-delete-modal';
import CWModalConfirmUpload from '@component/web/molecule/cw-modal-confirm-upload';
import CWModalCustomSuccess, { ESuccessModalMode } from '@component/web/molecule/cw-modal-custom-success';
import CWModalProgressDownload from '@component/web/molecule/cw-modal-progress-download';
import CWModalUploadError from '@component/web/molecule/cw-modal-upload-error';
import StoreGame from '@global/store/game';
import StoreGlobal from '@store/global';
import { IModelRecordSchema } from '@store/global/avatar-models';
import StoreBackgroundMusic from '@store/global/background-music';
import StoreLessons from '@store/global/lessons';
import StoreGlobalPersist from '@store/global/persist';
import StoreLoadingScene from '@store/web/loading-scene';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ResponsiveScaler from 'skillvir-architecture-helper/library/game-core/helper/responsive-scaler';
import { useDeleteOperations } from '../local/hook/use-delete-operations';
import { useModalState } from '../local/hook/use-modal-state';
import { useUploadOperations } from '../local/hook/use-upload-operations';
import CWHeader from './component/organisms/cw-header';
import CWTabBar, { TabConfig } from './component/organisms/cw-tab-bar';
import CWModelTab, { CWModelTabRef } from './component/template/cw-model-tab';
import CWSublessonTab, { CWSublessonTabRef, LessonData } from './component/template/cw-sublesson-tab';
import ConfigJson from './config/index.json';
import './index.css';
import { StateFlow } from './types';


const DomainJSX = () => {
  const { t } = useTranslation([ConfigJson.key]);

  // Get user settings
  const settings = StoreGlobalPersist.MethodGet().getSettings();

  // Custom hooks
  const modal = useModalState();
  const upload = useUploadOperations();
  const deleteOps = useDeleteOperations();

  // 🔄 Deletion loading state
  const [isDeleting, setIsDeleting] = useState(false);

  // Refs for child components
  const modelTabRef = useRef<CWModelTabRef>(null);
  const sublessonTabRef = useRef<CWSublessonTabRef>(null);


  // Initialize page
  useEffect(() => {
    StoreGame.MethodGet().GameCanvasEnableSet(false);
    StoreGame.MethodGet().State.Flow.Set(StateFlow.SUBLESSON);
    StoreGlobal.MethodGet().imageBackgroundUrlSet('/assets/images/background/map/map1.png');
    StoreBackgroundMusic.MethodGet().playSound('cartoon_intro_4');
    StoreLessons.MethodGet().setLessonLoading(false);
  }, []);

  const { stateFlow } = StoreGame.StateGet(['stateFlow']);

  const { loadingIs } = StoreLoadingScene.StateGet(['loadingIs']);

  const LoadingSceneUI = useCallback(
    () => StoreLoadingScene.MethodGet().uiGet(),
    [loadingIs],
  );
  const tabs: TabConfig[] = [
    {
      key: StateFlow.SUBLESSON,
      labelI18nKey: 'menu-header-sublesson-tab',
      isActive: stateFlow === StateFlow.SUBLESSON,
      onClick: () => StoreGame.MethodGet().State.Flow.Set(StateFlow.SUBLESSON),
    },
    {
      key: StateFlow.MODEL,
      labelI18nKey: 'menu-header-model-tab',
      isActive: stateFlow === StateFlow.MODEL,
      onClick: () => StoreGame.MethodGet().State.Flow.Set(StateFlow.MODEL),
    },
  ];

  // Delete handlers
  const handleModelDeleteClick = (model: IModelRecordSchema) => {
    modal.openDeleteModal({ name: model.modelKey, id: model.modelKey }, 'model');
  };

  const handleSublessonDeleteClick = (lesson: LessonData) => {
    modal.openDeleteModal(
      {
        name: lesson.title,
        id: lesson.id,
        lessonIds: lesson.lessonIds,
      },
      'sublesson'
    );
  };

  const handleConfirmDelete = async () => {
    if (!modal.itemToDelete) return;

    // 🔄 Show loading spinner on button
    setIsDeleting(true);

    if (modal.deleteModalMode === 'model') {
      await deleteOps.deleteModel(String(modal.itemToDelete.id));

      // 🔄 Hide loading and close modal
      setIsDeleting(false);
      modal.closeDeleteModal();

      modelTabRef.current?.refreshModels();
      modal.openSuccessModal(ESuccessModalMode.DeleteModel, 1);
    } else {
      const sublessonToDelete = modal.itemToDelete as { name: string; id: number; lessonIds: number[] };
      const result = await deleteOps.deleteLessons(sublessonToDelete.lessonIds);

      // 🔄 Hide loading and close modal
      setIsDeleting(false);
      modal.closeDeleteModal();

      if (result.successCount > 0) {
        sublessonTabRef.current?.refreshLessons();
        modal.openSuccessModal(ESuccessModalMode.DeleteSublesson, result.successCount);
      }
    }
  };

  // Render tab content based on current state
  const renderTabContent = () => {
    switch (stateFlow) {
      case StateFlow.SUBLESSON:
        return <CWSublessonTab ref={sublessonTabRef} onDeleteClick={handleSublessonDeleteClick} />;
      case StateFlow.MODEL:
        return <CWModelTab ref={modelTabRef} onDeleteClick={handleModelDeleteClick} />;
      default:
        return null;
    }
  };



  // Upload handlers
  const handleUploadClick = () => {
    modal.openUploadModal(stateFlow === StateFlow.SUBLESSON ? 'sublesson' : 'model');
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
        modal.uploadMode,
        settings.soundLanguage
      );

      modal.setShowUploadProgress(false);

      // Refresh lists if successful
      if (result.successCount > 0) {
        if (modal.uploadMode === 'model') {
          modelTabRef.current?.refreshModels();
        } else {
          sublessonTabRef.current?.refreshLessons();
        }
      }

      // Show result modals
      if (result.failCount > 0 && result.errors.length > 0) {
        modal.openErrorModal(result.errors, result.successCount, files.length);
      } else if (result.successCount > 0) {
        const successMode = modal.uploadMode === 'model'
          ? ESuccessModalMode.UploadModel
          : ESuccessModalMode.UploadSublesson;
        modal.openSuccessModal(successMode, result.successCount);
      }

      input.remove();
    };

    input.click();
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
            title={
              stateFlow === StateFlow.SUBLESSON
                ? t('menu-header-title-sublesson')
                : t('menu-header-title-model')
            }
            onUploadClick={handleUploadClick}
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
        mode={modal.uploadMode}
      />

      <CWModalProgressDownload
        showModal={modal.showUploadProgress}
        setShowModal={modal.setShowUploadProgress}
        onConfirm={() => { }}
        progress={upload.uploadProgress}
        current={upload.currentFileIndex}
        total={upload.totalFiles}
      />

      <CWModalConfirmDeleteModel
        showModal={modal.showDeleteModal}
        setShowModal={modal.closeDeleteModal}
        onConfirm={handleConfirmDelete}
        onClose={modal.closeDeleteModal}
        itemName={modal.itemToDelete?.name || ''}
        mode={modal.deleteModalMode}
        isLoading={isDeleting}
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
    </ResponsiveScaler>
  );
};

export default DomainJSX;

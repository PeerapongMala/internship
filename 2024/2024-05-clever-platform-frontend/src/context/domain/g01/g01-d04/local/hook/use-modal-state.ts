import { ErrorItem } from '@component/web/molecule/cw-error-list';
import { UploadMode } from '@component/web/molecule/cw-modal-confirm-upload';
import { ESuccessModalMode } from '@component/web/molecule/cw-modal-custom-success';
import { useState } from 'react';

type ModelToDelete = {
  id: string;
  name: string;
};

type SublessonToDelete = {
  id: number;
  name: string;
  lessonIds: number[];
};

export type ItemToDelete = ModelToDelete | SublessonToDelete;

export const useModalState = () => {
  // Upload modal
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadMode, setUploadMode] = useState<UploadMode>('sublesson');

  // Progress modal
  const [showUploadProgress, setShowUploadProgress] = useState(false);

  // Delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteModalMode, setDeleteModalMode] = useState<'model' | 'sublesson'>('model');
  const [itemToDelete, setItemToDelete] = useState<ItemToDelete | null>(null);

  // Success modal
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successModalMode, setSuccessModalMode] = useState<ESuccessModalMode>(
    ESuccessModalMode.Delete,
  );
  const [successCount, setSuccessCount] = useState(0);

  // Error modal
  const [showUploadErrorModal, setShowUploadErrorModal] = useState(false);
  const [uploadErrors, setUploadErrors] = useState<ErrorItem[]>([]);
  const [uploadErrorSuccessCount, setUploadErrorSuccessCount] = useState(0);
  const [uploadErrorTotalCount, setUploadErrorTotalCount] = useState(0);

  // Upload modal actions
  const openUploadModal = (mode: UploadMode) => {
    setUploadMode(mode);
    setShowUploadModal(true);
  };

  const closeUploadModal = () => {
    setShowUploadModal(false);
  };

  // Delete modal actions
  const openDeleteModal = (item: ItemToDelete, mode: 'model' | 'sublesson') => {
    setItemToDelete(item);
    setDeleteModalMode(mode);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  // Success modal actions
  const openSuccessModal = (mode: ESuccessModalMode, count: number = 1) => {
    setSuccessModalMode(mode);
    setSuccessCount(count);
    setShowSuccessModal(true);
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
  };

  // Error modal actions
  const openErrorModal = (
    errors: ErrorItem[],
    successCount: number,
    totalCount: number,
  ) => {
    setUploadErrors(errors);
    setUploadErrorSuccessCount(successCount);
    setUploadErrorTotalCount(totalCount);
    setShowUploadErrorModal(true);
  };

  const closeErrorModal = () => {
    setShowUploadErrorModal(false);
  };

  return {
    // Upload modal
    showUploadModal,
    uploadMode,
    openUploadModal,
    closeUploadModal,

    // Progress modal
    showUploadProgress,
    setShowUploadProgress,

    // Delete modal
    showDeleteModal,
    deleteModalMode,
    itemToDelete,
    openDeleteModal,
    closeDeleteModal,

    // Success modal
    showSuccessModal,
    successModalMode,
    successCount,
    openSuccessModal,
    closeSuccessModal,

    // Error modal
    showUploadErrorModal,
    uploadErrors,
    uploadErrorSuccessCount,
    uploadErrorTotalCount,
    openErrorModal,
    closeErrorModal,
  };
};

import { useState, useEffect } from 'react';
import {
  BannerImage,
  deleteBannerImage,
  fetchBannerList,
  sortOrderBannerImage,
  uploadImageBanner,
}  from '@domain/g03/g03-d02/local/api/restapi/service-banner';
import LoadingSpinner from '@component/web/atom/wc-loading-spinner';
import NotificationSuccess from '@component/web/atom/notification/wc-a-notification-success';
import NotificationError from '@component/web/atom/notification/wc-a-notification-error';
import Breadcrumb from '../breadcrumb';
import PageHeader from '../page-header';
import UploadHeader from '../upload-header';
import FileUpload, { FileWithPreview } from '../file-upload';

export type NotificationType = 'success' | 'error';

interface NotificationState {
  show: boolean;
  type: NotificationType;
  title: string;
  message?: string;
}

export const maxCountImage = 10;

export interface FileUploadState {
  imageBannerList: FileWithPreview[];
  pendingDeletes: number[];
  hasChanges: boolean;
  isDelete: boolean;
  isUploadNewImages: boolean;
  isUpdateDisplayOrders: boolean;
}

interface ImageBannerService {
  deleteImages: (
    pendingDeletes: number[],
    currentImages: FileWithPreview[],
  ) => Promise<FileWithPreview[]>;
  uploadNewImages: (
    imageBannerList: FileWithPreview[],
  ) => Promise<BannerImage[] | undefined>;
  updateDisplayOrders: (imageBannerList: FileWithPreview[]) => Promise<void>;
}

const notificationMessage = {
  delete: {
    success: 'ลบรูปภาพสำเร็จ',
    error: 'ลบรูปภาพไม่สำเร็จ กรุณาลองใหม่อีกครั้ง',
  },
  upload: {
    success: 'อัปโหลดรูปภาพสำเร็จ',
    error: 'อัปโหลดรูปภาพไม่สำเร็จ กรุณาลองใหม่อีกครั้ง',
  },
  sortOrder: {
    success: 'เรียงลำดับสำเร็จ',
    error: 'เรียงลำดับไม่สำเร็จ กรุณาลองใหม่อีกครั้ง',
  },
};

const breadcrumbItems = [
  { label: 'ADMIN', href: '/admin/banner' },
  { label: 'แก้ไขโฆษณา' },
];

const Banner: React.FC = () => {
  const [imageState, setImageState] = useState<FileUploadState>({
    imageBannerList: [],
    pendingDeletes: [],
    hasChanges: false,
    isDelete: false,
    isUploadNewImages: false,
    isUpdateDisplayOrders: false,
  });

  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<NotificationState>({
    show: false,
    type: 'success',
    title: '',
    message: '',
  });

  const imageBannerService: ImageBannerService = {
    deleteImages: async (pendingDeletes: number[], currentImages: FileWithPreview[]) => {
      try {
        const deletePromises = pendingDeletes.map((id) => deleteBannerImage(id));
        await Promise.all(deletePromises);

        const remainingImages = currentImages.filter(
          (img) => !pendingDeletes.includes(img.id!),
        );

        await reorderImagesAfterDeletion(remainingImages);

        showNotification('success', notificationMessage.delete.success);
        return remainingImages;
      } catch (error) {
        showNotification('error', notificationMessage.delete.error);
        throw error;
      }
    },

    uploadNewImages: async (imageBannerList: FileWithPreview[]) => {
      try {
        const newImages = imageBannerList.filter((item) => item.file);

        for (const [_index, item] of newImages.entries()) {
          if (!item.file) continue;

          await uploadImageBanner(item.file, item.display_order);
        }

        showNotification('success', notificationMessage.upload.success);

        // Fetch updated list after uploads
        if (imageBannerList.some((img) => img.display_order_new !== undefined)) {
          const updatedList = await fetchBannerList();
          return updatedList;
        }
      } catch (error) {
        showNotification('error', notificationMessage.upload.error);
        throw error;
      }
    },

    updateDisplayOrders: async (imageBannerList: FileWithPreview[]) => {
      try {
        const updatesNeeded = imageBannerList.filter(
          (item) => item.id && item.display_order_new !== undefined,
        );

        const updatePromises = updatesNeeded.map((item) =>
          sortOrderBannerImage(item.id!, item.display_order_new!),
        );

        await Promise.all(updatePromises);
        showNotification('success', notificationMessage.sortOrder.success);
      } catch (error) {
        showNotification('error', notificationMessage.sortOrder.error);
        throw error;
      }
    },
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsInitialLoading(true);
      const response = await fetchBannerList();
      await new Promise((resolve) => setTimeout(resolve, 500));

      const convertedImages = response.map((image) => ({
        id: image.id,
        display_order: image.display_order,
        image_url: image.banner_image_url,
      }));

      setImageState((prev) => ({
        ...prev,
        imageBannerList: convertedImages,
        hasChanges: false,
      }));
    } catch (err) {
      console.error('fetchData fail', err);
    } finally {
      setIsInitialLoading(false);
    }
  };

  const handleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      if (imageState.isDelete) {
        const updatedImages = await imageBannerService.deleteImages(
          imageState.pendingDeletes,
          imageState.imageBannerList,
        );
        setImageState((prev) => ({
          ...prev,
          imageBannerList: updatedImages,
          pendingDeletes: [],
          isDelete: false,
        }));
      }

      if (imageState.isUploadNewImages) {
        const updatedList = await imageBannerService.uploadNewImages(
          imageState.imageBannerList,
        );

        if (imageState.isUpdateDisplayOrders && updatedList) {
          const updatedImages = imageState.imageBannerList.map((img) => {
            if (img.display_order_new === undefined) return img;
            const uploadedImage = updatedList.find(
              (uploaded) => uploaded.display_order === img.display_order,
            );
            if (uploadedImage) {
              return {
                ...uploadedImage,
                display_order_new: img.display_order_new,
              };
            }
            return img;
          });
          setImageState((prev) => ({
            ...prev,
            imageBannerList: updatedImages,
          }));
          // Update display orders
          await imageBannerService.updateDisplayOrders(updatedImages);
        }
      } else if (imageState.isUpdateDisplayOrders) {
        await imageBannerService.updateDisplayOrders(imageState.imageBannerList);
      }

      await fetchData();

      setImageState((prev) => ({
        ...prev,
        hasChanges: false,
        isUploadNewImages: false,
        isUpdateDisplayOrders: false,
      }));
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const reorderImagesAfterDeletion = async (images: FileWithPreview[]) => {
    const sortedImages = [...images].sort((a, b) => a.display_order - b.display_order);

    let expectedOrder = 1;
    const reorderPromises: Promise<FileWithPreview>[] = [];

    for (const currentImage of sortedImages) {
      if (currentImage.display_order !== expectedOrder && currentImage.id) {
        const newOrder = expectedOrder;
        currentImage.display_order = newOrder;
        reorderPromises.push(sortOrderBannerImage(currentImage.id, newOrder));
      }
      expectedOrder++;
    }

    if (reorderPromises.length > 0) {
      await Promise.all(reorderPromises);
    }

    return sortedImages;
  };

  const showNotification = (type: NotificationType, title: string, message?: string) => {
    setNotification({
      show: true,
      type,
      title,
      message,
    });

    setTimeout(() => {
      setNotification((prev) => ({ ...prev, show: false }));
    }, 3000);
  };

  if (isInitialLoading) {
    return (
      <div className="flex flex-col h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-[85px] md:gap-y-[54px] px-[21px] md:pr-[33px]">
      <NotificationSuccess
        show={notification.show && notification.type === 'success'}
        title={notification.title}
        message={notification.message}
      />
      <NotificationError
        show={notification.show && notification.type === 'error'}
        title={notification.title}
        message={notification.message}
      />
      <div>
        <Breadcrumb items={breadcrumbItems} />
        <PageHeader title="แก้ไขโฆษณา" />
        <div>
          <UploadHeader
            currentCount={imageState.imageBannerList.length}
            maxCount={maxCountImage}
            description={`อัปโหลดรูปภาพเพื่อเพิ่มโฆษณา ได้สูงสุด ${maxCountImage} หน้า`}
            isRequired={true}
          />
          <FileUpload imageState={imageState} setImageState={setImageState} />
        </div>
      </div>
      <button
        className="w-full h-[38px] rounded-[6px] px-[12px] gap-[16px] bg-secondary flex items-center justify-center disabled:bg-[#D7D7D8]"
        disabled={!imageState.hasChanges || isSaving}
        onClick={handleSave}
      >
        <p className="font-bold text-[14px] leading-[20.61px] text-[#FBFBFB] text-center">
          {isSaving ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}
        </p>
      </button>
    </div>
  );
};

export default Banner;

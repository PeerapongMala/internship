import { useState, useRef, DragEvent, useEffect, Dispatch, SetStateAction } from 'react';
import ImagePreviewDialog from '../image-preview-dialog';
import DropZone from '@component/web/molecule/wc-m-dropzone';
import { FileUploadState, maxCountImage } from '../banner';
import ImageBannerList from '../image-banner-list';
export interface FileWithPreview {
  display_order: number;
  display_order_new?: number;
  file?: File;
  image_url?: string;
  id?: number;
}

interface FileUploadProps {
  imageState: FileUploadState;
  setImageState: Dispatch<SetStateAction<FileUploadState>>;
}

const FileUpload: React.FC<FileUploadProps> = ({ imageState, setImageState }) => {
  const dndRef = useRef<HTMLDivElement>(null);

  const [prevFiles, setPrevFiles] = useState<FileWithPreview>();
  const [isPreviewImage, setIsPreviewImage] = useState(false);

  const [fileDragging, setFileDragging] = useState<number | null>(null);
  const [fileDropping, setFileDropping] = useState<number | null>(null);
  const [isDisable, setIsDisable] = useState<boolean>(false);

  useEffect(() => {
    setIsDisable(imageState.imageBannerList.length === maxCountImage);
  }, [imageState]);

  const handleCropAndSetPreview = (file: File) => {
    setImageState((prev) => {
      const isMaxCountImage = prev.imageBannerList.length === maxCountImage;

      if (isMaxCountImage) {
        return prev;
      }

      const newOrder = prev.imageBannerList.length + 1;
      const newImage = {
        file: file,
        display_order: newOrder,
        image_url: URL.createObjectURL(file),
      };

      return {
        ...prev,
        imageBannerList: [...prev.imageBannerList, newImage],
        isUploadNewImages: true,
        hasChanges: true,
      };
    });

    handleClose();
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (fileDragging === index) return;
    setFileDropping(index);
  };

  const handleDragStart = (e: DragEvent<HTMLDivElement>, index: number) => {
    e.stopPropagation();
    setFileDragging(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (dndRef.current) {
      dndRef.current.classList.add('border-blue-400', 'ring-4', 'ring-inset');
    }
  };

  const handleDragLeave = (e?: DragEvent<HTMLDivElement>) => {
    e?.preventDefault();
    if (dndRef.current) {
      dndRef.current.classList.remove('border-blue-400', 'ring-4', 'ring-inset');
    }
  };

  const handleClose = () => {
    setPrevFiles(undefined);
    setIsPreviewImage(false);
  };

  const handleInitialDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleDragLeave();

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setPrevFiles({
        file: droppedFile,
        display_order: imageState.imageBannerList.length + 1,
      });
      setIsPreviewImage(true);
    }

    setFileDropping(null);
    setFileDragging(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selectedFile = e.target.files[0];
    const isTypeImage = selectedFile.type.includes('image/');

    if (selectedFile && isTypeImage) {
      setPrevFiles({
        file: selectedFile,
        display_order: imageState.imageBannerList.length + 1,
      });
      setIsPreviewImage(true);
    }
  };

  const handleSortDrop = (_e: DragEvent<HTMLDivElement>, dropIndex: number) => {
    if (fileDragging === null) return;

    setImageState((prev) => {
      const newFiles = [...prev.imageBannerList];
      const [draggedFile] = newFiles.splice(fileDragging, 1);
      newFiles.splice(dropIndex, 0, draggedFile);

      const updatedFiles = newFiles.map((file, index) => ({
        ...file,
        display_order_new: index + 1 !== file.display_order ? index + 1 : undefined,
      }));

      const hasOrderChanges = updatedFiles.some((file, index) => {
        if (file.id) {
          return file.display_order_new !== undefined;
        }

        return file.display_order !== index + 1;
      });

      const hasNewFiles = updatedFiles.some((file) => file.file);

      return {
        ...prev,
        imageBannerList: updatedFiles,
        hasChanges: hasOrderChanges || hasNewFiles,
        isUpdateDisplayOrders: hasOrderChanges,
      };
    });

    setFileDropping(null);
    setFileDragging(null);
  };

  const removeFile = (index: number) => {
    const fileToRemove = imageState.imageBannerList[index];

    if (fileToRemove.id) {
      setImageState((prev) => ({
        ...prev,
        pendingDeletes: [...prev.pendingDeletes, fileToRemove.id!],
        hasChanges: true,
        isDelete: true,
      }));
    }

    setImageState((prev) => {
      const filteredList = prev.imageBannerList.filter((_, idx) => idx !== index);

      const hasNewFiles = filteredList.some((item) => item.file);
      const hasAnyChanges = prev.pendingDeletes.length > 0 || hasNewFiles;

      return {
        ...prev,
        imageBannerList: filteredList,
        hasChanges: hasAnyChanges,
        isDelete: prev.pendingDeletes.length > 0,
      };
    });
  };

  return (
    <div>
      {imageState.imageBannerList.length > 0 && (
        <ImageBannerList
          imageBannerList={imageState.imageBannerList}
          fileDragging={fileDragging}
          fileDropping={fileDropping}
          onDragStart={handleDragStart}
          onDragEnd={() => {
            setFileDragging(null);
            setFileDropping(null);
          }}
          onDrop={handleSortDrop}
          onDragEnter={handleDragEnter}
          onDragLeave={() => setFileDropping(null)}
          onRemove={removeFile}
        />
      )}

      <DropZone
        isDisable={isDisable}
        dndRef={dndRef}
        onDrop={handleInitialDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onFileChange={handleFileChange}
        resolution="1,170 x 380 px "

      />

      <ImagePreviewDialog
        isOpen={isPreviewImage}
        prevFiles={prevFiles}
        handleClose={handleClose}
        handleCrop={handleCropAndSetPreview}
      />
    </div>
  );
};

export default FileUpload;

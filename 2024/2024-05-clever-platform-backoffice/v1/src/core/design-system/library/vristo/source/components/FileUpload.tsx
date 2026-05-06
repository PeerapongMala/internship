import { useEffect, useState } from 'react';
import ImageUploading, { ImageListType } from 'react-images-uploading';

import { convertBytesToMb } from '@global/utils/fileSize';
import IconX from './Icon/IconX';

const FileUpload = ({
  multiple = false,
  onChange,
  imageList,
  maxFileSize,
}: {
  multiple?: boolean;
  onChange?: (images: any) => void;
  imageList?: any;
  maxFileSize?: number;
}) => {
  const [images2, setImages2] = useState<any>([]);
  const maxNumber = 69;

  const onChange2 = (imageList: ImageListType, addUpdateIndex: number[] | undefined) => {
    setImages2(imageList as never[]);
    if (onChange) {
      onChange(imageList);
    }
  };

  useEffect(() => {
    if (imageList) {
      setImages2(imageList);
    }
  }, [imageList]);

  return (
    <div className="custom-file-container" data-upload-id="mySecondImage">
      <div className="label-container">
        <label>Upload </label>
      </div>
      <label className="custom-file-container__custom-file"></label>
      <input
        type="file"
        className="custom-file-container__custom-file__custom-file-input"
        accept="image/*"
      />
      <input type="hidden" name="MAX_FILE_SIZE" value="10485760" />
      <ImageUploading
        value={images2}
        onChange={onChange2}
        maxNumber={maxNumber}
        multiple={multiple}
        maxFileSize={maxFileSize}
      >
        {({
          imageList,
          onImageUpload,
          onImageRemoveAll,
          onImageUpdate,
          onImageRemove,
          isDragging,
          dragProps,
          errors,
        }) => (
          <div className="upload__image-wrapper" {...dragProps}>
            <div className="reletive w-full">
              <button
                type="button"
                className="custom-file-container__custom-file__custom-file-control relative cursor-pointer"
                onClick={onImageUpload}
                style={isDragging ? { color: 'red' } : undefined}
              >
                Choose File...
                {images2.length > 0 && (
                  <span
                    className="absolute right-2 top-1/2 -translate-y-1/2 transform"
                    onClick={(e) => {
                      e.stopPropagation();
                      setImages2([]);
                      onImageRemoveAll();
                    }}
                  >
                    <IconX />
                  </span>
                )}
              </button>
            </div>
            {errors && (
              <div className="text-red-500">
                {errors.maxNumber && (
                  <span>Number of selected images exceed maxNumber</span>
                )}
                {errors.acceptType && <span>Your selected file type is not allow</span>}
                {errors.maxFileSize && (
                  <span>
                    Selected file size exceed maxFileSize (
                    {convertBytesToMb(maxFileSize || 0)} MB)
                  </span>
                )}
                {errors.resolution && (
                  <span>Selected file is not match your desired resolution</span>
                )}
              </div>
            )}
            &nbsp;
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {imageList.map((image, index) => (
                <div
                  key={index}
                  className="custom-file-container__image-preview relative"
                >
                  <button
                    type="button"
                    className="custom-file-container__image-clear absolute left-0 top-0 block w-fit rounded-full bg-dark-light p-0.5 dark:bg-dark dark:text-white-dark"
                    title="Clear Image"
                    onClick={() => onImageRemove(index)}
                  >
                    <IconX />
                  </button>
                  <img
                    src={image.dataURL}
                    alt="img"
                    className="!max-h-48 w-full rounded object-cover shadow"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </ImageUploading>
      {images2.length === 0 ? (
        <img
          src="/assets/images/file-preview.svg"
          className="m-auto w-full max-w-md"
          alt=""
        />
      ) : (
        ''
      )}
    </div>
  );
};

export default FileUpload;

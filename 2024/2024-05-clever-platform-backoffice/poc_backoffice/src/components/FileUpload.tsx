import { useEffect, useState } from 'react';
import ImageUploading, { ImageListType } from 'react-images-uploading';
import IconX from './Icon/IconX';

const FileUpload = ({ multiple = false, onChange }: { multiple?: boolean; onChange?: (images: any) => void }) => {
    const [images2, setImages2] = useState<any>([]);
    const maxNumber = 69;

    const onChange2 = (imageList: ImageListType, addUpdateIndex: number[] | undefined) => {
        setImages2(imageList as never[]);
        if (onChange) {
            onChange(imageList);
        }
    };

    return (
        <div className="custom-file-container" data-upload-id="mySecondImage">
            <div className="label-container">
                <label>Upload </label>
                <button
                    type="button"
                    className="custom-file-container__image-clear"
                    title="Clear Image"
                    onClick={() => {
                        setImages2([]);
                    }}
                >
                    x
                </button>
            </div>
            <label className="custom-file-container__custom-file"></label>
            <input type="file" className="custom-file-container__custom-file__custom-file-input" accept="image/*" />
            <input type="hidden" name="MAX_FILE_SIZE" value="10485760" />
            <ImageUploading value={images2} onChange={onChange2} maxNumber={maxNumber} multiple={multiple}>
                {({ imageList, onImageUpload, onImageRemoveAll, onImageUpdate, onImageRemove, isDragging, dragProps }) => (
                    <div className="upload__image-wrapper" {...dragProps}>
                        <button
                            className="custom-file-container__custom-file__custom-file-control"
                            onClick={onImageUpload}
                            style={isDragging ? { color: 'red' } : undefined}
                        >
                            Choose File...
                        </button>
                        &nbsp;
                        <div className="grid gap-4 sm:grid-cols-3 grid-cols-1">
                            {imageList.map((image, index) => (
                                <div key={index} className="custom-file-container__image-preview relative">
                                    <button
                                        type="button"
                                        className="custom-file-container__image-clear bg-dark-light dark:bg-dark dark:text-white-dark rounded-full block w-fit p-0.5 absolute top-0 left-0"
                                        title="Clear Image"
                                        onClick={() => onImageRemove(index)}
                                    >
                                        <IconX className="w-3 h-3" />
                                    </button>
                                    <img src={image.dataURL} alt="img" className="object-cover shadow rounded w-full !max-h-48" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </ImageUploading>
            {images2.length === 0 ? <img src="/assets/images/file-preview.svg" className="max-w-md w-full m-auto" alt="" /> : ''}
        </div>
    );
};

export default FileUpload;

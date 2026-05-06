import showMessage from '@global/utils/showMessage';
import { useState } from 'react';

interface UploadPictureProps {
    label?: string
    imageUrls?: string[];
    allowUpload?: boolean;
    maxFiles?: number;
    maxFileSize?: number;
    onFilesChange?: (files: File[]) => void;
}

const CWUploadPicture = ({
    label,
    imageUrls = [],
    allowUpload = true,
    maxFiles = 10,
    maxFileSize = 5 * 1024 * 1024,
    onFilesChange,
}: UploadPictureProps) => {
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [imageLoadError, setImageLoadError] = useState<boolean>(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const oversizedFiles = Array.from(files).filter((file) => file.size > maxFileSize);
        if (oversizedFiles.length > 0) {
            showMessage(
                `ไฟล์บางไฟล์มีขนาดเกิน 5MB: ${oversizedFiles.map((f) => f.name).join(', ')}`,
                'warning',
            );
            return;
        }

        const availableSlots = maxFiles - (uploadedImages.length + imageUrls.length);
        const filesToUpload = Array.from(files).slice(0, availableSlots);

        if (filesToUpload.length < files.length) {
            showMessage(
                `คุณสามารถอัพโหลดได้สูงสุด ${maxFiles} ไฟล์ (เหลือที่ว่าง ${availableSlots} ไฟล์)`,
                'warning',
            );
        }
        const newImages: string[] = [];
        const newFiles: File[] = [];

        filesToUpload.forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                newImages.push(reader.result as string);
                newFiles.push(file);

                if (newImages.length === filesToUpload.length) {
                    setUploadedImages((prev) => [...prev, ...newImages]);
                    setUploadedFiles((prev) => [...prev, ...newFiles]);
                    setImageLoadError(false);

                    if (onFilesChange) {
                        onFilesChange([...uploadedFiles, ...newFiles]);
                    }
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const openImageModal = (index: number) => {
        setCurrentImageIndex(index);
        setShowModal(true);
        setImageLoadError(false);
    };

    const navigateImage = (direction: 'prev' | 'next') => {
        const images = [...uploadedImages, ...imageUrls];
        let newIndex = currentImageIndex;

        if (direction === 'prev') {
            newIndex = currentImageIndex > 0 ? currentImageIndex - 1 : images.length - 1;
        } else {
            newIndex = currentImageIndex < images.length - 1 ? currentImageIndex + 1 : 0;
        }

        setCurrentImageIndex(newIndex);
        setImageLoadError(false);
    };

    const handleRemoveImage = (index: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setUploadedImages((prev) => prev.filter((_, i) => i !== index));
        setUploadedFiles((prev) => prev.filter((_, i) => i !== index));

        if (onFilesChange) {
            onFilesChange(uploadedFiles.filter((_, i) => i !== index));
        }
    };

    // รวมรูปภาพทั้งหมด
    const allImages = [...uploadedImages, ...(imageUrls || [])];

    return (
        <div className="mt-4 w-full">
            <p className="mb-2 text-left font-semibold underline">
                {label}
            </p>

            {/* Preview container */}
            <div className="mb-4 w-full rounded-md border border-gray-300 p-2">
                <div
                    className="relative flex w-full items-center justify-center overflow-hidden rounded-md bg-gray-100"
                    style={{ minHeight: '200px' }}
                    onClick={() => allImages.length > 0 && openImageModal(0)}
                >
                    {allImages.length > 0 ? (
                        <>
                            <img
                                src={allImages[0]}
                                alt="Preview"
                                className="max-h-64 max-w-full cursor-pointer object-contain"
                                onError={() => setImageLoadError(true)}
                            />

                            {allowUpload && uploadedImages.length > 0 && (
                                <button
                                    type="button"
                                    className="absolute right-2 top-2 rounded-full bg-white p-1 shadow-md"
                                    onClick={(e) => handleRemoveImage(0, e)}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 text-gray-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            )}
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center p-4">
                            <div className="flex h-20 w-24 items-center justify-center rounded-md border border-gray-300 bg-gray-200">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-12 w-12 text-gray-400"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <circle cx="5" cy="5" r="2" fill="currentColor" />
                                    <path
                                        fillRule="evenodd"
                                        d="M3 10l4-4 7 7 4-4v9H3v-8z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* สำหรับแสดงรูปภาพย่อย */}
            {allImages.length > 1 && (
                <div className="mb-5 mt-3 flex flex-wrap gap-2">
                    {allImages.map((img, index) => (
                        <div
                            key={index}
                            className="relative h-16 w-16 cursor-pointer overflow-hidden rounded-md border border-gray-300"
                            onClick={() => openImageModal(index)}
                        >
                            <img
                                src={img}
                                alt={`Thumbnail ${index + 1}`}
                                className="h-full w-full object-cover"
                                onError={() => { }}
                            />
                            {index < uploadedImages.length && (
                                <button
                                    type="button"
                                    className="absolute right-0 top-0 rounded-bl-md bg-red-500 p-0.5"
                                    onClick={(e) => handleRemoveImage(index, e)}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-3 w-3 text-white"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* File upload area */}
            {allowUpload && (
                <div className="mb-5 rounded-md border border-dashed border-gray-300 p-8">
                    <label
                        htmlFor="file-upload"
                        className="flex cursor-pointer flex-col items-center justify-center"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="mb-2 h-12 w-12 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                        </svg>
                        <span className="mb-2 text-center text-gray-500 underline">อัพโหลดรูป</span>
                        <p className="text-center text-sm text-gray-400">
                            format: .jpg, .png | ขนาดไม่เกิน 5 MB
                        </p>
                    </label>

                    <input
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        onChange={handleFileChange}
                        className="hidden"
                        id="file-upload"
                    />
                </div>
            )}

            {/* Image Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
                    <div className="relative w-full max-w-6xl px-4 pb-5">
                        {/* ปุ่มปิด */}
                        <button
                            className="absolute right-4 top-0 z-10 rounded-full bg-white/80 p-2 shadow-lg hover:bg-white"
                            onClick={() => setShowModal(false)}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-gray-800"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>

                        {/* ภาพหลัก */}
                        <div className="flex h-[60vh] items-center justify-center">
                            {imageLoadError ? (
                                <div className="flex flex-col items-center justify-center text-white">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-16 w-16"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                    <p className="mt-2">ไม่สามารถโหลดรูปภาพได้</p>
                                </div>
                            ) : (
                                <img
                                    src={allImages[currentImageIndex]}
                                    alt={`Image ${currentImageIndex + 1}`}
                                    className="max-h-full max-w-full object-contain"
                                    onError={() => setImageLoadError(true)}
                                />
                            )}
                        </div>

                        {/* Navigation และข้อมูลภาพ */}
                        <div className="mt-4 flex items-center justify-between text-white">
                            <button
                                className="rounded-full bg-white/20 p-2 hover:bg-white/30"
                                onClick={() => navigateImage('prev')}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 19l-7-7 7-7"
                                    />
                                </svg>
                            </button>

                            <div className="text-center">
                                <p className="text-sm">
                                    {currentImageIndex + 1} / {allImages.length}
                                </p>
                            </div>

                            <button
                                className="rounded-full bg-white/20 p-2 hover:bg-white/30"
                                onClick={() => navigateImage('next')}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5l7 7-7 7"
                                    />
                                </svg>
                            </button>
                        </div>

                        {/* Thumbnail strip */}
                        <div className="mt-4 flex justify-center overflow-x-auto py-2">
                            <div className="flex space-x-2">
                                {allImages.map((img, index) => (
                                    <div
                                        key={index}
                                        className={`h-12 w-12 cursor-pointer overflow-hidden rounded-md border-2 ${currentImageIndex === index ? 'border-blue-500' : 'border-transparent'}`}
                                        onClick={() => {
                                            setCurrentImageIndex(index);
                                            setImageLoadError(false);
                                        }}
                                    >
                                        <img
                                            src={img}
                                            alt={`Thumb ${index + 1}`}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CWUploadPicture;

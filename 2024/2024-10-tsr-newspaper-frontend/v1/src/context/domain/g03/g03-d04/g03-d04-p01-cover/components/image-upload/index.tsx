import { useState } from 'react';

interface ImageUploadProps {
  onImageUpload: (index: number, file: File | null) => void;
  error?: string;
}

const ImageUpload = () => {
  const [images, setImages] = useState<(File | null)[]>([null, null, null]);
  const [errors, setErrors] = useState<string[]>(['', '', '']);

  const handleImageUpload = (index: number, file: File | null) => {
    if (file) {
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        const newErrors = [...errors];
        newErrors[index] = 'ขนาดไฟล์เกิน 10 MB';
        setErrors(newErrors);
        return;
      }

      const newImages = [...images];
      newImages[index] = file;
      setImages(newImages);

      const newErrors = [...errors];
      newErrors[index] = '';
      setErrors(newErrors);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {[0, 1, 2].map((index) => (
        <div key={index} className="relative">
          <label className="block cursor-pointer">
            <input
              type="file"
              className="hidden"
              accept="image/jpeg,image/png"
              onChange={(e) => handleImageUpload(index, e.target.files?.[0] || null)}
            />
            <div className="border border-dashed border-gray-300 rounded-lg p-4 text-center dark:text-[#D7D7D7]">
              {images[index] ? (
                <>
                  <img
                    src={URL.createObjectURL(images[index]!)}
                    alt={`Preview ${index + 1}`}
                    className="mx-auto max-h-32 object-contain mb-2"
                  />
                  <div className="text-xs text-gray-500">{images[index]?.name}</div>
                </>
              ) : (
                <>
                  <div className="mb-2">
                    <svg
                      className="mx-auto w-8 h-8 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-[#D7D7D7]">
                    อัปโหลดรูป
                  </div>
                  <div className="text-xs text-gray-400 mt-1 dark:text-[#D7D7D7]">
                    Resolution: 999 x 999px
                  </div>
                  <div className="text-xs text-gray-400 dark:text-[#D7D7D7]">
                    format: .jpg, .png | ขนาดไฟล์ไม่เกิน 10 MB
                  </div>
                </>
              )}
            </div>
          </label>
          {errors[index] && (
            <div className="text-red-500 text-xs mt-1 text-center">{errors[index]}</div>
          )}
          <div className="text-center mt-2">
            <p className="text-sm font-medium dark:text-[#344054]">
              โฆษณาที่ {index + 1}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImageUpload;

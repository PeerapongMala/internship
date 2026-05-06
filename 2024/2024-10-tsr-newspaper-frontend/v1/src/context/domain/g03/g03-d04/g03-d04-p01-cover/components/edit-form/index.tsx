import { Dispatch, SetStateAction, useState } from 'react';
import { navCover } from '../cover';

export interface EditFormType {
  title: string;
  public_date: string;
  content: string;
  content2: string;
  images: (File | null)[];
}

const EditForm = ({
  setStateForm,
  setCurrentPage,
  currentTemplate,
  initialFormData,
}: {
  setStateForm: Dispatch<SetStateAction<EditFormType | undefined>>;
  setCurrentPage: (value: SetStateAction<navCover>) => void;
  currentTemplate: number | undefined;
  initialFormData?: EditFormType;
}) => {
  const [formData, setFormData] = useState<EditFormType>(
    initialFormData || {
      title: '',
      public_date: '',
      content: '',
      content2: '',
      images: [null, null, null],
    },
  );

  const recommendedResolutionsMap: Record<number, string[]> = {
    1: ['228 x 228 px', '228 x 228 px', '228 x 228 px'],
    2: ['200 x 120 px', '200 x 170 px', '200 x 170 px'],
  };

  const [errors, setErrors] = useState({
    title: '',
    content: '',
    images: ['', '', ''],
  });

  const handleImageUpload = (index: number, file: File | null) => {
    if (file) {
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        const newErrors = { ...errors };
        newErrors.images[index] = 'ขนาดไฟล์เกิน 10 MB';
        setErrors(newErrors);
        return;
      }

      const newImages = [...formData.images];
      newImages[index] = file;
      setFormData({ ...formData, images: newImages });

      const newErrors = { ...errors };
      newErrors.images[index] = '';
      setErrors(newErrors);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = {
      title: !formData.title.trim() ? 'กรุณากรอกหัวข้อ' : '',
      content: !formData.content.trim() ? 'กรุณากรอกเนื้อหา' : '',
      content2: !formData.content2.trim() ? 'กรุณากรอกเนื้อหา' : '',
      images: errors.images,
    };
    setErrors(newErrors);

    if (
      !newErrors.title &&
      !newErrors.content &&
      !newErrors.images.some((error) => error)
    ) {
      setStateForm(formData);
      setCurrentPage(navCover.PREVIEW);
    }
  };

  return (
    <form onSubmit={onSubmit} className="max-w-3xl mx-auto mt-[30px]">
      <div className="mb-4">
        <label className="block mb-2 text-base font-medium dark:text-[#D7D7D7]">
          หัวข้อ<span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Placeholder Text.."
          className="w-full h-[55px] p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400 dark:bg-[#414141] dark:text-white"
        />
        {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
      </div>

      <div className="mb-6">
        <label className="block mb-2 text-base font-medium dark:text-[#D7D7D7]">
          เนื้อหา<span className="text-red-500">*</span>
        </label>
        <textarea
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          placeholder="Text.."
          rows={3}
          className="w-full h-[108px] p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400 dark:bg-[#414141] dark:text-white"
        />
        {currentTemplate == 2 && (
          <textarea
            value={formData.content2}
            onChange={(e) => setFormData({ ...formData, content2: e.target.value })}
            placeholder="Text.."
            rows={3}
            className="w-full h-[108px] p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400 dark:bg-[#414141] dark:text-white"
          />
        )}
        {errors.content && <p className="mt-1 text-sm text-red-500">{errors.content}</p>}
        {/* <p className='text-gray-400'>\n เพื่อขึ้นบรรทัดใหม่</p> */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 ">
        {[0, 1, 2].map((index) => (
          <div key={index} className="relative">
            <label className="block cursor-pointer">
              <input
                type="file"
                className="hidden"
                accept="image/jpeg,image/png"
                onChange={(e) => handleImageUpload(index, e.target.files?.[0] || null)}
              />
              <div className="border border-dashed border-gray-300 h-[190px] rounded-lg p-4 text-center dark:text-[#D7D7D7] flex flex-col justify-center items-center">
                {formData.images[index] ? (
                  <>
                    <img
                      src={URL.createObjectURL(formData.images[index]!)}
                      alt={`Preview ${index + 1}`}
                      className="max-h-[120px] w-full h-full object-contain"
                    />
                    <div className="text-xs line-clamp-1 text-gray-500 mt-2">
                      {formData.images[index]?.name}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mb-2 flex gap-[10px]">
                      <span className="dark:hidden">
                        <svg
                          width="41"
                          height="41"
                          viewBox="0 0 41 41"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M39.1325 32.1489C39.1325 33.0366 38.7799 33.8879 38.1522 34.5156C37.5245 35.1433 36.6731 35.496 35.7854 35.496H5.66155C4.77385 35.496 3.9225 35.1433 3.2948 34.5156C2.66709 33.8879 2.31445 33.0366 2.31445 32.1489V13.7398C2.31445 12.8521 2.66709 12.0008 3.2948 11.3731C3.9225 10.7454 4.77385 10.3927 5.66155 10.3927H12.3557L15.7028 5.37207H25.7441L29.0912 10.3927H35.7854C36.6731 10.3927 37.5245 10.7454 38.1522 11.3731C38.7799 12.0008 39.1325 12.8521 39.1325 13.7398V32.1489Z"
                            stroke="#737373"
                            stroke-width="1.67355"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M20.7294 28.8017C24.4265 28.8017 27.4236 25.8046 27.4236 22.1075C27.4236 18.4104 24.4265 15.4133 20.7294 15.4133C17.0323 15.4133 14.0352 18.4104 14.0352 22.1075C14.0352 25.8046 17.0323 28.8017 20.7294 28.8017Z"
                            stroke="#737373"
                            stroke-width="1.67355"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </span>
                      <span className="hidden dark:block">
                        <svg
                          width="41"
                          height="41"
                          viewBox="0 0 41 41"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M39.1325 32.1489C39.1325 33.0366 38.7799 33.8879 38.1522 34.5156C37.5245 35.1433 36.6731 35.496 35.7854 35.496H5.66155C4.77385 35.496 3.9225 35.1433 3.2948 34.5156C2.66709 33.8879 2.31445 33.0366 2.31445 32.1489V13.7398C2.31445 12.8521 2.66709 12.0008 3.2948 11.3731C3.9225 10.7454 4.77385 10.3927 5.66155 10.3927H12.3557L15.7028 5.37207H25.7441L29.0912 10.3927H35.7854C36.6731 10.3927 37.5245 10.7454 38.1522 11.3731C38.7799 12.0008 39.1325 12.8521 39.1325 13.7398V32.1489Z"
                            stroke="#D7D7D7"
                            stroke-width="1.67355"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M20.7294 28.8017C24.4265 28.8017 27.4236 25.8046 27.4236 22.1075C27.4236 18.4104 24.4265 15.4133 20.7294 15.4133C17.0323 15.4133 14.0352 18.4104 14.0352 22.1075C14.0352 25.8046 17.0323 28.8017 20.7294 28.8017Z"
                            stroke="#D7D7D7"
                            stroke-width="1.67355"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </span>
                      <span className="block dark:hidden md:hidden">
                        <svg
                          width="42"
                          height="41"
                          viewBox="0 0 42 41"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clip-path="url(#clip0_3600_6194)">
                            <path
                              d="M27.4847 3.60791V11.3273C27.4847 11.8392 27.6808 12.33 28.0298 12.692C28.3788 13.0539 28.8521 13.2572 29.3457 13.2572H36.7894M27.4847 3.60791H14.4582C13.4711 3.60791 12.5244 4.01456 11.8264 4.73839C11.1285 5.46223 10.7363 6.44397 10.7363 7.46763V28.6961M27.4847 3.60791L36.7894 13.2572M36.7894 13.2572V34.4856C36.7894 35.5093 36.3973 36.491 35.6993 37.2149C35.0013 37.9387 34.0547 38.3454 33.0675 38.3454H27.4847"
                              stroke="#737373"
                              stroke-width="2.2314"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M5.59857 31.1073H8.19815C9.12046 31.1073 9.81963 31.3193 10.2957 31.7433C10.7717 32.1598 11.0097 32.7772 11.0097 33.5953C11.0097 34.4582 10.7643 35.1164 10.2733 35.5701C9.78988 36.0164 9.07955 36.2396 8.14236 36.2396H7.20518V38.9172H5.59857V31.1073ZM8.27625 34.9677C8.66302 34.9677 8.9531 34.8561 9.14649 34.6329C9.34732 34.4024 9.44773 34.0714 9.44773 33.64C9.44773 33.2309 9.33988 32.9222 9.12418 32.7139C8.91591 32.4982 8.60352 32.3904 8.18699 32.3904H7.20518V34.9677H8.27625ZM12.1795 31.1073H14.9687C17.1034 31.1073 18.1708 32.3606 18.1708 34.8672C18.1708 35.8342 18.0518 36.6152 17.8137 37.2102C17.5757 37.7978 17.2001 38.2292 16.6869 38.5044C16.1811 38.7796 15.508 38.9172 14.6675 38.9172H12.1795V31.1073ZM14.8348 37.6342C15.2588 37.6342 15.5972 37.5412 15.8501 37.3553C16.103 37.1693 16.2852 36.8755 16.3968 36.4739C16.5158 36.0722 16.5753 35.5367 16.5753 34.8672C16.5753 33.9821 16.4489 33.3499 16.196 32.9706C15.9431 32.5838 15.5228 32.3904 14.9352 32.3904H13.7861V37.6342H14.8348ZM19.3378 31.1073H24.5816V32.3904H20.9444V34.4768H24.3361V35.7598H20.9444V38.9172H19.3378V31.1073Z"
                              fill="#737373"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_3600_6194">
                              <rect
                                width="40.1652"
                                height="40.1652"
                                fill="white"
                                transform="translate(0.966309 0.351318)"
                              />
                            </clipPath>
                          </defs>
                        </svg>
                      </span>
                      <span className="hidden dark:block dark:md:hidden md:hidden">
                        <svg
                          width="42"
                          height="41"
                          viewBox="0 0 42 41"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clip-path="url(#clip0_3600_6194)">
                            <path
                              d="M27.4847 3.60791V11.3273C27.4847 11.8392 27.6808 12.33 28.0298 12.692C28.3788 13.0539 28.8521 13.2572 29.3457 13.2572H36.7894M27.4847 3.60791H14.4582C13.4711 3.60791 12.5244 4.01456 11.8264 4.73839C11.1285 5.46223 10.7363 6.44397 10.7363 7.46763V28.6961M27.4847 3.60791L36.7894 13.2572M36.7894 13.2572V34.4856C36.7894 35.5093 36.3973 36.491 35.6993 37.2149C35.0013 37.9387 34.0547 38.3454 33.0675 38.3454H27.4847"
                              stroke="#D7D7D7"
                              stroke-width="2.2314"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M5.59857 31.1073H8.19815C9.12046 31.1073 9.81963 31.3193 10.2957 31.7433C10.7717 32.1598 11.0097 32.7772 11.0097 33.5953C11.0097 34.4582 10.7643 35.1164 10.2733 35.5701C9.78988 36.0164 9.07955 36.2396 8.14236 36.2396H7.20518V38.9172H5.59857V31.1073ZM8.27625 34.9677C8.66302 34.9677 8.9531 34.8561 9.14649 34.6329C9.34732 34.4024 9.44773 34.0714 9.44773 33.64C9.44773 33.2309 9.33988 32.9222 9.12418 32.7139C8.91591 32.4982 8.60352 32.3904 8.18699 32.3904H7.20518V34.9677H8.27625ZM12.1795 31.1073H14.9687C17.1034 31.1073 18.1708 32.3606 18.1708 34.8672C18.1708 35.8342 18.0518 36.6152 17.8137 37.2102C17.5757 37.7978 17.2001 38.2292 16.6869 38.5044C16.1811 38.7796 15.508 38.9172 14.6675 38.9172H12.1795V31.1073ZM14.8348 37.6342C15.2588 37.6342 15.5972 37.5412 15.8501 37.3553C16.103 37.1693 16.2852 36.8755 16.3968 36.4739C16.5158 36.0722 16.5753 35.5367 16.5753 34.8672C16.5753 33.9821 16.4489 33.3499 16.196 32.9706C15.9431 32.5838 15.5228 32.3904 14.9352 32.3904H13.7861V37.6342H14.8348ZM19.3378 31.1073H24.5816V32.3904H20.9444V34.4768H24.3361V35.7598H20.9444V38.9172H19.3378V31.1073Z"
                              fill="#D7D7D7"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_3600_6194">
                              <rect
                                width="40.1652"
                                height="40.1652"
                                fill="white"
                                transform="translate(0.966309 0.351318)"
                              />
                            </clipPath>
                          </defs>
                        </svg>
                      </span>
                    </div>
                    <div className="text-center text-gray-500 dark:text-[#D7D7D7] ">
                      <p className="text-sm font-semibold">อัปโหลดรูป</p>
                      <p className="text-[5px] whitespace-pre-line leading-relaxed">
                        {`Resolution: ${recommendedResolutionsMap[currentTemplate ?? 1][index]}
format: .jpg, .png | ขนาดไม่เกิน 10 MB`}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </label>
            {errors.images[index] && (
              <div className="text-red-500 text-xs mt-1 text-center">
                {errors.images[index]}
              </div>
            )}
            <div className="text-center mt-2">
              <p className="text-sm font-medium dark:text-[#344054]">
                โฆษณาที่ {index + 1}
              </p>
            </div>
          </div>
        ))}
      </div>

      <button
        type="submit"
        className="w-full bg-[#D9A84E] text-white h-[32px] font-semibold text-sm rounded-lg hover:bg-[#c69746] transition-colors"
      >
        บันทึก
      </button>
    </form>
  );
};

export default EditForm;

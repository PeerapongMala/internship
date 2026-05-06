import { useState } from 'react';
import { GoArrowLeft } from 'react-icons/go';
import { FaqItem } from '../faq-page';

interface FaqFormProps {
  initialData?: FaqItem;
  onSubmit: (data: FaqItem) => void;
  isLoading?: boolean;
  onCancel: () => void;
}

const FaqForm: React.FC<FaqFormProps> = ({
  initialData,
  onSubmit,
  isLoading = false,
  onCancel
}) => {
  const [formData, setFormData] = useState<FaqItem>({
    id: initialData?.id ?? 0,
    question: initialData?.question ?? '',
    answer: initialData?.answer ?? '',
  });

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.question.trim() && formData.answer.trim()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="">
      <div className="flex gap-x-[5px] mb-[85px] items-center">
        <button
          type="button"
          onClick={onCancel}
          className='hover:cursor-pointer'
        >
          <GoArrowLeft size={28} className="hidden dark:block" color="#ffffff" />
          <GoArrowLeft size={28} className="dark:hidden" />
        </button>
        <p className="font-semibold text-[28px] leading-[28px] text-[#101828] dark:text-white">
          เพิ่มคำถาม
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="question"
            className="block text-base font-medium text-[#344054] dark:text-[#D7D7D7] mb-[13px]"
          >
            คำถาม<span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            id="question"
            name="question"
            placeholder="Placeholder Text.."
            value={formData.question}
            onChange={handleInputChange}
            className="w-full px-[18.51px] py-[15.77px] h-[56px] border border-[#D0D5DD] rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-[#414141] dark:border-[#9096A2] dark:text-white"
            required
          />
        </div>

        <div>
          <label
            htmlFor="answer"
            className="block text-base font-medium mb-[13px] text-[#344054] dark:text-[#D7D7D7]"
          >
            คำตอบ<span className="text-red-600">*</span>
          </label>
          <textarea
            id="answer"
            name="answer"
            placeholder="Text.."
            value={formData.answer}
            onChange={handleInputChange}
            className="w-full  min-h-[108px] px-[18.51px] py-[15.77px] border border-[#D0D5DD] rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-[#414141] dark:border-[#9096A2] dark:text-white"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-[38px] rounded-[6px] px-[12px] gap-[16px] bg-secondary flex items-center justify-center disabled:bg-[#D7D7D8] disabled:cursor-not-allowed mt-[54px]"
        >
          <p className="font-bold text-[14px] leading-[20.61px] text-[#FBFBFB] text-center">
            {isLoading ? 'กำลังบันทึก...' : 'บันทึก'}
          </p>
        </button>
      </form>
    </div>
  );
};

export default FaqForm;

import NotificationSuccess from '@component/web/atom/notification/wc-a-notification-success';
import NotificationError from '@component/web/atom/notification/wc-a-notification-error';
import StoreGlobalPersist from '@store/global/persist';
import { useNavigate } from '@tanstack/react-router';
import { useState, ChangeEvent, useEffect } from 'react';
import { FaUserCircle, FaRegImage } from 'react-icons/fa';
import { getUserProfile, updateUserProfile } from '../../../local/api/restapi/get-user-profile';
import { NotificationState, NotificationType  } from '@component/web/atom/notification/type'; 


export type ProfileFormData = {
  email?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  company?: string;
  branch?: string;
  tax_id?: string;
  phone?: string;
  address?: string;
  district?: string;
  sub_district?: string;
  province?: string;
  postal_code?: string;
  profile_image_url?: File | null | string
};

export interface DisabledInputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'date';
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export default function UserProfileForm() {
  const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5050';
  const accessToken = StoreGlobalPersist.StateGetAllWithUnsubscribe().accessToken
  const navigate = useNavigate()
  const [formData, setFormData] = useState<ProfileFormData>({
    email: '',
    username: '',
    first_name: '',
    last_name: '',
    company: '',
    branch: '',
    tax_id: '',
    phone: '',
    address: '',
    district: '',
    sub_district: '',
    province: '',
    postal_code: '',
    profile_image_url: null
  });

  const [notification, setNotification] = useState<NotificationState>({
    show: false,
    type: 'success',
    title: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    fetchProfile()
  }, [])


  const fetchProfile = async () => {
    try {
      const profile = await getUserProfile(accessToken);
      setFormData({ ...profile, profile_image_url: profile.profile_image_url || null });
    } catch (error: any) {
      console.error('Error fetching profile:', error);
    }
  };
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      setNotification({
        show: true,
        type: 'error',
        title: 'ไฟล์ไม่ถูกต้อง',
        message: 'กรุณาอัปโหลดเฉพาะไฟล์รูปภาพ',
      });
      setTimeout(() => {
        setNotification((prev) => ({ ...prev, show: false }));
      }, 3000);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setNotification({
        show: true,
        type: 'error',
        title: 'ไฟล์มีขนาดใหญ่เกินไป',
        message: 'กรุณาเลือกไฟล์ขนาดไม่เกิน 5MB',
      });
      setTimeout(() => {
        setNotification((prev) => ({ ...prev, show: false }));
      }, 3000);
      return;
    }

    setFormData((prevData) => ({
      ...prevData,
      profile_image_url: file,
    }));
  };
  const validate: Record<string, (value: string) => string | null> = {
    phone: (value) => {
      if (!value) {
        return null;
      }
      if (value.startsWith('02')) {
        if (value.length !== 9) {
          return 'เบอร์โทรศัพท์ที่เริ่มต้นด้วย 02 ต้องมี 9 หลัก';
        }
      } else {

        if (value.length < 10) {
          return 'กรุณากรอกเบอร์โทรให้ครบ 10 หลัก';
        }
        if (value.length > 10) {
          return 'ห้ามกรอกเบอร์โทรเกิน 10 หลัก'
        }
      }

      if (!/^(02\d{7}|08\d{8}|09\d{8}|06\d{8})$/.test(value)) {
        return 'กรุณากรอกเบอร์โทรให้ถูกต้อง (เริ่มต้นด้วย 02, 08, 09 หรือ 06)';
      }

      return null; 
    },
    postal_code: (value) => {
      if (!value) {
        return null;
      }
      if (value.length < 5) {
        return 'กรุณากรอกรหัสไปรษณีย์ให้ครบ 5 หลัก';
      }
      if (value.length > 5) {
        return 'ห้ามกรอกรหัสไปรษณีย์เกิน 5 หลัก';
      }
      if (!/^\d{5}$/.test(value)) {
        return 'กรุณากรอกรหัสไปรษณีย์ 5 หลัก';
      }
      return null;
    },
  };


  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, files } = e.target;
    if (validate[name]) {
      const errorMessage = validate[name](value);
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: errorMessage || '',
      }));
    }

    if (type === 'file' && files) {
      setFormData((prevData) => ({
        ...prevData,
        [name]: files[0] || null,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };


  const handleSubmit = async () => {
    const hasErrors = Object.values(errors).some((error) => error !== '');
    if (hasErrors) {
      setNotification({
        show: true,
        title: 'กรุณาตรวจสอบข้อมูลให้ถูกต้อง',
        type: 'error',
      });
      setTimeout(() => {
        setNotification((prev) => ({ ...prev, show: false }));
      }, 3000);
      return;
    }
  
    setLoading(true);
    try {
      await updateUserProfile(formData, accessToken);
      setNotification({
        show: true,
        title: 'บันทึกข้อมูลสำเร็จ',
        type: 'success',
      });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      setNotification({
        show: true,
        title: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง',
        type: 'error',
      });
    } finally {
      setLoading(false);
      setTimeout(() => {
        setNotification((prev) => ({ ...prev, show: false }));
      }, 3000);
    }
  };


  return (
    <section >
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
      <h3 className="text-[#101828] dark:text-white pb-6 font-semibold text-2xl mb-[15px] md:mb-0">
        ข้อมูลส่วนตัว
      </h3>

      {/* Profile Picture Section */}
      <div className="flex flex-col items-left mb-8">
        <div className="text-base text-[#344054] font-normal leading-4 mb-2 dark:text-white">
          รูปโปรไฟล์
        </div>

        {formData.profile_image_url ? (
          typeof formData.profile_image_url === 'string' ? (
            <img src={`${BACKEND_URL}${formData.profile_image_url}`} alt="Profile" className="w-32 h-32 rounded-full mb-4 object-cover" />
          ) : (
            <img
              src={URL.createObjectURL(formData.profile_image_url)}
              alt="Profile"
              className="w-32 h-32 rounded-full mb-4 object-cover"
            />
          )
        ) : (
          <FaUserCircle className="text-gray-400 text-8xl mb-4" />
        )}
        <div className="relative w-48">
          <label
            htmlFor="profileImageUpload"
            className="flex gap-2 items-center justify-center border border-gray-300 rounded-md px-4 py-2 text-base hover:bg-gray-100 dark:hover:bg-black dark:border-[#737373] cursor-pointer transition-all duration-300"
          >
            <FaRegImage className="text-gray-600 dark:text-[#D7D7D7] text-2xl" />
            <span className="text-gray-600 text-sm font-normal dark:text-[#D7D7D7]">
              อัปโหลดรูปโปรไฟล์
            </span>
          </label>
          <input
            id="profileImageUpload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

      </div>

      {/* Form Profile */}
      <div className="grid grid-cols-1  sm:grid-cols-2 gap-x-[58px] gap-y-[22px] w-full">
        {/* Email Field */}
        <div className="mb-4">
          <CustomLabel text="อีเมล" />
          <CustomInput
            name="email"
            value={formData.email!}
            onChange={handleInputChange}
            disabled={true}
          />
        </div>

        {/* Username Field */}
        <div className="mb-4">
          <CustomLabel text="ชื่อผู้ใช้" />
          <CustomInput
            name="username"
            value={formData.username!}
            onChange={handleInputChange}
            disabled={true}
          />
        </div>

        {/* First Name Field */}
        <div className="mb-4">
          <CustomLabel text="ชื่อ" />
          <CustomInput
            name="first_name"
            value={formData.first_name!}
            onChange={handleInputChange}
          />
        </div>

        {/* Last Name Field */}
        <div className="mb-4">
          <CustomLabel text="นามสกุล" />
          <CustomInput
            name="last_name"
            value={formData.last_name!}
            onChange={handleInputChange}
          />
        </div>

        {/* Company Name Field */}
        <div className="mb-4">
          <CustomLabel text="ชื่อบริษัท" />
          <CustomInput
            name="company"
            value={formData.company!}
            onChange={handleInputChange}
          />
        </div>

        {/* Branch Field */}
        <div className="mb-4">
          <CustomLabel text="สาขา" />
          <CustomInput
            name="branch"
            value={formData.branch!}
            onChange={handleInputChange}
          />
        </div>

        {/* Tax ID Field */}
        <div className="mb-4">
          <CustomLabel text="เลขประจำตัวผู้เสียภาษี" />
          <CustomInput name="tax_id" value={formData.tax_id!} onChange={handleInputChange} />
        </div>

        {/* Phone Number Field */}
        <div className="mb-4">
          <CustomLabel text="เบอร์โทร" />
          <CustomInput
            name="phone"
            value={formData.phone!}
            onChange={handleInputChange}
            className={`border rounded w-full py-2 px-3 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
          )}
        </div>

        {/* Address Field */}
        <div className="md-4 sm:col-span-2">
          <CustomLabel text="ที่อยู่" />
          <CustomInput
            name="address"
            value={formData.address!}
            onChange={handleInputChange}
          />
        </div>

        {/* District Field */}
        <div className="mb-4">
          <CustomLabel text="แขวง/ตำบล" />
          <CustomInput
            name="district"
            value={formData.district!}
            onChange={handleInputChange}
          />
        </div>

        {/* Sub District Field */}
        <div className="mb-4">
          <CustomLabel text="เขต/อำเภอ" />
          <CustomInput
            name="sub_district"
            value={formData.sub_district!}
            onChange={handleInputChange}
          />
        </div>

        {/* Province Field */}
        <div className="mb-4">
          <CustomLabel text="จังหวัด" />
          <CustomInput
            name="province"
            value={formData.province!}
            onChange={handleInputChange}
          />
        </div>

        {/* Postal Code Field */}
        <div className="mb-4">
          <CustomLabel text="รหัสไปรษณีย์" />
          <CustomInput
            name="postal_code"
            value={formData.postal_code!}
            onChange={handleInputChange}
            className={`border rounded w-full py-2 px-3 ${errors.postal_code ? 'border-red-500' : 'border-gray-300'}`}

          />
          {errors.postal_code && (
            <p className="text-red-500 text-sm mt-1">{errors.postal_code}</p>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="w-full mt-8">
        <button
          onClick={handleSubmit}
          className={`w-full bg-secondary text-sm rounded-md py-2 font-bold text-[#FBFBFB] flex justify-center items-center ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-yellow-600"
            }`}
          disabled={loading}
        >
          {loading ? (
            <div className="animate-spin rounded-full border-t-2 border-b-2 border-[#FBFBFB] w-5 h-5"></div>
          ) : (
            "บันทึก"
          )}
        </button>
      </div>
    </section>
  );
}

const CustomLabel = ({ text }: { text: string }) => {
  return (
    <label className="block text-base font-normal text-[#414141] leading-4 mb-2 dark:text-[#D7D7D7]">
      {text}
    </label>
  );
};

const CustomInput: React.FC<DisabledInputProps> = ({
  type = 'text',
  name,
  value,
  onChange,
  disabled = false,
  placeholder,
  className = '',

}) => {
  const cssDisabled = 'bg-gray-300 cursor-default dark:bg-[#414141] dark:text-white';
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      placeholder={placeholder}
      className={`border p-2 w-full rounded-md dark:border-[#737373] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 
        ${disabled
          ? cssDisabled
          : 'bg-white border-[#D0D5DD] cursor-text dark:bg-[#262626]  dark:text-white'
        } ${className}
      `}
    />
  );
};

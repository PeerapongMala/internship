import { useCallback, useRef, useState } from 'react';
import TextField from '../textfield/TextField';
import { useNavigate } from 'react-router-dom';
import NotificationSuccess from '@component/web/atom/notification/wc-a-notification-success';
import NotificationError from '@component/web/atom/notification/wc-a-notification-error';
import { AuthError, signupUser } from '../../../local/api/restapi/sign-up-user';

export interface SignupForm {
  email: string;
  username: string;
  password: string;
  confirm_password: string;
  company: string;
  branch: string;
  tax_id: string;
  phone: string;
  address: string;
  district: string;
  sub_district: string;
  province: string;
  postal_code: string;
}

interface FormErrors {
  [key: string]: string;
}

interface TouchedFields {
  [key: string]: boolean;
}
interface FieldRefs {
  email: React.RefObject<HTMLDivElement>;
  username: React.RefObject<HTMLDivElement>;
  password: React.RefObject<HTMLDivElement>;
  confirm_password: React.RefObject<HTMLDivElement>;
}

const getFieldLabel = (fieldName: keyof SignupForm): string => {
  const translations: Record<keyof SignupForm, string> = {
    email: 'อีเมล',
    username: 'ชื่อผู้ใช้งาน',
    password: 'รหัสผ่าน',
    confirm_password: 'ยืนยันรหัสผ่าน',
    company: 'ชื่อบริษัท',
    branch: 'สาขา',
    tax_id: 'เลขที่ประจำตัวผู้เสียภาษี',
    phone: 'เบอร์โทร',
    address: 'ที่อยู่',
    district: 'เขต/อำเภอ',
    sub_district: 'แขวง/ตำบล',
    province: 'จังหวัด',
    postal_code: 'รหัสไปรษณีย์',
  };

  return translations[fieldName];
};

function Signup() {
  const navigate = useNavigate();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const fieldRefs: FieldRefs = {
    email: useRef<HTMLDivElement>(null),
    username: useRef<HTMLDivElement>(null),
    password: useRef<HTMLDivElement>(null),
    confirm_password: useRef<HTMLDivElement>(null),
  };

  const [isLoading, setIsLoading] = useState(false);
  const [isShowNotification, setIsShowNotification] = useState(false);
  const [touched, setTouched] = useState<TouchedFields>({});

  const [formData, setFormData] = useState<SignupForm>({
    email: '',
    username: '',
    password: '',
    confirm_password: '',
    company: '',
    branch: '',
    tax_id: '',
    phone: '',
    address: '',
    district: '',
    sub_district: '',
    province: '',
    postal_code: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const handleBlur = (name: string) => {
    setTouched((prev) => ({ ...prev, [name]: true }));

    const error = validateField(name, formData[name as keyof SignupForm]);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (['email', 'password', 'confirm_password'].includes(name)) {
      const noWhitespace = value.replace(/\s/g, '');
      setFormData((prev) => ({
        ...prev,
        [name]: noWhitespace,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    if (name === 'password') {
      setFormData((prev) => {
        const newFormData = {
          ...prev,
          password: value.replace(/\s/g, ''),
        };

        if (prev.confirm_password) {
          if (value !== prev.confirm_password) {
            setErrors((prev) => ({
              ...prev,
              password: 'กรุณากรอกรหัสผ่านให้เหมือนกัน',
              confirm_password: 'กรุณากรอกรหัสผ่านให้เหมือนกัน',
            }));
          } else {
            setErrors((prev) => ({
              ...prev,
              password: '',
              confirm_password: '',
            }));
          }
        }

        return newFormData;
      });
    }

    if (name === 'confirm_password') {
      setFormData((prev) => {
        const newFormData = {
          ...prev,
          confirm_password: value.replace(/\s/g, ''),
        };

        if (value !== prev.password) {
          setErrors((prev) => ({
            ...prev,
            password: 'กรุณากรอกรหัสผ่านให้เหมือนกัน',
            confirm_password: 'กรุณากรอกรหัสผ่านให้เหมือนกัน',
          }));
        } else {
          setErrors((prev) => ({
            ...prev,
            password: '',
            confirm_password: '',
          }));
        }

        return newFormData;
      });
    }

    if (touched[name] && !['password', 'confirm_password'].includes(name)) {
      const errorMessage = validateField(
        name,
        ['email'].includes(name) ? value.replace(/\s/g, '') : value,
      );
      setErrors((prev) => ({
        ...prev,
        [name]: errorMessage,
      }));
    }
  };

  const validateAllFields = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    const newTouched: TouchedFields = {};
    Object.keys(formData).forEach((key) => {
      newTouched[key] = true;
    });
    setTouched(newTouched);

    Object.entries(formData).forEach(([key, value]) => {
      const error = validateField(key, value);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);

    if (!isValid) {
      const firstErrorField = Object.keys(newErrors).find(
        (key) => fieldRefs[key as keyof typeof fieldRefs],
      );

      if (firstErrorField) {
        fieldRefs[firstErrorField as keyof typeof fieldRefs]?.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }

    return isValid;
  };

  const validateField = useCallback(
    (name: string, value: string): string => {
      if (
        ['email', 'username', 'password', 'confirm_password'].includes(name) &&
        !value.trim()
      ) {
        return `กรุณากรอกข้อมูล ${getFieldLabel(name as keyof SignupForm)}`;
      }

      if (name === 'password' || name === 'confirm_password') {
        const otherField = name === 'password' ? 'confirm_password' : 'password';
        if (formData[otherField] && value !== formData[otherField]) {
          return 'กรุณากรอกรหัสผ่านให้เหมือนกัน';
        }
        if (name === 'password' && value.length < 6) {
          return 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร';
        }
      }

      if (name === 'email') {
        if (!emailRegex.test(value)) {
          return 'รูปแบบอีเมลไม่ถูกต้อง';
        }
      }

      return '';
    },
    [emailRegex, formData],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedData = Object.entries(formData).reduce(
      (acc, [key, value]) => ({
        ...acc,
        [key]: ['password', 'confirm_password'].includes(key) ? value : value.trim(),
      }),
      {} as SignupForm,
    );

    if (!validateAllFields()) {
      return;
    }

    setIsLoading(true);
    try {
      await signupUser(trimmedData);

      setIsShowNotification(true);
      setTimeout(() => {
        setIsShowNotification(false);
        navigate('/sign-in');
      }, 2000);
    } catch (error) {
      if (error instanceof AuthError && error.field) {
        setErrors((prev) => ({
          ...prev,
          [error.field]: error.message,
        }));

        if (['email', 'username'].includes(error.field) && error.field in fieldRefs) {
          const field = error.field as keyof FieldRefs;
          fieldRefs[field].current?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
        }
      } else {
        setErrors((prev) => ({
          ...prev,
          submit: 'สมัครสมาชิกใหม่ไม่สำเร็จ กรุณาลองใหม่อีกครั้ง',
        }));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-dark md:w-[820px] py-[48px] sm:px-[72px] px-[24px] flex flex-col gap-[32px] items-center rounded-[20px]"
    >
      <p className="font-semibold text-[28px] leading-7 text[#262626] dark:text-white">
        สมัครสมาชิกใหม่
      </p>

      {errors.submit && (
        <div className="w-full px-4 py-3 rounded-lg bg-red-50 text-red-500 border border-red-200">
          {errors.submit}
        </div>
      )}
      <NotificationSuccess show={isShowNotification} title="User created successfully" />

      <div className="flex flex-col gap-[30px] w-full">
        <div className="flex w-full gap-[30px] max-md:flex-wrap">
          <TextField
            ref={fieldRefs.email}
            label="อีเมล"
            required
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            onBlur={() => handleBlur('email')}
            error={touched.email ? errors.email : ''}
          />
          <TextField
            ref={fieldRefs.username}
            label="ชื่อผู้ใช้งาน"
            required
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            onBlur={() => handleBlur('username')}
            error={touched.username ? errors.username : ''}
          />
        </div>
        <div className="flex w-full gap-[30px] max-md:flex-wrap">
          <TextField
            ref={fieldRefs.password}
            label="รหัสผ่าน"
            required
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            onBlur={() => handleBlur('password')}
            error={touched.password ? errors.password : ''}
          />
          <TextField
            ref={fieldRefs.confirm_password}
            label="ยืนยันรหัสผ่าน"
            required
            type="password"
            name="confirm_password"
            value={formData.confirm_password}
            onChange={handleInputChange}
            onBlur={() => handleBlur('confirm_password')}
            error={touched.confirm_password ? errors.confirm_password : ''}
          />
        </div>
        <div className="flex w-full gap-[30px] max-md:flex-wrap">
          <TextField
            label="ชื่อบริษัท"
            name="company"
            value={formData.company}
            onChange={handleInputChange}
          />
          <TextField
            label="สาขา"
            name="branch"
            value={formData.branch}
            onChange={handleInputChange}
          />
        </div>
        <div className="flex w-full gap-[30px] max-md:flex-wrap">
          <TextField
            label="เลขที่ประจำตัวผู้เสียภาษี"
            name="tax_id"
            value={formData.tax_id}
            onChange={handleInputChange}
          />
          <TextField
            label="เบอร์โทร"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
          />
        </div>
        <div className="flex w-full gap-[30px] max-md:flex-wrap">
          <TextField
            label="ที่อยู่"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
          />
        </div>
        <div className="flex w-full gap-[30px] max-md:flex-wrap">
          <TextField
            label="แขวง/ตำบล"
            name="sub_district"
            value={formData.sub_district}
            onChange={handleInputChange}
          />
          <TextField
            label="เขต/อำเภอ"
            name="district"
            value={formData.district}
            onChange={handleInputChange}
          />
        </div>
        <div className="flex w-full gap-[30px] max-md:flex-wrap">
          <TextField
            label="จังหวัด"
            name="province"
            value={formData.province}
            onChange={handleInputChange}
          />
          <TextField
            label="รหัสไปรษณีย์"
            name="postal_code"
            value={formData.postal_code}
            onChange={handleInputChange}
          />
        </div>
        <div className="flex flex-col items-center gap-6 w-full">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-secondary rounded-[6px] text-[14px] leading-[14px] font-semibold py-[12px] text-white disabled:opacity-50 flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                กำลังสมัครสมาชิก...
              </>
            ) : (
              'สมัครสมาชิก'
            )}
          </button>
          <p className="text-[16px] leading-4 text-[#BEC5CF] text-center">
            ในการดำเนินการลงทะเบียนสมาชิก เว็บประกาศข่าว ท่านรับทราบและตกลงตาม
            <br />
            <span className="text-secondary hover:text-secondary/80 cursor-pointer">
              ข้อกำหนดการใช้งาน
            </span>{' '}
            และ{' '}
            <span className="text-secondary hover:text-secondary/80 cursor-pointer">
              นโยบายความเป็นส่วนตัว
            </span>{' '}
            แล้ว
          </p>
          <p className="text-[16px] leading-[16px] text-[#98A2B3] dark:text-[#D7D7D7]">
            เป็นสมาชิกอยู่แล้ว?{' '}
            <a
              href="/sign-in"
              className="text-secondary hover:text-secondary/80 transition-colors duration-200 cursor-pointer"
            >
              เข้าสู่ระบบ
            </a>
          </p>
        </div>
      </div>
    </form>
  );
}

export default Signup;

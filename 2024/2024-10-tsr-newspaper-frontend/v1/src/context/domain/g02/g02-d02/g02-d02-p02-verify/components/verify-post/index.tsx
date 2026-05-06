import { useCallback, useEffect, useState } from 'react';
import { renderDate, useFileStore } from '../../../context';
import { CartIcon, PdfIcon } from '../Icons';
import CoverPage1 from './image.png';
import CoverPage2 from './image2.png';
import PreviewPdf from '@component/web/organism/wc-o-preview-pdf';
import { getPrice  } from '@global/api/restapi/uh-get-price';
import {  uploadFile } from '../../../local/api/restapi/upload-file';
import { Link } from '@tanstack/react-router';
import StoreGlobalPersist from '@store/global/persist';
import { error, log } from 'console';
import NotificationSuccess from '@component/web/atom/notification/wc-a-notification-success';
import NotificationError from '@component/web/atom/notification/wc-a-notification-error';
import { toDateFixTH, toDateTH, toDateTimeTH } from '@global/helper/uh-date-time';

type UserProps = {
  user?: {
    email?: string;
    first_name?: string;
    last_name?: string;
  };
};
export type NotificationType = 'success' | 'error';
export interface NotificationState {
  show: boolean;
  type: NotificationType;
  title: string;
  message?: string;
}
interface PayProp {
  merchantid?: string;
  productdetail?: string;
  customeremail?: string;
  total?: string;
  refno?: string;
  cc?: string;
  lang?: string;
}
interface Price {
  price_per_page: number;
  discount: number;
  base_price_per_page: number;
  vat_tax: number;
  ad_tax: number;
}

function CreateNews({ user }: UserProps) {
  // priceprepage
  const [priceData, setPriceData] = useState<Price>({
    price_per_page: 0,
    discount: 0,
    base_price_per_page: 0,
    vat_tax: 0,
    ad_tax: 0,
  });
  const [notification, setNotification] = useState<NotificationState>({
    show: false,
    type: 'success',
    title: '',
    message: '',
  });

  useEffect(() => {
    getPrice ()
      .then((res) => {
        setPriceData(res.data);
      })
      .catch((error) => {
        console.log(`Cant not Fetching ${error}`);
      });
  }, []);

  // payment
  const [showModal, setShowModal] = useState<boolean>(false);
  const fileUpload = useFileStore();
  const [paymentDetails, setPaymentDetails] = useState<PayProp>({
    merchantid: '95750470',
    productdetail: 'ลงประกาศหนังสือพิมพ์',
    customeremail: user?.email || 'custom@gmail.com',
    total: '',
    refno: '',
    cc: '00',
    lang: 'TH',
  });
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!fileUpload.file.length) {
      setNotification({
        show: true,
        title: 'กรุณาเลือกไฟล์ก่อนอัพโหลด',
        type: 'error',
      });
      setTimeout(() => {
        setNotification((prev) => ({ ...prev, show: false }));
      }, 3000);
      return;
    }

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // ขนาดไฟล์สูงสุด 5 MB
    const oversizedFiles = fileUpload.file.filter(
      (file) => file.size > MAX_FILE_SIZE
    );
    if (oversizedFiles.length) {
      setNotification({
        show: true,
        title: `ไฟล์ต้องมีขนาดไม่เกิน 5MB`,
        type: 'error',
      });
      setTimeout(() => {
        setNotification((prev) => ({ ...prev, show: false }));
      }, 3000);
      return;
    }

    const payload = new FormData();
    payload.append('public_date', renderDate(fileUpload.date, 'yyyy-mm-dd'));
    fileUpload.file.forEach((item) => payload.append('files', item));

    await uploadFile(payload)
      .then((responseData) => {
        const { payment_number, amount } = responseData.data;

        const paymentDetails = {
          total: amount.toString(),
          refno: payment_number.toString(),
        };

        setNotification({
          show: true,
          title: 'บันทึกข้อมูลสำเร็จ! กรุณาชำระเงินเพื่อดำเนินการต่อ',
          type: 'success',
        });

        setTimeout(() => {
          fileUpload.clearState();

          setPaymentDetails(paymentDetails);
          submitForm(amount, payment_number);
        }, 3000);
      })
      .catch((error) => {
        console.error('Error:', error);
        setNotification({
          show: true,
          title: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง',
          type: 'error',
        })
        setTimeout(() => {
          setNotification((prev) => ({ ...prev, show: false }));
        }, 3000);
      });
  };

  const submitForm = (total: string, refno: string) => {
    const form = document.getElementById('paymentForm') as HTMLFormElement;

    if (!form) {
      alert('Form not found');
      return;
    }

    const totalInput = form.querySelector('[name="total"]') as HTMLInputElement;
    const refnoInput = form.querySelector('[name="refno"]') as HTMLInputElement;

    if (totalInput && refnoInput) {
      totalInput.value = total;
      refnoInput.value = refno;

      form.submit();
    } else {
      console.error("Form fields 'total' or 'refno' not found");
    }
  };

  const handleOpenModal = useCallback((input: boolean) => {
    setShowModal(input);
  }, []);


  const totalPriceBeforeDiscount = priceData.base_price_per_page * fileUpload.file.length;
  const discount = priceData.discount > 0 ? totalPriceBeforeDiscount * (priceData.discount / 100) : 0;
  const totalPrice = (totalPriceBeforeDiscount - discount);

  //ชำระเงินตั้งแต่ 1,000 บาทขึ้นไป หักภาษี ณ ที่จ่าย 2% & vat (ถ้ามี)
  const withholdingTax = totalPrice >= 1000 ? totalPrice * priceData.ad_tax : 0;
  const vat = (totalPrice * priceData.vat_tax);
  const vatfix = vat.toFixed(2)

  // ราคาสุทธิหลังหัก ณ ที่จ่าย และรวม VAT (ถ้ามี)
  const netPrice = totalPrice - withholdingTax + vat;
  const formattedDate = renderDate(fileUpload.date, 'dd/mm/yyyy');
  const thaiDate = toDateFixTH(formattedDate);

  return (
    <div className="flex justify-center py-20 px-4 lg:px-20 mb-20">
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
      <div className="bg-white dark:bg-[#262626] py-[55px] md:px-[52px] px-[27px] rounded-[20px] flex flex-col gap-[58px] w-full max-w-[760px] items-center drop-shadow">
        <p className="font-semibold text-[24px] sm:text-[40px] leading-[40px] text-[#101828] dark:text-white">
          ลงประกาศหนังสือพิมพ์
        </p>

        <div className="flex flex-col gap-[40px] w-full">
          <div className="flex flex-col-reverse md:justify-between md:flex-row gap-[28px]">
            <div className="flex flex-col gap-[28px] md:gap-24">
              <div className="space-y-6">
                <p className="text-[16px] leading-4 text-[#414141] dark:text-[#D7D7D7]">
                  ชื่อไฟล์
                </p>
                <div className="flex flex-col gap-2">
                  {fileUpload.filesName.map((item) => (
                    <div className="border-[1px] rounded-[6px] w-[250px] py-[17px] px-[8px] flex gap-4 items-center border-black">
                      <PdfIcon />
                      <p className="text-[14px] leading-[14px] text-[#D7D7D8] line-clamp-1">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <p className="text-[16px] leading-4 text-[#414141] dark:text-[#D7D7D7]">
                  วันที่ลงประกาศ
                </p>
                <div className="border-1 rounded-[6px] w-[150px] py-[17px] flex gap-4 items-center border-[1px] px-4 border-black">
                  <p className="text-[14px] leading-[14px] text-[#D7D7D8]">
                    {thaiDate}
                  </p>
                </div>
              </div>
            </div>
            <div
              className={`md:max-w-[20rem] overflow-auto max-h-[445px] md:flex-col w-full ${fileUpload.file.length > 1 ? 'grid grid-cols-2 gap-2' : 'flex'}`}
              onClick={() => handleOpenModal(true)}
            >
              {fileUpload.file.map((item) => (
                <img src={URL.createObjectURL(item)} className="border-black border-2" />
              ))}
            </div>
          </div>
        </div>
        <div className="mt-10 w-full flex flex-col gap-8">
          <p className="text-[16px] leading-4 flex items-center gap-2 dark:text-[#D7D7D7]">
            <CartIcon /> ข้อมูลการชำระเงิน
          </p>
          <div className="flex flex-col w-full gap-3">
            <div className="flex justify-between w-full text-[16px] leading-4 text-[#858585]">
              <p>รวมทั้งหมด (บาท)</p>
              <p>฿{totalPriceBeforeDiscount}</p>
            </div>
            <div className="flex justify-between w-full text-[16px] leading-4 text-[#858585]">
              <p>ส่วนลด {priceData.discount}% (บาท)</p>
              <p>- ฿{discount}</p>
            </div>
            {priceData.vat_tax == 0 ? (
              <div className="flex justify-between w-full text-[24px] leading-6 font-medium text-secondary">
              </div>
            ) : (
              <div className="flex justify-between w-full text-[16px] leading-4 text-[#858585]">
                <p>อัตราภาษีร้อยละ {Math.round(priceData.vat_tax * 100)}% </p>
                <p>฿{vatfix}</p>
              </div>
            )}
            <div className="flex justify-between w-full text-[24px] leading-6 font-medium text-secondary">
              <p>ราคาสุทธิที่ต้องชำระ (บาท)</p>
              <p>฿{netPrice}</p>
            </div>
            <p className="text-[#9096a28e] text-[12px] leading-[14px] dark:text-white">
              <span className="text-[#D83636]">*</span>กรณีชำระเงินตั้งแต่ 1,000 บาทขึ้นไป
              หักภาษี ณ ที่จ่าย 2%
            </p>
          </div>
        </div>
        <form
          id="paymentForm"
          method="post"
          action="https://payments.paysolutions.asia/payment"
          className="payment-form"
          onSubmit={handleSubmit}
        >
          <div className="hidden">
            <div>
              <label htmlFor="total">Amount:</label>
              <input type="hidden" name="total" value={paymentDetails.total} />
            </div>
            <div>
              <label htmlFor="refno">Ref No:</label>
              <input type="hidden" name="refno" value={paymentDetails.refno} />
            </div>
            <div>
              <label htmlFor="merchantid">Merchant ID:</label>
              <input
                type="text"
                id="merchantid"
                name="merchantid"
                value={paymentDetails.merchantid}
                readOnly
                hidden
              />
            </div>
            <div>
              <label htmlFor="customeremail">Customer Email:</label>
              <input
                type="text"
                id="customeremail"
                name="customeremail"
                value={paymentDetails.customeremail}
                readOnly
                hidden
              />
            </div>
            <div>
              <label htmlFor="productdetail">Product Detail:</label>
              <input
                type="text"
                id="productdetail"
                name="productdetail"
                value={paymentDetails.productdetail}
                readOnly
                hidden
              />
            </div>
            <div>
              <label htmlFor="cc">CC:</label>
              <input
                type="text"
                id="cc"
                name="cc"
                value={paymentDetails.cc}
                readOnly
                hidden
              />
            </div>
            <div>
              <label htmlFor="lang">Language:</label>
              <input
                type="text"
                id="lang"
                name="lang"
                value={paymentDetails.lang}
                readOnly
                hidden
              />
            </div>
          </div>
          <div className="flex gap-4">
            <button
              type="submit"
              className="w-[152px] h-[38px] text-[14px] rounded-[6px] px-[12px] gap-[16px] bg-secondary flex items-center justify-center disabled:bg-[#D7D7D8] text-white font-bold"
            >
              ชำระเงิน
            </button>
            <Link
              className="w-[86px] h-[38px] rounded-[6px] px-[12px] gap-[16px] bg-[#CC3333] flex items-center justify-center disabled:bg-[#D7D7D8]"
              to={'/post'}
            >
              <p className="font-bold text-[14px] leading-[20.61px] text-[#FBFBFB] text-center">
                แก้ไข
              </p>
            </Link>
          </div>
        </form>
      </div>
      {showModal && (
        <PreviewPdf
          data={fileUpload.file.map((item) => ({ src: URL.createObjectURL(item) }))}
          handleOpenModal={handleOpenModal}
        />
      )}
    </div>
  );
}

export default CreateNews;

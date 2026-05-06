import { useEffect, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
// import DownloadIcon from './../icon/download.svg';
import {
  NotificationState
} from '@component/web/atom/notification/type';
import NotificationError from '@component/web/atom/notification/wc-a-notification-error';
import NotificationSuccess from '@component/web/atom/notification/wc-a-notification-success';
import Pagination from '@component/web/atom/pagination/wc-pagination';
import PDFDownloadFile from '@component/web/template/cc-t-unified-billing-receipt';
import { getPrice } from '@global/api/restapi/uh-get-price';
import { toDateTimeTH } from '@global/helper/uh-date-time';
import {
  pdf,
  PDFViewer
} from '@react-pdf/renderer';
import { useNavigate } from '@tanstack/react-router';
import { th } from 'date-fns/locale/th';
import { saveAs } from 'file-saver';
import { registerLocale } from 'react-datepicker';
import { exportCSVPayment } from '../../../local/api/restapi/get-csv-payment';
import { GetInvoice } from '../../../local/api/restapi/get-invoice';
import { GetPayment } from '../../../local/api/restapi/get-payment';
import DateRangeSelectorUTC from '../../../local/component/web/DateRangeSelectorUTC';
import DownloadIcon from '../../../local/icon/Download';
import { Invoice, Payment } from '../../../local/type';
registerLocale('th', th);

export interface Pagination {
  limit: number;
  page: number;
  total: number;
}
interface Price {
  price_per_page: number;
  discount: number;
  base_price_per_page: number;
  vat_tax: number;
  ad_tax: number;
}

export default function PaymentHistory() {
  const navigate = useNavigate();
  const [paymentListData, setPaymentListData] = useState<Payment[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [notification, setNotification] = useState<NotificationState>({
    show: false,
    type: 'success',
    title: '',
    message: '',
  });
  const [isLoading, setIsLoading] = useState(true);

  const [showPDFViewer, setShowPDFViewer] = useState(false);
  const [pdfData, setPdfData] = useState<Invoice | undefined>(undefined);

  const handlePreviewPDF = async (receiptNumber: number | undefined) => {
    if (!receiptNumber) return;
    const invoiceListData = await handleDownload(receiptNumber.toString());
    setPdfData(invoiceListData);
    setShowPDFViewer(true);
  };

  useEffect(() => {
    fetchPayments(currentPage);
  }, [currentPage, startDate, endDate]);

  const handleDownload = async (paymentNumber: string): Promise<Invoice> => {
    let res: any = {};

    try {
      res = await GetInvoice(paymentNumber);
    } catch (err: any) {
      console.error('Error fetching invoice:', err);
    }

    if (!res.data) {
      console.error('Error fetching invoice:');
    }

    return res.data;
  };
  const formatDate = (date: Date | null) =>
    date ? date.toISOString().split('T')[0] : '';
  const fetchPayments = (page: number) => {
    GetPayment({
      page,
      limit: itemsPerPage,
      start_date: formatDate(startDate),
      end_date: formatDate(endDate),
    })
      .then((res) => {
        if (res.data.length === 0) {
          setNotification({
            show: true,
            title: 'ไม่มีข้อมูลในช่วงวันที่ที่เลือก',
            type: 'error',
          });
          setTimeout(() => {
            setNotification((prev) => ({ ...prev, show: false }));
          }, 3000);
        }
        setPaymentListData(res.data);
        setTotalItems(res._pagination.total_count);
        if (res.status_code === 401) {
          navigate({ to: '../../sign-in' });
        }
      })
      .catch((err) => {
        console.error('Error fetching announcements:', err);
      });
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalItems) {
      setCurrentPage(page);
    }
  };
  const [priceData, setPriceData] = useState<Price>({
    price_per_page: 0,
    discount: 0,
    base_price_per_page: 0,
    vat_tax: 0,
    ad_tax: 0,
  });

  useEffect(() => {
    getPrice()
      .then((res) => {
        setPriceData(res.data);
      })
      .catch((error) => {
        console.log(`Cant not Fetching ${error}`);
      });
  }, []);

  const billingPDFDownload = async (receiptNumber: number | undefined) => {
    try {
      const invoiceListData = await handleDownload(
        receiptNumber ? receiptNumber.toString() : '',
      );
      const blob = await pdf(
        <PDFDownloadFile
          invoiceListData={invoiceListData}
          priceData={priceData}
          type="billing"
        />,
      ).toBlob();
      saveAs(blob, `Billing_${receiptNumber}`);
      setNotification({
        show: true,
        title: 'ดาวน์โหลดใบแจ้งหนี้สำเร็จ',
        type: 'success',
      });
    } catch (error) {
      console.error(error);
      setNotification({
        show: true,
        title: 'เกิดข้อผิดพลาดในการดาวน์โหลด กรุณาลองใหม่อีกครั้ง',
        type: 'error',
      });
    } finally {
      setTimeout(() => {
        setNotification((prev) => ({ ...prev, show: false }));
      }, 3000);
    }
  };
  const ReceiptPDFDownload = async (receiptNumber: number | undefined) => {
    try {
      const invoiceListData = await handleDownload(
        receiptNumber ? receiptNumber.toString() : '',
      );
      const blob = await pdf(
        <PDFDownloadFile
          invoiceListData={invoiceListData}
          priceData={priceData}
          type="receipt"
        />,
      ).toBlob();
      saveAs(blob, `Invoice_${receiptNumber}`);
      setNotification({
        show: true,
        title: 'ดาวน์โหลดใบเสร็จรับเงินสำเร็จ',
        type: 'success',
      });
    } catch (error) {
      console.error(error);
      setNotification({
        show: true,
        title: 'เกิดข้อผิดพลาดในการดาวน์โหลด กรุณาลองใหม่อีกครั้ง',
        type: 'error',
      });
    } finally {
      setTimeout(() => {
        setNotification((prev) => ({ ...prev, show: false }));
      }, 3000);
    }
  };

  const exportCSV = async () => {
    if (paymentListData?.length === 0) {
      setNotification({
        show: true,
        title: 'ไม่มีข้อมูลสำหรับการดาวน์โหลด',
        type: 'error',
      });
      setTimeout(() => {
        setNotification((prev) => ({ ...prev, show: false }));
      }, 3000);
      return;
    }
    try {
      await exportCSVPayment(formatDate(startDate), formatDate(endDate));
      setNotification({
        show: true,
        title: 'ดาวน์โหลด CSV สำเร็จ',
        type: 'success',
      });
    } catch (err: any) {
      setNotification({
        show: true,
        title: 'เกิดข้อผิดพลาดในการดาวน์โหลด กรุณาลองใหม่อีกครั้ง',
        type: 'error',
      });
      console.error('Error fetching payment:', err);
    } finally {
      setTimeout(() => {
        setNotification((prev) => ({ ...prev, show: false }));
      }, 3000);
    }
  };

  return (
    <section>
      {/* pdf preview */}

      {showPDFViewer && pdfData && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 z-50 flex flex-col items-center justify-center">
          <div className="bg-white rounded-lg w-[80%] h-[90%] relative shadow-lg">
            <button
              onClick={() => setShowPDFViewer(false)}
              className="absolute top-2 right-2 text-black font-bold"
            >
              ✕
            </button>
            <PDFViewer width="100%" height="100%">
              <PDFDownloadFile
                invoiceListData={pdfData}
                priceData={priceData}
                type="billing"
              />
            </PDFViewer>
          </div>
        </div>
      )}

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

      <div className="w-full flex flex-col md:flex-row md:justify-between md:items-center md:mb-[53px]">
        <h3 className="text-[#101828] dark:text-white font-semibold text-2xl mb-[15px] md:mb-0">
          ประวัติการชำระเงิน
        </h3>
        <div
          className={`w-[120px] h-10 border border-solid rounded-lg  ${
            paymentListData.length === 0
              ? 'border-gray-300 text-gray-300 cursor-not-allowed'
              : 'border-[#D0D5DD] text-black cursor-pointer '
          } flex items-center justify-center `}
          onClick={paymentListData.length > 0 ? exportCSV : undefined}
        >
          <div className="text-sm leading-[14px] font-medium text-black dark:text-white">
            ดาวน์โหลด CSV
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-y-4 w-full mb-5 xl:mt-0 mt-5">
        <p className="text-sm font-normal text-[#344054] dark:text-[#D7D7D7]">
          ช่วงวันที่สั่งซื้อ
        </p>
        <div className="flex gap-x-[9px] items-center">
          <div className="relative w-[150px]">
            <DateRangeSelectorUTC
              label="ตั้งแต่วันที่"
              value={startDate}
              onChange={setStartDate}
              maxDate={endDate}
            />
          </div>
          <div className="relative w-[150px]">
            <DateRangeSelectorUTC
              label="จนถึงวันที่"
              value={endDate}
              onChange={setEndDate}
              minDate={startDate}
            />
          </div>
        </div>
      </div>

      <div className="w-full min-h-[650px]">
        <div className="relative overflow-x-auto dark-scrollbar">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-sm font-semibold bg-[#D9A84E] text-white">
              <tr className='text-center'>
                <th className="px-2 overflow-hidden text-ellipsis whitespace-nowrap">วันที่สั่งซื้อ</th>
                <th className="px-2 overflow-hidden text-ellipsis whitespace-nowrap">หมายเลขสั่งซื้อ</th>
                <th className="px-2 overflow-hidden text-ellipsis whitespace-nowrap">เลขที่ใบเสร็จ</th>
                <th className="px-2 overflow-hidden text-ellipsis whitespace-nowrap">จำนวนเงิน</th>
                <th className="px-2 overflow-hidden text-ellipsis whitespace-nowrap">ใบแจ้งหนี้</th>
                <th className="px-2 text-center py-[14px] overflow-hidden text-ellipsis whitespace-nowrap">ใบเสร็จรับเงิน</th>
              </tr>
            </thead>
            <tbody>
              {paymentListData?.length > 0 ? (
                paymentListData.map((item) => (
                  <tr
                    key={item.id}
                    className="align-middle text-center  bg-white text-black dark:text-white dark:bg-[#262626] border-b  px-2 dark:border-[#DBDBDB] hover:bg-[#FFFBF3] dark:hover:bg-black"
                  >
                    <td className="py-[14px] overflow-hidden text-ellipsis whitespace-nowrap">
                      {toDateTimeTH(item.order_date || '-')}
                    </td>
                    <td
                      className="overflow-hidden text-ellipsis whitespace-nowrap px-2"
                      title={item.order_number}
                    >
                      {item.order_number || '-'}
                    </td>
                    <td className="py-[14px] overflow-hidden text-ellipsis whitespace-nowrap px-2">
                      {item.receipt_number || <div className="">-</div>}
                    </td>
                    <td className="py-[14px] overflow-hidden text-ellipsis whitespace-nowrap px-2">{item.price}</td>
                    <td className="text-center py-[14px]">
                      <button
                        onClick={() => billingPDFDownload(item.receipt_number)}
                        className={`overflow-hidden text-ellipsis whitespace-nowrap px-2 ${
                          item.receipt_number === null
                            ? 'cursor-not-allowed opacity-50 text-[#D7D7D7]'
                            : 'text-[#D9A84E]'
                        }`}
                                                disabled={item.receipt_number === null}
                      >
                        <DownloadIcon />
                      </button>
                    </td>
                    <td className="text-center py-[14px]">
                      <button
                        onClick={() => ReceiptPDFDownload(item.receipt_number)}
                        className={` ${item.receipt_number === null ? 'cursor-not-allowed opacity-50 text-[#D7D7D7]' : 'text-[#D9A84E]'} `}
                        disabled={item.receipt_number === null}
                      >
                        <DownloadIcon />
                      </button>
                    </td>
                    {/* pdf preview */}
                    {/* <td className="text-center py-[14px]">
                      <button
                        onClick={() => handlePreviewPDF(item.receipt_number)}
                        className={` ${item.receipt_number === null ? 'cursor-not-allowed opacity-50 text-[#D7D7D7]' : 'text-blue-500 underline'} `}
                        disabled={item.receipt_number === null}
                      >
                        แสดง PDF
                      </button>
                    </td> */}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-[14px]">
                    ไม่มีข้อมูล
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        onPageChange={handlePageChange}
      />
    </section>
  );
}

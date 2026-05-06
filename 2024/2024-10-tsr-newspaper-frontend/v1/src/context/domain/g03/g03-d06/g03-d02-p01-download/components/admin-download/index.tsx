import { useEffect, useState } from 'react';
import {
  AnnouncementListParams,
  getAnnouncementList,
  IAnnouncement,
} from '../../../local/api/restapi/annoucement';
import DownloadIcon from '../icon/download.svg';
import DateRangeSelector from '@domain/g02/g02-d01/local/component/web/DateRangeSelector';
import InputSearch from '../input-search';
import NotificationSuccess from '@component/web/atom/notification/wc-a-notification-success';
import NotificationError from '@component/web/atom/notification/wc-a-notification-error';
import logoPKK from '@asset/Logo/Logo_TSR_Light.png';

import { toDateTimeTH, toDateTH } from '@global/helper/uh-date-time';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
  PDFViewer,
  Image,
  pdf,
} from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { Table, TD, TH, TR } from '@ag-media/react-pdf-table';
import { styles } from '../invoice-style';
import ThaiBahtText from 'thai-baht-text';

import { Invoice } from '@domain/g03/g03-d06/local/type';
import { GetInvoice } from '@domain/g03/g03-d06/local/api/restapi/get-invoice';
import NoData from '../nodata';
import Pagination from '@component/web/atom/pagination/wc-pagination';
import { getPrice } from '@global/api/restapi/uh-get-price';
import PDFDownloadFile from '@component/web/template/cc-t-unified-billing-receipt';
import {
  NotificationState,
  NotificationType,
} from '@component/web/atom/notification/type';

const TableSkeleton = () => (
  <>
    {[...Array(10)].map((_, index) => (
      <tr
        key={index}
        className="animate-pulse bg-white dark:bg-[#262626] border-b dark:border-b-[#DBDBDB]"
      >
        <td className="w-[147px] py-[14px] px-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </td>
        <td className="w-[105px] py-[14px] px-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </td>
        <td className="w-[112px] py-[14px] px-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </td>
        <td className="w-[142px] py-[14px] px-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mx-auto"></div>
        </td>
        <td className="w-[142px] py-[14px] px-2">
          <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded mx-auto"></div>
        </td>
        <td className="w-[142px] py-[14px] px-2">
          <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded mx-auto"></div>
        </td>
      </tr>
    ))}
  </>
);

interface Price {
  price_per_page: number;
  discount: number;
  base_price_per_page: number;
  vat_tax: number;
  ad_tax: number;
}

const AdminDownload: React.FC = () => {
  const [data, setData] = useState<IAnnouncement[]>([]);

  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [notification, setNotification] = useState<NotificationState>({
    show: false,
    type: 'success',
    title: '',
    message: '',
  });

  const itemsPerPage = 10;
  const [showPDFViewer, setShowPDFViewer] = useState(false);
  const [pdfData, setPdfData] = useState<Invoice | undefined>(undefined);

  const handlePreviewPDF = async (receiptNumber: string | undefined) => {
    if (!receiptNumber) return;
    const invoiceListData = await handleDownload(receiptNumber);
    setPdfData(invoiceListData);
    setShowPDFViewer(true);
  };

  useEffect(() => {
    const params: AnnouncementListParams = {
      page: currentPage,
      limit: itemsPerPage,
      search: searchTerm.trim() || undefined,
      start_created_date: formatDateToISO(startDate),
      end_created_date: formatDateToISO(endDate),
    };
    fetchData(params);
  }, [currentPage, searchTerm, startDate, endDate]);

  const fetchData = async (params: AnnouncementListParams) => {
    try {
      setIsLoading(true);
      const cleanEmail = params.search?.trim() ?? '';
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail);

      if (isEmail) {
        params = {
          ...params,
          page: 1,
          limit: 9999,
          search: undefined,
        };

        const response = await getAnnouncementList(params);

        const filteredData = response.data.data.filter(
          (item) => item.user_email.toLowerCase().trim() === cleanEmail.toLowerCase(),
        );

        setData(filteredData);
        setTotalItems(filteredData.length);
        if (filteredData.length === 0) {
          setNotification({
            show: true,
            type: 'error',
            title: 'ไม่พบข้อมูลในวันที่เลือก',
          });
        }
      } else {
        const response = await getAnnouncementList(params);

        setData(response.data.data);
        setTotalItems(response.data.total);
        if (response.data.data.length === 0) {
          setNotification({
            show: true,
            type: 'error',
            title: 'ไม่พบข้อมูลในวันที่เลือก',
          });
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setNotification({
        show: true,
        title: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        setNotification((prev) => ({ ...prev, show: false }));
      }, 3000);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    fetchData({
      page: 1,
      limit: itemsPerPage,
      search: value,
      start_created_date: formatDateToISO(startDate),
      end_created_date: formatDateToISO(endDate),
    });
    setCurrentPage(1);
  };

  const handleDateChange = (start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);

    fetchData({
      page: 1,
      limit: itemsPerPage,
      search: searchTerm,
      start_created_date: formatDateToISO(start),
      end_created_date: formatDateToISO(end),
    });
    setCurrentPage(1);
  };

  const formatDateToISO = (date: Date | null): string | undefined => {
    if (!date) return undefined;

    // ปรับวันที่ให้เป็น timezone
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
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

  const billingPDFDownload = async (receiptNumber: string | undefined) => {
    try {
      const receiptId = receiptNumber?.toString() || '';
      const invoiceListData = await handleDownload(receiptId);
      if (!invoiceListData) {
        throw new Error('ไม่มีข้อมูลใบแจ้งหนี้');
      }
      const blob = await pdf(
        <PDFDownloadFile
          invoiceListData={invoiceListData}
          priceData={priceData}
          type="billing"
        />,
      ).toBlob();
      saveAs(blob, `Billing_${receiptId}`);
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
  const InvoicePDFDownload = async (receiptNumber: string | undefined) => {
    try {
      const receiptId = receiptNumber?.toString() || '';
      const invoiceListData = await handleDownload(receiptId);
      if (!invoiceListData) {
        throw new Error('ไม่มีข้อมูลใบเสร็จรับเงิน');
      }
      const blob = await pdf(
        <PDFDownloadFile
          invoiceListData={invoiceListData}
          priceData={priceData}
          type="receipt"
        />,
      ).toBlob();
      saveAs(blob, `Invoice_${receiptId}`);
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
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const renderTableContent = () => {
    if (isLoading) {
      return <TableSkeleton />;
    }

    if (data.length === 0) {
      return <NoData />;
    }
    console.log(data);

    return data.map((item) => (
      <tr
        key={item.id}
        className="align-middle text-center bg-white dark:bg-[#262626] border-b dark:border-b-[#DBDBDB] hover:bg-[#FFFBF3] dark:hover:bg-[#281E0B] transition-colors duration-200"
      >
        <td className="py-[14px] text-[#000000] dark:text-white  whitespace-pre">
          {toDateTimeTH(item.created_at)}
        </td>
        <td className=" text-[#000000] dark:text-[#D7D7D7]  ">{item.no}</td>
        <td className=" text-[#000000] dark:text-[#D7D7D7] ">{item.user_email}</td>
        <td className="  text-[#000000] dark:text-[#D7D7D7]">{item.net_amount}</td>
        <td className=" ">
          <div className="flex justify-center">
            <button
              onClick={() => billingPDFDownload(item.no)}
              disabled={item.status === 'draft' || item.status === 'cancelled'}
              className=" rounded transition-transform duration-200
            text-[#D9A84E] hover:scale-110
            disabled:text-gray-300 disabled:hover:scale-100"
            >
              <DownloadIcon />
            </button>
          </div>
        </td>

        {/* Invoice Download Button */}
        <td className="">
          <div className="flex justify-center">
            <button
              onClick={() => InvoicePDFDownload(item.no)}
              disabled={item.status === 'draft' || item.status === 'cancelled'}
              className="p-2 rounded transition-transform duration-200
            text-[#D9A84E] hover:scale-110
            disabled:text-gray-300  disabled:hover:scale-100"
            >
              <DownloadIcon />
            </button>
          </div>

          {/* pdf preview */}
          {/* <td className="text-center py-[14px]">
            <button
              onClick={() => handlePreviewPDF(item.no)}
              className={` ${item.no === null ? 'cursor-not-allowed opacity-50 text-[#D7D7D7]' : 'text-blue-500 underline'} `}
              disabled={item.no === null}
            >
              แสดง PDF
            </button>
          </td> */}
        </td>
      </tr>
    ));
  };
  return (
    <div className="flex flex-col">
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
          ดาวน์โหลดใบแจ้งหนี้และใบเสร็จ
        </h3>
      </div>
      <div className="flex flex-col gap-y-4 lg:flex-row gap-x-[74px] items-start">
        <div className="flex flex-col gap-y-4 mb-[20px] md:mb-12">
          <div className="flex gap-[9px] flex-col sm:flex-row">
            <div className="flex gap-x-[9px]">
              <DateRangeSelector
                label="ตั้งแต่วันที่"
                value={startDate}
                onChange={setStartDate}
                minDate={endDate}
              />
              <DateRangeSelector
                label="จนถึงวันที่"
                value={endDate}
                onChange={setEndDate}
                minDate={startDate}
              />
            </div>
            <div className=" w-fit">
              <InputSearch
                placeholder="ค้นหา"
                value={searchTerm}
                onChange={handleSearch}
                onSearch={handleSearch}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="xl:max-w-[954px]">
        <div className="relative overflow-x-auto dark-scrollbar">
          <table className="w-[954px] text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-sm font-semibold leading-[14px] bg-[#D9A84E] text-white">
              <tr className="text-center align-middle">
                <th scope="col" className="col-span-1 py-[14px]">
                  วันที่สั่งซื้อ
                </th>
                <th scope="col" className="col-span-1 py-[14px]">
                  หมายเลขสั่งซื้อ
                </th>
                <th scope="col" className="col-span-1 py-[14px]">
                  อีเมลของผู้ใช้งาน
                </th>
                <th scope="col" className="col-span-1 py-[14px] text-center">
                  จำนวนเงิน
                </th>
                <th scope="col" className="col-span-1 text-center py-[14px]">
                  ใบแจ้งหนี้
                </th>
                <th scope="col" className="col-span-1 text-center py-[14px]">
                  ใบเสร็จรับเงิน
                </th>
              </tr>
            </thead>
            <tbody className="transition-opacity duration-150">
              {renderTableContent()}
            </tbody>
          </table>
        </div>
        {!isLoading && data.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default AdminDownload;

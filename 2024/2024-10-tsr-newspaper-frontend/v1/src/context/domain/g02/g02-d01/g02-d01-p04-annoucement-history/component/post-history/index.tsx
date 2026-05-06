// import TableCustom from './TableCustom';
import { NotificationState } from '@component/web/atom/notification/type';
import NotificationError from '@component/web/atom/notification/wc-a-notification-error';
import NotificationSuccess from '@component/web/atom/notification/wc-a-notification-success';
import Pagination from '@component/web/atom/pagination/wc-pagination';
import { GetAnnouncementList } from '@domain/g02/g02-d01/local/api/restapi/get-annoucement';
import { CSVAnnoucement } from '@domain/g02/g02-d01/local/api/restapi/get-csv-annoucement';
import { styles } from '@domain/g02/g02-d01/local/component/Invoice';
import DateRangeSelectorUTC from '@domain/g02/g02-d01/local/component/web/DateRangeSelectorUTC';
import { toDateTH, toDateTimeTH } from '@global/helper/uh-date-time';
import { Document, Image, Page, pdf, Text, View } from '@react-pdf/renderer';
import { useNavigate } from '@tanstack/react-router';
import { saveAs } from 'file-saver';
import { useEffect, useState } from 'react';

import DownloadIcon from './icon/download.svg';


export enum AnnouncementStatus {
  APPROVED = 'approved',
  WAITING_APPROVAL = 'waiting_approval',
  REJECTED = 'rejected',
}

export interface Announcement {
  id?: number;
  no?: string;
  public_date?: string;
  title?: string;
  image_url_list?: [];
  status?: string;
  created_at?: string;
}
export interface Pagination {
  limit: number;
  page: number;
  total_count: number;
}

interface ResponseData {
  status_code: number;
  _pagination: Pagination;
  data: Announcement[];
  message: string;
}

export default function PostHistory() {
  const navigate = useNavigate();
  const [announcementListData, setAnnouncementListData] = useState<Announcement[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(1);
  const itemsPerPage = 10;
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [publicstartDate, setPublicstartDate] = useState<Date | null>(null);
  const [publicendDate, setPublicendDate] = useState<Date | null>(null);
  const [notification, setNotification] = useState<NotificationState>({
    show: false,
    type: 'success',
    title: '',
    message: '',
  });
  const [loadingState, setLoadingState] = useState<{ [key: number]: boolean }>({});
  useEffect(() => {
    Announcements(currentPage);
  }, [currentPage, startDate, endDate, publicstartDate, publicendDate]);

  const formatDate = (date: Date | null) =>
    date ? date.toISOString().split('T')[0] : '';

  const Announcements = (page: number) => {
    GetAnnouncementList({
      page,
      limit: itemsPerPage,
      created_at_start_date: formatDate(startDate),
      created_at_end_date: formatDate(endDate),
      public_start_date: formatDate(publicstartDate),
      public_end_date: formatDate(publicendDate),
    })
      .then((res) => {
        if (res) {
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
          setAnnouncementListData(res.data);
          setTotalItems(res._pagination.total_count);
        } else {
          console.error('No data received or error occurred');
        }
      })
      .catch((err) => {
        console.error('Error fetching announcements:', err);
      });
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startPage = Math.max(1, currentPage - 1);
  const endPage = Math.min(totalPages, currentPage + 1);
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalItems) {
      setCurrentPage(page);
    }
  };

  const PDFDownload = async (announcementId: number) => {
    setLoadingState((prev) => ({ ...prev, [announcementId]: true }));
    try {
      if (typeof announcementId !== 'number') {
        throw new Error('ID ต้องเป็นตัวเลข');
      }

      const selectedAnnouncement = announcementListData.find(
        (announcement) => announcement.id === announcementId,
      );

      if (!selectedAnnouncement) {
        throw new Error('ไม่พบประกาศที่เลือก');
      }

      const blob = await pdf(
        <AnnouncementPDF announcementListData={selectedAnnouncement} />,
      ).toBlob();

      saveAs(blob, `Announcement_${selectedAnnouncement.no}.pdf`);

      setNotification({
        show: true,
        title: 'ดาวน์โหลดประกาศสำเร็จ',
        type: 'success',
      });
    } catch (error) {
      console.error('Error downloading PDF:', error);
      setNotification({
        show: true,
        title: 'เกิดข้อผิดพลาดในการดาวน์โหลด กรุณาลองใหม่อีกครั้ง',
        type: 'error',
      });
    } finally {
      setLoadingState((prev) => ({ ...prev, [announcementId]: false }));
      setTimeout(() => {
        setNotification((prev) => ({ ...prev, show: false }));
      }, 3000);
    }
  };

  const handleButtonClick = (itemId: number) => {
    if (itemId) {
      PDFDownload(itemId);
    } else {
      console.error('ID ของประกาศไม่ถูกต้อง');
    }
  };

  // ดาวโหลดเป็นรูป
  // const handleDownloadInvoice = async (invoiceNumber: string, imageUrlList: string[]) => {
  //   try {
  //     const image_url_list = imageUrlList || [];
  //     if (image_url_list.length > 0) {
  //       for (let i = 0; i < image_url_list.length; i++) {
  //         const url = image_url_list[i];
  //         const filename = `Announcement-${invoiceNumber}-${i + 1}.png`;
  //         await downloadFile(url, filename);
  //       }
  //     }
  //     setNotification({
  //       show: true,
  //       title: 'ดาวน์โหลดประกาศสำเร็จ',
  //       type: 'success',
  //     });
  //   } catch (error) {
  //     console.error('Error handling download:', error);
  //     setNotification({
  //       show: true,
  //       title: 'เกิดข้อผิดพลาดในการดาวน์โหลด กรุณาลองใหม่อีกครั้ง',
  //       type: 'error',
  //     });
  //   } finally {
  //     setTimeout(() => {
  //       setNotification((prev) => ({ ...prev, show: false }));
  //     }, 3000);
  //   }
  // };

  const exportCSV = async () => {
    if (announcementListData.length === 0) {
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
      await CSVAnnoucement(
        formatDate(startDate),
        formatDate(endDate),
        formatDate(publicstartDate),
        formatDate(publicendDate),
      );
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
      console.error('Error fetching annoucement:', err);
    } finally {
      setTimeout(() => {
        setNotification((prev) => ({ ...prev, show: false }));
      }, 3000);
    }
  };

  return (
    <section>
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
          ประกาศของฉัน
        </h3>
        <div
          className={`w-[120px] h-10 border border-solid rounded-lg ${
            announcementListData.length === 0
              ? 'border-gray-300 text-gray-300 cursor-not-allowed'
              : 'border-[#D0D5DD] text-black cursor-pointer'
          } flex items-center justify-center`}
          onClick={announcementListData.length > 0 ? exportCSV : undefined}
        >
          <div className="text-sm leading-[14px] font-medium dark:text-white">
            ดาวน์โหลด CSV
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-y-4 lg:flex-row gap-x-[74px] mt-3 xl:mt-0">
        <div className="flex flex-col gap-y-4 w-fit md:mb-5">
          <p className="text-sm font-normal text-[#344054] dark:text-[#D7D7D7]">
            ช่วงวันที่ทำรายการ
          </p>
          <div className="flex gap-x-[9px]">
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
        <div className="flex flex-col gap-y-4 w-fit mb-5">
          <p className="text-sm font-normal text-[#344054] dark:text-[#D7D7D7]">
            ช่วงวันที่ลงประกาศ
          </p>
          <div className="flex gap-x-[9px]">
            <div className="relative w-[150px]">
              <DateRangeSelectorUTC
                label="ตั้งแต่วันที่"
                value={publicstartDate}
                onChange={setPublicstartDate}
                maxDate={publicendDate}
              />
            </div>
            <div className="relative w-[150px]">
              <DateRangeSelectorUTC
                label="จนถึงวันที่"
                value={publicendDate}
                onChange={setPublicendDate}
                minDate={publicstartDate}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="w-full min-h-[650px]">
        <div className="relative  overflow-x-auto dark-scrollbar ">
          <table className="w-full  text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-sm font-semibold bg-[#D9A84E] text-white">
              <tr className='text-center items-center'>
                <th className="">วันที่ทำรายการ</th>
                <th className="">เลขที่ประกาศ</th>
                <th className="">วันที่ลงประกาศ</th>
                <th className="">หน้า</th>
                <th className="">สถานะ</th>
                <th className="text-center py-[14px]">ดาวน์โหลดประกาศ</th>
              </tr>
            </thead>
            <tbody>
              {announcementListData?.length > 0 ? (
                announcementListData.map((item) => (
                  <tr
                    key={item.id}
                    className="text-center bg-white text-black dark:text-white dark:bg-[#262626] border-b dark:border-[#DBDBDB] hover:bg-[#FFFBF3] dark:hover:bg-black"
                  >
                    <td className="  overflow-hidden text-ellipsis whitespace-nowrap px-2">
                      {toDateTimeTH(item.created_at || '-')}
                    </td>
                    <td className=" overflow-hidden text-ellipsis whitespace-nowrap px-2">{item.no}</td>
                    <td className=" overflow-hidden text-ellipsis whitespace-nowrap px-2">{toDateTH(item.public_date || '-')}</td>
                    <td className="flex justify-center overflow-hidden text-ellipsis whitespace-nowrap px-2">
                      {item.image_url_list?.length || '-'}
                    </td>
                    <td className="py-[14px] text-center overflow-hidden text-ellipsis whitespace-nowrap px-2">
                      {(() => {
                        if (item.status === AnnouncementStatus.APPROVED) {
                          return (
                            <button className="w-[73px] h-7 font-semibold text-sm border rounded-md text-[#00AB55] border-[#00AB55] hover:cursor-default">
                              อนุมัติ
                            </button>
                          );
                        } else if (item.status === AnnouncementStatus.WAITING_APPROVAL) {
                          return (
                            <button className="w-[73px] h-7 font-semibold text-sm border rounded-md text-[#D9A84E] border-[#D9A84E] hover:cursor-default">
                              รออนุมัติ
                            </button>
                          );
                        } else if (item.status === AnnouncementStatus.REJECTED) {
                          return (
                            <button className="w-[73px] h-7 font-semibold text-sm border rounded-md text-[#D83636] border-[#D83636] hover:cursor-default">
                              ไม่อนุมัติ
                            </button>
                          );
                        }
                      })()}
                    </td>
                    <td className="flex justify-center py-[14px] overflow-hidden text-ellipsis whitespace-nowrap px-2">
                      {loadingState[item.id!] ? (
                        <div className="animate-spin h-5 w-5 border-t-2 border-yellow-500 border-solid rounded-full"></div>
                      ) : (
                        <button onClick={() => handleButtonClick(item.id!)}>
                          <DownloadIcon />
                        </button>
                      )}
                    </td>
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
      ={' '}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        onPageChange={handlePageChange}
      />
    </section>
  );
}
const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5050';
const AnnouncementPDF = ({
  announcementListData,
}: {
  announcementListData: Announcement;
}) => (
  <Document>
    <Page style={styles.page} size={'A4'}>
      <View style={styles.section}>
        {announcementListData ? (
          <View key={announcementListData.id}>
            {Array.isArray(announcementListData.image_url_list) &&
              announcementListData.image_url_list.length > 0 &&
              announcementListData.image_url_list.map((imageUrl, index) => (
                <Image
                  key={index}
                  style={styles.image}
                  src={`${BACKEND_URL}/${imageUrl}`}
                />
              ))}
          </View>
        ) : (
          <Text style={styles.text}>ไม่มีข้อมูล </Text>
        )}
      </View>
    </Page>
  </Document>
);

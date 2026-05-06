import { useCallback, useEffect, useState } from 'react';
import { DatePickIcon, DownloadIcon } from '../../../local/icon/icon-date-download';
import { GetDownload } from '../../../local/api/restapi/get-download';
import { downloadProp } from '../../../local/type';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
  Image,
  pdf,
  Font,
  PDFViewer
} from '@react-pdf/renderer';

import { useNavigate } from '@tanstack/react-router';

import PreviewPdf from '../previewpdf';

import DateRangeSelector from '../date-range-selector';
import { saveAs } from 'file-saver';
import { NotificationState } from '@component/web/atom/notification/type'; 
import NotificationSuccess from '@component/web/atom/notification/wc-a-notification-success';
import NotificationError from '@component/web/atom/notification/wc-a-notification-error';
import { toDateTH } from '@global/helper/uh-date-time';
const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5050';
type Props = {};
function DownloadNews({ }: Props) {
  const navigate = useNavigate();
  Font.register({
    family: 'Anuphan',
    src: '../../../../../../../font/Anuphan-VariableFont_wght.ttf',
  });
  const styles = StyleSheet.create({
    page: {

      backgroundColor: '#ffffff',
      padding: 0,
      margin: 0,
      width: '100%',
      height: '100%',
    },
    section: {
      fontFamily: 'Anuphan',
    },
    header: {
      fontSize: 18,
      fontWeight: 'bold',
      fontFamily: 'Anuphan',
      textAlign: 'center',
      backgroundColor: '#d9a84e',
    },
    text: {
      fontSize: 12,
      marginBottom: 5,
      fontWeight: 'bold',
    },
    image: {
      padding: 0,
      margin: 0,
      width: '100%',
      height: '100%',
      objectFit: 'fit',
    },
  });


  const DownloadPDF = ({ downloadData }: { downloadData: downloadProp[] }) => (
    <Document>
      {downloadData.length > 0 ? (
        downloadData.map((item, index) => (
          <>
            {/* หน้าแรก (preview_url) */}
            {item.preview_url && (
              <Page style={styles.page} size="A4" key={`${item.id}-preview`}>
                <View style={styles.section}>

                  <Image
                    style={styles.image}
                    src={`${BACKEND_URL}/${item.preview_url}`}
                  />
                </View>
              </Page>
            )}

            {/* สร้างหน้าใหม่สำหรับแต่ละรูปใน image_url_list */}
            {item.image_url_list &&
              item.image_url_list.map((url, idx) => {
                const isNewPage = idx % 4 === 0;

                return (
                  isNewPage && (
                    <Page
                      style={styles.page}
                      size="A4"
                      key={`${item.id}-page-${Math.floor(idx / 4)}`}
                    >
                      <View style={styles.section}>
                        {/* Header */}
                        <View
                          style={{
                            display: "flex",
                            marginTop: 5,
                            flexDirection: "row",
                            justifyContent: "space-between",
                            paddingHorizontal: 10,

                          }}
                        >
                          <Text style={styles.text}>เว็บประกาศข่าว{' '} </Text>
                          <Text style={{
                            fontSize: 12,
                            paddingLeft: 60,
                            fontWeight: 'bold'
                          }}>
                            หน้าที่ {index + Math.floor(idx / 4) + 2}
                          {' '} </Text>
                          <Text style={styles.text}>
                            วันที่ {toDateTH(item.public_date)}
                          {' '} </Text>
                        </View>

                        {/* รูปภาพ */}
                        <View
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            flexWrap: "wrap",
                            // marginLeft: 30
                            paddingHorizontal: 10
                          }}
                        >
                          {item.image_url_list
                            .slice(idx, idx + 4) // ดึงรูป 4 รูปสำหรับหน้าใหม่
                            .map((innerUrl, innerIdx) => (
                              <View
                                key={`${item.id}-image-${idx + innerIdx}`}
                                style={{
                                  width: "50%",
                                  height: 400,
                                  borderWidth: 0.5,
                                  borderColor: "#000000",
                                }}
                              >
                                <Image
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                  }}
                                  src={`${BACKEND_URL}/${innerUrl}`}
                                />
                              </View>
                            ))}
                        </View>
                      </View>
                    </Page>
                  )
                );
              })}

          </>
        ))
      ) : (
        <Page style={styles.page} size="A4">
          <Text style={styles.text}>ไม่มีข้อมูล{' '} </Text>
        </Page>
      )}
    </Document>
  );


  const getTodayDate = () => new Date();

  const formatDateToString = (date: Date | null) => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [selectedDate, setSelectedDate] = useState<Date | null>(getTodayDate());
  const [downloadData, setDownloadData] = useState<downloadProp[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [notification, setNotification] = useState<NotificationState>({
    show: false,
    type: 'success',
    title: '',
    message: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenModal = useCallback((input: boolean) => {
    setShowModal(input);
  }, []);

  useEffect(() => {
    const formattedDate = selectedDate ? formatDateToString(selectedDate) : '';
    GetDownload(formattedDate)
      .then((res) => {
        if (res.message === 'User retrieved successfully') {
          setDownloadData([res.data]);
        } else {
          setDownloadData([]);
        }
      })
      .catch((err) => {
        console.error('Error fetching Faq:', err);
      });
  }, [selectedDate]);


  const PDFDownload = async (announcementId: number) => {
    if (!announcementId) {
      setNotification({
        show: true,
        type: 'error',
        title: 'เกิดข้อผิดพลาด',
        message: 'ไม่มีข้อมูลที่สามารถดาวน์โหลดได้',
      });
      return;
    }
    setIsLoading(true);
    try {
      const selectedDownload = downloadData.find((item) => item.id === announcementId);
      if (!selectedDownload) throw new Error('ไม่พบประกาศที่เลือก');

      const blob = await pdf(<DownloadPDF downloadData={[selectedDownload]} />).toBlob();
      saveAs(blob, `ประกาศหนังสือพิมพ์_${toDateTH(selectedDownload.public_date)}.pdf`);

      setNotification({ show: true, type: 'success', title: 'ดาวน์โหลดสำเร็จ' });
    } catch (error) {
      console.error('Error downloading PDF:', error);
      setNotification({
        show: true,
        type: 'error',
        title: 'เกิดข้อผิดพลาด',
      });
    } finally {
      setIsLoading(false);
      setTimeout(() => setNotification((prev) => ({ ...prev, show: false })), 3000);
    }
  };


  return (
    <div className="flex justify-center  px-4 lg:px-20">
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
      <div className="w-[750px]  shadow-md rounded-[20.16px] py-[56px] px-[24px] lg:px-[52px] flex flex-col items-center  bg-white gap-[40px] dark:bg-[#262626]">
        <div className="w-fit lg:w-[661.3px]">
          <p className="text-[24px] leading-[54px] font-bold md:text-[40px] md:leading-[40px] md:font-semibold text-center dark:text-[#D7D7D7]">
            ดาวน์โหลดหนังสือพิมพ์
          </p>
        </div>
        <div className="flex flex-col gap-3 items-center">
          <p className="font-semibold text-[16px] leading-4 text-[#414141] dark:text-[#D7D7D7]">
            ค้นหาวันที่ลงประกาศหนังสือพิมพ์
          </p>
          <div className="date-picker-wrapper">
            <DateRangeSelector
              label="ตั้งแต่วันที่"
              value={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              maxDate={new Date()}
            />
            {/* <input
              value={selectedDate}
              type="date"
              placeholder="วันนี้"
              className="bg-white dark:bg-[#262626] border-1 border-[#737373] text-[#414141] dark:text-[#D7D7D7] p-2 rounded-md"
            /> */}
            {/* <DatePickIcon /> */}
          </div>
        </div>

        <div>
          <button
            disabled={downloadData.length === 0 || isLoading}
            onClick={() => PDFDownload(downloadData[0]?.id)}
            className={`w-[152px] h-[38px] rounded-[6px] px-[12px] flex items-center justify-center ${isLoading || downloadData.length === 0
              ? 'bg-[#D9A84E] cursor-not-allowed'
              : 'bg-[#D9A84E]'
              }`}
          >
            {isLoading ? (
              <div className="animate-spin h-5 w-5 border-t-2 border-white border-solid rounded-full"></div>
            ) : (
              <>
                <DownloadIcon />
                <p className="font-bold text-[14px] text-white">ดาวน์โหลด</p>
              </>
            )}
          </button>
        </div>

        {/* <div className="h-[850px] w-full">
          <PDFViewer style={{ width: '100%', height: '100%' }}>
            <DownloadPDF downloadData={downloadData} />
          </PDFViewer>
        </div> */}


        <div className="w-full flex flex-col justify-center hover:cursor-pointer">
          <div className="w-full h-auto xl:h-[900px] ">
            {downloadData.length > 0 ? (
              downloadData.map((item, index) => (
                <div key={item.id}>
                  {item.preview_url && item.preview_url.length > 0 && (
                    <div className="mt-4">
                      <img
                        key={index}
                        src={`${BACKEND_URL}/${item.preview_url}`}
                        alt={`Image ${index + 1}`}
                        className="w-full h-auto object-cover  shadow"
                        onClick={() => handleOpenModal(true)}
                      />
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="w-full h-full flex justify-center items-center ">
                <p className="text-center text-gray-500 ">ไม่มีข้อมูลรูปภาพในขณะนี้</p>
              </div>
            )}
          </div>

          {showModal && (
            <PreviewPdf
              data={downloadData.flatMap((item, index) =>
                item.image_url_list
                  ? [
                    {
                      image_url_list: item.image_url_list.map(
                        (imageUrl) => `${BACKEND_URL}/${imageUrl}`,
                      ), // เพิ่ม image_url_list ที่เป็น array ของ URL
                      preview_url: `${BACKEND_URL}/${item.preview_url}`,
                      index: index, // เก็บ index ของ item
                      public_date: item.public_date
                    },
                  ]
                  : [],
              )}
              handleOpenModal={handleOpenModal}
            />
          )}
        </div>
        <p className="font-bold text-[16px] leading-4 text-[#262626] dark:text-[#D7D7D7]  mt-5">
          {downloadData.length > 0
            ? `มีทั้งหมด  ${(downloadData[0].preview_url ? 1 : 0) +
            (downloadData[0].image_url_list
              ? Math.round((downloadData[0].image_url_list.length)/4)
              : 0)
            } หน้า`
            : 'ไม่มีข้อมูล'}
        </p>
      </div>
    </div>
  );
}

export default DownloadNews;

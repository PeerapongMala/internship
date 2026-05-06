const thaiMonths = [
  'มกราคม',
  'กุมภาพันธ์',
  'มีนาคม',
  'เมษายน',
  'พฤษภาคม',
  'มิถุนายน',
  'กรกฎาคม',
  'สิงหาคม',
  'กันยายน',
  'ตุลาคม',
  'พฤศจิกายน',
  'ธันวาคม',
];

export const formatToThaiDate = (isoDate: string): string => {
  try {
    const date = new Date(isoDate);

    if (isNaN(date.getTime())) {
      throw new Error('Invalid date');
    }

    const day = date.getDate();
    const month = thaiMonths[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return isoDate; // คืนค่าเดิมถ้าแปลงไม่สำเร็จ
  }
};

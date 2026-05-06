// helper/dateTime.ts
export function toDateTimeTH(date: string | undefined): string {
  if (!date) return '-';

  const months = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];

  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) return '-'; 

  const day = parsedDate.getDate();
  const month = months[parsedDate.getMonth()];
  const year = parsedDate.getFullYear() + 543; 
  const hours = parsedDate.getHours().toString().padStart(2, '0');
  const minutes = parsedDate.getMinutes().toString().padStart(2, '0');

  return `${day} ${month} ${year} ${hours}:${minutes} น.`;
}

export function toDateTH(date: string | undefined): string {
  if (!date) return '-';

  const months = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];

  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) return '-'; 

  const day = parsedDate.getDate();
  const month = months[parsedDate.getMonth()];
  const year = parsedDate.getFullYear() + 543; 

  return `${day} ${month} ${year} `;
}

export function toDateFixTH(date: string | undefined): string {
  if (!date) return '-';


  const formattedDate = date.includes('/') 
    ? date.split('/').reverse().join('-') 
    : date;

  const parsedDate = new Date(formattedDate);
  if (isNaN(parsedDate.getTime())) return '-'; 

  const day = parsedDate.getDate();
  const month = parsedDate.getMonth() + 1;
  const year = parsedDate.getFullYear() + 543; 

  return `${day}/${month}/${year}`;
}
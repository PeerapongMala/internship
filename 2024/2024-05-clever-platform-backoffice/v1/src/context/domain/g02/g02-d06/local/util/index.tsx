import { TranslateTextStatusType } from '../type';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import buddhistEra from 'dayjs/plugin/buddhistEra';
import Swal from 'sweetalert2';

dayjs.extend(buddhistEra);

const statusColors: { [key in keyof typeof TranslateTextStatusType]: string } = {
  enabled: 'badge-outline-success',
  disabled: 'badge-outline-danger',
  draft: 'badge-outline-secondary',
};

const convertDataToOptions = (data: any[], labelKey?: string) => {
  return data.map((item) => {
    return {
      label: labelKey ? item[labelKey] : item.name,
      value: item.id,
    };
  });
};

const convertIdToThreeDigit = (id: number | string | undefined | null) => {
  return id?.toString().padStart(3, '0') || '-';
};

const convertTime = (time: string) => {
  if (!time) return '-';

  const date = dayjs(time).locale('th');
  return date.format('DD MMM BBBB HH:mm');
};

const getStatus = (status: keyof typeof TranslateTextStatusType) => {
  const label = TranslateTextStatusType[status] || status;
  const colorClass = statusColors[status] || 'badge-outline-info';
  return <span className={`badge ${colorClass}`}>{label || 'แบบร่าง'}</span>;
};

const showToast = (title: string, isSuccess?: boolean, loading?: boolean) => {
  const toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    showCloseButton: true,
    customClass: {
      popup: loading ? 'color-info' : isSuccess ? 'color-success' : 'color-danger',
    },
  });

  toast.fire({
    title,
  });
};

export { convertDataToOptions, convertIdToThreeDigit, convertTime, getStatus, showToast };

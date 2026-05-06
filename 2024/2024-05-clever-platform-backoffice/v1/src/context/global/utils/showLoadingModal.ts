import Swal, { SweetAlertOptions } from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

function showLoadingModal(
  options: Omit<SweetAlertOptions, 'input' | 'inputValidator' | 'text' | 'html'> = {},
) {
  const defaultOptions: SweetAlertOptions = {
    showConfirmButton: false,
    allowOutsideClick: false,
    allowEscapeKey: false,
    customClass: {
      popup: 'px-4 py-4 sm:px-6 sm:py-5 max-w-[400px]',
      title: 'text-base font-medium mb-1',
      htmlContainer: 'text-sm mb-0',
      loader: 'mt-1 mb-3',
    },
    title: 'กำลังอัปโหลด...',
    html: '<div class="text-sm text-gray-600">กรุณารอจนกว่ากระบวนการจะเสร็จสิ้น</div><div class="swal2-loading-placeholder"></div>',
  };

  const mergedOptions: SweetAlertOptions = { ...defaultOptions, ...options };

  Swal.fire({
    ...mergedOptions,
    didOpen: () => {
      Swal.showLoading();
    },
  });
}

export default showLoadingModal;

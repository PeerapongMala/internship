import Swal from 'sweetalert2';

type SwalType = 'success' | 'error' | 'warning' | 'info' | 'question';

const showMessage = (msg: string = '', type: SwalType = 'success') => {
  const toast: any = Swal.mixin({
    toast: true,
    position: 'top-right',
    showConfirmButton: false,
    timer: 3000,
    customClass: { container: 'toast' },
  });
  toast.fire({
    icon: type,
    title: msg,
    padding: '10px 20px',
  });
};

export default showMessage;

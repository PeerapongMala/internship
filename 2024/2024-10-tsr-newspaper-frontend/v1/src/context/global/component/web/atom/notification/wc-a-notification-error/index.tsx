import { useEffect, useState } from 'react';

interface NotificationProps {
  show: boolean;
  title: string;
  message?: string;
}

const NotificationError: React.FC<NotificationProps> = ({ show, title, message }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  const showNotification = () => {
    setShouldRender(true);
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
  };

  const hideNotification = () => {
    setIsVisible(false);
    const timer = setTimeout(() => {
      setShouldRender(false);
    }, 300); // ระยะเวลาให้การแสดงผล fade-out ทำงานเสร็จ
    return timer;
  };

  useEffect(() => {
    if (show) {
      showNotification();
    } else {
      const timer = hideNotification();
      return () => clearTimeout(timer); // เคลียร์ timeout ถ้ามีการเปลี่ยนแปลง
    }
  }, [show]);

  if (!shouldRender) return null;

  return (
    <div className="fixed translate-y-32 inset-0 flex items-start justify-end pt-4 px-4 pointer-events-none z-10">
      <div
        className={`w-full max-w-[400px] bg-white rounded-2xl shadow-lg pointer-events-auto
          transform transition-all duration-300 ease-out
          ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}
      >
        <div className="p-4 flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
              <svg
                className="w-4 h-4 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          </div>
          <div className="flex-1 pt-0.5">
            <h3 className="text-base font-medium text-gray-900">{title}</h3>
            {message && <p className="mt-1 text-sm text-gray-500">{message}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationError;

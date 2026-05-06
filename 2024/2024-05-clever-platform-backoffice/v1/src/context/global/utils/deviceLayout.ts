// src/utils/deviceLayout.ts
import { isMobile as detectMobile } from 'react-device-detect';

const showFooterPaths = [
  '/line/parent/clever/dashboard/choose-student',
  '/line/parent/clever/homework/choose-student',
  '/line/parent/clever/announcement',
  '/line/parent/clever/bug-report',
];

const showMobileOnlyFooterPaths = ['/line/parent/clever/lesson', '/line/parent/family'];

export const shouldShowHeader = (pathname: string, isMobile: boolean): boolean => {
  // ❌ ไม่แสดง header ถ้าเป็น path ที่ต้องซ่อนบนมือถือ
  if (isMobile) {
    return ![...showFooterPaths, ...showMobileOnlyFooterPaths].some((path) =>
      pathname.startsWith(path),
    );
  }

  // ✅ Desktop: แสดง header ยกเว้นบาง path
  return !showFooterPaths.some((path) => pathname.startsWith(path));
};

export const shouldShowFooter = (pathname: string, isMobile: boolean): boolean => {
  if (isMobile) {
    return (
      showFooterPaths.some((path) => pathname.startsWith(path)) ||
      showMobileOnlyFooterPaths.some((path) => pathname.startsWith(path))
    );
  }

  return showFooterPaths.some((path) => pathname.startsWith(path));
};

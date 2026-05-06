import { Outlet } from '@tanstack/react-router';
import { getUserData } from '@global/utils/store/getUserData';
import ModalContactAdminForSubject from '@component/web/cw-modal/cw-modal-contact-admin-for-subject';

const SubjectTeacherMiddleware = () => {
  const userData = getUserData();

  if (!userData) {
    return null;
  }

  if (!userData?.is_subject_teacher) {
    return <ModalContactAdminForSubject />;
  }

  return <Outlet />;
};

export default SubjectTeacherMiddleware;

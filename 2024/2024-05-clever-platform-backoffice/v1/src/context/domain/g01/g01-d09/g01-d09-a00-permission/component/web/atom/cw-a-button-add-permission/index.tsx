import { useNavigate } from '@tanstack/react-router';
import CWButton from '@component/web/cw-button';
import IconPlus from '@core/design-system/library/component/icon/IconPlus';

const ButtonAddPermission = () => {
  const navigate = useNavigate();

  const handleAddPermission = () => {
    navigate({ to: '/admin/report-permission/info' });
  };

  return (
    <CWButton
      onClick={handleAddPermission}
      icon={<IconPlus />}
      title={'เพิ่มสิทธิ์'}
      variant={'primary'}
    />
  );
};

export default ButtonAddPermission;

import { useNavigate } from '@tanstack/react-router';
import CWButton from '@component/web/cw-button';
import IconPlus from '@core/design-system/library/component/icon/IconPlus';

type ButtonAddSchoolProps = {
  onClick?: () => void;
};
const ButtonAddSchool = ({ onClick }: ButtonAddSchoolProps) => {
  const navigate = useNavigate();

  return (
    <CWButton
      onClick={onClick}
      icon={<IconPlus />}
      title={'เพิ่มโรงเรียน'}
      variant={'primary'}
    />
  );
};

export default ButtonAddSchool;

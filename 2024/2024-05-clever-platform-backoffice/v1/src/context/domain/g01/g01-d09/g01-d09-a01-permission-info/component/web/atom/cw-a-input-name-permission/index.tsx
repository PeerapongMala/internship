import CWWhiteBox from '@global/component/web/cw-white-box';
import CWInput from '@global/component/web/cw-input';

type InputNamePermissionProps = {
  accessName: string;
  handleAccessNameChange: (value: string) => void;
};
const InputNamePermission = ({
  accessName,
  handleAccessNameChange,
}: InputNamePermissionProps) => {
  return (
    <CWWhiteBox>
      <CWInput
        aria-required
        label="ชื่อสิทธิ์การเข้าถึง"
        placeholder=""
        type="text"
        required
        className="w-full"
        value={accessName}
        onChange={(e) => handleAccessNameChange(e.target.value)}
      />
    </CWWhiteBox>
  );
};

export default InputNamePermission;

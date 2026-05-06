import IconArrowBackward from '@core/design-system/library/component/icon/IconArrowBackward';
import { useNavigate } from '@tanstack/react-router';

interface CWMReverseNavigateProps {
  label: React.ReactNode;
  to: string;
  className?: string;
  btnClassName?: string;
  labelClassName?: string;
  children?: React.ReactNode;
}

const CWMReverseNavigate = function (props: CWMReverseNavigateProps) {
  const navigate = useNavigate();
  return (
    <div className={`flex flex-col gap-1 ${props.className}`}>
      <div className={`flex w-fit items-center gap-4 ${props.btnClassName ?? ''}`}>
        <button onClick={() => navigate({ to: props.to })}>
          <IconArrowBackward />
        </button>
        <div className={`text-xl font-bold ${props.labelClassName ?? ''}`}>
          {props.label}
        </div>
      </div>
      {props.children}
    </div>
  );
};

export default CWMReverseNavigate;

import CWButton from '@component/web/cw-button';
import IconArrowLeft from '@core/design-system/library/component/icon/IconArrowLeft';
import IconArrowRight from '@core/design-system/library/component/icon/IconArrowRight';

type ButtonPageSwitchProps = {
  hideNextPage?: boolean;
  hidePreviousPage?: boolean;
  isNextButtonSubmit?: boolean;
  onNextPage?: () => void;
  onPreviousPage?: () => void;
};

const ButtonPageSwitch = ({
  hideNextPage,
  hidePreviousPage,
  isNextButtonSubmit,
  onNextPage,
  onPreviousPage,
}: ButtonPageSwitchProps) => {
  return (
    <div className="flex gap-6">
      {!hidePreviousPage && (
        <CWButton
          className="gap-[10px] px-5 py-2.5"
          title="ย้อนกลับ"
          icon={<IconArrowLeft />}
          type="button"
          onClick={onPreviousPage}
        />
      )}
      {!hideNextPage && (
        <CWButton
          className="gap-[10px] px-5 py-2.5"
          title="ต่อไป"
          suffix={<IconArrowRight />}
          type={isNextButtonSubmit ? 'submit' : 'button'}
          onClick={onNextPage}
        />
      )}
    </div>
  );
};

export default ButtonPageSwitch;

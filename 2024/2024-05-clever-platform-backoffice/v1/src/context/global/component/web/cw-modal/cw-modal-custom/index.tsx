import { ReactNode } from 'react';
import Modal, { ModalProps } from '../Modal';
import Button from '../../cw-button';
import { cn } from '@core/design-system/library/vristo/source/utils/cn';
import CWALoadingOverlay from '@component/web/atom/cw-a-loading-overlay';

export interface ModalPopupProps extends ModalProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  variant?:
    | 'primary'
    | 'secondary'
    | 'info'
    | 'success'
    | 'warning'
    | 'danger'
    | 'white'
    | 'dark';
  buttonName?: string;
  buttonContainerClassName?: string;
  containerClassName?: string;
  cancelButtonName?: string;
  outline?: boolean;
  size?: 'small' | 'medium' | 'large' | 'veryLarge';
  buttonWidth?: string;
  disableOk?: boolean;
  loading?: boolean;
}
// million-ignore
const CWModalCustom = ({
  className,
  open,
  onClose,
  children,
  onOk,
  title,
  variant,
  buttonName,
  buttonContainerClassName,
  cancelButtonName,
  outline,
  size,
  buttonWidth,
  disableOk,
  loading,
  containerClassName,
  ...rest
}: ModalPopupProps) => {
  const sizeArr = {
    small: 'w-[400px]',
    medium: 'w-[500px]',
    large: 'w-[800px]',
    veryLarge: 'w-[1200px]',
  };

  return (
    <Modal
      className={cn(sizeArr[size || 'small'], className)}
      open={open}
      onClose={onClose}
      onOk={onOk}
      disableCancel
      disableOk
      title={title}
      {...rest}
    >
      <div className="w-full">
        <div className={cn('relative flex flex-col gap-4', containerClassName)}>
          <CWALoadingOverlay visible={loading} />

          {children}
        </div>

        <div
          className={cn(
            'mt-5 flex w-full justify-between gap-5',
            buttonContainerClassName,
          )}
        >
          {cancelButtonName && (
            <Button
              outline={outline}
              variant={'white'}
              title={cancelButtonName}
              onClick={onClose}
              className={buttonWidth ? `w-[${buttonWidth}]` : 'w-full'}
            />
          )}
          {buttonName && (
            <Button
              disabled={disableOk}
              outline={outline}
              variant={variant}
              title={buttonName}
              onClick={onOk}
              className={buttonWidth ? `w-[${buttonWidth}]` : 'w-full'}
            />
          )}
        </div>
      </div>
    </Modal>
  );
};

export default CWModalCustom;

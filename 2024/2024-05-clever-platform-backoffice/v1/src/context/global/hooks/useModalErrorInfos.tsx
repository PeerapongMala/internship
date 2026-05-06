import ModalErrorInfos from '@component/web/cw-modal/cw-modal-error-infos';
import {
  TErrorInfos,
  TModalErrorInfosOptions,
} from '@component/web/cw-modal/cw-modal-error-infos/type';
import useModal from '@global/utils/useModal';
import { useEffect, useState } from 'react';

/**
 * A custom React hook for managing and displaying a generic error information modal.
 * It provides state and functions to control the modal's visibility and content.
 *
 * The modal automatically opens when error information is set.
 *
 * @function
 * @param {TModalErrorInfosOptions} [options] - Configuration options for the modal.
 * @returns {Object} An object containing:
 * @returns {boolean} return.isOpen - A boolean indicating whether the modal is currently open.
 * @returns {function(TErrorInfos[]): void} return.setErrorInfos - A function to set the list of error information to be displayed. Setting a non-empty array will automatically open the modal.
 * @returns {function(): JSX.Element} return.render - A function that returns the `ModalErrorInfos` component, to be rendered in your component's JSX.
 */
const useModalErrorInfos = (options?: TModalErrorInfosOptions) => {
  const { isOpen, open, close } = useModal();

  const [errorInfos, setErrorInfos] = useState<TErrorInfos[]>([]);
  useEffect(() => {
    // auto open modal when errorInfos has been set
    if (errorInfos.length > 0) {
      open();
    }
  }, [errorInfos]);

  const render = () => (
    <ModalErrorInfos
      title={options?.title ?? 'พบปัญหาขณะบันทึก'}
      errorLists={errorInfos}
      open={isOpen}
      onClose={() => {
        close();
        setErrorInfos([]);
      }}
    />
  );

  return {
    isOpen,
    setErrorInfos,
    render,
  };
};

export default useModalErrorInfos;

import { LoadingOverlay, LoadingOverlayProps } from '@mantine/core';

type CWALoadingOverlayProps = LoadingOverlayProps & {};

/**
 * Docs: https://mantine.dev/core/loading-overlay/
 * LoadingOverlay renders an overlay with a loader over the parent element with relative position.
 * controlled by `visible` props
 */
const CWALoadingOverlay = ({
  zIndex = 1000,
  overlayProps = { radius: 'sm', blur: 2 },
  ...props
}: CWALoadingOverlayProps) => {
  return <LoadingOverlay {...props} zIndex={zIndex} overlayProps={overlayProps} />;
};

export default CWALoadingOverlay;

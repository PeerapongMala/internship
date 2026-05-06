import Header from '../../../../../../local/component/web/molecule/cw-m-header';
import React, { useEffect, useState } from 'react';
import IconCamera from '@core/design-system/library/component/icon/IconCamera';
import QrCodeScanner from '@domain/g05/g05-d02/g05-d02-p04-account-managment/local/component/web/atom/cw-a-qr-scanner';
import OverlayCameraScanner from '@domain/g05/g05-d02/g05-d02-p04-account-managment/local/component/web/atom/cw-a-overlay-camera';

type QRCodeScannerModalProps = {
  isOpen: boolean;
  handleCloseModal?: () => void;
  onResult?: (data: string) => void;
};

const QRCodeScannerModal = ({
  isOpen,
  handleCloseModal,
  onResult,
}: QRCodeScannerModalProps) => {
  const [cameraLists, setCameraLists] = useState<string[] | null>([]);
  const [selectedCameraIndex, setSelectedCameraIndex] = useState<number>(0);
  const [isPermissionDenied, setIsPermissionDenied] = useState(false);

  // prevent page below modal scrolling
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const checkPermissionAndFetchCameras = async () => {
    let permissionStatus: PermissionStatus;
    try {
      // Check camera permissions
      permissionStatus = await navigator.permissions.query({
        name: 'camera' as PermissionName,
      });

      if (permissionStatus.state === 'granted') {
        // If permission is granted, fetch cameras immediately
        await getCameraInfo();
      } else {
        // If permission is not granted, request camera access first
        await navigator.mediaDevices.getUserMedia({ video: true });

        await getCameraInfo(); // Fetch camera info after user allows access
      }
    } catch (error) {
      const err = error as { code: number; name: string; message: string };

      if (err.name === 'NotAllowedError') {
        setIsPermissionDenied(true);
      }

      console.error('Error checking camera permissions:', error);
    }
  };

  // TODO: need to filter camera when want to support camera selection
  // ? This code get 4 input in samsung galaxy A75 5g but only work with front and back cam.
  const getCameraInfo = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter((device) => device.kind === 'videoinput');

    // Sort: Move back camera to index 0 if found
    videoDevices.sort((a, b) => {
      const isBackA =
        a.label.toLowerCase().includes('back') ||
        a.label.toLowerCase().includes('environment');
      const isBackB =
        b.label.toLowerCase().includes('back') ||
        b.label.toLowerCase().includes('environment');

      if (isBackA && !isBackB) return -1; // A (back) comes first
      if (!isBackA && isBackB) return 1; // B (back) comes first
      return 0; // Keep order if both are same type
    });

    const cameraIDLists = videoDevices
      .map((device) => device.deviceId)
      .filter((id) => !!id);

    if (cameraIDLists.length > 0) {
      setCameraLists(cameraIDLists);
      setSelectedCameraIndex(0);
      return;
    }
    setCameraLists(null);
  };

  const handleChangeCamera = () => {
    if (selectedCameraIndex === null || cameraLists?.length === 1) {
      return;
    }

    if (cameraLists?.length && selectedCameraIndex + 1 > cameraLists.length - 1) {
      setSelectedCameraIndex(0);
      return;
    }

    setSelectedCameraIndex((prev) => {
      if (prev === null) return 0;
      return prev + 1;
    });
  };

  useEffect(() => {
    checkPermissionAndFetchCameras();
  }, []);

  // * Close modal when press back
  useEffect(() => {
    // Push a dummy state so that there is an entry to return to.
    window.history.pushState(null, '', window.location.href);

    const handlePopState = (event: PopStateEvent) => {
      // Prevent back navigation by pushing the state back again.
      window.history.pushState(null, '', window.location.href);
      handleCloseModal?.();
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex h-screen w-screen flex-col items-center bg-white">
          <Header title={'จัดการครอบครัว'} onCloseClick={() => handleCloseModal?.()} />

          <div className="relative h-full w-full bg-[#000]">
            {cameraLists && (
              <QrCodeScanner
                className="absolute inset-0 h-full w-full"
                currentCameraID={cameraLists[selectedCameraIndex]}
                onResult={(data) => {
                  onResult?.(data);
                  handleCloseModal?.();
                }}
              />
            )}
            <div className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[80vw] max-w-[300px] -translate-x-1/2 -translate-y-1/2">
              <OverlayCameraScanner />
            </div>
            // ! Camera selection feature
            {/* {cameraLists ? (
              <>
                <button
                  onClick={handleChangeCamera}
                  className="absolute right-0 m-2 p-2 text-white"
                >
                  <IconCamera />
                </button>

                <div className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[80vw] max-w-[300px] -translate-x-1/2 -translate-y-1/2">
                  <OverlayCameraScanner />
                </div>
              </>
            ) : (
              <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-noto-sans-thai text-lg font-normal text-white">
                <span>No Camera Detected.</span>
              </div>
            )} */}
            {isPermissionDenied && (
              <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-noto-sans-thai text-lg font-normal text-white">
                <span>Camera Access Denied.</span>
              </div>
            )}
            {isPermissionDenied && (
              <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-noto-sans-thai text-lg font-normal text-white">
                <span>Camera Access Denied.</span>
              </div>
            )}
            <div className="absolute bottom-0 flex w-full justify-center px-10 py-2">
              <span className="font-noto-sans-thai text-lg font-normal text-white">
                สแกน QR CODE เพื่อเพิ่มสมาชิก
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default QRCodeScannerModal;

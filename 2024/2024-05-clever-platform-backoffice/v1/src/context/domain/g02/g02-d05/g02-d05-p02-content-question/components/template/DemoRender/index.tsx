import IconFullscreen from '@core/design-system/library/component/icon/IconFullscreen';
import { useState, useEffect, useRef } from 'react';
import { Modal } from '@core/design-system/library/vristo/source/components/Modal';

const GAME_URL = import.meta.env.VITE_GAME_BASE_URL ?? 'http://localhost:6101';

const DemoRender = ({ forceUpdate }: { forceUpdate: () => void }) => {
  const [iframeKey, setIframeKey] = useState(0);
  const [height, setHeight] = useState('100%');
  const [showModal, setShowModal] = useState(false);
  const [url, setUrl] = useState(`${GAME_URL}/quiz/quiz-demo`);
  const [loading, setLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const refreshIframe = () => {
    if (iframeRef.current) {
      iframeRef.current.src = 'about:blank';
    }
    setIframeKey((prevKey) => prevKey + 1);
    setLoading(true);
  };

  const handleRefreshIframe = () => {
    forceUpdate();
    setTimeout(() => {
      refreshIframe();
    }, 100);
  };

  const handleIframeLoad = () => {
    forceUpdate();
    setLoading(false);
    /*
    if (containerRef.current && !showModal) {
      const width = containerRef.current.offsetWidth;
      const height = (width * 9) / 16;
      setHeight(`${height}px`);
    } else {
      setHeight('100%');
    }
      */
  };

  const handleFullScreen = () => {
    setShowModal(true);
  };

  useEffect(() => {
    console.log('DemoRender', iframeKey);
    setUrl(`${GAME_URL}/quiz/quiz-demo?key=${iframeKey}`);
    setLoading(true);
  }, [iframeKey]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe) {
      iframe.addEventListener('load', handleIframeLoad);
      return () => {
        iframe.removeEventListener('load', handleIframeLoad);
      };
    }
  }, [url]);

  return (
    <div className="flex min-h-[20rem] flex-col gap-2" ref={containerRef}>
      <ModalDemoRender
        open={showModal}
        iframeKey={iframeKey}
        height={height}
        url={url}
        iframeRef={iframeRef}
        setShowModal={setShowModal}
        loading={loading}
        setLoading={setLoading}
      />
      <div className="flex justify-between">
        <h1 className="text-xl font-bold">ตัวอย่างการแสดงผลในเกม</h1>
        <div className="flex gap-2">
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={handleRefreshIframe}
          >
            อัพเดทข้อมูล
          </button>
        </div>
      </div>
      <div className="relative">
        <IFrame
          iframeKey={iframeKey}
          height={height}
          url={url}
          iframeRef={iframeRef}
          onLoad={handleIframeLoad}
        />
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60">
            <span className="inline-block h-[18px] w-[18px] shrink-0 animate-spin rounded-full border-2 border-primary border-l-transparent align-middle" />
          </div>
        )}
        <button
          type="button"
          className="absolute bottom-2 right-2 rounded-full bg-white p-2 shadow-md"
          onClick={handleFullScreen}
        >
          <IconFullscreen />
        </button>
      </div>
    </div>
  );
};

const IFrame = ({
  iframeKey,
  height,
  url,
  iframeRef,
  onLoad,
}: {
  iframeKey: number;
  height: string;
  url: string;
  iframeRef: React.RefObject<HTMLIFrameElement>;
  onLoad?: () => void;
}) => {
  return (
    <iframe
      ref={iframeRef}
      key={iframeKey}
      src={url}
      title="quiz"
      height={height}
      width={'100%'}
      style={{ aspectRatio: '16/9' }}
      onLoad={onLoad}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; microphone"
      sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
      loading="eager"
    />
  );
};

const ModalDemoRender = ({
  open,
  iframeKey,
  height,
  url,
  iframeRef,
  setShowModal,
  loading,
  setLoading,
}: {
  open: boolean;
  iframeKey: number;
  height: string;
  url: string;
  iframeRef: React.RefObject<HTMLIFrameElement>;
  setShowModal: (show: boolean) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}) => {
  const handleModalIframeLoad = () => setLoading(false);
  return (
    <Modal
      open={open}
      onClose={() => setShowModal(false)}
      title="ตัวอย่างการแสดงผลในเกม"
      className="w-[80%]"
    >
      <div className="relative flex h-[75vh]">
        <IFrame
          iframeKey={iframeKey}
          height={height}
          url={url}
          iframeRef={iframeRef}
          onLoad={handleModalIframeLoad}
        />
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60">
            <span className="inline-block h-[18px] w-[18px] shrink-0 animate-spin rounded-full border-2 border-primary border-l-transparent align-middle" />
          </div>
        )}
      </div>
    </Modal>
  );
};

export default DemoRender;

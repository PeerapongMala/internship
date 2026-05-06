import { useEffect, useState } from 'react';

interface GuideProps {
  responsiveEvent: any;
}

const Guide: React.FC<GuideProps> = ({ responsiveEvent }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null; // Variable to hold timeout ID

    const onYouTubeIframeAPIReady = () => {
      const player = new (window as any).YT.Player('yt-player', {
        events: {
          onStateChange: (event: any) => {
            if (event.data === 1) {
              setIsPlaying(true);
            } else if (event.data === 0 || event.data === -1 || event.data === 2) {
              if (timeoutId) {
                clearTimeout(timeoutId); // Clear previous timeout
              }
              timeoutId = setTimeout(() => {
                setIsPlaying(false);
              }, 1500); // Set new timeout for 2 seconds delay
            }
          },
        },
      });
    };

    if (!(window as any).YT) {
      // Load the YouTube Iframe API script
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      // Attach API ready event
      (window as any).onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
    } else {
      onYouTubeIframeAPIReady();
    }

    // Cleanup function
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId); // Clear timeout on cleanup
      }
    };
  }, []);

  return (
    <div
      className={`flex flex-col items-center ${
        responsiveEvent.mobileIs ? 'pt-4 pb-5 gap-6' : 'pt-6 pb-7 gap-8 md:gap-11'
      }`}
    >
      {/* Header */}
      <div
        className={`text-text mx-auto ${
          responsiveEvent.mobileIs ? 'text-[28px]' : 'text-[24px] md:text-[40px]'
        } font-semibold text-center`}
      >
        รายละเอียดวิธีการใช้งาน
      </div>

      {/* Video Section */}
      <div
        className={`relative flex flex-col items-center bg-[#2D2D2D] ${
          responsiveEvent.mobileIs
            ? 'w-full max-w-[90%] h-[530px]'
            : 'w-full max-w-[875px] md:h-[506px]'
        } rounded-2xl overflow-hidden`}
      >
        {/* YouTube Video Embed */}
        <iframe
          id="yt-player"
          className="w-full h-full  rounded-2xl"
          src="https://www.youtube.com/embed/_opd5_pSgj0?enablejsapi=1"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>

        {/* Overlay */}
        {!isPlaying && (
          <div
            className={`absolute bottom-0 left-0 w-full bg-[#281E0B] from-black to-transparent ${
              responsiveEvent.mobileIs ? 'p-8' : 'p-6'
            } text-[#F6C945]`}
          >
            <div
              className={`${
                responsiveEvent.mobileIs ? 'text-sm' : 'text-sm md:text-lg'
              } font-semibold`}
            >
              รายละเอียดวิธีการใช้งาน
            </div>
            <div
              className={`mt-2 ${
                responsiveEvent.mobileIs ? 'text-xs' : 'text-xs md:text-sm'
              } text-gray-300`}
            >
              กดเล่นเพื่อดูวิธีการใช้งาน
            </div>
            <a href="/guide" target="_blank">
              <button
                className={`mt-4 ${
                  responsiveEvent.mobileIs ? 'px-4 py-2' : 'px-4 py-2 md:px-6 md:py-2'
                } bg-[#F6C945] text-black rounded-lg font-medium`}
              >
                กดเพื่ออ่านรายละเอียดการใช้งาน
              </button>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Guide;

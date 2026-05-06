import { useEffect, useState } from "react";
import Steps from "../steps/Steps";

export default function GuidePage() {
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        const onYouTubeIframeAPIReady = () => {
            const player = new (window as any).YT.Player('yt-player', {
                events: {
                    onStateChange: (event: any) => {
                        if (event.data === 1) {
                            // Video is playing
                            setIsPlaying(true);
                        } else {
                            // Video is paused or stopped
                            setIsPlaying(false);
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
    }, []);
    return (
        <div className="flex flex-col justify-start items-center bg-white dark:bg-dark w-full min-h-screen">
            <div className="flex flex-col md:flex-row justify-evenly items-center bg-secondary w-full p-8 space-y-8 md:space-x-8">
                <div className="w-[400px] h-[300px] xl:w-[650px] xl:h-[400px]  rounded-2xl">

                    <iframe
                        id="yt-player"
                        className="w-full h-full  rounded-2xl"
                        src="https://www.youtube.com/embed/_opd5_pSgj0?si=XN9marnLqoWMERBB" 
                        title="YouTube video player"
 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    
                        allowFullScreen
                        ></iframe>
                </div>

                <div className="flex flex-col justify-center items-center space-y-2 md:space-y-2 text-4xl md:text-[50px]">
                    <h1 className="text-white font-semibold leading-tight">รายละเอียดวิธีการ</h1>
                    <h1 className="text-white font-semibold"></h1>
                    <h1 className="text-black  md:text-[48px] leading-tight">ลงประกาศและชำระเงิน</h1>
                </div>
            </div>
            <Steps />
        </div>
    );
}
import { GameConfig } from '../../../type';
import ListItem from '../atoms/wc-a-list-item';

interface LearnItem {
  id: number;
  title: string;
  duration?: string;
  status: 'completed' | 'active' | 'locked';
  type?: 'video' | 'article' | 'start' | 'end';
  onSubmit?: () => void;
}

const QuestionLearnComponent = ({

  gameConfig,
  learnItems = [],
  currentIndex = 0,
  onItemClick,
  onSubmit
}: {
  gameConfig: GameConfig;
  learnItems?: LearnItem[];
  currentIndex?: number;
  onItemClick?: (index: number) => void;
  onSubmit?: () => void;

}) => {
  const hasText = gameConfig.text?.trim() !== '';
  const hasVideo = !!gameConfig.url;

  // Function to convert YouTube URL to embed URL
  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return null;

    // Check if it's a YouTube URL
    const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/;
    const match = url.match(youtubeRegex);

    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }

    // If not YouTube, return original URL (for direct video files)
    return url;
  };

  const videoUrl = gameConfig.url ? getYouTubeEmbedUrl(gameConfig.url) : null;
  const isYouTube = gameConfig.url?.includes('youtube.com') || gameConfig.url?.includes('youtu.be');

  return (
    <div className="w-full h-full flex gap-4">
      {/* Content area - left side */}
      <div className="flex-1 flex items-center justify-center p-2">
        {hasVideo ? (
          <div className="w-full aspect-video border-4 border-white rounded-3xl overflow-hidden">
            {isYouTube ? (
              <iframe
                src={videoUrl || ''}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; compute-pressure;"
                allowFullScreen
                title="YouTube video"

              />
            ) : (
              <video
                src={gameConfig.url}
                controls
                className="w-full h-full object-contain bg-black"
              />
            )}
          </div>
        ) : hasText ? (
          <div className="w-full h-full flex">
            <div className="text-lg text-gray-800 leading-relaxed text-center">
              {gameConfig.text}
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-gray-500">ไม่มีเนื้อหา</div>
          </div>
        )}
      </div>

      {/* List area - right side */}
      <div className="w-[230px] bg-[rgba(255,255,255,0.8)] border-4 border-solid border-white rounded-tl-3xl rounded-bl-2xl overflow-hidden">
        <div className="h-full overflow-y-auto flex flex-col">
          {learnItems && learnItems.length > 0 ? (
            learnItems.map((item, index) => {
              const isLastItem = index === learnItems.length - 1;
              const isActiveItem = item.status === 'active';

              return (
                <ListItem
                  key={item.id || index}
                  title={item.title}
                  duration={item.duration}
                  status={item.status}
                  icon={item.type === 'end' ? 'sword' : 'arrow'}
                  onClick={() => {
                    // If clicking active item and it's the last one, submit
                    if (isActiveItem && isLastItem) {
                      onSubmit?.();
                    } else {
                      // Otherwise, let the parent handle navigation (including going back)
                      onItemClick?.(index);
                    }
                  }}
                  onSubmit={onSubmit}
                />
              );
            })
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 text-sm p-4 text-center">
              ไม่มีรายการบทเรียน
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionLearnComponent;
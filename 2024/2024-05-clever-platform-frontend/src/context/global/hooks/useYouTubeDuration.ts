import { useEffect, useState } from 'react';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface YouTubeDurationResult {
  duration: string;
  loading: boolean;
  error: boolean;
}

export const useYouTubeDuration = (videoId: string | null): YouTubeDurationResult => {
  const [duration, setDuration] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!videoId) {
      setDuration('');
      setLoading(false);
      return;
    }

    const loadAPI = async () => {
      setLoading(true);
      setError(false);

      try {
        // Load YouTube API if not already loaded
        if (!window.YT || !window.YT.Player) {
          await new Promise<void>((resolve) => {
            // Check if script is already being loaded
            const existingScript = document.querySelector('script[src="https://www.youtube.com/iframe_api"]');

            if (existingScript) {
              // Script is loading, wait for it
              window.onYouTubeIframeAPIReady = () => resolve();
            } else {
              // Add new script
              const tag = document.createElement('script');
              tag.src = 'https://www.youtube.com/iframe_api';
              document.head.appendChild(tag);

              window.onYouTubeIframeAPIReady = () => resolve();
            }
          });
        }

        // Create temporary player to get duration
        const tempDiv = document.createElement('div');
        tempDiv.id = `temp-player-${videoId}-${Date.now()}`;
        tempDiv.style.display = 'none';
        document.body.appendChild(tempDiv);

        new window.YT.Player(tempDiv.id, {
          videoId: videoId,
          events: {
            onReady: (event: any) => {
              const seconds = event.target.getDuration();
              const formatted = formatDuration(seconds);
              setDuration(formatted);
              event.target.destroy();
              tempDiv.remove();
              setLoading(false);
            },
            onError: () => {
              setError(true);
              tempDiv.remove();
              setLoading(false);
            }
          }
        });
      } catch (err) {
        console.error('Failed to load YouTube duration:', err);
        setError(true);
        setLoading(false);
      }
    };

    loadAPI();
  }, [videoId]);

  return { duration, loading, error };
};

const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Utility function to get YouTube duration without using a hook
 * Useful for getting multiple durations in parallel
 */
export const getYouTubeDuration = async (videoId: string): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {
      // Load YouTube API if not already loaded
      if (!window.YT || !window.YT.Player) {
        await new Promise<void>((resolveAPI) => {
          const existingScript = document.querySelector('script[src="https://www.youtube.com/iframe_api"]');

          if (existingScript) {
            window.onYouTubeIframeAPIReady = () => resolveAPI();
          } else {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            document.head.appendChild(tag);

            window.onYouTubeIframeAPIReady = () => resolveAPI();
          }
        });
      }

      // Create temporary player to get duration
      const tempDiv = document.createElement('div');
      tempDiv.id = `temp-player-${videoId}-${Date.now()}`;
      tempDiv.style.display = 'none';
      document.body.appendChild(tempDiv);

      new window.YT.Player(tempDiv.id, {
        videoId: videoId,
        events: {
          onReady: (event: any) => {
            const seconds = event.target.getDuration();
            const formatted = formatDuration(seconds);
            event.target.destroy();
            tempDiv.remove();
            resolve(formatted);
          },
          onError: (error: any) => {
            tempDiv.remove();
            reject(error);
          }
        }
      });
    } catch (err) {
      reject(err);
    }
  });
};

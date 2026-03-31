import { useEffect, useRef, memo } from "react";
import Hls from "hls.js";

interface VideoPlayerProps {
  src: string;
  className?: string;
  onLoaded?: () => void;
}

const VideoPlayer = memo(({ src, className, onLoaded }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      if (onLoaded) onLoaded();
    };

    video.addEventListener("canplaythrough", handleCanPlay);

    const hlsConfig = {
      enableWorker: true,
      maxBufferLength: 30,
      maxMaxBufferLength: 60,
      appendErrorMaxRetry: 10,
      // Helps with seamless looping by pre-fetching
      backBufferLength: 30,
    };

    if (Hls.isSupported()) {
      const hls = new Hls(hlsConfig);
      hlsRef.current = hls;
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => {});
      });
      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              hls.destroy();
              break;
          }
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      video.addEventListener("loadedmetadata", () => {
        video.play().catch(() => {});
      });
    }

    // Try to mitigate the "stutter" at the end of the loop
    const handleTimeUpdate = () => {
      if (video.duration && video.currentTime > video.duration - 0.2) {
        // We don't manually seek here as standard 'loop' attribute is usually better 
        // if the buffer is well managed by HLS.js
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      video.removeEventListener("canplaythrough", handleCanPlay);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [src, onLoaded]);

  return (
    <video
      ref={videoRef}
      className={className}
      autoPlay
      loop
      muted
      playsInline
    />
  );
});

VideoPlayer.displayName = "VideoPlayer";

export default VideoPlayer;

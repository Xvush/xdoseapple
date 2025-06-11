import React, { useRef, useEffect } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

interface VideoJSPlayerProps {
  src: string;
  poster?: string;
  autoPlay?: boolean;
}

const VideoJSPlayer: React.FC<VideoJSPlayerProps> = ({ src, poster, autoPlay = false }) => {
  const videoNode = useRef<HTMLVideoElement | null>(null);
  const playerRef = useRef<any>(null); // Fix: use 'any' for compatibility

  useEffect(() => {
    if (videoNode.current) {
      playerRef.current = videojs(videoNode.current, {
        controls: true,
        autoplay: autoPlay,
        responsive: true,
        fluid: true,
        sources: [{ src, type: src.endsWith('.m3u8') ? 'application/x-mpegURL' : 'video/mp4' }],
        poster,
      });
    }
    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
      }
    };
  }, [src, poster, autoPlay]);

  return (
    <div data-vjs-player>
      <video ref={videoNode} className="video-js vjs-big-play-centered" playsInline />
    </div>
  );
};

export default VideoJSPlayer;

// XDoseVideoPlayer.tsx
import React from "react";
import VideoJSPlayer from "./VideoJSPlayer";

export interface XDoseVideoPlayerProps {
  src: string;
  poster?: string;
  autoPlay?: boolean;
}

const XDoseVideoPlayer: React.FC<XDoseVideoPlayerProps> = ({ src, poster, autoPlay = false }) => {
  return (
    <div style={{width: '100%', maxWidth: 800, margin: '0 auto', borderRadius: '1.2rem', boxShadow: '0 4px 24px 0 rgba(80,0,180,0.10)', background: '#000'}}>
      <VideoJSPlayer src={src} poster={poster} autoPlay={autoPlay} />
    </div>
  );
};

export default XDoseVideoPlayer;

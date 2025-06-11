// XDoseVideoPlayer.tsx
import React from "react";
import VideoJSPlayer from "./VideoJSPlayer";
import './XDoseVideoPlayer.css';

export interface XDoseVideoPlayerProps {
  src: string;
  poster?: string;
  autoPlay?: boolean;
}

const XDoseVideoPlayer: React.FC<XDoseVideoPlayerProps> = ({ src, poster, autoPlay = false }) => {
  return (
    <div className="xdose-premium-player-wrapper">
      <VideoJSPlayer src={src} poster={poster} autoPlay={autoPlay} />
    </div>
  );
};

export default XDoseVideoPlayer;

// XDoseVideoPlayer.tsx
import React from "react";
import VideoJSPlayer from "./VideoJSPlayer";

export interface XDoseVideoPlayerProps {
  src: string;
  poster?: string;
  autoPlay?: boolean;
}

const XDoseVideoPlayer: React.FC<XDoseVideoPlayerProps> = ({ src, poster, autoPlay = false }) => {
  return <VideoJSPlayer src={src} poster={poster} autoPlay={autoPlay} />;
};

export default XDoseVideoPlayer;

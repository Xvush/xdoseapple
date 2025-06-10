"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, Volume1, VolumeX, Maximize, Minimize } from "lucide-react";
import "./XDoseVideoPlayer.css"; // Assure-toi que ce fichier contient le CSS mentionné plus bas

export default function XDoseVideoPlayer({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeout = useRef<NodeJS.Timeout | null>(null);

  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);

  // Lecture/Pause
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  // Volume
  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  };

  const changeVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    const video = videoRef.current;
    if (!video) return;
    video.volume = newVolume;
    setVolume(newVolume);
    setMuted(newVolume === 0);
  };

  // Plein écran
  const toggleFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen().then(() => setIsFullscreen(true));
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  };

  // Masquage auto des contrôles
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleInteraction = () => {
      setShowControls(true);
      if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
      controlsTimeout.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    };

    el.addEventListener("mousemove", handleInteraction);
    el.addEventListener("touchstart", handleInteraction);
    el.addEventListener("click", handleInteraction);

    return () => {
      el.removeEventListener("mousemove", handleInteraction);
      el.removeEventListener("touchstart", handleInteraction);
      el.removeEventListener("click", handleInteraction);
      if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
    };
  }, []);

  // Garder lecture à jour
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const updatePlayState = () => setPlaying(!video.paused);
    video.addEventListener("play", updatePlayState);
    video.addEventListener("pause", updatePlayState);
    return () => {
      video.removeEventListener("play", updatePlayState);
      video.removeEventListener("pause", updatePlayState);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="xdose-player relative w-full aspect-video bg-black rounded-xl overflow-hidden group select-none"
    >
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-contain"
        playsInline
        controls={false}
        preload="auto"
        onClick={togglePlay}
      />

      <div
        className={`controls-container absolute bottom-0 left-0 right-0 flex justify-between items-center gap-4 bg-black/60 p-2 transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Lecture */}
        <button
          onClick={togglePlay}
          className="text-white hover:text-green-400 transition"
        >
          {playing ? <Pause size={28} /> : <Play size={28} />}
        </button>

        {/* Volume */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMute}
            className="text-white hover:text-green-400 transition"
          >
            {muted || volume === 0 ? <VolumeX size={24} /> : <Volume1 size={24} />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={muted ? 0 : volume}
            onChange={changeVolume}
            className="w-24 cursor-pointer"
          />
        </div>

        {/* Plein écran */}
        <button
          onClick={toggleFullscreen}
          className="text-white hover:text-green-400 transition"
        >
          {isFullscreen ? <Minimize size={24} /> : <Maximize size={24} />}
        </button>
      </div>
    </div>
  );
}

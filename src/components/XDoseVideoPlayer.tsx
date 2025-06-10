// Composant React complet : lecteur vidéo interactif premium XDoseVideoPlayer

import { useRef, useState, useEffect } from "react";
import { Maximize2, Minimize2, Pause, Play, Volume1, VolumeX } from "lucide-react";
import "./XDoseVideoPlayer.css";

export default function XDoseVideoPlayer({ src }) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const controlsTimeout = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(true);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  // Synchronise play/pause
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
    };
  }, []);

  // Synchronise volume/mute
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.volume = volume;
    video.muted = muted;
  }, [volume, muted]);

  // Durée et temps courant
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleLoadedMetadata = () => setDuration(video.duration);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, []);

  // Fullscreen natif
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      setShowControls(true);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Auto-hide des contrôles
  useEffect(() => {
    if (!isPlaying || !isFullscreen) return;
    if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
    controlsTimeout.current = setTimeout(() => setShowControls(false), 3000);
    return () => controlsTimeout.current && clearTimeout(controlsTimeout.current);
  }, [isPlaying, isFullscreen, showControls]);

  // Play/pause robuste
  const togglePlay = async (e) => {
    if (e) e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    try {
      if (video.paused || video.ended) {
        await video.play();
      } else {
        video.pause();
      }
    } catch (error) {
      // ignore AbortError
    }
  };

  // Volume
  const toggleMute = (e) => {
    if (e) e.stopPropagation();
    setMuted((m) => !m);
  };
  const changeVolume = (e) => {
    setVolume(parseFloat(e.target.value));
    setMuted(e.target.value === "0");
  };

  // Seek
  const handleSeek = (e) => {
    const video = videoRef.current;
    if (!video) return;
    const newTime = parseFloat(e.target.value);
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Fullscreen
  const toggleFullscreen = (e) => {
    if (e) e.stopPropagation();
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  // Format temps
  const formatTime = (s) => {
    if (isNaN(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  return (
    <div
      ref={containerRef}
      className="xdose-player relative w-full aspect-video bg-black rounded-xl overflow-hidden group select-none"
      tabIndex={0}
      onMouseMove={() => setShowControls(true)}
      onClick={() => setShowControls(true)}
      onMouseLeave={() => isFullscreen && setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-contain"
        playsInline
        controls={false}
        preload="auto"
        muted={muted}
        autoPlay
        onClick={e => { if (!isPlaying) togglePlay(e); }}
        tabIndex={-1}
      />

      {/* Overlay bouton play centré si la vidéo est en pause */}
      {!isPlaying && (
        <button
          className="absolute inset-0 flex items-center justify-center z-30 bg-black/30 hover:bg-black/40 transition"
          style={{ pointerEvents: 'auto' }}
          aria-label="Lecture"
          onClick={e => { e.stopPropagation(); togglePlay(e); }}
        >
          <Play size={64} className="text-white drop-shadow-lg" />
        </button>
      )}

      {/* Barre de progression custom tout en bas */}
      <div className="absolute left-0 right-0 bottom-0 z-20 h-2 flex items-center">
        <input
          type="range"
          min={0}
          max={duration}
          step={0.1}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-2 accent-green-400 bg-transparent cursor-pointer progress-bar"
          aria-label="Barre de progression"
        />
      </div>

      {/* Contrôles premium */}
      {showControls && (
        <div
          className={`controls-container absolute bottom-2 left-0 right-0 flex justify-between items-center gap-4 bg-black/60 p-2 transition-opacity duration-300 z-30 ${
            showControls || !isFullscreen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={e => e.stopPropagation()}
          onMouseDown={e => e.stopPropagation()}
        >
          {/* Lecture */}
          <button
            onClick={togglePlay}
            className="text-white hover:text-green-400 transition"
            aria-label={isPlaying ? "Pause" : "Lecture"}
            tabIndex={0}
          >
            {isPlaying ? <Pause size={28} /> : <Play size={28} />}
          </button>

          {/* Volume */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleMute}
              className="text-white hover:text-green-400 transition"
              aria-label={muted || volume === 0 ? "Activer le son" : "Couper le son"}
              tabIndex={0}
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
              aria-label="Volume"
            />
          </div>

          {/* Temps */}
          <div className="text-white text-xs font-mono min-w-[60px] text-center select-none">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>

          {/* Plein écran */}
          <button
            onClick={toggleFullscreen}
            className="text-white hover:text-green-400 transition"
            aria-label={isFullscreen ? "Quitter le plein écran" : "Plein écran"}
            tabIndex={0}
          >
            {isFullscreen ? <Minimize2 size={24} /> : <Maximize2 size={24} />}
          </button>
        </div>
      )}
    </div>
  );
}

// Composant React complet : lecteur vidéo interactif premium XDoseVideoPlayer

import { useRef, useState, useEffect } from "react";
import { Maximize2, Minimize2, Pause, Play, Volume1, VolumeX } from "lucide-react";
import "./XDoseVideoPlayer.css";
import Hls from "hls.js";
import { useIsMobile } from "../hooks/use-mobile";

export default function XDoseVideoPlayer({ src }) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const controlsTimeout = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(true);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showVolumeDrawer, setShowVolumeDrawer] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [showTooltip, setShowTooltip] = useState(null);
  const [hasInteracted, setHasInteracted] = useState(false); // Nouvel état pour l'interaction utilisateur
  const isMobile = useIsMobile();
  const [isPaused, setIsPaused] = useState(true);
  const [hasEnded, setHasEnded] = useState(false);

  // Synchronise play/pause
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("ended", handleEnded);
    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("ended", handleEnded);
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
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

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

  // HLS.js pour lecture universelle
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let hls;
    if (src && src.endsWith('.m3u8') && !video.canPlayType('application/vnd.apple.mpegurl')) {
      if (Hls.isSupported()) {
        hls = new Hls();
        hls.loadSource(src);
        hls.attachMedia(video);
      }
    } else {
      video.src = src;
    }
    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [src]);

  // Gestion du loader circulaire (affiché si buffering > 300ms)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let timeout;
    const handleWaiting = () => {
      timeout = setTimeout(() => setShowLoader(true), 300);
    };
    const handlePlaying = () => {
      clearTimeout(timeout);
      setShowLoader(false);
    };
    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("playing", handlePlaying);
    video.addEventListener("seeked", handlePlaying);
    return () => {
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("playing", handlePlaying);
      video.removeEventListener("seeked", handlePlaying);
      clearTimeout(timeout);
    };
  }, []);

  // Marque l'interaction utilisateur dès le premier play/pause
  useEffect(() => {
    if (isPlaying && !hasInteracted) setHasInteracted(true);
  }, [isPlaying, hasInteracted]);

  return (
    <div
      ref={containerRef}
      className="xdose-player relative w-full aspect-video bg-black rounded-xl overflow-hidden group select-none"
      tabIndex={0}
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

      {/* Overlay “tap to play” avant lecture (mobile) */}
      {!isPlaying && !hasInteracted && (
        <button
          className="absolute inset-0 flex flex-col items-center justify-center z-40 bg-black/40 transition animate-fade-in"
          style={{ pointerEvents: 'auto' }}
          aria-label="Appuyez pour lancer la lecture"
          onClick={e => { e.stopPropagation(); setHasInteracted(true); togglePlay(e); }}
        >
          <Play size={64} className="text-white drop-shadow-lg mb-4" />
          <span className="text-white text-base font-semibold">Appuyez pour lire</span>
        </button>
      )}

      {/* Barre de progression custom tout en bas */}
      <div className="absolute left-0 right-0 bottom-3 z-20 h-2 flex items-center pointer-events-auto">
        <input
          type="range"
          min={0}
          max={duration}
          step={0.1}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-2 accent-brand-purple-500 bg-transparent cursor-pointer progress-bar"
          aria-label="Barre de progression"
        />
      </div>

      {/* Contrôles premium */}
      <div
        className="controls-container fixed left-1/2 bottom-8 sm:bottom-2 w-[95vw] max-w-2xl flex flex-row items-center justify-between gap-2 bg-black/60 rounded-2xl px-3 py-2 shadow-lg z-50"
        // Correction : position fixed + left: 50% + translateX(-50%) pour garantir que le container est toujours centré et visible
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: 40,
          opacity: 1,
          pointerEvents: 'auto',
          left: '50%',
          transform: 'translateX(-50%)',
          maxWidth: '98vw',
          width: '100%',
          zIndex: 99999,
        }}
        onClick={e => e.stopPropagation()}
        onMouseDown={e => e.stopPropagation()}
      >
        {/* Play/Pause central avec animation pulse */}
        <button
          onClick={togglePlay}
          className="flex items-center justify-center w-12 h-12 rounded-full bg-brand-purple-500/90 hover:bg-brand-purple-600 text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-purple-300 transition-all duration-200 animate-pulse-on-play"
          aria-label={isPlaying ? "Pause" : "Lecture"}
          tabIndex={0}
          aria-describedby="tooltip-play"
          onMouseEnter={() => setShowTooltip('play')}
          onMouseLeave={() => setShowTooltip(null)}
        >
          {isPlaying ? <Pause size={32} /> : <Play size={32} />}
        </button>
        {/* Tooltip accessible pour play/pause (desktop) */}
        {showTooltip === 'play' && (
          <div id="tooltip-play" role="tooltip" className="absolute left-1/2 -translate-x-1/2 bottom-16 bg-neutral-900 text-white text-xs rounded px-3 py-1 shadow-lg z-50 animate-fade-in">
            {isPlaying ? 'Pause' : 'Lecture'}
          </div>
        )}

        {/* Drawer/Popover pour volume et options avancées (mobile first) */}
        <div className="relative flex items-center">
          <button
            onClick={() => setShowVolumeDrawer(v => !v)}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-black/40 hover:bg-brand-purple-100 text-white hover:text-brand-purple-700 transition"
            aria-label={muted || volume === 0 ? "Activer le son" : "Couper le son"}
            tabIndex={0}
          >
            {muted || volume === 0 ? <VolumeX size={24} /> : <Volume1 size={24} />}
          </button>
          {/* Drawer volume mobile : visible si showVolumeDrawer, sinon caché */}
          {showVolumeDrawer && (
            <div className="absolute left-1/2 -translate-x-1/2 bottom-12 sm:hidden flex flex-col items-center bg-black/90 rounded-xl px-4 py-3 shadow-lg z-40 animate-fade-in">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={muted ? 0 : volume}
                onChange={changeVolume}
                className="w-32 accent-brand-purple-500"
                aria-label="Volume"
              />
            </div>
          )}
          {/* Slider volume desktop : visible uniquement sur sm+ */}
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={muted ? 0 : volume}
            onChange={changeVolume}
            className="hidden sm:inline-block w-24 ml-2 cursor-pointer accent-brand-purple-500"
            aria-label="Volume"
            tabIndex={0}
            aria-describedby="tooltip-volume"
            onMouseEnter={() => setShowTooltip('volume')}
            onMouseLeave={() => setShowTooltip(null)}
          />
          {/* Tooltip accessible pour le volume (desktop) */}
          {showTooltip === 'volume' && (
            <div id="tooltip-volume" role="tooltip" className="absolute left-1/2 -translate-x-1/2 bottom-12 bg-neutral-900 text-white text-xs rounded px-3 py-1 shadow-lg z-50 animate-fade-in">
              Régler le volume
            </div>
          )}
        </div>

        {/* Temps courant/total */}
        <div className="text-white text-xs font-mono min-w-[60px] text-center select-none">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>

        {/* Plein écran */}
        <button
          onClick={toggleFullscreen}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-black/40 hover:bg-brand-purple-100 text-white hover:text-brand-purple-700 transition"
          aria-label={isFullscreen ? "Quitter le plein écran" : "Plein écran"}
          tabIndex={0}
          style={{ zIndex: 10001 }}
        >
          {isFullscreen ? <Minimize2 size={24} /> : <Maximize2 size={24} />}
        </button>
      </div>

      {/* Loader circulaire pendant le buffering (affiché si buffering > 300ms) */}
      {showLoader && (
        <div className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none">
          <div className="w-12 h-12 border-4 border-brand-purple-500 border-t-transparent rounded-full animate-spin" aria-label="Chargement" />
        </div>
      )}
    </div>
  );
}

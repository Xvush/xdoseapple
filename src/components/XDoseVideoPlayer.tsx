// XDoseVideoPlayer.tsx
import React, { useRef, useState, useEffect } from "react";
import Hls from "hls.js";
import { Maximize2, Minimize2, Pause, Play, Volume1, VolumeX, Settings, RotateCcw, Repeat, ChevronDown, ChevronUp } from "lucide-react";
import "./XDoseVideoPlayer.css";

export interface XDoseVideoPlayerProps {
  src: string;
  poster?: string;
  subtitles?: string[];
  autoPlay?: boolean;
  controls?: boolean;
}

const XDoseVideoPlayer: React.FC<XDoseVideoPlayerProps> = ({
  src,
  poster,
  subtitles = [],
  autoPlay = false,
  controls = true,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRootRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [qualityOptions, setQualityOptions] = useState<string[]>([]);
  const [selectedQuality, setSelectedQuality] = useState<string>("auto");
  const [showSubtitles, setShowSubtitles] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeout = useRef<NodeJS.Timeout | null>(null);

  // HLS support
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let hls: Hls | null = null;
    if (src.endsWith(".m3u8") && !video.canPlayType("application/vnd.apple.mpegurl")) {
      hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.ERROR, (event, data) => {
        setError("Erreur de streaming HLS");
      });
      hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
        if (data.levels) {
          setQualityOptions(["auto", ...data.levels.map((l: any) => l.height + "p")]);
        }
      });
    }
    return () => { hls && hls.destroy(); };
  }, [src]);

  // Play/pause
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  // Volume
  const toggleMute = () => setMuted((m) => !m);
  const changeVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
    setMuted(e.target.value === "0");
  };

  // Seek
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const newTime = parseFloat(e.target.value);
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Fullscreen
  const toggleFullscreen = () => {
    const playerRoot = playerRootRef.current;
    if (!playerRoot) return;
    if (!document.fullscreenElement) {
      playerRoot.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Playback rate
  const handlePlaybackRate = (rate: number) => {
    setPlaybackRate(rate);
    if (videoRef.current) videoRef.current.playbackRate = rate;
  };

  // Time update
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const update = () => setCurrentTime(video.currentTime);
    video.addEventListener("timeupdate", update);
    video.addEventListener("loadedmetadata", () => setDuration(video.duration));
    return () => {
      video.removeEventListener("timeupdate", update);
    };
  }, []);

  // Volume/mute sync
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
      videoRef.current.muted = muted;
    }
  }, [volume, muted]);

  // Auto-hide controls after 2.5s inactivity, always visible if paused OR if mouse is over controls/settings
  useEffect(() => {
    if (!isPlaying) {
      setShowControls(true);
      if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
      return;
    }
    if (!showControls) {
      if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
      return;
    }
    if (controlsTimeout.current) clearTimeout(controlsTimeout.current);

    controlsTimeout.current = setTimeout(() => {
      const playerRoot = playerRootRef.current;
      if (playerRoot) {
        const isHovering =
          playerRoot.querySelector('.xdose-player-controls:hover') ||
          playerRoot.querySelector('.xdose-player-settings:hover');
        if (isHovering) {
          // Do nothing, keep controls visible and timer will reset on next activity
          return;
        }
      }
      setShowControls(false);
    }, 2500);

    return () => {
      if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
    };
  }, [showControls, isPlaying]);

  // Show controls on user activity (mousemove, touch, click, scroll)
  const showControlsOnActivity = () => setShowControls(true);

  useEffect(() => {
    const playerRoot = playerRootRef.current;
    const video = videoRef.current;
    const events = ['mousemove', 'touchstart', 'click', 'scroll'];
    const targets = [playerRoot, video].filter(Boolean);

    targets.forEach(target => {
      events.forEach(event => target!.addEventListener(event, showControlsOnActivity));
    });
    return () => {
      targets.forEach(target => {
        events.forEach(event => target!.removeEventListener(event, showControlsOnActivity));
      });
    };
  }, []);

  // Format time
  const formatTime = (s: number) => {
    if (isNaN(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  return (
    <div className="xdose-player-root" ref={playerRootRef}>
      <div className="xdose-player-video-wrapper">
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          tabIndex={0}
          controls={false}
          autoPlay={autoPlay}
          playsInline
          aria-label="Lecteur vidéo XDose"
        />
        {error && <div className="xdose-player-error">{error}</div>}
        {/* Overlay play bouton */}
        {!isPlaying && (
          <button className="xdose-player-overlay-play" onClick={togglePlay} aria-label="Lecture">
            <Play size={56} />
          </button>
        )}
      </div>
      {controls && (
        <div className={`xdose-player-controls${showControls ? '' : ' xdose-player-controls--hidden'}`} tabIndex={-1} aria-live="polite">
          {/* Play/Pause */}
          <button onClick={togglePlay} aria-label={isPlaying ? "Pause" : "Lecture"}>
            {isPlaying ? <Pause size={28} /> : <Play size={28} />}
          </button>
          {/* Volume */}
          <button onClick={toggleMute} aria-label={muted ? "Activer le son" : "Couper le son"}>
            {muted || volume === 0 ? <VolumeX size={24} /> : <Volume1 size={24} />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={muted ? 0 : volume}
            onChange={changeVolume}
            aria-label="Volume"
            className="xdose-player-slider"
          />
          {/* Progression */}
          <input
            type="range"
            min={0}
            max={duration}
            step={0.1}
            value={currentTime}
            onChange={handleSeek}
            aria-label="Barre de progression"
            className="xdose-player-progress"
          />
          <span className="xdose-player-time">{formatTime(currentTime)} / {formatTime(duration)}</span>
          {/* Vitesse */}
          <button onClick={() => setShowSettings((v) => !v)} aria-label="Paramètres">
            <Settings size={22} />
          </button>
          {/* Fullscreen */}
          <button onClick={toggleFullscreen} aria-label={isFullscreen ? "Quitter le plein écran" : "Plein écran"}>
            {isFullscreen ? <Minimize2 size={22} /> : <Maximize2 size={22} />}
          </button>
        </div>
      )}
      {/* Settings Drawer */}
      {showSettings && (
        <div className="xdose-player-settings">
          <div>
            <span>Vitesse</span>
            {[0.5, 1, 1.25, 1.5, 2].map((rate) => (
              <button key={rate} onClick={() => handlePlaybackRate(rate)} className={playbackRate === rate ? "active" : ""}>{rate}x</button>
            ))}
          </div>
          {qualityOptions.length > 0 && (
            <div>
              <span>Qualité</span>
              {qualityOptions.map((q) => (
                <button key={q} onClick={() => setSelectedQuality(q)} className={selectedQuality === q ? "active" : ""}>{q}</button>
              ))}
            </div>
          )}
          {subtitles.length > 0 && (
            <div>
              <span>Sous-titres</span>
              <button onClick={() => setShowSubtitles((v) => !v)}>{showSubtitles ? "Masquer" : "Afficher"}</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default XDoseVideoPlayer;

import React, { useRef, useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { XDoseLogo } from './XDoseLogo';
import { Pause, Play, Volume2, VolumeX, Maximize2, Loader2 } from 'lucide-react';

interface XDoseVideoPlayerProps {
  url: string;
  poster?: string;
  title?: string;
}

export const XDoseVideoPlayer: React.FC<XDoseVideoPlayerProps> = ({ url, poster, title }) => {
  const playerRef = useRef<ReactPlayer>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [fullscreen, setFullscreen] = useState(false);
  const [progress, setProgress] = useState({ played: 0, loaded: 0 });
  const [buffering, setBuffering] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  // Reprise de lecture (sauvegarde du timestamp par url)
  useEffect(() => {
    const saved = localStorage.getItem('xdose_video_' + url);
    if (saved) {
      setProgress(p => ({ ...p, played: parseFloat(saved) }));
    }
  }, [url]);
  useEffect(() => {
    if (progress.played > 0 && playing) {
      localStorage.setItem('xdose_video_' + url, progress.played.toString());
    }
  }, [progress.played, playing, url]);

  const handlePlayPause = () => {
    setPlaying(p => {
      if (!hasStarted) setHasStarted(true);
      return !p;
    });
  };
  const handleMute = () => setMuted(m => !m);
  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => setVolume(Number(e.target.value));
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTo = parseFloat(e.target.value);
    playerRef.current?.seekTo(seekTo, 'fraction');
  };
  const handleProgress = (state: any) => setProgress(state);
  const handleFullscreen = () => {
    const el = playerRef.current?.getInternalPlayer()?.parentElement;
    if (el && el.requestFullscreen) el.requestFullscreen();
  };

  // Loader pendant le buffering
  const handleBuffer = () => setBuffering(true);
  const handleBufferEnd = () => setBuffering(false);

  // Gestion de l'affichage des contrôles (auto-hide en plein écran uniquement)
  const [showControls, setShowControls] = useState(true);
  const controlsTimeout = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Affiche les contrôles au moindre mouvement/tap, puis les masque après 2s (en plein écran uniquement)
  const handleUserActivity = () => {
    setShowControls(true);
    if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
    if (document.fullscreenElement === containerRef.current) {
      controlsTimeout.current = setTimeout(() => setShowControls(false), 2000);
    }
  };

  // Plein écran sur le conteneur principal
  const handleStartAndFullscreen = () => {
    setHasStarted(true);
    setPlaying(true);
    setTimeout(() => {
      const el = containerRef.current;
      if (el) requestFullscreenCompat(el);
    }, 100);
  };

  // Réaffiche les contrôles en sortant du plein écran
  useEffect(() => {
    const onFullscreenChange = () => {
      setShowControls(true);
      if (document.fullscreenElement !== containerRef.current && controlsTimeout.current) {
        clearTimeout(controlsTimeout.current);
      }
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  // Ajoute listeners pour détecter activité utilisateur sur le conteneur
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('mousemove', handleUserActivity);
    el.addEventListener('touchstart', handleUserActivity);
    return () => {
      el.removeEventListener('mousemove', handleUserActivity);
      el.removeEventListener('touchstart', handleUserActivity);
    };
  }, [hasStarted]);

  // Fonction utilitaire pour demander le plein écran compatible navigateurs
  function requestFullscreenCompat(el: HTMLElement) {
    if (el.requestFullscreen) return el.requestFullscreen();
    // @ts-ignore
    if (el.webkitRequestFullscreen) return el.webkitRequestFullscreen();
    // @ts-ignore
    if (el.mozRequestFullScreen) return el.mozRequestFullScreen();
    // @ts-ignore
    if (el.msRequestFullscreen) return el.msRequestFullscreen();
  }

  // Lazy loading du player (IntersectionObserver)
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full aspect-video bg-black rounded-xl overflow-hidden group select-none">
      {/* Overlay branding */}
      <div className="absolute top-1 left-1 z-20 flex items-center gap-1 pointer-events-none">
        <XDoseLogo size="sm" animated className="!text-base" />
        {title && <span className="text-white text-xs font-semibold drop-shadow">{title}</span>}
      </div>
      {/* Loader pendant buffering */}
      {buffering && (
        <div className="absolute inset-0 flex items-center justify-center z-30 bg-black/40">
          <Loader2 className="animate-spin w-10 h-10 text-brand-purple-500" />
        </div>
      )}
      {/* Miniature avant lecture */}
      {!hasStarted && poster && !playing && (
        <button
          className="absolute inset-0 w-full h-full flex items-center justify-center bg-black/60 z-20"
          onClick={handleStartAndFullscreen}
        >
          <img src={poster} alt="miniature" className="w-full h-full object-cover absolute inset-0 z-0" />
          <span className="relative z-10">
            <Play className="w-16 h-16 text-white bg-brand-purple-500 rounded-full p-4 shadow-xl" />
          </span>
        </button>
      )}
      {/* Player (lazy loaded) */}
      {isVisible && (
        <ReactPlayer
          ref={playerRef}
          url={url}
          playing={playing}
          muted={muted}
          volume={volume}
          width="100%"
          height="100%"
          light={false}
          controls={false}
          onProgress={handleProgress}
          onBuffer={handleBuffer}
          onBufferEnd={handleBufferEnd}
          onPlay={() => setHasStarted(true)}
          onPause={() => setPlaying(false)}
          style={{ background: '#000' }}
          config={{
            file: {
              attributes: { poster: poster || undefined },
              forceHLS: true,
              hlsOptions: {
                enableWorker: true,
                lowLatencyMode: true,
                maxBufferLength: 30,
                maxMaxBufferLength: 60,
              },
            },
          }}
        />
      )}
      {/* Custom Controls */}
      {(showControls || document.fullscreenElement !== containerRef.current) && (
        <div className="absolute bottom-0 left-0 right-0 z-20 p-2 bg-gradient-to-t from-black/80 to-transparent flex flex-col gap-1 opacity-100 transition">
          {/* Progress bar */}
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={progress.played}
            onChange={handleSeek}
            className="w-full accent-brand-purple-500 h-1 cursor-pointer"
          />
          <div className="flex items-center justify-between gap-1">
            <button onClick={handlePlayPause} className="bg-white/20 hover:bg-white/40 text-white rounded-full p-1.5">
              {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button onClick={handleMute} className="bg-white/20 hover:bg-white/40 text-white rounded-full p-1.5">
              {muted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={handleVolume}
              className="accent-brand-purple-500 h-1 w-14 cursor-pointer"
            />
            <button onClick={handleFullscreen} className="bg-white/20 hover:bg-white/40 text-white rounded-full p-1.5 ml-auto">
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

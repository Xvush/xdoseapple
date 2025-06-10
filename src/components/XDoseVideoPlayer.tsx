import React, { useRef, useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { Pause, Play, Volume2, VolumeX, Maximize2, Loader2 } from 'lucide-react';
import './XDoseVideoPlayer.css';

interface XDoseVideoPlayerProps {
  url: string;
  poster?: string;
}

export const XDoseVideoPlayer: React.FC<XDoseVideoPlayerProps> = ({ url, poster }) => {
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

  // Affiche les contrôles au clic/tap sur toute la zone vidéo (même en plein écran), et au mouvement souris sur desktop
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handleInteraction = () => {
      setShowControls(true);
      if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
      controlsTimeout.current = setTimeout(() => setShowControls(false), 3000);
    };
    el.addEventListener('click', handleInteraction);
    el.addEventListener('touchstart', handleInteraction);
    el.addEventListener('mousemove', handleInteraction); // UX desktop : apparition au survol
    return () => {
      el.removeEventListener('click', handleInteraction);
      el.removeEventListener('touchstart', handleInteraction);
      el.removeEventListener('mousemove', handleInteraction);
      if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
    };
  }, []);

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

  // Ajout d'un bouton pour quitter le plein écran
  const handleExitFullscreen = () => {
    if (document.exitFullscreen) document.exitFullscreen();
    // @ts-ignore
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    // @ts-ignore
    else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
    // @ts-ignore
    else if (document.msExitFullscreen) document.msExitFullscreen();
  };

  // Les contrôles ne sont visibles que si showControls est true
  return (
    <div
      ref={containerRef}
      className="xdose-player relative w-full aspect-video bg-black rounded-xl overflow-hidden group select-none"
      style={{ touchAction: 'manipulation' }}
    >
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
      {/* Custom Controls (affichés uniquement si showControls) */}
      {showControls && (
        <div className="controls-container absolute left-0 right-0 bottom-0 z-20 flex flex-col gap-0 pointer-events-none">
          {/* Progress bar tout en bas */}
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={progress.played}
            onChange={handleSeek}
            className="w-full accent-brand-purple-500 h-2 cursor-pointer rounded-lg bg-neutral-200/60 pointer-events-auto"
            aria-label="Avancer/Reculer"
            style={{ position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 30 }}
          />
          {/* Contrôles principaux */}
          <div className="flex items-center justify-between gap-2 px-1 py-1 pointer-events-auto" style={{ position: 'relative', zIndex: 20, marginBottom: '2.2rem' }}>
            <button
              onClick={handlePlayPause}
              aria-label={playing ? 'Pause' : 'Lecture'}
              className="bg-brand-purple-600 hover:bg-brand-purple-700 text-white rounded-full p-3 shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-purple-400 transition-all"
              style={{ minWidth: 44, minHeight: 44 }}
            >
              {playing ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </button>
            <button
              onClick={handleMute}
              aria-label={muted || volume === 0 ? 'Activer le son' : 'Couper le son'}
              className="bg-white/20 hover:bg-white/40 text-white rounded-full p-3 focus:outline-none focus:ring-2 focus:ring-brand-purple-400 transition-all"
              style={{ minWidth: 44, minHeight: 44 }}
            >
              {muted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={handleVolume}
              className="accent-brand-purple-500 h-2 w-20 mx-2 cursor-pointer rounded-lg bg-neutral-200/60"
              aria-label="Volume"
            />
            <button
              onClick={handleFullscreen}
              aria-label="Plein écran"
              className="bg-white/20 hover:bg-white/40 text-white rounded-full p-3 ml-auto focus:outline-none focus:ring-2 focus:ring-brand-purple-400 transition-all"
              style={{ minWidth: 44, minHeight: 44 }}
            >
              <Maximize2 className="w-5 h-5" />
            </button>
            {/* Bouton quitter plein écran si on est en plein écran */}
            {document.fullscreenElement === containerRef.current && (
              <button
                onClick={handleExitFullscreen}
                aria-label="Quitter le plein écran"
                className="bg-white/20 hover:bg-white/40 text-white rounded-full p-3 ml-2 focus:outline-none focus:ring-2 focus:ring-brand-purple-400 transition-all"
                style={{ minWidth: 44, minHeight: 44 }}
              >
                {/* Utilise une icône X ou Minimize2 */}
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

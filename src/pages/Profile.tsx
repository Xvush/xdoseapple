import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Header } from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import ReactPlayer from 'react-player';

const Profile = () => {
  console.log('Profile component mounted');
  // Use id from params (not username)
  const { id } = useParams();
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [videos, setVideos] = useState([]);
  const [videoFetchError, setVideoFetchError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Correction: si pas d'id dans l'URL, utiliser l'id du user connecté
  const profileId = id || user?.id;
  const isOwner = user?.id && profileId === user.id;

  // Suppression de toute logique creator/creator.id
  useEffect(() => {
    if (!profileId) return;
    setLoading(true);
    fetch(`/api/profile-id?id=${profileId}`)
      .then(async (res) => {
        if (!res || res.status === 404) {
          setNotFound(true);
          setLoading(false);
          return;
        }
        const text = await res.text();
        try {
          const data = JSON.parse(text);
          setProfileData(data);
        } catch (e) {
          setNotFound(true);
        }
        setLoading(false);
      })
      .catch(() => {
        setNotFound(true);
        setLoading(false);
      });
  }, [profileId]);

  useEffect(() => {
    if (profileData && profileData.role === 'creator') {
      fetch(`/api/getProfileVideos.js?id=${profileData.id}`)
        .then(async res => {
          const contentType = res.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const data = await res.json();
            setVideos(data.videos || []);
            setVideoFetchError(null);
          } else {
            setVideos([]);
            setVideoFetchError("Impossible de récupérer les vidéos (erreur API)");
          }
        })
        .catch(() => {
          setVideos([]);
          setVideoFetchError("Impossible de récupérer les vidéos (erreur réseau)");
        });
    }
  }, [profileData]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <span className="text-lg text-neutral-500">Chargement du profil...</span>
      </div>
    );
  }

  if (notFound || !profileData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Profil introuvable</h1>
        <p className="text-neutral-500 mb-8">Ce profil n'existe pas ou n'est pas public.</p>
        <Button onClick={() => window.history.back()}>Retour</Button>
      </div>
    );
  }

  // If the profile is a viewer and not the owner, show 404
  if (profileData.role === 'viewer' && !isOwner) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Profil introuvable</h1>
        <p className="text-neutral-500 mb-8">Ce profil n'est pas public.</p>
        <Button onClick={() => window.history.back()}>Retour</Button>
      </div>
    );
  }

  return (
    <div className="pb-20 bg-white min-h-screen">
      <Header currentView="profile" onViewChange={() => {}} />
      <div className="pt-20 max-w-md mx-auto">
        {/* Cover Image */}
        <div className="relative h-48 bg-gradient-to-br from-neutral-100 to-neutral-200 overflow-hidden">
          <img 
            src={profileData.coverImage} 
            alt="Cover" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </div>
        {/* Profile Info */}
        <div className="px-6 -mt-12 relative z-10">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden mb-4 bg-white shadow-lg">
            <img 
              src={profileData.avatar} 
              alt={profileData.name} 
              className="w-full h-full object-cover"
            />
          </div>
          {/* Bouton Create pour le créateur propriétaire */}
          {isOwner && profileData.role === 'creator' && (
            <div className="flex justify-end mb-4">
              <Button
                className="flex items-center gap-2 px-5 py-2 rounded-xl font-medium bg-gradient-to-r from-brand-purple-500 to-brand-teal-500 hover:from-brand-purple-600 hover:to-brand-teal-600 text-white shadow-lg"
                onClick={e => {
                  e.preventDefault();
                  if (isOwner && profileData.role === 'creator') {
                    console.log('Navigating to /studio');
                    navigate('/studio');
                  }
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                Create
              </Button>
            </div>
          )}
          {/* Name and Bio */}
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-2">
              <h1 className="text-2xl font-bold text-neutral-900">{profileData.name}</h1>
              {profileData.isVerified && (
                <div className="w-5 h-5 bg-brand-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
              <span className="text-xs px-2 py-1 bg-brand-purple-100 text-brand-purple-700 rounded-full capitalize">
                {profileData.role}
              </span>
            </div>
            <p className="text-neutral-700 text-balance leading-relaxed mb-4">
              {profileData.bio}
            </p>
          </div>
          {/* Stats */}
          <div className="flex justify-around py-4 mb-6 bg-neutral-50 rounded-xl">
            <div className="text-center">
              <div className="text-xl font-bold text-neutral-900">{profileData.posts}</div>
              <div className="text-sm text-neutral-500">Posts</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-neutral-900">{profileData.followers}</div>
              <div className="text-sm text-neutral-500">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-neutral-900">{profileData.following}</div>
              <div className="text-sm text-neutral-500">Following</div>
            </div>
          </div>
          {/* Action Buttons */}
          {profileData.role === 'creator' && (
            <>
              <div className="flex space-x-3 mb-8">
                <Button className="flex-1 bg-gradient-to-r from-brand-purple-500 to-brand-teal-500 hover:from-brand-purple-600 hover:to-brand-teal-600 text-white rounded-xl font-medium">
                  Subscribe
                </Button>
                <Button className="flex-1 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl font-medium">
                  Tip
                </Button>
              </div>
              {/* Subscription Card */}
              <div className="glass-card rounded-2xl p-6 mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-neutral-900 mb-1">Premium Content</h3>
                    <p className="text-sm text-neutral-600">Exclusive access to my creations</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-brand-purple-600">{profileData.subscriptionPrice}</div>
                    <div className="text-xs text-neutral-500">per month</div>
                  </div>
                </div>
              </div>
            </>
          )}
          {/* Action Buttons et config uniquement pour le propriétaire creator */}
          {isOwner && profileData.role === 'creator' && (
            <div className="flex space-x-3 mb-8">
              <Button className="flex-1 bg-gradient-to-r from-brand-purple-500 to-brand-teal-500 hover:from-brand-purple-600 hover:to-brand-teal-600 text-white rounded-xl font-medium">
                Gérer mon abonnement
              </Button>
              <Button className="flex-1 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl font-medium" onClick={() => navigate('/edit-profile')}>
                Modifier mon profil
              </Button>
            </div>
          )}
          {/* Découverte et achat de vidéos pour tous les visiteurs sur les profils créateurs */}
          {profileData.role === 'creator' && !isOwner && (
            <div className="flex space-x-3 mb-8">
              <Button className="flex-1 bg-gradient-to-r from-brand-purple-500 to-brand-teal-500 text-white rounded-xl font-medium">
                S'abonner pour accéder au contenu premium
              </Button>
              <Button className="flex-1 bg-neutral-900 text-white rounded-xl font-medium">
                Acheter une vidéo
              </Button>
            </div>
          )}
          {/* Content Tabs */}
          <div className="flex border-b border-neutral-200 mb-6">
            <button className="flex-1 py-3 text-sm font-medium text-brand-purple-600 border-b-2 border-brand-purple-600">
              Posts
            </button>
            {profileData.role === 'creator' && (
              <>
                <button className="flex-1 py-3 text-sm font-medium text-neutral-500">
                  Premium
                </button>
                <button className="flex-1 py-3 text-sm font-medium text-neutral-500">
                  NFTs
                </button>
              </>
            )}
          </div>
          {/* Posts Grid */}
          <div className="grid grid-cols-2 gap-2 pb-8">
            {videos.map((video, index) => (
              <div key={video.id} className="aspect-square rounded-xl overflow-hidden hover-lift bg-black flex items-center justify-center">
                <ReactPlayer
                  url={`https://stream.mux.com/${video.muxPlaybackId}.m3u8`}
                  controls
                  width="100%"
                  height="100%"
                  light={video.thumbnailUrl || false}
                  pip
                  config={{
                    file: {
                      attributes: {
                        crossOrigin: 'anonymous',
                        poster: video.thumbnailUrl || undefined,
                      },
                      forceHLS: true,
                      hlsOptions: {
                        enableWorker: true,
                        lowLatencyMode: true,
                      },
                    },
                  }}
                  style={{ background: '#000', borderRadius: '1rem' }}
                  playIcon={<button className="bg-brand-purple-500 text-white rounded-full p-3 shadow-lg">▶</button>}
                />
              </div>
            ))}
            {videoFetchError && (
              <div className="col-span-2 text-center text-red-500 py-4">
                {videoFetchError}
              </div>
            )}
          </div>
        </div>
      </div>
      <BottomNavigation currentView="profile" onViewChange={() => {}} />
    </div>
  );
};

export default Profile;

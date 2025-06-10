import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Header } from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import XDoseVideoPlayer from '@/components/XDoseVideoPlayer';
import { EditVideoModal } from '@/components/EditVideoModal';

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
  const [editingVideo, setEditingVideo] = useState(null);
  const navigate = useNavigate();

  // Correction: si pas d'id dans l'URL, utiliser l'id du user connecté
  const profileId = id || user?.id;
  const isOwner = user?.id && profileId === user.id;

  // Suppression de toute logique creator/creator.id
  useEffect(() => {
    if (!profileId) return;
    setLoading(true);
    fetch(`/api/profile?id=${profileId}`)
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
    if (profileData && profileData.id) {
      fetch(`/api/profile?videos&id=${profileData.id}`)
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

  const handleEditVideo = (video) => setEditingVideo(video);

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
    <div className="pb-20 bg-neutral-50 min-h-screen">
      <Header currentView="profile" onViewChange={() => {}} />
      <div className="pt-20 max-w-2xl mx-auto w-full">
        {/* Cover Image */}
        <div className="relative h-48 bg-gradient-to-br from-neutral-100 to-neutral-200 overflow-hidden">
          <img 
            src={profileData.cover || '/placeholder.svg'} 
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
              src={profileData.avatar || '/placeholder.svg'} 
              alt={profileData.displayName || 'avatar'} 
              className="w-full h-full object-cover"
            />
          </div>
          {/* Bouton Create pour le créateur propriétaire */}
          {isOwner && profileData.role === 'CREATOR' && (
            <div className="flex justify-end mb-4">
              <Button
                className="flex items-center gap-2 px-5 py-2 rounded-xl font-medium bg-gradient-to-r from-brand-purple-500 to-brand-teal-500 hover:from-brand-purple-600 hover:to-brand-teal-600 text-white shadow-lg"
                onClick={e => {
                  e.preventDefault();
                  navigate('/studio');
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
              <h1 className="text-2xl font-bold text-neutral-900">{profileData.displayName}</h1>
              {profileData.isVerified && (
                <div className="w-5 h-5 bg-brand-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
              <span className="text-xs px-2 py-1 bg-brand-purple-100 text-brand-purple-700 rounded-full capitalize">
                {profileData.role?.toLowerCase()}
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
          {profileData.role === 'CREATOR' && (
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
          {isOwner && profileData.role === 'CREATOR' && (
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
          {profileData.role === 'CREATOR' && !isOwner && (
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
            {profileData.role === 'CREATOR' && (
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
          {/* Posts List (1 vidéo par étage, centré, responsive) */}
          <div className="flex flex-col gap-12 pb-8">
            {videos.map((video, index) => (
              <div key={video.id} className="w-full flex flex-col items-center">
                <div className="w-full max-w-2xl rounded-t-2xl overflow-hidden bg-black flex flex-col items-center justify-center p-2 relative group shadow-xl">
                  <XDoseVideoPlayer
                    src={`https://stream.mux.com/${video.muxPlaybackId}.m3u8`}
                  />
                  {/* Bouton Editer pour le créateur propriétaire */}
                  {isOwner && profileData.role === 'CREATOR' && (
                    <button
                      className="absolute top-2 right-2 bg-white/80 hover:bg-brand-purple-100 text-brand-purple-700 rounded-full p-2 shadow transition-opacity opacity-0 group-hover:opacity-100"
                      onClick={() => handleEditVideo(video)}
                      title="Éditer la vidéo"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 00-4-4l-8 8v3zm0 0v3h3" /></svg>
                    </button>
                  )}
                </div>
                {/* Bloc métadonnées sous le lecteur, dans le blanc, arrondi et ombre */}
                <div className="w-full max-w-2xl bg-white px-5 pt-4 pb-6 rounded-b-2xl shadow-xl border-x border-b border-neutral-200">
                  <div className="font-semibold text-lg text-neutral-900 mb-1 truncate" title={video.title}>{video.title}</div>
                  {Array.isArray(video.tags) && video.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {video.tags.map((tag, i) => (
                        <span key={i} className="inline-block bg-brand-purple-100 text-brand-purple-700 text-xs px-3 py-1 rounded-full">#{tag}</span>
                      ))}
                    </div>
                  )}
                  {video.description && (
                    <div className="text-base text-neutral-600 whitespace-pre-line" title={video.description}>{video.description}</div>
                  )}
                </div>
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
      {editingVideo && (
        <EditVideoModal
          video={editingVideo}
          onClose={() => setEditingVideo(null)}
          onUpdate={updated => {
            setVideos(videos => videos.map(v => v.id === updated.id ? updated : v));
            setEditingVideo(null);
          }}
          userId={user?.id}
        />
      )}
    </div>
  );
};

export default Profile;

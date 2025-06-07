import { useParams } from "react-router-dom";
import { ArrowLeft, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Header } from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";

const Profile = () => {
  const { username } = useParams();
  const { user } = useAuth();

  // Détermine si le profil affiché est celui du user connecté
  const isOwner = user?.username && username === user.username;

  // Simule une récupération de profil créateur (à remplacer par un vrai fetch si besoin)
  // Si on visite un profil qui n'est pas le sien, on affiche un profil "public" (readonly)
  // Pour l'instant, on utilise les mêmes données mockées
  const profileData = isOwner
    ? {
        name: user?.username || "User",
        username: user?.username || "user",
        avatar: "/images/profile.png",
        coverImage: "/images/profile.png",
        bio: user?.bio || "Content creator and visual storyteller. Adding perspective to capture beauty and emotion.",
        followers: user?.followers || "12.5K",
        following: user?.following || "892",
        posts: user?.posts || "156",
        subscriptionPrice: user?.subscription_price || "9.99€/month",
        isVerified: user?.is_verified || false,
        role: user?.role || "viewer",
      }
    : {
        name: username || "Créateur",
        username: username || "creator",
        avatar: "/images/profile.png",
        coverImage: "/images/profile.png",
        bio: "Profil public du créateur. Découvrez ses contenus premium.",
        followers: "12.5K",
        following: "892",
        posts: "156",
        subscriptionPrice: "9.99€/month",
        isVerified: true,
        role: "creator",
      };

  const posts = [
    "/lovable-uploads/7ec6a124-1c1b-4e01-80a9-cb913f60aaba.png",
    "/lovable-uploads/d165fa45-7ad1-4879-ad72-974e27879f72.png",
    "/lovable-uploads/99b5ec0d-8b0b-4099-b7eb-04f239fe2d31.png",
    "/lovable-uploads/5ae50604-431b-4b7c-b9a4-ff64cfbff468.png",
  ];

  // Si le profil est celui d'un viewer et que ce n'est pas le sien, afficher 404
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
              <Button className="flex-1 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl font-medium">
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
            {posts.map((post, index) => (
              <div key={index} className="aspect-square rounded-xl overflow-hidden hover-lift">
                <img 
                  src={post} 
                  alt={`Post ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <BottomNavigation currentView="profile" onViewChange={() => {}} />
    </div>
  );
};

export default Profile;

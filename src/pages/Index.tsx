
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { BottomNavigation } from "@/components/BottomNavigation";
import { FeedView } from "@/components/FeedView";
import { SearchView } from "@/components/SearchView";
import { CreateView } from "@/components/CreateView";
import { ProfileView } from "@/components/ProfileView";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

type ViewType = 'feed' | 'search' | 'create' | 'profile';

const Index = () => {
  const [currentView, setCurrentView] = useState<ViewType>('feed');
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      // Show welcome screen for non-authenticated users
    }
  }, [user, loading]);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'feed':
        return <FeedView />;
      case 'search':
        return <SearchView />;
      case 'create':
        return <CreateView />;
      case 'profile':
        return <ProfileView />;
      default:
        return <FeedView />;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">XDose</h1>
          <div className="animate-spin w-8 h-8 border-2 border-gray-300 border-t-black rounded-full mx-auto"></div>
        </div>
      </div>
    );
  }

  // Welcome screen for non-authenticated users
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">XDose</h1>
          <p className="text-lg text-gray-600 mb-8">
            La plateforme premium pour créateurs de contenu vidéo
          </p>
          <div className="space-y-3">
            <Button
              onClick={() => navigate('/auth')}
              className="w-full bg-black text-white rounded-xl h-12 font-medium hover:bg-black/90"
            >
              Commencer
            </Button>
            <p className="text-sm text-gray-500">
              Rejoignez notre communauté de créateurs
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated user view
  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentView={currentView} onViewChange={setCurrentView} />
      {renderCurrentView()}
      <BottomNavigation currentView={currentView} onViewChange={setCurrentView} />
    </div>
  );
};

export default Index;

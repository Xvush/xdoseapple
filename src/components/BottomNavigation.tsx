import { Home, Search, Plus, User, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

interface BottomNavigationProps {
  currentView: 'feed' | 'search' | 'create' | 'profile' | 'discover';
  onViewChange: (view: 'feed' | 'search' | 'create' | 'profile' | 'discover') => void;
}

export function BottomNavigation({ currentView, onViewChange }: BottomNavigationProps) {
  const { user } = useAuth();

  const navItems = [
    { id: 'feed' as const, icon: Home, label: 'Feed' },
    { id: 'discover' as const, icon: Compass, label: 'Découvrir' },
    { id: 'search' as const, icon: Search, label: 'Search' },
    { id: 'create' as const, icon: Plus, label: 'Create' },
    { id: 'profile' as const, icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-t border-gray-200">
      <div className="max-w-md mx-auto px-4 py-2">
        <div className="flex items-center justify-around">
          {navItems.map(({ id, icon: Icon, label }) => (
            <Button
              key={id}
              variant="ghost"
              size="sm"
              onClick={() => {
                if (id === 'feed') window.location.href = '/feed';
                else if (id === 'discover') window.location.href = '/discover';
                else if (id === 'profile') {
                  if (user?.id) {
                    window.location.href = `/profile/${user.id}`;
                  } else {
                    window.location.href = '/profile';
                  }
                }
                // Ajoute ici la navigation pour les autres onglets si besoin
              }}
              className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors ${
                currentView === id 
                  ? 'text-black bg-gray-100' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{label}</span>
            </Button>
          ))}
        </div>
      </div>
    </nav>
  );
}

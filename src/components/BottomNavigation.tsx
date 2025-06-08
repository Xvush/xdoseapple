import { Home, Search, Plus, User, Compass, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

interface BottomNavigationProps {
  currentView: 'feed' | 'search' | 'create' | 'profile' | 'discover' | 'studio';
  onViewChange: (view: 'feed' | 'search' | 'create' | 'profile' | 'discover' | 'studio') => void;
}

export function BottomNavigation({ currentView, onViewChange }: BottomNavigationProps) {
  const { user } = useAuth();
  const navItems = [
    { id: 'feed' as const, icon: Home, label: 'Feed' },
    { id: 'discover' as const, icon: Compass, label: 'Découvrir' },
    { id: 'search' as const, icon: Search, label: 'Search' },
    { id: 'create' as const, icon: Plus, label: 'Create' },
    // Studio will be handled separately for creators
    { id: 'profile' as const, icon: User, label: 'Profile' },
  ];
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-neutral-200 shadow-sm">
      <div className="max-w-md mx-auto flex justify-between items-center px-4 py-2">
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
                  window.location.href = '/auth';
                }
              }
              // Add navigation for other tabs if needed
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
        {/* Studio (creators only) */}
        {user && user.role === "creator" && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.location.href = '/studio'}
            className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors bg-gradient-to-tr from-brand-purple-500 to-pink-400 text-white rounded-full shadow-lg px-4 py-2 -mt-6 border-4 border-white ${currentView === 'studio' ? 'ring-2 ring-brand-purple-500' : ''}`}
            aria-label="Studio"
          >
            <Sparkles className="w-5 h-5" />
            <span className="text-xs font-medium">Studio</span>
          </Button>
        )}
      </div>
    </nav>
  );
}

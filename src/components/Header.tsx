import { User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  currentView: 'feed' | 'search' | 'create' | 'profile' | 'discover';
  onViewChange: (view: 'feed' | 'search' | 'create' | 'profile' | 'discover') => void;
}

export function Header({ currentView, onViewChange }: HeaderProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleProfileClick = () => {
    if (user?.id) {
      navigate(`/profile/${user.id}`);
    } else {
      navigate('/auth');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-md mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">XDose</h1>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="rounded-full p-2"
              onClick={handleProfileClick}
            >
              <User className="w-5 h-5 text-gray-600" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="rounded-full p-2"
              onClick={handleSignOut}
            >
              <LogOut className="w-5 h-5 text-gray-600" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

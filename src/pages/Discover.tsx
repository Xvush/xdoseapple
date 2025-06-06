import { useState } from "react";
import { Search, TrendingUp, Users, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { BottomNavigation } from "@/components/BottomNavigation";

const Discover = () => {
  const [activeTab, setActiveTab] = useState("suggestions");

  const suggestions = [
    { type: "creator", name: "Emma Photo", followers: "125k abonnés", avatar: "/lovable-uploads/5ae50604-431b-4b7c-b9a4-ff64cfbff468.png" },
    { type: "creator", name: "Visual Arts", followers: "89k abonnés", avatar: "/lovable-uploads/7ec6a124-1c1b-4e01-80a9-cb913f60aaba.png" },
    { type: "creator", name: "Alex Creator", followers: "156k abonnés", avatar: "/lovable-uploads/99b5ec0d-8b0b-4099-b7eb-04f239fe2d31.png" },
  ];

  const tabs = [
    { id: "suggestions", label: "Pour vous", icon: Users },
    { id: "trending", label: "Tendances", icon: TrendingUp },
    { id: "hashtags", label: "Hashtags", icon: Hash },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 pb-20 pt-20">
      <Header currentView="discover" onViewChange={() => {}} />
      
      <div className="px-6 py-4 space-y-6 animate-spring-in">
        {/* Search Bar */}
        <div className="relative">
          <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Rechercher créateurs, hashtags..."
            className="w-full pl-12 pr-4 py-3 bg-white/80 backdrop-blur-xl rounded-2xl border border-white/30 focus:outline-none focus:ring-2 focus:ring-brand-purple-500/20 transition-all duration-200"
          />
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-white/50 backdrop-blur-xl rounded-2xl p-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl transition-all duration-200 interaction-feedback ${
                  activeTab === tab.id
                    ? 'bg-brand-purple-600 text-white shadow-lg'
                    : 'text-neutral-600 hover:bg-white/50'
                }`}
              >
                <Icon size={16} />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="space-y-4">
          {activeTab === "suggestions" && (
            <>
              <div className="flex items-center space-x-2 mb-4">
                <Users size={20} className="text-brand-purple-600" />
                <h3 className="font-semibold text-neutral-800">Créateurs à suivre</h3>
              </div>
              {suggestions.map((creator, index) => (
                <div 
                  key={index}
                  className="card-elevated p-4 rounded-2xl hover-lift transition-all duration-300"
                  style={{
                    animationDelay: `${index * 100}ms`
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={creator.avatar}
                        alt={creator.name}
                        className="w-12 h-12 rounded-2xl object-cover"
                      />
                      <div>
                        <h4 className="font-medium text-neutral-800">{creator.name}</h4>
                        <p className="text-sm text-neutral-500">{creator.followers}</p>
                      </div>
                    </div>
                    <Button className="bg-brand-purple-600 hover:bg-brand-purple-700 text-white rounded-xl px-6 py-2 shadow-lg interaction-feedback">
                      Suivre
                    </Button>
                  </div>
                </div>
              ))}
            </>
          )}

          {activeTab === "trending" && (
            <div className="text-center py-12">
              <TrendingUp size={48} className="mx-auto text-neutral-300 mb-4" />
              <p className="text-neutral-500">Les tendances arrivent bientôt</p>
            </div>
          )}

          {activeTab === "hashtags" && (
            <div className="text-center py-12">
              <Hash size={48} className="mx-auto text-neutral-300 mb-4" />
              <p className="text-neutral-500">Hashtags populaires à venir</p>
            </div>
          )}
        </div>
      </div>

      <BottomNavigation currentView="discover" onViewChange={() => {}} />
    </div>
  );
};

export default Discover;

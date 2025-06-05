
import { Button } from "@/components/ui/button";
import { User, Heart, Play } from "lucide-react";

interface ContentCardProps {
  creator: {
    name: string;
    avatar: string;
    verified?: boolean;
  };
  content: {
    thumbnail: string;
    title?: string;
    duration?: string;
    isVideo?: boolean;
  };
  engagement: {
    likes: number;
    timeAgo: string;
  };
}

export function ContentCard({ creator, content, engagement }: ContentCardProps) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 mb-4">
      {/* Creator Info */}
      <div className="flex items-center justify-between p-4 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {creator.avatar ? (
              <img src={creator.avatar} alt={creator.name} className="w-full h-full object-cover" />
            ) : (
              <User className="w-5 h-5 text-gray-400" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">{creator.name}</h3>
            <p className="text-xs text-gray-500">{engagement.timeAgo}</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="text-xs px-3 py-1 h-7">
          Follow
        </Button>
      </div>

      {/* Content */}
      <div className="relative">
        <div className="aspect-video bg-gray-100 flex items-center justify-center relative overflow-hidden">
          {content.thumbnail ? (
            <img src={content.thumbnail} alt={content.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
          )}
          
          {content.isVideo && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Play className="w-5 h-5 text-white ml-0.5" fill="currentColor" />
              </div>
            </div>
          )}
          
          {content.duration && (
            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
              {content.duration}
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between p-4 pt-3">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors p-0">
            <Heart className="w-5 h-5" />
            <span className="text-sm font-medium">{engagement.likes}</span>
          </Button>
        </div>
        
        <Button variant="outline" size="sm" className="text-xs px-4 py-1.5 h-7 rounded-full border-gray-200">
          Subscribe • $9.99/mo
        </Button>
      </div>
    </div>
  );
}


import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const categories = [
  "All", "Photos", "Videos", "Trending", "Art", "Tech", "Lifestyle", "Travel"
];

const sampleSearchResults = [
  {
    title: "Majestic Mountains",
    creator: "Alex Rivera",
    thumbnail: "/lovable-uploads/bab48b91-04cf-483d-aa24-93e60d380904.png",
    isVideo: true
  },
  {
    title: "City Nightlife", 
    creator: "Emily Johnson",
    thumbnail: "/lovable-uploads/bab48b91-04cf-483d-aa24-93e60d380904.png",
    isVideo: true
  },
  {
    title: "Serene Lake",
    creator: "Sarah Chen",
    thumbnail: "/lovable-uploads/bab48b91-04cf-483d-aa24-93e60d380904.png",
    isVideo: false
  },
  {
    title: "Stray Cat",
    creator: "Mike Taylor",
    thumbnail: "/lovable-uploads/bab48b91-04cf-483d-aa24-93e60d380904.png",
    isVideo: true
  }
];

export function SearchView() {
  return (
    <div className="pt-20 pb-20 min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto px-4">
        {/* Search Header */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input 
              placeholder="Search creators, content..." 
              className="pl-10 bg-white border-gray-200 rounded-xl h-11"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {categories.map((category, index) => (
            <Button
              key={category}
              variant={index === 0 ? "default" : "outline"}
              size="sm"
              className={`flex-shrink-0 rounded-full px-4 py-1.5 text-sm ${
                index === 0 
                  ? "bg-black text-white hover:bg-black/90" 
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-2 gap-3">
          {sampleSearchResults.map((item, index) => (
            <div key={index} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
              <div className="aspect-square bg-gray-100 relative">
                <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                {item.isVideo && (
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded text-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  </div>
                )}
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-sm text-gray-900 mb-1 line-clamp-1">{item.title}</h3>
                <p className="text-xs text-gray-500">{item.creator}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

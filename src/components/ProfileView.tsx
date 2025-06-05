
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Share, BarChart3, Users, Video, Image } from "lucide-react";

export function ProfileView() {
  const stats = [
    { label: "Followers", value: "12.4K" },
    { label: "Following", value: "892" },
    { label: "Content", value: "156" },
    { label: "Revenue", value: "$2.1K" }
  ];

  const contentItems = [
    { type: "video", thumbnail: "/lovable-uploads/bab48b91-04cf-483d-aa24-93e60d380904.png", views: "2.1K" },
    { type: "photo", thumbnail: "/lovable-uploads/ca13cd5f-31f8-4add-a923-c23749a2cfd3.png", views: "892" },
    { type: "video", thumbnail: "/lovable-uploads/bab48b91-04cf-483d-aa24-93e60d380904.png", views: "3.4K" },
    { type: "photo", thumbnail: "/lovable-uploads/81ac62f4-ab9f-434f-9b0b-2c1b666bd185.png", views: "1.2K" }
  ];

  return (
    <div className="pt-20 pb-20 min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto px-4">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl p-6 mb-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden">
              <img 
                src="/lovable-uploads/81ac62f4-ab9f-434f-9b0b-2c1b666bd185.png" 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="p-2">
                <Share className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" className="p-2">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="text-center mb-4">
            <h1 className="text-xl font-bold text-gray-900 mb-1">Emma</h1>
            <p className="text-gray-600 text-sm mb-3">Photographer and visual storyteller. I add insight to captive beauty and emotion.</p>
            
            <div className="flex gap-4 mb-4">
              <Button variant="outline" size="sm" className="flex-1 rounded-full">
                Subscribe • $9.99/mo
              </Button>
              <Button variant="default" size="sm" className="bg-black text-white rounded-full px-6">
                Tip
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 pt-4 border-t border-gray-100">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="font-bold text-gray-900">{stat.value}</div>
                <div className="text-xs text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4 bg-white border border-gray-200 rounded-xl p-1">
            <TabsTrigger value="content" className="rounded-lg">Content</TabsTrigger>
            <TabsTrigger value="analytics" className="rounded-lg">Analytics</TabsTrigger>
            <TabsTrigger value="monetization" className="rounded-lg">Revenue</TabsTrigger>
          </TabsList>
          
          <TabsContent value="content">
            <div className="grid grid-cols-2 gap-3">
              {contentItems.map((item, index) => (
                <div key={index} className="relative bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
                  <div className="aspect-square bg-gray-100">
                    <img src={item.thumbnail} alt="Content" className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute top-2 left-2">
                    {item.type === 'video' ? (
                      <Video className="w-4 h-4 text-white" />
                    ) : (
                      <Image className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {item.views}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="analytics">
            <Card className="p-6 border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <BarChart3 className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Analytics Overview</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Views</span>
                  <span className="font-semibold">45.2K</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Engagement Rate</span>
                  <span className="font-semibold">8.4%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">New Followers</span>
                  <span className="font-semibold">+234</span>
                </div>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="monetization">
            <Card className="p-6 border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Revenue Summary</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subscriptions</span>
                  <span className="font-semibold">$1,892</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tips</span>
                  <span className="font-semibold">$156</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Premium Content</span>
                  <span className="font-semibold">$87</span>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

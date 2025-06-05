
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Video, Camera, Image, Mic, Sparkles } from "lucide-react";

const createOptions = [
  {
    icon: Video,
    title: "Record Video",
    description: "Create a new video with built-in editing tools",
    color: "from-blue-500 to-purple-600"
  },
  {
    icon: Camera,
    title: "Take Photo",
    description: "Capture and edit stunning photos",
    color: "from-green-500 to-blue-500"
  },
  {
    icon: Image,
    title: "Upload Media",
    description: "Upload existing photos or videos",
    color: "from-orange-500 to-red-500"
  },
  {
    icon: Sparkles,
    title: "AI Studio",
    description: "Create content with AI assistance",
    color: "from-purple-500 to-pink-500"
  }
];

export function CreateView() {
  return (
    <div className="pt-20 pb-20 min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Content</h1>
          <p className="text-gray-600">Share your creativity with the world</p>
        </div>

        {/* Create Options */}
        <div className="space-y-4">
          {createOptions.map((option, index) => (
            <Card key={index} className="p-6 border-gray-200 hover:shadow-lg transition-all duration-200 cursor-pointer">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${option.color} flex items-center justify-center`}>
                  <option.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{option.title}</h3>
                  <p className="text-sm text-gray-600">{option.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Recent Drafts */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Drafts</h2>
          <div className="space-y-3">
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Video className="w-5 h-5 text-gray-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">Untitled Video</h4>
                  <p className="text-sm text-gray-500">Draft • 2 hours ago</p>
                </div>
                <Button variant="outline" size="sm">Continue</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

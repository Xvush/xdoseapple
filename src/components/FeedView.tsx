
import { ContentCard } from "./ContentCard";

const sampleContent = [
  {
    creator: {
      name: "Jane Cooper",
      avatar: "/lovable-uploads/48425c32-77f6-44ad-b002-c97f70701bf5.png",
      verified: true
    },
    content: {
      thumbnail: "/lovable-uploads/bab48b91-04cf-483d-aa24-93e60d380904.png",
      title: "Majestic Mountains",
      duration: "2:34",
      isVideo: true
    },
    engagement: {
      likes: 212,
      timeAgo: "5h"
    }
  },
  {
    creator: {
      name: "Alex Rivera",
      avatar: "",
      verified: false
    },
    content: {
      thumbnail: "/lovable-uploads/bab48b91-04cf-483d-aa24-93e60d380904.png",
      title: "City Nightlife",
      duration: "1:45",
      isVideo: true
    },
    engagement: {
      likes: 89,
      timeAgo: "8h"
    }
  },
  {
    creator: {
      name: "Emma",
      avatar: "/lovable-uploads/81ac62f4-ab9f-434f-9b0b-2c1b666bd185.png",
      verified: true
    },
    content: {
      thumbnail: "/lovable-uploads/ca13cd5f-31f8-4add-a923-c23749a2cfd3.png",
      title: "Portrait Session",
      duration: "3:12",
      isVideo: true
    },
    engagement: {
      likes: 456,
      timeAgo: "12h"
    }
  }
];

export function FeedView() {
  return (
    <div className="pt-20 pb-20 min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto px-4">
        <div className="space-y-0">
          {sampleContent.map((item, index) => (
            <ContentCard
              key={index}
              creator={item.creator}
              content={item.content}
              engagement={item.engagement}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

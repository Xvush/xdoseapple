import { HeartIcon } from "@heroicons/react/24/solid";

interface FeedMainCardProps {
  image: string;
  username: string;
  likes: number;
  timeAgo: string;
}

export default function FeedMainCard({ image, username, likes, timeAgo }: FeedMainCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <img src={image} alt={username} className="w-full aspect-[4/3] object-cover" />
      <div className="flex items-center justify-between px-3 py-2">
        <span className="font-medium text-[#222]">{username}</span>
        <span className="flex items-center gap-1 text-[#555]">
          <HeartIcon className="w-5 h-5" />
          {likes}
        </span>
      </div>
      <div className="px-3 pb-2 text-xs text-[#888]">{timeAgo}</div>
    </div>
  );
}

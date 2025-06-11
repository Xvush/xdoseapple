import { PlayIcon } from "@heroicons/react/24/solid";

interface FeedGridCardProps {
  image: string;
  username: string;
  timeAgo: string;
  isVideo?: boolean;
}

export default function FeedGridCard({ image, username, timeAgo, isVideo }: FeedGridCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden relative">
      <img src={image} alt={username} className="w-full aspect-square object-cover" />
      {isVideo && (
        <span className="absolute inset-0 flex items-center justify-center">
          <PlayIcon className="w-12 h-12 text-white/80" />
        </span>
      )}
      <div className="px-3 py-2 font-medium text-[#222]">{username}</div>
      <div className="px-3 pb-2 text-xs text-[#888]">{timeAgo}</div>
    </div>
  );
}

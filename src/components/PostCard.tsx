import React from "react";

interface PostCardProps {
  post: {
    id: number;
    username: string;
    avatar: string;
    image: string;
    caption: string;
    likes: number;
    comments: number;
    timeAgo: string;
    isPremium?: boolean;
    price?: string;
  };
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <div className="rounded-3xl bg-white/80 shadow-lg mb-6 overflow-hidden border border-white/40 backdrop-blur-xl animate-fade-in">
      <div className="flex items-center px-4 pt-4 pb-2">
        <img
          src={post.avatar}
          alt={post.username}
          className="w-10 h-10 rounded-full object-cover border border-white/60 shadow-sm"
        />
        <div className="ml-3 flex-1">
          <div className="font-semibold text-neutral-900 text-sm">
            {post.username}
            {post.isPremium && (
              <span className="ml-2 px-2 py-0.5 text-xs rounded bg-gradient-to-r from-brand-purple-500 to-brand-purple-700 text-white font-medium align-middle">Premium</span>
            )}
          </div>
          <div className="text-xs text-neutral-400">{post.timeAgo}</div>
        </div>
        {post.isPremium && post.price && (
          <div className="text-xs font-semibold text-brand-purple-700 bg-brand-purple-100 rounded-xl px-3 py-1 ml-2">
            {post.price}
          </div>
        )}
      </div>
      <div className="w-full aspect-[4/5] bg-neutral-100">
        <img
          src={post.image}
          alt={post.caption}
          className="w-full h-full object-cover object-center transition-all duration-300 hover:scale-105"
        />
      </div>
      <div className="px-4 py-3">
        <div className="text-neutral-800 text-sm mb-2 line-clamp-2">
          {post.caption}
        </div>
        <div className="flex items-center text-xs text-neutral-500 space-x-4">
          <button
            aria-label="Aimer"
            className="transition hover:scale-110 focus:outline-none"
            onClick={() => {/* TODO: like logic */}}
            style={{ color: '#d946ef' }}
          >
            ❤️ {post.likes}
          </button>
          <button
            aria-label="Commenter"
            className="transition hover:scale-110 focus:outline-none"
            onClick={() => {/* TODO: comment logic */}}
          >
            💬 {post.comments}
          </button>
          <button
            aria-label="Sauvegarder"
            className="transition hover:scale-110 focus:outline-none"
            onClick={() => {/* TODO: save logic */}}
          >
            🔖
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostCard;

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
    <div className="relative rounded-3xl bg-white/80 shadow-xl mb-8 overflow-hidden border border-white/40 backdrop-blur-xl transition-all duration-300 hover:shadow-2xl group">
      {/* Header: Avatar, Username, Premium, Time */}
      <div className="flex items-center px-5 pt-5 pb-2">
        <img
          src={post.avatar}
          alt={post.username}
          className="w-11 h-11 rounded-full object-cover border border-white/60 shadow-sm"
        />
        <div className="ml-3 flex-1 min-w-0">
          <div className="font-semibold text-neutral-900 text-base truncate">
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
      {/* Media: Image or Video */}
      <div className="relative w-full aspect-[4/5] bg-neutral-100 overflow-hidden">
        <img
          src={post.image}
          alt={post.caption}
          className="w-full h-full object-cover object-center transition-all duration-300 group-hover:scale-105"
        />
        {/* Overlay for video (if needed in future) */}
        {/* <button className="absolute inset-0 flex items-center justify-center bg-black/10 hover:bg-black/20 transition-all">
          <svg ...>Play</svg>
        </button> */}
      </div>
      {/* Caption & Actions */}
      <div className="px-5 py-4">
        <div className="text-neutral-800 text-base mb-3 line-clamp-2 font-medium">
          {post.caption}
        </div>
        <div className="flex items-center text-sm text-neutral-500 space-x-6">
          <button
            aria-label="Aimer"
            className="transition hover:scale-110 focus:outline-none flex items-center space-x-1"
            onClick={() => {/* TODO: like logic */}}
            style={{ color: '#d946ef' }}
          >
            <span>❤️</span>
            <span>{post.likes}</span>
          </button>
          <button
            aria-label="Commenter"
            className="transition hover:scale-110 focus:outline-none flex items-center space-x-1"
            onClick={() => {/* TODO: comment logic */}}
          >
            <span>💬</span>
            <span>{post.comments}</span>
          </button>
          <button
            aria-label="Sauvegarder"
            className="transition hover:scale-110 focus:outline-none flex items-center space-x-1"
            onClick={() => {/* TODO: save logic */}}
          >
            <span>🔖</span>
          </button>
          {/* Menu overflow (optionnel) */}
          <button
            aria-label="Plus d'options"
            className="ml-auto text-neutral-400 hover:text-neutral-700 transition"
            onClick={() => {/* TODO: menu logic */}}
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostCard;

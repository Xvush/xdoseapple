import { useState, useEffect } from "react";
import { UserIcon } from "@heroicons/react/24/solid";
import FeedMainCard from "@/components/FeedMainCard";
import FeedGridCard from "@/components/FeedGridCard";
import { Header } from "@/components/Header";
import { BottomNavigation } from "@/components/BottomNavigation";

// Données de test (à remplacer par un fetch plus tard)
const featuredPost = {
	id: 1,
	username: "Jane Cooper",
	image: "/images/feed.png",
	likes: 212,
	timeAgo: "5h",
	isVideo: false,
};
const gridPosts = [
	{
		id: 2,
		username: "Ronald Richards",
		image: "/images/profile.png",
		timeAgo: "8h",
		isVideo: false,
	},
	{
		id: 3,
		username: "Leslie Alexander",
		image: "/images/profile.png",
		timeAgo: "12h",
		isVideo: true,
	},
	{
		id: 4,
		username: "Alex Creator",
		image: "/images/profile.png",
		timeAgo: "16h",
		isVideo: false,
	},
	{
		id: 5,
		username: "Sophie Lens",
		image: "/images/profile.png",
		timeAgo: "1j",
		isVideo: true,
	},
];

export default function Feed() {
	const [isLoading, setIsLoading] = useState(true);
	const [visibleCount, setVisibleCount] = useState(3); // 1 principale + 2 secondaires

	useEffect(() => {
		const timer = setTimeout(() => setIsLoading(false), 900);
		return () => clearTimeout(timer);
	}, []);

	const handleLoadMore = () => {
		setVisibleCount((prev) => Math.min(prev + 2, gridPosts.length));
	};

	// Sépare la carte principale et la grille secondaire
	const main = featuredPost;
	const grid = gridPosts.slice(0, visibleCount);
	const hasMore = visibleCount < gridPosts.length;

	return (
		<div className="min-h-screen bg-[#FAFAFA] pt-[env(safe-area-inset-top)] pb-20 px-4 font-sans">
			{/* Header XDose original */}
			<Header currentView="feed" onViewChange={() => {}} />
			<main className="flex flex-col gap-4 max-w-md mx-auto">
				{/* Loader skeleton */}
				{isLoading ? (
					<>
						<div className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
							<div className="w-full aspect-[4/3] bg-gray-200" />
							<div className="h-5 w-1/2 bg-gray-200 mx-3 my-2 rounded" />
							<div className="h-4 w-1/4 bg-gray-200 mx-3 mb-2 rounded" />
						</div>
						<div className="grid grid-cols-2 gap-4">
							{[0, 1].map((i) => (
								<div
									key={i}
									className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse"
								>
									<div className="w-full aspect-square bg-gray-200" />
									<div className="h-5 w-2/3 bg-gray-200 mx-3 my-2 rounded" />
									<div className="h-4 w-1/4 bg-gray-200 mx-3 mb-2 rounded" />
								</div>
							))}
						</div>
					</>
				) : (
					<>
						{/* Carte principale */}
						<FeedMainCard {...main} likes={main.likes || 0} />
						{/* Grille secondaire */}
						<div className="grid grid-cols-2 gap-4">
							{grid.map((post) => (
								<FeedGridCard key={post.id} {...post} />
							))}
						</div>
						{/* Bouton Charger plus */}
						{hasMore && (
							<button
								className="w-full mt-2 py-2 rounded-xl bg-[#F3F3F3] text-[#555] font-medium active:scale-95 transition-transform shadow-sm"
								onClick={handleLoadMore}
								aria-label="Charger plus de posts"
							>
								Charger plus
							</button>
						)}
					</>
				)}
			</main>
			{/* Barre de navigation XDose originale */}
			<BottomNavigation currentView="feed" onViewChange={() => {}} />
		</div>
	);
}

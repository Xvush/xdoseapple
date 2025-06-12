import { useState, useEffect } from "react";
import FeedMainCard from "@/components/FeedMainCard";
import FeedGridCard from "@/components/FeedGridCard";
import { Header } from "@/components/Header";
import { BottomNavigation } from "@/components/BottomNavigation";

export default function Feed() {
	const [isLoading, setIsLoading] = useState(true);
	const [posts, setPosts] = useState<any[]>([]);
	const [visibleCount, setVisibleCount] = useState(3); // 1 principale + 2 secondaires
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		setIsLoading(true);
		fetch("/api/feed")
			.then(async (res) => {
				if (!res.ok) throw new Error("Erreur lors du chargement du feed");
				const data = await res.json();
				setPosts(data.posts || []);
				setError(null);
			})
			.catch(() => setError("Impossible de charger le feed (erreur réseau ou API)"))
			.finally(() => setIsLoading(false));
	}, []);

	const handleLoadMore = () => {
		setVisibleCount((prev) => Math.min(prev + 2, posts.length - 1));
	};

	// Sépare la carte principale et la grille secondaire
	const main = posts[0];
	const grid = posts.slice(1, visibleCount + 1);
	const hasMore = posts.length > visibleCount + 1;

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
				) : error ? (
					<div className="text-center text-red-500 py-8">{error}</div>
				) : posts.length === 0 ? (
					<div className="text-center text-neutral-500 py-8">Aucun post à afficher.</div>
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

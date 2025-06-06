import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { BottomNavigation } from "@/components/BottomNavigation";

const feedPosts = [
	{
		id: 1,
		username: "jane_cooper",
		avatar: "/lovable-uploads/99b5ec0d-8b0b-4099-b7eb-04f239fe2d31.png",
		image: "/lovable-uploads/99b5ec0d-8b0b-4099-b7eb-04f239fe2d31.png",
		caption: "Nouvelle session photo avec cette lumière naturelle parfaite ✨",
		likes: 2847,
		comments: 89,
		timeAgo: "2h",
	},
	{
		id: 2,
		username: "emma_photo",
		avatar: "/lovable-uploads/7ec6a124-1c1b-4e01-80a9-cb913f60aaba.png",
		image: "/lovable-uploads/7ec6a124-1c1b-4e01-80a9-cb913f60aaba.png",
		caption:
			"Derrière les coulisses de ma dernière création. Photographe et storyteller passionnée 📸",
		likes: 5243,
		comments: 156,
		timeAgo: "4h",
		isPremium: true,
		price: "9,99€",
	},
	{
		id: 3,
		username: "visual_arts",
		avatar: "/lovable-uploads/d165fa45-7ad1-4879-ad72-974e27879f72.png",
		image: "/lovable-uploads/d165fa45-7ad1-4879-ad72-974e27879f72.png",
		caption:
			"Réglages de post-production pour cette ambiance cinématographique",
		likes: 1832,
		comments: 34,
		timeAgo: "6h",
	},
	{
		id: 4,
		username: "alex_creator",
		avatar: "/lovable-uploads/5ae50604-431b-4b7c-b9a4-ff64cfbff468.png",
		image: "/lovable-uploads/5ae50604-431b-4b7c-b9a4-ff64cfbff468.png",
		caption:
			"Collection XDose - Découvrez mes dernières créations visuelles",
		likes: 3621,
		comments: 98,
		timeAgo: "8h",
		isPremium: true,
		price: "4,99€",
	},
];

const Feed = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [visiblePosts, setVisiblePosts] = useState<typeof feedPosts>([]);

	useEffect(() => {
		// Simulate loading
		const timer = setTimeout(() => {
			setIsLoading(false);
			// Animate posts appearing one by one
			feedPosts.forEach((post, index) => {
				setTimeout(() => {
					setVisiblePosts((prev) => [...prev, post]);
				}, index * 150);
			});
		}, 800);

		return () => clearTimeout(timer);
	}, []);

	return (
		<div className="pb-24 pt-24 min-h-screen ios-scroll">
			<Header currentView="feed" onViewChange={() => {}} />
			<div className="max-w-md mx-auto">
				<div
					className="animate-fade-in"
					style={{ animationDelay: "200ms" }}
				>
					{/* <StoryBar /> */}
				</div>
				<div className="px-6 py-4 space-y-8">
					{isLoading ? (
						Array.from({ length: 3 }).map((_, index) => (
							<div
								key={index}
								className="space-y-4 animate-fade-in"
								style={{ animationDelay: `${index * 100}ms` }}
							>
								<div className="flex items-center space-x-3">
									<div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
									<div className="space-y-2 flex-1">
										<div className="h-4 w-24 bg-gray-200 animate-pulse" />
										<div className="h-3 w-16 bg-gray-200 animate-pulse" />
									</div>
								</div>
								<div className="h-80 w-full bg-gray-200 animate-pulse" />
								<div className="space-y-2">
									<div className="h-4 w-32 bg-gray-200 animate-pulse" />
									<div className="h-3 w-full bg-gray-200 animate-pulse" />
									<div className="h-3 w-3/4 bg-gray-200 animate-pulse" />
								</div>
							</div>
						))
					) : (
						visiblePosts.map((post, index) => (
							<div
								key={post.id}
								className="animate-spring-in"
								style={{ animationDelay: `${index * 150}ms` }}
							>
								{/* <PostCard post={post} /> */}
							</div>
						))
					)}
				</div>
			</div>
			<BottomNavigation currentView="feed" onViewChange={() => {}} />
		</div>
	);
};

export default Feed;

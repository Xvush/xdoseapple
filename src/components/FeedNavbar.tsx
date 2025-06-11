import { HomeIcon, UserIcon } from "@heroicons/react/24/solid";

interface FeedNavbarProps {
  current?: "home" | "profile";
}

export default function FeedNavbar({ current = "home" }: FeedNavbarProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-10 bg-white shadow-sm flex justify-around items-center h-16"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <button
        className={`flex flex-col items-center ${current === "home" ? "text-[#FF4D4F]" : "text-[#888]"} active:scale-95 transition-transform`}
        aria-label="Accueil"
      >
        <HomeIcon className="w-7 h-7" />
      </button>
      <button
        className={`flex flex-col items-center ${current === "profile" ? "text-[#FF4D4F]" : "text-[#888]"} active:scale-95 transition-transform`}
        aria-label="Profil"
      >
        <UserIcon className="w-7 h-7" />
      </button>
    </nav>
  );
}

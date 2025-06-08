import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Image, Video, Mic, Palette, Type, Music, Sparkles, Send, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { BottomNavigation } from "@/components/BottomNavigation";
import { useAuth } from "@/hooks/useAuth";

const Studio = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [showAccessDenied, setShowAccessDenied] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);

  useEffect(() => {
    const isCreator = user && (user.role === "creator" || user.role === "CREATOR");
    if (!loading && (!user || !isCreator)) {
      setShowAccessDenied(true);
      setPageLoading(false);
    } else if (!loading && isCreator) {
      // Simulate loading for polish
      const timer = setTimeout(() => setPageLoading(false), 500);
      return () => clearTimeout(timer);
    }
  }, [user, loading]);

  const handleVideoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;
    setUploading(true);
    setUploadProgress(0);
    setUploadError("");
    setUploadSuccess(false);
    try {
      // 1. Demande une URL d'upload à l'API
      const res = await fetch("/api/upload-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id })
      });
      const data = await res.json();
      if (!data.uploadUrl) throw new Error("Erreur lors de la création de l'upload Mux");
      // 2. Upload direct du fichier vidéo sur l'URL Mux
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", data.uploadUrl, true);
      xhr.setRequestHeader("Content-Type", file.type);
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          setUploadProgress(Math.round((event.loaded / event.total) * 100));
        }
      };
      xhr.onload = () => {
        setUploading(false);
        if (xhr.status === 200) {
          setUploadSuccess(true);
        } else {
          setUploadError("Erreur lors de l'upload vidéo (" + xhr.status + ")");
        }
      };
      xhr.onerror = () => {
        setUploading(false);
        setUploadError("Erreur réseau lors de l'upload vidéo");
      };
      xhr.send(file);
    } catch (err) {
      setUploading(false);
      setUploadError(err.message || "Erreur inconnue");
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 animate-fade-in">
        <Loader2 className="animate-spin text-brand-purple-500 mb-4" size={48} />
        <p className="text-neutral-500 font-medium">Chargement du Studio…</p>
      </div>
    );
  }

  if (showAccessDenied) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100">
        <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center animate-fade-in">
          <AlertTriangle size={48} className="text-yellow-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2 text-neutral-800">Accès réservé aux créateurs</h2>
          <p className="text-neutral-600 mb-6 text-center max-w-xs">Le Studio est uniquement disponible pour les créateurs. Si vous souhaitez publier du contenu, demandez l'accès créateur dans vos paramètres.</p>
          <Button className="apple-button-secondary rounded-xl px-6 py-3 interaction-feedback" onClick={() => navigate("/feed")}>Retour au Feed</Button>
        </div>
      </div>
    );
  }

  const tools = [
    { icon: Palette, label: "Filtres", id: "filters", color: "bg-pink-500" },
    { icon: Type, label: "Texte", id: "text", color: "bg-orange-500" },
    { icon: Music, label: "Musique", id: "music", color: "bg-teal-500" },
    { icon: Sparkles, label: "IA", id: "ai", color: "bg-purple-500" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 pb-20 pt-20">
      <Header currentView="profile" onViewChange={() => {}} />
      <div className="px-6 py-4 space-y-6 animate-spring-in">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" className="interaction-feedback" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
          </Button>
          <h2 className="font-semibold text-neutral-800">Studio de Création</h2>
          <div />
        </div>
        {/* Media Preview Area + Upload */}
        <div className="card-elevated rounded-2xl h-96 flex flex-col items-center justify-center bg-neutral-100 hover-lift transition-all duration-300">
          <div className="text-center space-y-4">
            <div className="flex space-x-4 justify-center">
              <Button className="apple-button-secondary rounded-xl px-6 py-3 interaction-feedback" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                <Image size={20} className="mr-2" />
                Photo
              </Button>
              <Button className="apple-button-secondary rounded-xl px-6 py-3 interaction-feedback" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                <Video size={20} className="mr-2" />
                Vidéo
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                className="hidden"
                onChange={handleVideoUpload}
                disabled={uploading}
              />
            </div>
            <p className="text-neutral-500 text-sm">Sélectionnez ou capturez votre contenu</p>
            {uploading && (
              <div className="mt-4">
                <div className="w-64 bg-gray-200 rounded-full h-3 mb-2 overflow-hidden">
                  <div className="bg-brand-purple-500 h-3 rounded-full transition-all" style={{ width: `${uploadProgress}%` }} />
                </div>
                <p className="text-xs text-neutral-500">Upload : {uploadProgress}%</p>
              </div>
            )}
            {uploadError && <p className="text-red-500 text-sm mt-2">{uploadError}</p>}
            {uploadSuccess && <p className="text-green-600 text-sm mt-2">Vidéo uploadée ! Traitement en cours…</p>}
          </div>
        </div>
        {/* Creation Tools */}
        <div className="space-y-4">
          <h3 className="font-medium text-neutral-700">Outils de création</h3>
          <div className="grid grid-cols-2 gap-4">
            {tools.map((tool, index) => {
              const Icon = tool.icon;
              return (
                <button
                  key={tool.id}
                  onClick={() => setSelectedTool(tool.id)}
                  className={`card-elevated p-6 rounded-2xl transition-all duration-300 hover-lift interaction-feedback ${
                    selectedTool === tool.id ? 'ring-2 ring-brand-purple-500' : ''
                  }`}
                  style={{
                    animationDelay: `${index * 100}ms`
                  }}
                >
                  <div className={`w-12 h-12 ${tool.color} rounded-2xl flex items-center justify-center mb-3 mx-auto`}>
                    <Icon size={24} className="text-white" />
                  </div>
                  <p className="font-medium text-neutral-700">{tool.label}</p>
                </button>
              );
            })}
          </div>
        </div>
        {/* Action Buttons */}
        <div className="space-y-3 pt-4">
          <Button className="w-full apple-button-secondary rounded-xl py-4 interaction-feedback">
            <Send size={20} className="mr-2 text-brand-purple-600" />
            <span className="text-brand-purple-600 font-medium">Publier la création</span>
          </Button>
          <Button className="w-full bg-brand-purple-600 hover:bg-brand-purple-700 text-white rounded-xl py-4 shadow-lg interaction-feedback">
            Enregistrer en brouillon
          </Button>
        </div>
      </div>
      <BottomNavigation currentView="studio" onViewChange={() => {}} />
    </div>
  );
};

export default Studio;

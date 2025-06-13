import React from "react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Image, Video, Mic, Palette, Type, Music, Sparkles, Send, AlertTriangle, Loader2, X } from "lucide-react";
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
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [tags, setTags] = useState([]); // tags séparés par virgule

  // Wizard d'upload vidéo (UX premium)
  const [wizardStep, setWizardStep] = useState(1);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string>("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");

  // Validation pour activer le bouton "Suivant"
  const isStep1Valid = videoFile && videoTitle.trim().length > 0 && tags.length > 0;

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

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      // Générer un thumbnail preview (optionnel, ici via URL.createObjectURL)
      setThumbnailUrl(URL.createObjectURL(file));
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setThumbnailFile(file || null);
    setThumbnailPreview(file ? URL.createObjectURL(file) : "");
  };

  const handleNext = () => setWizardStep(2);
  const handleBack = () => setWizardStep(1);

  const handlePublish = async () => {
    if (!videoFile || !user?.id) return;
    setUploading(true);
    setUploadProgress(0);
    setUploadError("");
    setUploadSuccess(false);
    try {
      // 1. Demande une URL d'upload à l'API
      const res = await fetch("/api/upload-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          title: videoTitle,
          description: videoDescription,
          tags: tags
        })
      });
      const data = await res.json();
      if (!data.uploadUrl) throw new Error("Erreur lors de la création de l'upload Mux");
      // 2. Upload direct du fichier vidéo sur l'URL Mux
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", data.uploadUrl, true);
      xhr.setRequestHeader("Content-Type", videoFile.type);
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          setUploadProgress(Math.round((event.loaded / event.total) * 100));
        }
      };
      xhr.onload = async () => {
        setUploading(false);
        if (xhr.status === 200) {
          let uploadedThumbnailUrl = null;
          if (thumbnailFile && data.uploadId) {
            // 1. Upload de la miniature sur /api/upload-image.js
            const imageRes = await fetch("/api/upload-image.js", {
              method: "POST",
              headers: { "Content-Type": thumbnailFile.type },
              body: thumbnailFile
            });
            const imageData = await imageRes.json();
            if (imageData.url) {
              uploadedThumbnailUrl = imageData.url;
              // 2. PATCH /api/video-edit.js pour mettre à jour thumbnailUrl
              await fetch(`/api/video-edit.js?id=${data.uploadId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user.id, thumbnailUrl: uploadedThumbnailUrl })
              });
            }
          }
          setUploadSuccess(true);
          setWizardStep(1); // Reset wizard
          setVideoFile(null);
          setThumbnailUrl("");
          setThumbnailFile(null);
          setThumbnailPreview("");
          setVideoTitle("");
          setVideoDescription("");
          setTags([]);
        } else {
          setUploadError("Erreur lors de l'upload vidéo (" + xhr.status + ")");
        }
      };
      xhr.onerror = () => {
        setUploading(false);
        setUploadError("Erreur réseau lors de l'upload vidéo");
      };
      xhr.send(videoFile);
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

  const MAX_TAGS = 5;

  function TagInput({ tags, setTags, disabled }) {
    const [input, setInput] = useState("");
    const inputRef = useRef(null);
    const addTag = (tag) => {
      const clean = tag.trim().toLowerCase();
      if (!clean || tags.includes(clean) || tags.length >= MAX_TAGS || clean.length > 20) return;
      setTags([...tags, clean]);
      setInput("");
    };
    const removeTag = (tag) => setTags(tags.filter(t => t !== tag));
    const onInput = (e) => setInput(e.target.value);
    const onKeyDown = (e) => {
      if ((e.key === "Enter" || e.key === ",") && input.trim()) {
        e.preventDefault();
        addTag(input);
      } else if (e.key === "Backspace" && !input && tags.length) {
        removeTag(tags[tags.length - 1]);
      }
    };
    return (
      <div className="w-full">
        <div className="flex flex-wrap gap-1 mb-1">
          {tags.map((tag, i) => (
            <span key={i} className="inline-flex items-center bg-brand-purple-100 text-brand-purple-700 text-xs px-2 py-0.5 rounded-full">
              #{tag}
              {!disabled && (
                <button type="button" className="ml-1 focus:outline-none" onClick={() => removeTag(tag)}>
                  <X size={14} />
                </button>
              )}
            </span>
          ))}
        </div>
        <input
          ref={inputRef}
          className="input w-full rounded border px-3 py-2 text-base"
          type="text"
          placeholder={tags.length >= MAX_TAGS ? "Limite de tags atteinte" : "Ajouter un tag (Entrée ou ,)"}
          value={input}
          onChange={onInput}
          onKeyDown={onKeyDown}
          maxLength={20}
          disabled={disabled || tags.length >= MAX_TAGS}
        />
        {tags.length >= MAX_TAGS && (
          <div className="text-xs text-neutral-400 mt-1">Maximum {MAX_TAGS} tags</div>
        )}
      </div>
    );
  }

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
        {wizardStep === 1 && (
          <div className="card-elevated rounded-2xl h-96 flex flex-col items-center justify-center bg-neutral-100 hover-lift transition-all duration-300">
            <div className="text-center space-y-4 w-full max-w-xs mx-auto">
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                className="hidden"
                onChange={handleFileChange}
                disabled={uploading}
              />
              <Button className="apple-button-secondary rounded-xl px-6 py-3 interaction-feedback w-full" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                <Video size={20} className="mr-2" />
                Sélectionner une vidéo
              </Button>
              {videoFile && (
                <video src={thumbnailUrl} controls className="w-full rounded-xl mt-2" style={{ maxHeight: 160 }} />
              )}
              <input
                className="input w-full rounded border px-3 py-2 text-base mt-2"
                type="text"
                placeholder="Titre de la vidéo"
                value={videoTitle}
                onChange={e => setVideoTitle(e.target.value)}
                maxLength={80}
                disabled={uploading}
              />
              <textarea
                className="input w-full rounded border px-3 py-2 text-base"
                placeholder="Description (optionnelle)"
                value={videoDescription}
                onChange={e => setVideoDescription(e.target.value)}
                maxLength={500}
                rows={2}
                disabled={uploading}
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                disabled={uploading}
              />
              {thumbnailPreview && (
                <img src={thumbnailPreview} alt="Aperçu miniature" className="w-32 h-20 object-cover rounded mt-2" />
              )}
              <TagInput tags={tags} setTags={setTags} disabled={uploading} />
              <div className="flex gap-2 mt-4">
                <Button className="flex-1 apple-button-secondary rounded-xl" onClick={handleNext} disabled={!isStep1Valid || uploading}>
                  Suivant
                </Button>
                <Button className="flex-1 bg-brand-purple-600 text-white rounded-xl" onClick={async () => {
                  if (!isStep1Valid || uploading) return;
                  setWizardStep(2);
                  await new Promise(r => setTimeout(r, 100)); // Laisse le temps au DOM de passer à l'étape 2
                  handlePublish();
                }} disabled={!isStep1Valid || uploading}>
                  Publier
                </Button>
              </div>
              {uploadError && <div className="text-red-500 text-sm mt-2">{uploadError}</div>}
              {uploadSuccess && <div className="text-green-600 text-sm mt-2">Vidéo uploadée ! Traitement en cours…</div>}
            </div>
          </div>
        )}
        {wizardStep === 2 && (
          <div className="card-elevated rounded-2xl h-96 flex flex-col items-center justify-center bg-neutral-100 hover-lift transition-all duration-300">
            <div className="text-center space-y-4 w-full max-w-xs mx-auto">
              <h3 className="font-semibold text-neutral-800">Récapitulatif</h3>
              {videoFile && (
                <video src={thumbnailUrl} controls className="w-full rounded-xl" style={{ maxHeight: 160 }} />
              )}
              <div className="text-left mt-2">
                <div className="font-semibold text-sm text-neutral-900 truncate">{videoTitle}</div>
                {videoDescription && <div className="text-xs text-neutral-500 truncate">{videoDescription}</div>}
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {tags.map((tag, i) => (
                      <span key={i} className="inline-block bg-brand-purple-100 text-brand-purple-700 text-xs px-2 py-0.5 rounded-full">#{tag}</span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-2 mt-4">
                <Button className="flex-1 rounded-xl border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-100 transition-colors" onClick={handleBack} disabled={uploading}>Retour</Button>
                <Button className="flex-1 rounded-xl bg-brand-purple-600 text-white hover:bg-brand-purple-700 transition-colors font-semibold shadow-lg" onClick={handlePublish} disabled={uploading}>
                  {uploading ? 'Publication…' : 'Publier'}
                </Button>
              </div>
              {uploadError && <div className="text-red-500 text-sm mt-2">{uploadError}</div>}
              {uploadSuccess && <div className="text-green-600 text-sm mt-2">Vidéo uploadée ! Traitement en cours…</div>}
              {uploading && (
                <div className="mt-2">
                  <div className="w-64 bg-gray-200 rounded-full h-3 mb-2 overflow-hidden">
                    <div className="bg-brand-purple-500 h-3 rounded-full transition-all" style={{ width: `${uploadProgress}%` }} />
                  </div>
                  <p className="text-xs text-neutral-500">Upload : {uploadProgress}%</p>
                </div>
              )}
            </div>
          </div>
        )}
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

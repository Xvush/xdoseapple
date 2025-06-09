import { useState, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const EditProfile = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [cover, setCover] = useState(user?.cover || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    const res = await fetch('/api/update-profile.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: user.id,
        displayName,
        bio,
        avatar,
        cover,
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || 'Erreur lors de la mise à jour');
      return;
    }
    setUser(data.user);
    setSuccess(true);
    setTimeout(() => navigate(-1), 1200);
  };

  // Gestion de l'upload d'image pour avatar et cover
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'cover') => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Affichage preview immédiat
    const reader = new FileReader();
    reader.onload = ev => {
      if (type === 'avatar') setAvatar(ev.target?.result as string);
      else setCover(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
    // Upload vers l'API
    const formData = new FormData();
    formData.append('image', file);
    formData.append('type', type);
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      const res = await fetch('/api/upload-image.js', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setLoading(false);
      if (!res.ok) {
        setError(data.error || 'Erreur upload image');
        return;
      }
      if (type === 'avatar') setAvatar(data.url);
      else setCover(data.url);
    } catch (err) {
      setLoading(false);
      setError('Erreur réseau lors de l’upload');
    }
  };

  return (
    <div className="max-w-md mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Éditer mon profil</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-1 font-medium">Nom affiché</label>
          <input className="input w-full" value={displayName} onChange={e => setDisplayName(e.target.value)} />
        </div>
        <div>
          <label className="block mb-1 font-medium">Bio</label>
          <textarea className="input w-full" value={bio} onChange={e => setBio(e.target.value)} />
        </div>
        <div>
          <label className="block mb-1 font-medium">Photo de profil</label>
          {avatar && (
            <img src={avatar} alt="avatar preview" className="w-20 h-20 rounded-full object-cover mb-2 border" />
          )}
          <input type="file" accept="image/*" onChange={e => handleImageUpload(e, 'avatar')} />
        </div>
        <div>
          <label className="block mb-1 font-medium">Image de couverture</label>
          {cover && (
            <img src={cover} alt="cover preview" className="w-full h-32 object-cover mb-2 border rounded" />
          )}
          <input type="file" accept="image/*" onChange={e => handleImageUpload(e, 'cover')} />
        </div>
        {error && <div className="text-red-500">{error}</div>}
        {success && <div className="text-green-600">Profil mis à jour !</div>}
        <Button type="submit" disabled={loading} className="w-full">{loading ? 'Enregistrement...' : 'Enregistrer'}</Button>
      </form>
    </div>
  );
};

export default EditProfile;

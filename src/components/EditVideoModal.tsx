import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

export function EditVideoModal({ video, onClose, onUpdate, userId }) {
  const [title, setTitle] = useState(video.title || '');
  const [description, setDescription] = useState(video.description || '');
  const [tags, setTags] = useState((video.tags || []).join(', '));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      const res = await fetch(`/api/video-edit.js?id=${video.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          title,
          description,
          tags: tags.split(',').map(t => t.trim()).filter(Boolean)
        })
      });
      const data = await res.json();
      setLoading(false);
      if (!res.ok) {
        setError(data.error || 'Erreur lors de la mise à jour');
        return;
      }
      setSuccess(true);
      onUpdate(data.video);
    } catch (err) {
      setLoading(false);
      setError('Erreur réseau lors de la mise à jour');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md animate-fade-in">
        <h2 className="text-lg font-semibold mb-4">Éditer la vidéo</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Titre</label>
            <input className="input w-full" value={title} onChange={e => setTitle(e.target.value)} maxLength={100} required />
          </div>
          <div>
            <label className="block mb-1 font-medium">Description</label>
            <textarea className="input w-full" value={description} onChange={e => setDescription(e.target.value)} maxLength={500} rows={2} />
          </div>
          <div>
            <label className="block mb-1 font-medium">Tags (séparés par des virgules, max 5)</label>
            <input className="input w-full" value={tags} onChange={e => setTags(e.target.value)} maxLength={100} />
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm">Vidéo mise à jour !</div>}
          <div className="flex gap-2 mt-4">
            <Button type="submit" disabled={loading} className="flex-1 bg-brand-purple-600 text-white">
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">Annuler</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Fichier de test, peut être supprimé si non utilisé pour debug ou healthcheck.
// Route de test simple pour vérifier le routing API plat sur Vercel
module.exports = (req, res) => {
  res.status(200).json({ ok: true });
};

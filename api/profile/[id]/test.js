// Route de test pour vérifier le routing dynamique Vercel
module.exports = (req, res) => {
  res.status(200).json({ ok: true, id: req.query.id, msg: 'Dynamic API route works!' });
};

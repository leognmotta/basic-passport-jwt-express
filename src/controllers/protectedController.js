exports.getProtectedMessage = (req, res, next) => {
  res.status(200).json({ message: 'I am protected!' });
};

const User = require('../models/user');

exports.postSignUp = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      const error = new Error('Por favor preencha todos os campos.');
      error.status = 400;
      throw error;
    }

    if (await User.findOne({ email })) {
      const error = new Error('Este email já está cadastrado.');
      error.status = 400;
      throw error;
    }

    const user = await User.create({ name, email, password });

    return res.status(201).json({ message: 'Usuário criado com sucesso!' });
  } catch (error) {
    next(error);
  }
};

exports.postSignIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const error = new Error('Por favor preencha todos os campos.');
      error.status = 400;
      throw error;
    }

    const user = await User.findOne({ email });

    let isEqual;
    if (user) isEqual = await user.comparePassword(password);

    if (!user || !isEqual) {
      const error = new Error('Email ou senha incorretos.');
      error.status = 400;
      throw error;
    }

    const token = user.getToken();

    return res.status(200).json({ userId: user._id, token: token });
  } catch (error) {
    next(error);
  }
};

exports.getIsTokenValid = (req, res, body) => {
  const user = req.user;
  res.status(200).json({ user });
};

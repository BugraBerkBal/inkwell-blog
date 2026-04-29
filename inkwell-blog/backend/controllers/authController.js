const jwt = require('jsonwebtoken');
const User = require('../models/User');

/** JWT token üretir */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

/**
 * @desc  Yeni kullanıcı kaydı
 * @route POST /api/auth/register
 * @access Public
 */
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Eksik alan kontrolü
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Tüm alanlar zorunludur' });
    }

    // Kullanıcı zaten var mı?
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({
        message: existingUser.email === email
          ? 'Bu e-posta zaten kullanımda'
          : 'Bu kullanıcı adı zaten alınmış',
      });
    }

    const user = await User.create({ username, email, password });

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

/**
 * @desc  Kullanıcı girişi
 * @route POST /api/auth/login
 * @access Public
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'E-posta ve şifre zorunludur' });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'E-posta veya şifre hatalı' });
    }

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

/**
 * @desc  Giriş yapan kullanıcı profili
 * @route GET /api/auth/me
 * @access Private
 */
const getMe = async (req, res) => {
  res.json(req.user);
};

module.exports = { register, login, getMe };

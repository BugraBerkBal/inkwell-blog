const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * JWT doğrulama middleware'i.
 * Authorization header'dan token alınır, doğrulanır ve req.user'a eklenir.
 */
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Kullanıcıyı DB'den çek, şifre hariç
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'Kullanıcı bulunamadı' });
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: 'Geçersiz veya süresi dolmuş token' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Token bulunamadı, yetkilendirme reddedildi' });
  }
};

module.exports = { protect };

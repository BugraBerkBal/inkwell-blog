const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * Kullanıcı Modeli
 * OOP yaklaşımı: şema üzerinde instance metodlar tanımlandı
 */
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Kullanıcı adı zorunludur'],
      unique: true,
      trim: true,
      minlength: [3, 'Kullanıcı adı en az 3 karakter olmalıdır'],
      maxlength: [30, 'Kullanıcı adı en fazla 30 karakter olabilir'],
    },
    email: {
      type: String,
      required: [true, 'E-posta zorunludur'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Geçerli bir e-posta girin'],
    },
    password: {
      type: String,
      required: [true, 'Şifre zorunludur'],
      minlength: [6, 'Şifre en az 6 karakter olmalıdır'],
    },
    bio: {
      type: String,
      maxlength: [200, 'Bio en fazla 200 karakter olabilir'],
      default: '',
    },
  },
  { timestamps: true }
);

// Kayıt öncesi şifreyi hashle (pre-save hook)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Instance metod: Şifre doğrulama
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// JSON çıktısında şifreyi gizle
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);

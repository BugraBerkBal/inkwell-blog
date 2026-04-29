const mongoose = require('mongoose');

/**
 * Blog Yazısı Modeli
 * User ile ilişki: author alanı User._id'ye referans verir
 */
const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Başlık zorunludur'],
      trim: true,
      minlength: [3, 'Başlık en az 3 karakter olmalıdır'],
      maxlength: [150, 'Başlık en fazla 150 karakter olabilir'],
    },
    content: {
      type: String,
      required: [true, 'İçerik zorunludur'],
      minlength: [10, 'İçerik en az 10 karakter olmalıdır'],
    },
    summary: {
      type: String,
      maxlength: [300, 'Özet en fazla 300 karakter olabilir'],
      default: '',
    },
    category: {
      type: String,
      enum: ['Teknoloji', 'Yaşam', 'Seyahat', 'Yemek', 'Spor', 'Diğer'],
      default: 'Diğer',
    },
    coverImage: {
      type: String,
      default: '',
    },
    // Kullanıcı ile ilişki (Foreign Key)
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Okuma süresini hesapla (instance method - OOP)
postSchema.methods.getReadTime = function () {
  const wordsPerMinute = 200;
  const words = this.content.split(' ').length;
  return Math.ceil(words / wordsPerMinute);
};

// Özet otomatik oluştur (pre-save hook)
postSchema.pre('save', function (next) {
  if (!this.summary && this.content) {
    this.summary = this.content.substring(0, 200).trim() + '...';
  }
  next();
});

module.exports = mongoose.model('Post', postSchema);

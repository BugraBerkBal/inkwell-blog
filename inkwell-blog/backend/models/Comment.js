const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, 'Yorum içeriği zorunludur'],
      trim: true,
      minlength: [2, 'Yorum en az 2 karakter olmalıdır'],
      maxlength: [500, 'Yorum en fazla 500 karakter olabilir'],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Comment', commentSchema);

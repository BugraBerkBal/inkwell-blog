const Comment = require('../models/Comment');

const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.id })
      .populate('author', 'username')
      .sort({ createdAt: 1 });
    res.json(comments);
  } catch {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

const addComment = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ message: 'Yorum içeriği zorunludur' });

    const comment = await Comment.create({
      content,
      author: req.user._id,
      post: req.params.id,
    });
    await comment.populate('author', 'username');
    res.status(201).json(comment);
  } catch {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ message: 'Yorum bulunamadı' });

    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Bu yorumu silme yetkiniz yok' });
    }

    await comment.deleteOne();
    res.json({ message: 'Yorum silindi' });
  } catch {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

module.exports = { getComments, addComment, deleteComment };

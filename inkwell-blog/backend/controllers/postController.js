const Post = require('../models/Post');

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * @desc  Tüm yazıları getir (sayfalama + kategori filtresi)
 * @route GET /api/posts
 * @access Public
 */
const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const category = req.query.category;
    const search = req.query.search;

    // Filtre koşulları oluştur
    const filter = {};
    if (category && category !== 'Tümü') filter.category = category;
    if (search) {
      const safeSearch = escapeRegex(search);
      filter.$or = [
        { title: { $regex: safeSearch, $options: 'i' } },
        { content: { $regex: safeSearch, $options: 'i' } },
      ];
    }

    const [posts, total] = await Promise.all([
      Post.find(filter)
        .populate('author', 'username email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Post.countDocuments(filter),
    ]);

    res.json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalPosts: total,
    });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

/**
 * @desc  Tek yazı getir (görüntülenme sayısını artır)
 * @route GET /api/posts/:id
 * @access Public
 */
const getPostById = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('author', 'username email bio');

    if (!post) {
      return res.status(404).json({ message: 'Yazı bulunamadı' });
    }

    // Okuma süresini ekle (instance method)
    const postObj = post.toObject();
    postObj.readTime = post.getReadTime();

    res.json(postObj);
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

/**
 * @desc  Yeni yazı oluştur
 * @route POST /api/posts
 * @access Private
 */
const createPost = async (req, res) => {
  try {
    const { title, content, summary, category, coverImage } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Başlık ve içerik zorunludur' });
    }

    const post = await Post.create({
      title,
      content,
      summary,
      category,
      coverImage,
      author: req.user._id,
    });

    await post.populate('author', 'username email');
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

/**
 * @desc  Yazı güncelle (sadece sahibi)
 * @route PUT /api/posts/:id
 * @access Private
 */
const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Yazı bulunamadı' });
    }

    // Sahiplik kontrolü
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Bu yazıyı düzenleme yetkiniz yok' });
    }

    const { title, content, summary, category, coverImage } = req.body;

    post.title = title || post.title;
    post.content = content || post.content;
    post.summary = summary || post.summary;
    post.category = category || post.category;
    post.coverImage = coverImage !== undefined ? coverImage : post.coverImage;

    const updatedPost = await post.save();
    await updatedPost.populate('author', 'username email');

    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

/**
 * @desc  Yazı sil (sadece sahibi)
 * @route DELETE /api/posts/:id
 * @access Private
 */
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Yazı bulunamadı' });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Bu yazıyı silme yetkiniz yok' });
    }

    await post.deleteOne();
    res.json({ message: 'Yazı başarıyla silindi' });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

/**
 * @desc  Giriş yapan kullanıcının yazıları
 * @route GET /api/posts/my-posts
 * @access Private
 */
const getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user._id })
      .sort({ createdAt: -1 })
      .populate('author', 'username email');

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

module.exports = { getPosts, getPostById, createPost, updatePost, deletePost, getMyPosts };

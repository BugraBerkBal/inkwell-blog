const express = require('express');
const router = express.Router();
const {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getMyPosts,
} = require('../controllers/postController');
const { protect } = require('../middleware/auth');

// Public rotalar
router.get('/', getPosts);

// Korumalı rotalar (giriş gerekli) — sabit path'ler /:id'den önce gelmeli
router.get('/user/my-posts', protect, getMyPosts);
router.post('/', protect, createPost);
router.put('/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);

// Dinamik :id rotası en sona
router.get('/:id', getPostById);

module.exports = router;

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';

// Sayfalar
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PostDetail from './pages/PostDetail';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost';
import MyPosts from './pages/MyPosts';
import NotFound from './pages/NotFound';

/**
 * App: Uygulamanın kök bileşeni.
 * Routing ve global context burada sarmalanır.
 */
const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />

          <Routes>
            {/* Public rotalar */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/post/:id" element={<PostDetail />} />

            {/* Korumalı rotalar — giriş gerekli */}
            <Route path="/create" element={
              <PrivateRoute><CreatePost /></PrivateRoute>
            } />
            <Route path="/edit/:id" element={
              <PrivateRoute><EditPost /></PrivateRoute>
            } />
            <Route path="/my-posts" element={
              <PrivateRoute><MyPosts /></PrivateRoute>
            } />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>

          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;

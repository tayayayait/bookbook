import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import AuthGuard from './components/auth/AuthGuard';
import Home from './pages/Home';
import BookDetail from './pages/BookDetail';
import WriteReview from './pages/WriteReview';
import MyLibrary from './pages/MyLibrary';
import Auth from './pages/Auth';
import Profile from './pages/Profile';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/book/:id" element={<BookDetail />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/profile" element={<Profile />} />
          <Route
            path="/write"
            element={
              <AuthGuard>
                <WriteReview />
              </AuthGuard>
            }
          />
          <Route
            path="/library"
            element={
              <AuthGuard>
                <MyLibrary />
              </AuthGuard>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './context/AuthContext';
import { MessageProvider } from './context/MessageContext';
import { NotificationProvider } from './context/NotificationContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/CreateAccount';
import Dashboard from './pages/Dashboard';
import SearchFreelance from './pages/SearchFreelance';
import WorkPage from './pages/WorkPage';
import Messages from './pages/Messages';
import PostProject from './pages/PostProject';
import Profile from './pages/Profile';
import ProjectDetails from './pages/ProjectDetails';
import Settings from './pages/Settings';
import ProtectedRoute from './ProtectedRoute';

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <MessageProvider>
          <NotificationProvider>
            <Router>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/search" element={<SearchFreelance />} />
                  <Route path="/work" element={<WorkPage />} />
                  <Route path="/profile/:id" element={<Profile />} />
                  <Route path="/project/:id" element={<ProjectDetails />} />
                  <Route path="/messages" element={
                    <ProtectedRoute>
                      <Messages />
                    </ProtectedRoute>
                  } />
                  <Route path="/post-project" element={
                    <ProtectedRoute>
                      <PostProject />
                    </ProtectedRoute>
                  } />
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/settings" element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  } />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
          </NotificationProvider>
        </MessageProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;

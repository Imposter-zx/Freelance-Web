import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import { MessageProvider } from './context/MessageContext';
import { NotificationProvider } from './context/NotificationContext';
import { LanguageProvider } from './context/LanguageContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import PageSkeleton from './components/common/PageSkeleton';
import ScrollToTop from './components/common/ScrollToTop';
import ErrorBoundary from './components/common/ErrorBoundary';
import ProtectedRoute from './ProtectedRoute';

// Route-level code splitting keeps the initial landing page bundle small.
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/CreateAccount'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const SearchFreelance = lazy(() => import('./pages/SearchFreelance'));
const WorkPage = lazy(() => import('./pages/WorkPage'));
const Messages = lazy(() => import('./pages/Messages'));
const PostProject = lazy(() => import('./pages/PostProject'));
const Profile = lazy(() => import('./pages/Profile'));
const ProjectDetails = lazy(() => import('./pages/ProjectDetails'));
const Settings = lazy(() => import('./pages/Settings'));
const PaymentPage = lazy(() => import('./pages/PaymentPage'));
const NotFound = lazy(() => import('./pages/NotFound'));

const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/';

function App() {
  return (
    <LanguageProvider>
        <AuthProvider>
          <MessageProvider>
            <NotificationProvider>
              <MotionConfig reducedMotion="user">
                <Router basename={basename}>
                  <ScrollToTop />
                  <a href="#main-content" className="skip-link">
                    Aller au contenu principal
                  </a>
                  <div className="flex min-h-screen flex-col">
                    <Header />
                    <main id="main-content" className="flex-grow" tabIndex={-1}>
                      <ErrorBoundary>
                        <Suspense fallback={<PageSkeleton />}>
                          <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/search" element={<SearchFreelance />} />
                            <Route path="/work" element={<WorkPage />} />
                            <Route path="/profile/:id" element={<Profile />} />
                            <Route path="/project/:id" element={<ProjectDetails />} />
                            <Route
                              path="/messages"
                              element={
                                <ProtectedRoute>
                                  <Messages />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/post-project"
                              element={
                                <ProtectedRoute>
                                  <PostProject />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/dashboard"
                              element={
                                <ProtectedRoute>
                                  <Dashboard />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/settings"
                              element={
                                <ProtectedRoute>
                                  <Settings />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/checkout"
                              element={
                                <ProtectedRoute>
                                  <PaymentPage />
                                </ProtectedRoute>
                              }
                            />
                            <Route path="*" element={<NotFound />} />
                          </Routes>
                        </Suspense>
                      </ErrorBoundary>
                    </main>
                    <Footer />
                  </div>
                </Router>
              </MotionConfig>
            </NotificationProvider>
          </MessageProvider>
        </AuthProvider>
    </LanguageProvider>
  );
}

export default App;

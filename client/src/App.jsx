import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Wallet, 
  Trophy, 
  Target, 
  Settings, 
  Menu, 
  X, 
  Coffee,
  Star,
  MessageSquare,
  LogOut,
  ArrowLeft,
  Crown,
  Users,
  Gift,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import { AppProvider, useApp } from './context/AppContext';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { Reviews } from './pages/Reviews';
import { Wallet as WalletPage } from './pages/Wallet';
import { Ranking } from './pages/Ranking';
import { Admin } from './pages/Admin';
import { User } from './pages/User';
import { PanelSelector } from './pages/PanelSelector';
import { LandingPage } from './pages/LandingPage';
import { Register } from './pages/Register';
import { Login } from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { IconButton } from './components/buttons/PrimaryButton';

function Navigation({ currentPage, setCurrentPage, isMobileMenuOpen, setIsMobileMenuOpen }) {
  const { user, setUser } = useApp();
  const navigate = useNavigate();
  
  let navigation;
  if (user && user.role === 'admin') {
    // Admin sidebar: Dashboard + admin sections
    navigation = [
      { id: 'dashboard', label: 'Dashboard', icon: Home },
      { id: 'admin:users', label: 'Users', icon: Users },
      { id: 'admin:awards', label: 'Awards', icon: Gift },
      { id: 'admin:withdrawals', label: 'Withdrawals', icon: DollarSign },
      { id: 'admin:reviews', label: 'Reviews', icon: Star },
    ];
    } else {
      navigation = [
        { id: 'dashboard', label: 'Dashboard', icon: Home },
        { id: 'wallet', label: 'Wallet', icon: Wallet },
        { id: 'ranking', label: 'Rankings', icon: Trophy },
        { id: 'reviews', label: 'Reviews', icon: MessageSquare },
      ];
    }

  const NavItems = () => (
    <>
      {navigation.map((item) => {
        const Icon = item.icon;
        const isActive = currentPage === item.id;
        return (
          <motion.button
            key={item.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setCurrentPage(item.id);
              setIsMobileMenuOpen(false);
            }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              padding: '0.75rem 1rem',
              borderRadius: '0.75rem',
              fontWeight: '500',
              transition: 'all 0.3s ease',
              border: 'none',
              cursor: 'pointer',
              background: isActive 
                ? 'linear-gradient(to right, #FF9933, #FF8C00)' 
                : 'transparent',
              color: isActive 
                ? 'white' 
                : '#374151',
              boxShadow: isActive 
                ? '0 10px 25px -5px rgba(255, 153, 51, 0.3)' 
                : 'none'
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.target.style.backgroundColor = 'rgba(255, 153, 51, 0.1)';
                e.target.style.color = '#FF8C00';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#374151';
              }
            }}
          >
            <Icon style={{ width: '1.25rem', height: '1.25rem' }} />
            <span style={{ marginLeft: '0.75rem' }}>{item.label}</span>
          </motion.button>
        );
      })}
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="w-64 bg-white border-r border-vendor-100 shadow-luxury h-screen sticky top-0 overflow-y-auto">
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center p-6 border-b border-vendor-100">
              <div className="w-10 h-10 bg-gradient-to-br from-vendor-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                <Coffee className="w-6 h-6 text-white" />
              </div>
              <div className="ml-3">
                <h2 className="text-lg font-bold bg-gradient-to-r from-vendor-600 to-orange-600 bg-clip-text text-transparent">
                  Millionaire Chai
                </h2>
                <p className="text-xs text-gray-500 font-medium">Premium Platform</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2">
              <NavItems />
            </nav>

            {/* User Section */}
            <div style={{ padding: '1rem', borderTop: '1px solid rgba(255, 153, 51, 0.2)' }}>
              <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(24px)', borderRadius: '1rem', padding: '1rem', border: '1px solid rgba(255, 153, 51, 0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ 
                      width: '2.5rem', 
                      height: '2.5rem', 
                      background: 'linear-gradient(to bottom right, #FF9933, #FF8C00)', 
                      borderRadius: '50%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      color: 'white', 
                      fontWeight: 'bold',
                      fontSize: '1rem'
                    }}>
                      {user.name ? user.name.charAt(0) : 'U'}
                    </div>
                  )}
                        <div style={{ marginLeft: '0.75rem', flex: 1 }}>
                          <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1F2937' }}>{user.name}</div>
                            {user.role !== 'admin' && (
                              <div style={{ fontSize: '0.75rem', color: '#FF8C00', fontWeight: '500' }}>{user.rank}</div>
                            )}
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          {/* notifications UI removed per admin preference */}
                          {user.isVip && (
                            <Crown style={{ width: '1.25rem', height: '1.25rem', color: '#EAB308' }} />
                          )}
                          <button
                            onClick={async () => {
                              try {
                                await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
                              } catch (e) {
                                console.error('Logout failed', e);
                              }
                              setUser(null);
                              navigate('/');
                            }}
                            title="Logout"
                            style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '0.25rem' }}
                          >
                            <LogOut style={{ width: '1rem', height: '1rem', color: '#FF6B35' }} />
                          </button>
                        </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 40 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25 }}
              style={{ position: 'fixed', top: 0, left: 0, bottom: 0, width: '18rem', backgroundColor: '#ffffff', zIndex: 50, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.18)'}}
            >
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                {/* Mobile Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem', borderBottom: '1px solid rgba(255, 153, 51, 0.2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ 
                      width: '2.5rem', 
                      height: '2.5rem', 
                      background: 'linear-gradient(to bottom right, #FF9933, #FF8C00)', 
                      borderRadius: '0.75rem', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      boxShadow: '0 10px 25px -5px rgba(255, 153, 51, 0.3)'
                    }}>
                      <Coffee style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
                    </div>
                    <div style={{ marginLeft: '0.75rem' }}>
                      <h2 style={{ 
                        fontSize: '1.125rem', 
                        fontWeight: 'bold', 
                        background: 'linear-gradient(to right, #FF9933, #FF8C00)', 
                        WebkitBackgroundClip: 'text', 
                        WebkitTextFillColor: 'transparent', 
                        backgroundClip: 'text'
                      }}>
                        Millionaire Chai
                      </h2>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{ 
                      padding: '0.5rem', 
                      borderRadius: '0.5rem', 
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 153, 51, 0.1)'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  >
                    <X style={{ width: '1.25rem', height: '1.25rem', color: '#FF8C00' }} />
                  </button>
                </div>

                {/* Mobile Navigation */}
                <nav style={{ flex: 1, padding: '1rem 0' }}>
                  <NavItems />
                </nav>

                {/* Mobile User Section */}
                <div style={{ padding: '1rem', borderTop: '1px solid rgba(255, 153, 51, 0.2)' }}>
                  <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.78)', backdropFilter: 'blur(12px)', borderRadius: '1rem', padding: '1rem', border: '1px solid rgba(255, 153, 51, 0.08)' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', objectFit: 'cover' }}
                        />
                      ) : (
                        <div style={{ 
                          width: '2.5rem', 
                          height: '2.5rem', 
                          background: 'linear-gradient(to bottom right, #FF9933, #FF8C00)', 
                          borderRadius: '50%', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          color: 'white', 
                          fontWeight: 'bold',
                          fontSize: '1rem'
                        }}>
                          {user?.name ? user.name.charAt(0) : 'U'}
                        </div>
                      )}
                      <div style={{ marginLeft: '0.75rem', flex: 1 }}>
                        <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1F2937' }}>{user.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#FF8C00', fontWeight: '500' }}>{user.rank}</div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        {user.isVip && (
                          <Crown style={{ width: '1.25rem', height: '1.25rem', color: '#EAB308' }} />
                        )}
                        <button
                          onClick={async () => {
                            try {
                              await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
                            } catch (e) {
                              console.error('Logout failed', e);
                            }
                            setUser(null);
                            setIsMobileMenuOpen(false);
                            navigate('/');
                          }}
                          title="Logout"
                          style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '0.25rem' }}
                        >
                          <LogOut style={{ width: '1rem', height: '1rem', color: '#FF6B35' }} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function AppContent() {
  const { currentPage, setCurrentPage, isLoading, user } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLanding, setShowLanding] = useState(false);

  // If a logged-in user arrives and `currentPage` is left as 'panel-select',
  // force it to the appropriate dashboard so they don't see the selector.
  useEffect(() => {
    if (user && currentPage === 'panel-select') {
      if (user.role === 'admin' || user.role === 'superadmin') setCurrentPage('admin');
      else setCurrentPage('dashboard');
    }
  }, [user, currentPage, setCurrentPage]);

  const renderPage = () => {
    // if currentPage targets an admin sub-page, render Admin with the tab
    if (typeof currentPage === 'string' && currentPage.startsWith('admin:')) {
      const tab = currentPage.split(':')[1] || 'overview';
      return <Admin initialTab={tab} />;
    }

    switch (currentPage) {
      case 'dashboard':
        // if the signed-in user is an admin, show the Admin Overview tab
        if (user && user.role === 'admin') return <Admin initialTab="overview" />;
        return <Dashboard />;
      case 'reviews':
        return <Reviews />;
      case 'user':
        return <User />;
      
      case 'panel-select':
        return <PanelSelector onSelect={(p) => setCurrentPage(p)} />;
      case 'wallet':
        return <WalletPage />;
      case 'ranking':
        return <Ranking />;
      // 'Milestones' page removed from user sidebar; fallthrough to default
      case 'admin':
        return <Admin />;
      default:
        return <Dashboard />;
    }
  };

  const handleGetStarted = () => {
    setShowLanding(false);
    setCurrentPage('panel-select');
  };
 
  if (isLoading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(to bottom right, rgba(255, 153, 51, 0.05), white, rgba(255, 140, 0, 0.05))'
      }}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center' }}
        >
          <Coffee style={{ width: '4rem', height: '4rem', color: '#FF9933', margin: '0 auto 1rem', animation: 'pulse 2s infinite' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1F2937', marginBottom: '0.5rem' }}>
            Loading Millionaire Chai...
          </h2>
          <p style={{ color: '#6B7280' }}>Preparing your premium experience</p>
        </motion.div>
      </div>
    );
  }

  if (showLanding) {
    return <LandingPage onGetStarted={handleGetStarted} />;
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <div className="lg:flex">
        <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

        <div style={{ flex: 1 }}>
          {/* Mobile Header */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            padding: '1rem 1.5rem', 
            background: 'linear-gradient(90deg, rgba(255,153,51,0.88), rgba(255,140,0,0.78))',
            backgroundImage: 'linear-gradient(45deg, rgba(255,255,255,0.03) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.03) 50%, rgba(255,255,255,0.03) 75%, transparent 75%, transparent)',
            backgroundSize: '10px 10px',
            backdropFilter: 'blur(6px)',
            borderBottom: '1px solid rgba(255,153,51,0.08)',
            boxShadow: '0 6px 24px rgba(0,0,0,0.10), inset 0 -2px 0 rgba(255,255,255,0.05)',
            position: 'sticky',
            top: 0,
            zIndex: 30
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <button
                onClick={() => setShowLanding(true)}
                style={{
                  padding: '0.5rem',
                  borderRadius: '0.5rem',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  marginRight: '1rem',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <ArrowLeft style={{ width: '1.25rem', height: '1.25rem', color: 'white', filter: 'drop-shadow(0 1px 0 rgba(0,0,0,0.12))' }} />
              </button>
              <div style={{ 
                width: '2rem', 
                height: '2rem', 
                background: 'linear-gradient(to bottom right, #FF9933, #FF8C00)', 
                borderRadius: '0.5rem', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                <Coffee style={{ width: '1.25rem', height: '1.25rem', color: 'white' }} />
              </div>
              <div style={{ marginLeft: '0.75rem' }}>
                <h1 style={{ fontSize: '1.125rem', fontWeight: '700', color: 'white', letterSpacing: '0.2px', textShadow: '0 1px 0 rgba(0,0,0,0.12)' }}>
                        Millionaire Chai
                </h1>
                <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.9)' }}>Premium Platform</p>
              </div>
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-3"
              style={{
                padding: '0.5rem',
                borderRadius: '0.5rem',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <Menu style={{ width: '1.5rem', height: '1.5rem', color: '#6B7280' }} />
            </button>
          </div>

          {/* Main Content */}
          <div style={{ padding: '1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
            {renderPage()}
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  function LandingWrapper() {
    const navigate = useNavigate();
    const { user, setCurrentPage } = useApp();

    const handleGetStarted = () => {
      if (user) {
        // already signed in -> set correct landing page then go to app
        if (user.role === 'admin' || user.role === 'superadmin') {
          setCurrentPage('admin');
        } else {
          setCurrentPage('dashboard');
        }
        navigate('/app');
      } else {
        // not signed in -> go to register
        navigate('/register');
      }
    };

    return <LandingPage onGetStarted={handleGetStarted} />;
  }
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingWrapper />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/app/*" element={
            <ProtectedRoute>
              <AppContent />
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;

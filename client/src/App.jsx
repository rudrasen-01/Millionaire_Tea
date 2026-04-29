import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Wallet, 
  Trophy, 
  Target, 
  Menu, 
  X, 
  Coffee,
  Star,
  Bell,
  MessageSquare,
  LogOut,
  ArrowLeft,
  Crown,
  Users,
  Gift,
  TrendingUp,
  DollarSign,
  UserCircle,
  Check
} from 'lucide-react';
import { AppProvider, useApp } from './context/AppContext';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { Reviews } from './pages/Reviews';
import { Wallet as WalletPage } from './pages/Wallet';
import { Ranking } from './pages/Ranking';
import { Admin } from './pages/Admin';
import { User } from './pages/User';
import { Profile } from './pages/Profile';
import Notifications from './pages/Notifications';
import { PanelSelector } from './pages/PanelSelector';
import { LandingPage } from './pages/LandingPage';
import { Register } from './pages/Register';
import { Login } from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { IconButton } from './components/buttons/PrimaryButton';
import { ScrollToTop } from './components/buttons/ScrollToTop';

function Navigation({ currentPage, setCurrentPage, isMobileMenuOpen, setIsMobileMenuOpen, darkMode }) {
  const { user, setUser, notifications, removeNotification } = useApp();
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
                ? 'linear-gradient(to right, #B87333, #4A2C2A)' 
                : 'transparent',
              color: isActive 
                ? 'white' 
                : (darkMode ? '#D1D5DB' : '#374151'),
              boxShadow: isActive 
                ? '0 10px 25px -5px rgba(184, 115, 51, 0.3)' 
                : 'none'
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.target.style.backgroundColor = darkMode ? 'rgba(184, 115, 51, 0.15)' : 'rgba(184, 115, 51, 0.1)';
                e.target.style.color = '#B87333';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = darkMode ? '#D1D5DB' : '#374151';
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
        <div className="w-64 border-r h-screen sticky top-0 overflow-y-auto" style={{
          background: darkMode ? '#1F2937' : 'white',
          borderColor: darkMode ? '#374151' : 'rgba(184, 115, 51, 0.1)',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease'
        }}>
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center p-6 border-b" style={{
              borderColor: darkMode ? '#374151' : 'rgba(184, 115, 51, 0.1)',
              transition: 'border-color 0.3s ease'
            }}>
              <div className="w-10 h-10 bg-gradient-to-br from-caramel to-darkBrown rounded-xl flex items-center justify-center shadow-lg">
                <Coffee className="w-6 h-6 text-white" />
              </div>
              <div className="ml-3">
                <h2 className="text-lg font-bold bg-gradient-to-r from-caramel to-darkBrown bg-clip-text text-transparent">
                  Millionaire Chai
                </h2>
                <p className="text-xs font-medium" style={{
                  color: darkMode ? '#9CA3AF' : '#6B7280',
                  transition: 'color 0.3s ease'
                }}>Premium Platform</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-2 space-y-2">
              <NavItems />
            </nav>

            {/* User Section */}
            <div style={{ padding: '1rem', borderTop: '1px solid rgba(184, 115, 51, 0.2)' }}>
              <div 
                onClick={() => setCurrentPage('profile')}
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                  backdropFilter: 'blur(24px)', 
                  borderRadius: '1rem', 
                  padding: '1rem', 
                  border: '1px solid rgba(184, 115, 51, 0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
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
                      background: 'linear-gradient(to bottom right, #B87333, #4A2C2A)', 
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
                              <div style={{ fontSize: '0.75rem', color: '#B87333', fontWeight: '500' }}>{user.rank}</div>
                            )}
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          {/* notifications UI removed per admin preference */}
                          {user.isVip && (
                            <Crown style={{ width: '1.25rem', height: '1.25rem', color: '#EAB308' }} />
                          )}
                          <button
                            onClick={async (e) => {
                              e.stopPropagation(); // Prevent profile navigation
                              try {
                                await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
                              } catch (err) {
                                console.error('Logout failed', err);
                              }
                              setUser(null);
                              navigate('/');
                            }}
                            title="Logout"
                            style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '0.25rem' }}
                          >
                            <LogOut style={{ width: '1rem', height: '1rem', color: '#B87333' }} />
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
              style={{ 
                position: 'fixed', 
                top: 0, 
                left: 0, 
                bottom: 0, 
                width: '18rem', 
                backgroundColor: darkMode ? '#1F2937' : '#ffffff', 
                zIndex: 50, 
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.18)',
                transition: 'background-color 0.3s ease'
              }}>
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                {/* Mobile Header */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  padding: '1.5rem', 
                  borderBottom: `1px solid ${darkMode ? '#374151' : 'rgba(184, 115, 51, 0.2)'}`,
                  transition: 'border-color 0.3s ease'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ 
                      width: '2.5rem', 
                      height: '2.5rem', 
                      background: 'linear-gradient(to bottom right, #B87333, #4A2C2A)', 
                      borderRadius: '0.75rem', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      boxShadow: '0 10px 25px -5px rgba(184, 115, 51, 0.3)'
                    }}>
                      <Coffee style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
                    </div>
                    <div style={{ marginLeft: '0.75rem' }}>
                      <h2 style={{ 
                        fontSize: '1.125rem', 
                        fontWeight: 'bold', 
                        background: 'linear-gradient(to right, #B87333, #4A2C2A)', 
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
                    onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(184, 115, 51, 0.1)'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  >
                    <X style={{ width: '1.25rem', height: '1.25rem', color: '#B87333' }} />
                  </button>
                </div>

                {/* Mobile Navigation */}
                <nav style={{ flex: 1, padding: '1rem 0' }}>
                  <NavItems />
                </nav>

                {/* Mobile User Section */}
                <div style={{ padding: '1rem', borderTop: '1px solid rgba(184, 115, 51, 0.2)' }}>
                  <div 
                    onClick={() => {
                      setCurrentPage('profile');
                      setIsMobileMenuOpen(false);
                    }}
                    style={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.78)', 
                      backdropFilter: 'blur(12px)', 
                      borderRadius: '1rem', 
                      padding: '1rem', 
                      border: '1px solid rgba(184, 115, 51, 0.08)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
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
                          background: 'linear-gradient(to bottom right, #B87333, #4A2C2A)', 
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
                        <div style={{ fontSize: '0.75rem', color: '#B87333', fontWeight: '500' }}>{user.rank}</div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        {user.isVip && (
                          <Crown style={{ width: '1.25rem', height: '1.25rem', color: '#EAB308' }} />
                        )}
                        <button
                          onClick={async (e) => {
                            e.stopPropagation(); // Prevent profile navigation
                            try {
                              await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
                            } catch (err) {
                              console.error('Logout failed', err);
                            }
                            setUser(null);
                            setIsMobileMenuOpen(false);
                            navigate('/');
                          }}
                          title="Logout"
                          style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '0.25rem' }}
                        >
                          <LogOut style={{ width: '1rem', height: '1rem', color: '#B87333' }} />
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
  const { currentPage, setCurrentPage, isLoading, user, notifications, removeNotification, markNotificationRead, darkMode, toggleDarkMode, setUser, fetchNotifications } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLanding, setShowLanding] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [expandedNotifs, setExpandedNotifs] = useState(new Set());
  const navigate = useNavigate();

  // Handle bell icon click - refresh notifications and open dropdown
  const handleBellClick = async () => {
    setIsNotifOpen(!isNotifOpen);
    if (!isNotifOpen && fetchNotifications) {
      await fetchNotifications();
    }
  };

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
      case 'notifications':
        return <Notifications />;
      case 'user':
        return <User />;
      case 'profile':
        return <Profile />;
      
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

  function formatDate(d) {
    const dt = new Date(d);
    const pad = (v) => String(v).padStart(2, '0');
    return `${pad(dt.getDate())}/${pad(dt.getMonth()+1)}/${dt.getFullYear()} ${pad(dt.getHours())}:${pad(dt.getMinutes())}`;
  }

  const unreadCount = (notifications || []).filter(n => !n.read).length;

  const openNotifications = async () => {
    setIsNotifOpen(v => !v);
    // if opening, mark unread as read (optimistic)
    if (!isNotifOpen && notifications && notifications.length) {
      for (const n of notifications) {
        if (!n.read) {
          try { await markNotificationRead(n.id || n._id); } catch (e) { /* ignore */ }
        }
      }
    }
  };
 
  if (isLoading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(to bottom right, rgba(184, 115, 51, 0.05), white, rgba(184, 115, 51, 0.05))'
      }}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center' }}
        >
          <Coffee style={{ width: '4rem', height: '4rem', color: '#B87333', margin: '0 auto 1rem', animation: 'pulse 2s infinite' }} />
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
    <div style={{ 
      minHeight: '100vh',
      background: darkMode ? '#111827' : '#ffffff',
      transition: 'background-color 0.3s ease'
    }}>
      <ScrollToTop />
      <div className="lg:flex">
        <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} darkMode={darkMode} />

        <div style={{ flex: 1 }}>
          {/* Attractive Header Bar */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="sticky top-0 z-20"
            style={{
              background: 'linear-gradient(135deg, #B87333 0%, #4A2C2A 50%, #B87333 100%)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 20px rgba(184, 115, 51, 0.3), 0 0 40px rgba(184, 115, 51, 0.1)',
            }}
          >
            {/* Decorative top shine */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '2px',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
            }} />
            
            {/* Floating orbs decoration */}
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', opacity: 0.3 }}>
              <motion.div
                animate={{ 
                  x: [0, 30, 0],
                  y: [0, -20, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  position: 'absolute',
                  top: '-20px',
                  right: '10%',
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)',
                  filter: 'blur(20px)',
                }}
              />
              <motion.div
                animate={{ 
                  x: [0, -40, 0],
                  y: [0, 15, 0],
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  position: 'absolute',
                  top: '-30px',
                  left: '20%',
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
                  filter: 'blur(15px)',
                }}
              />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
              <div className="flex items-center justify-between h-16">
                {/* Left: Page Title with Icon */}
                <div className="flex items-center gap-3">
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className="p-2 rounded-lg"
                    style={{
                      background: 'rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                    }}
                  >
                    {currentPage === 'dashboard' && <Home className="w-5 h-5 text-white" />}
                    {currentPage === 'wallet' && <Wallet className="w-5 h-5 text-white" />}
                    {currentPage === 'ranking' && <Trophy className="w-5 h-5 text-white" />}
                    {currentPage === 'reviews' && <MessageSquare className="w-5 h-5 text-white" />}
                    {currentPage === 'profile' && <UserCircle className="w-5 h-5 text-white" />}
                    {currentPage.startsWith('admin') && <Crown className="w-5 h-5 text-white" />}
                    {currentPage === 'user' && <Users className="w-5 h-5 text-white" />}
                  </motion.div>
                  
                  <div>
                    <motion.h1 
                      key={currentPage}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-lg sm:text-xl font-bold text-white"
                      style={{
                        textShadow: '0 2px 10px rgba(0,0,0,0.2)',
                      }}
                    >
                      {currentPage === 'dashboard' && 'Dashboard'}
                      {currentPage === 'wallet' && 'Wallet'}
                      {currentPage === 'ranking' && 'Rankings'}
                      {currentPage === 'reviews' && 'Reviews'}
                      {currentPage === 'profile' && 'My Profile'}
                      {currentPage === 'admin:users' && 'User Management'}
                      {currentPage === 'admin:awards' && 'Award Management'}
                      {currentPage === 'admin:withdrawals' && 'Withdrawal Requests'}
                      {currentPage === 'admin:settings' && 'Settings'}
                      {currentPage === 'user' && 'User Profile'}
                    </motion.h1>
                    <p className="text-xs text-white/80 hidden sm:block">
                      Welcome back, {user?.name?.split(' ')[0] || 'User'}! ✨
                    </p>
                  </div>
                </div>

                {/* Right: User Info */}
                <div className="flex items-center gap-3">
                  {/* Points Badge - Hidden for Admin */}
                  {user?.points !== undefined && user?.role !== 'admin' && user?.role !== 'superadmin' && (
                    <motion.div
                      whileHover={{ scale: 1.05, y: -2 }}
                      className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full"
                      style={{
                        background: 'rgba(255, 255, 255, 0.25)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.4)',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                      }}
                    >
                      <Star className="w-4 h-4 text-white fill-white" />
                      <span className="text-sm font-semibold text-white">
                        {user.points.toLocaleString()}
                      </span>
                    </motion.div>
                  )}

                  {/* Notification Bell Icon */}
                  {user && (
                    <div className="relative">
                      <motion.button
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleBellClick}
                        className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full"
                        style={{
                          background: 'rgba(255, 255, 255, 0.25)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255, 255, 255, 0.4)',
                          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                        }}
                      >
                        <Bell className="w-5 h-5 text-white" />
                        {unreadCount > 0 && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                            style={{
                              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                              color: 'white',
                              boxShadow: '0 2px 8px rgba(239, 68, 68, 0.4)',
                            }}
                          >
                            {unreadCount > 9 ? '9+' : unreadCount}
                          </motion.div>
                        )}
                      </motion.button>

                      {/* Notifications Dropdown */}
                      <AnimatePresence>
                        {isNotifOpen && (
                          <>
                            {/* Backdrop */}
                            <div 
                              className="fixed inset-0 z-30"
                              onClick={() => setIsNotifOpen(false)}
                            />
                            
                            <motion.div
                              initial={{ opacity: 0, y: 10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 10, scale: 0.95 }}
                              transition={{ duration: 0.2 }}
                              className="absolute right-0 mt-2 w-96 rounded-2xl overflow-hidden z-40"
                              style={{
                                background: darkMode ? '#1F2937' : 'white',
                                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                                border: `1px solid ${darkMode ? '#374151' : 'rgba(184, 115, 51, 0.1)'}`,
                                maxHeight: '32rem',
                              }}
                            >
                              {/* Header */}
                              <div 
                                className="flex items-center justify-between px-4 py-3 border-b"
                                style={{ 
                                  borderColor: darkMode ? '#374151' : 'rgba(184, 115, 51, 0.1)',
                                  background: darkMode ? '#111827' : 'rgba(184, 115, 51, 0.05)'
                                }}
                              >
                                <h3 className="font-bold text-sm" style={{ color: darkMode ? '#F9FAFB' : '#111827' }}>
                                  Notifications
                                </h3>
                                <button
                                  onClick={() => setIsNotifOpen(false)}
                                  className="text-xs"
                                  style={{ 
                                    color: darkMode ? '#9CA3AF' : '#6B7280',
                                    padding: '0.25rem 0.5rem',
                                    borderRadius: '0.375rem',
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer'
                                  }}
                                >
                                  Close
                                </button>
                              </div>

                              {/* Notifications List */}
                              <div className="overflow-y-auto" style={{ maxHeight: '28rem' }}>
                                {(notifications || []).length === 0 ? (
                                  <div className="p-8 text-center">
                                    <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" style={{ color: darkMode ? '#9CA3AF' : '#6B7280' }} />
                                    <p className="text-sm" style={{ color: darkMode ? '#9CA3AF' : '#6B7280' }}>
                                      No notifications
                                    </p>
                                  </div>
                                ) : (
                                  (notifications || [])
                                    .slice()
                                    .sort((a, b) => {
                                      if (a.read === b.read) return new Date(b.createdAt) - new Date(a.createdAt);
                                      return a.read ? 1 : -1;
                                    })
                                    .map((n) => {
                                      const id = n.id || n._id;
                                      const isExpanded = expandedNotifs.has(id);
                                      const fullTextRaw = n.message || n.text || '';
                                      const fullText = (fullTextRaw || '').replace(/\s+/g, ' ').trim();
                                      const preview = fullText.length > 80 ? fullText.slice(0, 80) + '...' : fullText;
                                      const long = fullText.length > preview.length;

                                      return (
                                        <motion.div
                                          key={id}
                                          initial={{ opacity: 0, x: -20 }}
                                          animate={{ opacity: 1, x: 0 }}
                                          className="flex items-start px-4 py-3 gap-3 border-b"
                                          style={{
                                            background: n.read 
                                              ? (darkMode ? '#1F2937' : '#F9FAFB')
                                              : (darkMode ? '#374151' : 'white'),
                                            borderColor: darkMode ? '#374151' : 'rgba(184, 115, 51, 0.1)',
                                          }}
                                        >
                                          <div 
                                            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                                            style={{
                                              background: 'linear-gradient(135deg, #B87333, #4A2C2A)',
                                              boxShadow: '0 4px 8px rgba(184, 115, 51, 0.3)'
                                            }}
                                          >
                                            <Coffee className="w-5 h-5 text-white" />
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                              <div className="text-sm font-medium flex-1" style={{ color: darkMode ? '#F9FAFB' : '#111827' }}>
                                                {isExpanded ? fullText : preview}
                                              </div>
                                              <div className="text-xs text-right flex-shrink-0" style={{ color: darkMode ? '#9CA3AF' : '#6B7280' }}>
                                                {n.createdAt ? formatDate(n.createdAt) : ''}
                                              </div>
                                            </div>
                                            <div className="flex items-center justify-between mt-2">
                                              <div>
                                                {long && (
                                                  <button
                                                    onClick={() => {
                                                      const next = new Set(expandedNotifs);
                                                      if (isExpanded) next.delete(id);
                                                      else next.add(id);
                                                      setExpandedNotifs(next);
                                                    }}
                                                    className="text-xs font-medium"
                                                    style={{
                                                      color: '#B87333',
                                                      background: 'transparent',
                                                      border: 'none',
                                                      cursor: 'pointer',
                                                      padding: '0.25rem 0.5rem',
                                                      borderRadius: '0.25rem'
                                                    }}
                                                  >
                                                    {isExpanded ? 'Show less' : 'Read more'}
                                                  </button>
                                                )}
                                              </div>
                                              <button
                                                onClick={() => markNotificationRead(id)}
                                                className="text-xs font-medium px-3 py-1"
                                                style={{
                                                  color: n.read ? (darkMode ? '#9CA3AF' : '#9CA3AF') : '#B87333',
                                                  background: 'transparent',
                                                  border: 'none',
                                                  cursor: n.read ? 'default' : 'pointer',
                                                  opacity: n.read ? 0.5 : 1,
                                                }}
                                              >
                                                Read
                                              </button>
                                            </div>
                                          </div>
                                        </motion.div>
                                      );
                                    })
                                )}
                              </div>
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </div>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="lg:hidden"
                  style={{
                    padding: '0.5rem',
                    borderRadius: '0.5rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    border: 'none',
                    cursor: 'pointer',
                    marginLeft: '0.75rem'
                  }}
                >
                  <Menu style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
                </button>
              </div>
            </div>

            {/* Decorative bottom shine */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
            }} />
          </motion.div>

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

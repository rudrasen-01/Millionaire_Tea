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
  DollarSign,
  UserCircle,
  Moon,
  Sun,
  Bell,
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
import { PanelSelector } from './pages/PanelSelector';
import { LandingPage } from './pages/LandingPage';
import { Register } from './pages/Register';
import { Login } from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { IconButton } from './components/buttons/PrimaryButton';
import { ToastContainer } from './components/notifications/Toast';
import { ScrollToTop } from './components/buttons/ScrollToTop';

function Navigation({ currentPage, setCurrentPage, isMobileMenuOpen, setIsMobileMenuOpen, darkMode }) {
  const { user, setUser, notifications, removeNotification } = useApp();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  
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
                : (darkMode ? '#D1D5DB' : '#374151'),
              boxShadow: isActive 
                ? '0 10px 25px -5px rgba(255, 153, 51, 0.3)' 
                : 'none'
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.target.style.backgroundColor = darkMode ? 'rgba(255, 153, 51, 0.15)' : 'rgba(255, 153, 51, 0.1)';
                e.target.style.color = '#FF8C00';
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
          borderColor: darkMode ? '#374151' : 'rgba(255, 153, 51, 0.1)',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease'
        }}>
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center p-6 border-b" style={{
              borderColor: darkMode ? '#374151' : 'rgba(255, 153, 51, 0.1)',
              transition: 'border-color 0.3s ease'
            }}>
              <div className="w-10 h-10 bg-gradient-to-br from-vendor-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                <Coffee className="w-6 h-6 text-white" />
              </div>
              <div className="ml-3">
                <h2 className="text-lg font-bold bg-gradient-to-r from-vendor-600 to-orange-600 bg-clip-text text-transparent">
                  Millionaire Chai
                </h2>
                <p className="text-xs font-medium" style={{
                  color: darkMode ? '#9CA3AF' : '#6B7280',
                  transition: 'color 0.3s ease'
                }}>Premium Platform</p>
              </div>
            </div>

            {/* Notifications Bell */}
            <div className="px-4 pt-6 pb-2">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative w-full flex items-center p-3 rounded-xl transition-all"
                style={{
                  background: showNotifications ? 'rgba(255, 153, 51, 0.1)' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: darkMode ? '#D1D5DB' : '#374151'
                }}
                onMouseEnter={(e) => {
                  if (!showNotifications) {
                    e.target.style.backgroundColor = 'rgba(255, 153, 51, 0.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!showNotifications) {
                    e.target.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <Bell className="w-5 h-5" />
                <span className="ml-3 font-medium">Notifications</span>
                {notifications && notifications.length > 0 && (
                  <span className="ml-auto bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
                    {notifications.length}
                  </span>
                )}
              </button>
              
              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-orange-100 dark:border-gray-700 max-h-96 overflow-y-auto">
                  {notifications && notifications.length > 0 ? (
                    <div className="divide-y divide-gray-100 dark:divide-gray-700">
                      {notifications.slice(0, 5).map((notif) => (
                        <div
                          key={notif.id}
                          className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          <div className="flex items-start gap-2">
                            <div className="flex-1">
                              <p className="text-sm text-gray-700 dark:text-gray-300">{notif.message}</p>
                            </div>
                            <button
                              onClick={() => removeNotification(notif.id)}
                              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                              title="Mark as read"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                      {notifications.length > 5 && (
                        <div className="p-2 text-center text-xs text-gray-500">
                          +{notifications.length - 5} more notifications
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                      <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No notifications</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-2 space-y-2">
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
                  borderBottom: `1px solid ${darkMode ? '#374151' : 'rgba(255, 153, 51, 0.2)'}`,
                  transition: 'border-color 0.3s ease'
                }}>
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

                {/* Mobile Notifications Bell */}
                <div style={{ padding: '0 1rem' }}>
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0.75rem',
                      borderRadius: '0.75rem',
                      background: showNotifications ? 'rgba(255, 153, 51, 0.1)' : 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      color: darkMode ? '#D1D5DB' : '#374151',
                      fontWeight: '500',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!showNotifications) {
                        e.target.style.backgroundColor = 'rgba(255, 153, 51, 0.05)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!showNotifications) {
                        e.target.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    <Bell style={{ width: '1.25rem', height: '1.25rem' }} />
                    <span style={{ marginLeft: '0.75rem' }}>Notifications</span>
                    {notifications && notifications.length > 0 && (
                      <span style={{
                        marginLeft: 'auto',
                        background: 'linear-gradient(to right, #EF4444, #F97316)',
                        color: 'white',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        borderRadius: '9999px',
                        width: '1.5rem',
                        height: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}>
                        {notifications.length}
                      </span>
                    )}
                  </button>
                  
                  {/* Mobile Notifications Dropdown */}
                  {showNotifications && (
                    <div style={{
                      marginTop: '0.5rem',
                      background: darkMode ? '#374151' : 'white',
                      borderRadius: '0.75rem',
                      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                      border: `1px solid ${darkMode ? '#4B5563' : 'rgba(255, 153, 51, 0.1)'}`,
                      maxHeight: '24rem',
                      overflowY: 'auto'
                    }}>
                      {notifications && notifications.length > 0 ? (
                        <div>
                          {notifications.slice(0, 5).map((notif) => (
                            <div
                              key={notif.id}
                              style={{
                                padding: '0.75rem',
                                borderBottom: `1px solid ${darkMode ? '#4B5563' : 'rgba(0, 0, 0, 0.05)'}`,
                                transition: 'background-color 0.2s'
                              }}
                              onMouseEnter={(e) => e.target.style.backgroundColor = darkMode ? '#4B5563' : 'rgba(255, 153, 51, 0.05)'}
                              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                            >
                              <div style={{ display: 'flex', alignItems: 'start', gap: '0.5rem' }}>
                                <div style={{ flex: 1 }}>
                                  <p style={{ fontSize: '0.875rem', color: darkMode ? '#D1D5DB' : '#374151' }}>{notif.message}</p>\n                                </div>
                                <button
                                  onClick={() => removeNotification(notif.id)}
                                  style={{
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: darkMode ? '#9CA3AF' : '#6B7280',
                                    padding: '0.25rem'
                                  }}
                                  title="Mark as read"
                                >
                                  <Check style={{ width: '1rem', height: '1rem' }} />
                                </button>
                              </div>
                            </div>
                          ))}
                          {notifications.length > 5 && (
                            <div style={{ padding: '0.5rem', textAlign: 'center', fontSize: '0.75rem', color: '#6B7280' }}>
                              +{notifications.length - 5} more notifications
                            </div>
                          )}
                        </div>
                      ) : (
                        <div style={{ padding: '1.5rem', textAlign: 'center', color: darkMode ? '#9CA3AF' : '#6B7280' }}>
                          <Bell style={{ width: '2rem', height: '2rem', margin: '0 auto 0.5rem', opacity: 0.5 }} />
                          <p style={{ fontSize: '0.875rem' }}>No notifications</p>
                        </div>
                      )}
                    </div>
                  )}
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
  const { currentPage, setCurrentPage, isLoading, user, notifications, removeNotification, darkMode, toggleDarkMode } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLanding, setShowLanding] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useApp();

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
    <div style={{ 
      minHeight: '100vh',
      background: darkMode ? '#111827' : '#ffffff',
      transition: 'background-color 0.3s ease'
    }}>
      <ToastContainer notifications={notifications} onRemove={removeNotification} />
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
              background: 'linear-gradient(135deg, #FF9933 0%, #FF8C00 50%, #FFA500 100%)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 20px rgba(255, 153, 51, 0.3), 0 0 40px rgba(255, 153, 51, 0.1)',
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
                  {/* Points Badge */}
                  {user?.points !== undefined && (
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

                  {/* User Avatar with Dropdown */}
                  <div className="relative">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                      className="relative cursor-pointer"
                    >
                      {user?.profileImage ? (
                        <img
                          src={user.profileImage}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover"
                          style={{
                            border: '2px solid rgba(255, 255, 255, 0.5)',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                          }}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                          style={{
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1))',
                            backdropFilter: 'blur(10px)',
                            border: '2px solid rgba(255, 255, 255, 0.5)',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                          }}
                        >
                          {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                      )}
                      
                      {/* Online indicator */}
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white"
                        style={{
                          background: '#10b981',
                          boxShadow: '0 0 10px rgba(16, 185, 129, 0.8)',
                        }}
                      />
                    </motion.button>

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                      {isProfileDropdownOpen && (
                        <>
                          {/* Backdrop to close dropdown */}
                          <div 
                            className="fixed inset-0 z-30"
                            onClick={() => setIsProfileDropdownOpen(false)}
                          />
                          
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute right-0 mt-2 w-64 rounded-xl overflow-hidden z-40"
                            style={{
                              background: darkMode ? '#1F2937' : 'white',
                              boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                              transition: 'background-color 0.3s ease',
                            }}
                          >
                            {/* User Info Header */}
                            <div className="p-4" style={{
                              background: darkMode 
                                ? 'linear-gradient(135deg, #374151 0%, #1F2937 100%)'
                                : 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)',
                              borderBottom: `1px solid ${darkMode ? 'rgba(75, 85, 99, 0.5)' : 'rgba(255, 153, 51, 0.2)'}`,
                              transition: 'all 0.3s ease',
                            }}>
                              <div className="flex items-center gap-3">
                                {user?.profileImage ? (
                                  <img
                                    src={user.profileImage}
                                    alt={user.name}
                                    className="w-12 h-12 rounded-full object-cover"
                                    style={{
                                      boxShadow: '0 4px 15px rgba(255, 153, 51, 0.3)',
                                    }}
                                  />
                                ) : (
                                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                                    style={{
                                      background: 'linear-gradient(135deg, #FF9933, #FF8C00)',
                                      boxShadow: '0 4px 15px rgba(255, 153, 51, 0.3)',
                                    }}
                                  >
                                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-semibold truncate" style={{ 
                                    color: darkMode ? '#F9FAFB' : '#111827',
                                    transition: 'color 0.3s ease'
                                  }}>
                                    {user?.name || 'User Name'}
                                  </h3>
                                  <p className="text-sm truncate" style={{ 
                                    color: darkMode ? '#D1D5DB' : '#6B7280',
                                    transition: 'color 0.3s ease'
                                  }}>
                                    {user?.email || 'user@example.com'}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Menu Options */}
                            <div className="py-2">
                              {/* My Profile */}
                              <motion.button
                                whileHover={{ backgroundColor: darkMode ? '#374151' : '#FFF7ED' }}
                                onClick={() => {
                                  setCurrentPage('profile');
                                  setIsProfileDropdownOpen(false);
                                }}
                                className="w-full px-4 py-3 flex items-center gap-3 text-left transition-colors"
                                style={{
                                  border: 'none',
                                  background: 'transparent',
                                  cursor: 'pointer',
                                }}
                              >
                                <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                                  style={{ background: darkMode ? '#4B5563' : '#EEF2FF' }}
                                >
                                  <UserCircle className="w-4 h-4" style={{ color: darkMode ? '#93C5FD' : '#4F46E5' }} />
                                </div>
                                <span className="font-medium" style={{ 
                                  color: darkMode ? '#F9FAFB' : '#111827',
                                  transition: 'color 0.3s ease'
                                }}>My Profile</span>
                              </motion.button>

                              {/* Settings */}
                              <motion.button
                                whileHover={{ backgroundColor: darkMode ? '#374151' : '#FFF7ED' }}
                                onClick={() => {
                                  // Navigate to settings based on user role
                                  if (user?.role === 'admin') {
                                    setCurrentPage('admin:settings');
                                  } else {
                                    setCurrentPage('wallet'); // or any settings page for regular users
                                  }
                                  setIsProfileDropdownOpen(false);
                                }}
                                className="w-full px-4 py-3 flex items-center gap-3 text-left transition-colors"
                                style={{
                                  border: 'none',
                                  background: 'transparent',
                                  cursor: 'pointer',
                                }}
                              >
                                <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                                  style={{ background: darkMode ? '#4B5563' : '#F3F4F6' }}
                                >
                                  <Settings className="w-4 h-4" style={{ color: darkMode ? '#9CA3AF' : '#6B7280' }} />
                                </div>
                                <span className="font-medium" style={{ 
                                  color: darkMode ? '#F9FAFB' : '#111827',
                                  transition: 'color 0.3s ease'
                                }}>Settings</span>
                              </motion.button>

                              {/* Dark Mode Toggle */}
                              <motion.button
                                whileHover={{ backgroundColor: darkMode ? '#374151' : '#FFF7ED' }}
                                onClick={() => {
                                  toggleDarkMode();
                                }}
                                className="w-full px-4 py-3 flex items-center gap-3 text-left transition-colors"
                                style={{
                                  border: 'none',
                                  background: 'transparent',
                                  cursor: 'pointer',
                                }}
                              >
                                <div className="w-9 h-9 rounded-lg flex items-center justify-center relative overflow-hidden"
                                  style={{ background: darkMode ? '#1F2937' : '#FEF3C7' }}
                                >
                                  <AnimatePresence mode="wait">
                                    {darkMode ? (
                                      <motion.div
                                        key="moon"
                                        initial={{ rotate: -180, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: 180, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                      >
                                        <Moon className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                                      </motion.div>
                                    ) : (
                                      <motion.div
                                        key="sun"
                                        initial={{ rotate: 180, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: -180, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                      >
                                        <Sun className="w-4 h-4 text-yellow-600" />
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                                <div className="flex-1 flex items-center justify-between">
                                  <span className="font-medium" style={{ 
                                    color: darkMode ? '#F9FAFB' : '#111827',
                                    transition: 'color 0.3s ease'
                                  }}>
                                    {darkMode ? 'Dark Mode' : 'Light Mode'}
                                  </span>
                                  <div className="relative w-11 h-6 rounded-full transition-colors"
                                    style={{ background: darkMode ? '#FF9933' : '#D1D5DB' }}
                                  >
                                    <motion.div
                                      animate={{ x: darkMode ? 20 : 2 }}
                                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                      className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-md"
                                    />
                                  </div>
                                </div>
                              </motion.button>

                              {/* Divider */}
                              <div className="my-2 mx-4 border-t" style={{ 
                                borderColor: darkMode ? '#4B5563' : '#E5E7EB',
                                transition: 'border-color 0.3s ease'
                              }} />

                              {/* Logout */}
                              <motion.button
                                whileHover={{ backgroundColor: darkMode ? '#7F1D1D' : '#FEF2F2' }}
                                onClick={async () => {
                                  try {
                                    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
                                  } catch (e) {
                                    console.error('Logout failed', e);
                                  }
                                  setUser(null);
                                  setIsProfileDropdownOpen(false);
                                  navigate('/');
                                }}
                                className="w-full px-4 py-3 flex items-center gap-3 text-left transition-colors"
                                style={{
                                  border: 'none',
                                  background: 'transparent',
                                  cursor: 'pointer',
                                }}
                              >
                                <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                                  style={{ background: darkMode ? '#991B1B' : '#FEF2F2' }}
                                >
                                  <LogOut className="w-4 h-4" style={{ color: darkMode ? '#FCA5A5' : '#DC2626' }} />
                                </div>
                                <span className="font-medium" style={{ color: darkMode ? '#FCA5A5' : '#DC2626' }}>Logout</span>
                              </motion.button>
                            </div>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
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

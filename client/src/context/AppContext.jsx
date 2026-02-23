import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { io as ioClient } from 'socket.io-client';
// static mock data removed — use empty defaults and server-provided data

const AppContext = createContext();

const initialState = {
  user: null,
  allUsers: [],
  userWithdrawals: [],
  milestones: [],
  vendorStats: {},
  adminKPIs: {},
  isLoading: true,
  currentPage: 'dashboard',
  showTooltip: false,
  notifications: [],
  darkMode: false
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_PAGE':
      return { ...state, currentPage: action.payload };
    
    case 'UPDATE_USER_POINTS':
      return {
        ...state,
        user: { ...state.user, points: state.user.points + action.payload }
      };
    
    case 'UPDATE_USER_RANK':
      return {
        ...state,
        user: { ...state.user, rank: action.payload }
      };
    
    case 'ADD_REWARD_HISTORY':
      return {
        ...state,
        user: {
          ...state.user,
          rewardHistory: [action.payload, ...state.user.rewardHistory]
        }
      };
    
    case 'UPDATE_MILESTONE':
      return {
        ...state,
        milestones: state.milestones.map(m =>
          m.id === action.payload.id ? { ...m, achieved: true } : m
        )
      };
    
    case 'SET_DARK_MODE':
      return { ...state, darkMode: action.payload };
    
    case 'ADD_NOTIFICATION':
      // Ensure notification has createdAt timestamp for proper sorting
      const notificationWithTimestamp = {
        ...action.payload,
        createdAt: action.payload.createdAt || new Date().toISOString()
      };
      
      const msg = (notificationWithTimestamp.message || notificationWithTimestamp.text || '').toString().toLowerCase();
      
      // Filter notifications based on user role
      if (state.user) {
        const isAdmin = state.user.role === 'admin' || state.user.role === 'superadmin';
        
        // Check for admin-only message patterns
        const isAdminOnlyMsg = msg.includes('withdrawal request from') || 
                                msg.includes('new review submitted by') ||
                                msg.includes('new user registered:');
        
        if (isAdmin) {
          // Filter out tea purchase notifications for admins
          if (msg.includes('tea purchase') || 
              msg.includes('quantity added') || 
              msg.includes('points earned')) {
            // Do not add tea purchase notifications to admin state
            return state;
          }
        } else {
          // For regular users, ONLY show tea purchase notifications
          // Block all admin-only messages
          if (isAdminOnlyMsg) {
            return state;
          }
          
          const isTeaPurchaseNotif = msg.includes('tea purchase') || 
                                      msg.includes('quantity added') || 
                                      msg.includes('points earned');
          if (!isTeaPurchaseNotif) {
            // Do not add non-tea-purchase notifications to user state
            return state;
          }
        }
      }
      
      return {
        ...state,
        notifications: [notificationWithTimestamp, ...state.notifications]
      };
    case 'SET_NOTIFICATIONS':
      // Merge with existing notifications to preserve socket-based notifications
      // that may have arrived before the fetch
      const existingIds = new Set(state.notifications.map(n => n.id || n._id));
      let newNotifs = action.payload.filter(n => !existingIds.has(n.id || n._id));
      
      // Filter notifications based on user role
      if (state.user) {
        const isAdmin = state.user.role === 'admin' || state.user.role === 'superadmin';
        
        if (isAdmin) {
          // Filter out tea purchase notifications for admins
          newNotifs = newNotifs.filter(n => {
            const msg = (n.message || n.text || '').toString().toLowerCase();
            return !(msg.includes('tea purchase') || 
                     msg.includes('quantity added') || 
                     msg.includes('points earned'));
          });
        } else {
          // For regular users, ONLY show tea purchase notifications
          // Block all admin-only messages
          newNotifs = newNotifs.filter(n => {
            const msg = (n.message || n.text || '').toString().toLowerCase();
            
            // Block admin-only messages
            if (msg.includes('withdrawal request from') || 
                msg.includes('new review submitted by') ||
                msg.includes('new user registered:')) {
              return false;
            }
            
            return msg.includes('tea purchase') || 
                   msg.includes('quantity added') || 
                   msg.includes('points earned');
          });
        }
      }
      
      return { ...state, notifications: [...state.notifications, ...newNotifs] };
    case 'TAG_ADMIN_CONFIRMATIONS':
      return {
        ...state,
        notifications: state.notifications.map(n => {
          const txt = (n.message || n.text || '').toString();
          if (txt.startsWith(action.payload.prefix)) return { ...n, adminConfirmation: true };
          return n;
        })
      };
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(n => n.id === action.payload || n._id === action.payload ? { ...n, read: true } : n)
      };
    
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload)
      };
    
    case 'CLEANUP_NOTIFICATIONS_BY_ROLE':
      // Remove inappropriate notifications based on user role
      if (!state.user) return state;
      
      const isAdmin = state.user.role === 'admin' || state.user.role === 'superadmin';
      
      return {
        ...state,
        notifications: state.notifications.filter(n => {
          const msg = (n.message || n.text || '').toString().toLowerCase();
          const isTeaPurchaseNotif = msg.includes('tea purchase') || 
                                      msg.includes('quantity added') || 
                                      msg.includes('points earned');
          
          const isAdminOnlyMsg = msg.includes('withdrawal request from') || 
                                  msg.includes('new review submitted by') ||
                                  msg.includes('new user registered:');
          
          if (isAdmin) {
            // Admins: remove tea purchase notifications
            return !isTeaPurchaseNotif;
          } else {
            // Regular users: remove admin messages and keep ONLY tea purchase notifications
            if (isAdminOnlyMsg) return false;
            return isTeaPurchaseNotif;
          }
        })
      };
    
    case 'SHOW_TOOLTIP':
      return { ...state, showTooltip: action.payload };

    case 'SET_USER':
      return { ...state, user: action.payload };

    case 'SET_ALL_USERS':
      return { ...state, allUsers: action.payload };

    case 'SET_ADMIN_KPIS':
      return { ...state, adminKPIs: action.payload };

      case 'SET_USER_WITHDRAWALS':
        return { ...state, userWithdrawals: action.payload };

    case 'SET_VENDOR_STATS':
      return { ...state, vendorStats: action.payload };
    
    case 'CLAIM_PRIZE':
      const updatedUsers = [...state.allUsers];
      const rank1UserIndex = updatedUsers.findIndex(u => u.rank === 1);
      
      if (rank1UserIndex !== -1) {
        const rank1User = updatedUsers[rank1UserIndex];
        updatedUsers[rank1UserIndex] = { ...rank1User, rank: updatedUsers.length };
        
        for (let i = 0; i < updatedUsers.length - 1; i++) {
          updatedUsers[i] = { ...updatedUsers[i], rank: updatedUsers[i].rank + 1 };
        }
      }
      
      return {
        ...state,
        allUsers: updatedUsers,
        user: updatedUsers.find(u => u.id === state.user.id) || state.user
      };
    
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Initialize dark mode from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode !== null) {
      dispatch({ type: 'SET_DARK_MODE', payload: savedDarkMode === 'true' });
    }
  }, []);

  // Apply dark mode class to document
  useEffect(() => {
    if (state.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.darkMode]);

  // check current auth state on mount and clear loading when done
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/auth/me', { credentials: 'include' });
        if (!mounted) return;
        if (res.ok) {
          const data = await res.json();
          dispatch({ type: 'SET_USER', payload: data.user });
        } else {
          dispatch({ type: 'SET_USER', payload: null });
        }
      } catch (err) {
        if (!mounted) return;
        dispatch({ type: 'SET_USER', payload: null });
      } finally {
        if (!mounted) return;
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    })();
    return () => { mounted = false; };
  }, []);

  // fetch initial app data (rankings + dashboard)
  const fetchAppData = async () => {
    try {
      const [ranksRes, dashRes] = await Promise.all([
        fetch('/api/rewards/rankings'),
        fetch('/api/rewards/dashboard', { credentials: 'include' })
      ]);
      if (ranksRes && ranksRes.ok) {
        const r = await ranksRes.json();
        dispatch({ type: 'SET_ALL_USERS', payload: r.rankings || [] });
      }
      if (dashRes && dashRes.ok) {
        const d = await dashRes.json();
        dispatch({ type: 'SET_ADMIN_KPIS', payload: d.admin || {} });
        // dashboard returns `top` users under `top`, and vendorStats under `vendorStats`
        dispatch({ type: 'SET_VENDOR_STATS', payload: d.vendorStats || {} });
      }
    } catch (e) {
      console.error('Failed to fetch app data', e);
    }
  };

  const fetchUserWithdrawals = async () => {
    try {
      const res = await fetch('/api/rewards/withdrawals', { credentials: 'include' });
      if (res && res.ok) {
        const b = await res.json();
        dispatch({ type: 'SET_USER_WITHDRAWALS', payload: b.withdrawals || [] });
      }
    } catch (e) {
      console.error('Failed to fetch user withdrawals', e);
    }
  };

  const fetchAdminWithdrawals = async () => {
    try {
      const res = await fetch('/api/rewards/admin/withdrawals', { credentials: 'include' });
      if (res && res.ok) {
        const b = await res.json();
        try { window.dispatchEvent(new CustomEvent('app:withdrawalsAdminUpdated', { detail: b.withdrawals || [] })); } catch (e) { /* ignore */ }
      }
    } catch (e) {
      console.error('Failed to fetch admin withdrawals', e);
    }
  };

  useEffect(() => {
    fetchAppData();
    const id = setInterval(fetchAppData, 15000);
    // listen for manual refresh events from other components
    const onRanks = (e) => {
      if (e?.detail) dispatch({ type: 'SET_ALL_USERS', payload: e.detail });
    };
    window.addEventListener('app:rankingsUpdated', onRanks);
    return () => clearInterval(id);
  }, []);

  // fetch user notifications when user becomes available
  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/rewards/notifications', { credentials: 'include' });
      if (res && res.ok) {
        const b = await res.json();
        let notifs = (b.notifications || []).map(n => ({ ...n, id: n._id || n.id }));
        
        const isAdmin = state.user && (state.user.role === 'admin' || state.user.role === 'superadmin');
        
        // Filter notifications based on user role
        if (state.user) {
          notifs = notifs.filter(n => {
            const msg = (n.message || n.text || '').toString().toLowerCase();
            const isTeaPurchaseNotif = msg.includes('tea purchase') || 
                                        msg.includes('quantity added') ||
                                        msg.includes('points earned');
            
            const isAdminOnlyMsg = msg.includes('withdrawal request from') || 
                                    msg.includes('new review submitted by') ||
                                    msg.includes('new user registered:');
            
            if (isAdmin) {
              // Admins: exclude tea purchase notifications
              return !isTeaPurchaseNotif;
            } else {
              // Regular users: block admin messages and include ONLY tea purchase notifications
              if (isAdminOnlyMsg) return false;
              return isTeaPurchaseNotif;
            }
          });
        }
        
        // if current user is admin, also fetch persisted admin notifications
        if (isAdmin) {
          try {
            const ares = await fetch('/api/rewards/admin/notifications', { credentials: 'include' });
            if (ares && ares.ok) {
              const ab = await ares.json();
              const adminNotifs = (ab.notifications || [])
                .map(n => ({ ...n, id: n._id || n.id, adminNotification: true }))
                // Filter out unwanted messages to avoid cluttering admin notifications
                .filter(n => {
                  const msg = (n.message || n.msg || '').toString().toLowerCase();
                  return !msg.startsWith('notification sent to') && 
                         !msg.includes('tea purchase') &&
                         !msg.includes('quantity added') &&
                         !msg.includes('points earned');
                });
              // merge admin notifications before user notifications so they appear on top
              notifs = [...adminNotifs, ...notifs];
            }
          } catch (e) { /* ignore admin fetch errors */ }
        }
        dispatch({ type: 'SET_NOTIFICATIONS', payload: notifs });
      }
    } catch (e) {
      console.error('Failed to fetch notifications', e);
    }
  };

  useEffect(() => {
    if (state.user) {
      fetchNotifications();
      // Cleanup inappropriate notifications based on user role
      dispatch({ type: 'CLEANUP_NOTIFICATIONS_BY_ROLE' });
    }
  }, [state.user]);

  const markNotificationRead = async (id) => {
    try {
      dispatch({ type: 'MARK_NOTIFICATION_READ', payload: id });
      // determine if this is an admin notification
      const current = state.notifications.find(n => String(n.id || n._id) === String(id));
      if (current && current.adminNotification) {
        await fetch(`/api/rewards/admin/notifications/${id}/read`, { method: 'POST', credentials: 'include' });
      } else {
        await fetch(`/api/rewards/notifications/${id}/read`, { method: 'POST', credentials: 'include' });
      }
    } catch (e) {
      console.error('Failed to mark notification read', e);
    }
  };

  useEffect(() => {
    const onRanks = (e) => {
      if (e?.detail) dispatch({ type: 'SET_ALL_USERS', payload: e.detail });
    };
    window.addEventListener('app:rankingsUpdated', onRanks);
    return () => window.removeEventListener('app:rankingsUpdated', onRanks);
  }, []);

  // socket connection for real-time updates
  useEffect(() => {
    const apiUrl = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) ? import.meta.env.VITE_API_URL : 'http://localhost:5001';
    const socket = ioClient(apiUrl, { withCredentials: true });
    socket.on('connect', () => console.log('socket connected', socket.id));
    
    // Dashboard updates - refresh data for current user
    socket.on('dashboard:update', (payload) => {
      try { fetchAppData(); } catch(e) { /* ignore */ }
      if (payload.user && state.user && String(payload.user.id) === String(state.user._id || state.user.id)) {
        dispatch({ type: 'UPDATE_USER_POINTS', payload: payload.user.points - (state.user.points || 0) });
        dispatch({ type: 'UPDATE_USER_RANK', payload: payload.user.rankPosition });
      }
    });
    
    // Withdrawal created - notify BOTH the requesting user AND admins
    socket.on('withdrawal:created', (payload) => {
      try {
        if (!payload) return;
        // Notify the requesting user
        if (state.user && String(payload.userId) === String(state.user._id || state.user.id)) {
          fetchUserWithdrawals();
          dispatch({ type: 'ADD_NOTIFICATION', payload: { 
            id: Date.now() + Math.random(), 
            message: 'Your withdrawal request was created',
            read: false
          }});
        }
        // Separately notify admins about new withdrawal requests
        else if (state.user && (state.user.role === 'admin' || state.user.role === 'superadmin')) {
          dispatch({ type: 'ADD_NOTIFICATION', payload: { 
            id: Date.now() + Math.random(), 
            message: 'New withdrawal request received',
            read: false,
            adminNotification: true
          }});
        }
      } catch (e) { /* ignore */ }
    });
    
    // Withdrawal status updates - notify ONLY the requesting user
    socket.on('withdrawal:accepted', (payload) => {
      try {
        if (payload && state.user && String(payload.userId) === String(state.user._id || state.user.id)) {
          fetchUserWithdrawals();
          dispatch({ type: 'ADD_NOTIFICATION', payload: { 
            id: Date.now() + Math.random(), 
            message: 'Your withdrawal request was accepted',
            read: false
          }});
        }
      } catch (e) { /* ignore */ }
    });
    
    socket.on('withdrawal:confirmed', (payload) => {
      try {
        if (payload && state.user && String(payload.userId) === String(state.user._id || state.user.id)) {
          fetchUserWithdrawals();
          dispatch({ type: 'ADD_NOTIFICATION', payload: { 
            id: Date.now() + Math.random(), 
            message: 'Your withdrawal was confirmed',
            read: false
          }});
        }
      } catch (e) { /* ignore */ }
    });
    
    socket.on('withdrawal:paid', (payload) => {
      try {
        if (payload && state.user && String(payload.userId) === String(state.user._id || state.user.id)) {
          fetchUserWithdrawals();
          dispatch({ type: 'ADD_NOTIFICATION', payload: { 
            id: Date.now() + Math.random(), 
            message: 'Your withdrawal was marked paid',
            read: false
          }});
        }
      } catch (e) { /* ignore */ }
    });
    
    // Reward transferred - notify ONLY the winner user
    socket.on('reward:transferred', (info) => {
      try {
        if (state.user && String(info.winnerId) === String(state.user._id || state.user.id)) {
          dispatch({ type: 'ADD_NOTIFICATION', payload: { 
            id: Date.now() + Math.random(), 
            message: `Reward transferred: ${info.amount} points`,
            read: false
          }});
        }
        // Refresh admin awards data if current user is admin (no notification)
        (async () => {
          try {
            if (state.user && (state.user.role === 'admin' || state.user.role === 'superadmin')) {
              const res = await fetch('/api/rewards/admin/awards', { credentials: 'include' });
              if (res && res.ok) {
                const b = await res.json();
                try { window.dispatchEvent(new CustomEvent('app:awardsUpdated', { detail: b.awards || [] })); } catch (e) { /* ignore */ }
              }
            }
          } catch (e) { /* ignore */ }
        })();
      } catch (e) { /* ignore */ }
    });
    
    // User-specific notifications - filter based on user role
    socket.on('user:notification', (notif) => {
      try {
        if (!notif) return;
        // Only add notification if current user is the exact target user
        if (state.user && String(notif.userId) === String(state.user._id || state.user.id)) {
          const isAdmin = state.user.role === 'admin' || state.user.role === 'superadmin';
          const message = notif.message || notif.text || 'Notification';
          const msgLower = message.toLowerCase();
          
          const isTeaPurchase = msgLower.includes('tea purchase') || 
                                msgLower.includes('quantity added') || 
                                msgLower.includes('points earned');
          
          const isAdminOnlyMsg = msgLower.includes('withdrawal request from') || 
                                  msgLower.includes('new review submitted by') ||
                                  msgLower.includes('new user registered:');
          
          // Update user points if present (regardless of notification display)
          if (typeof notif.totalPoints === 'number') {
            dispatch({ type: 'SET_USER', payload: { ...state.user, points: notif.totalPoints } });
          }
          
          // Filter notification based on role
          if (isAdmin && isTeaPurchase) {
            // Admins: skip tea purchase notifications
            return;
          }
          
          if (!isAdmin) {
            // Regular users: block admin messages
            if (isAdminOnlyMsg) {
              return;
            }
            // Regular users: skip non-tea-purchase notifications
            if (!isTeaPurchase) {
              return;
            }
          }
          
          // Add the notification
          const payload = {
            id: Date.now() + Math.random(),
            message: message,
            quantity: notif.quantity,
            rewardPointsAdded: notif.rewardPointsAdded,
            totalPoints: notif.totalPoints,
            createdAt: notif.createdAt || new Date().toISOString(),
            read: false
          };
          dispatch({ type: 'ADD_NOTIFICATION', payload });
        }
      } catch (e) { /* ignore */ }
    });
    
    // User claim processed - notify ONLY the affected user
    socket.on('user:claimed', (info) => {
      try {
        if (state.user && String(info.userId) === String(state.user._id || state.user.id)) {
          dispatch({ type: 'ADD_NOTIFICATION', payload: { 
            id: Date.now() + Math.random(), 
            message: `Your claim processed: ${info.amount}`,
            read: false
          }});
        }
      } catch (e) { /* ignore */ }
    });

    // Admin config updates - notify ONLY admins
    socket.on('admin:configUpdated', (cfg) => {
      try {
        if (state.user && (state.user.role === 'admin' || state.user.role === 'superadmin')) {
          dispatch({ type: 'ADD_NOTIFICATION', payload: { 
            id: Date.now() + Math.random(), 
            message: 'Admin configuration updated',
            read: false,
            adminNotification: true
          }});
        }
      } catch (e) { /* ignore */ }
    });

    // Admin new user registration - handled by persisted admin:notification
    socket.on('admin:newUser', (u) => {
      try {
        // Server emits persisted admin:notification - no duplicate needed here
      } catch (e) { /* ignore */ }
    });

    // Admin new review - handled by persisted admin:notification
    socket.on('admin:newReview', (r) => {
      try {
        // Server emits persisted admin:notification - no duplicate needed here
      } catch (e) { /* ignore */ }
    });
    
    // Admin notification sent confirmation - DO NOT show as notification to avoid spam
    // Admins should not see "notification sent to user" messages for tea purchases
    socket.on('admin:notificationSent', (p) => {
      try {
        // This event is used to confirm notification delivery but should not create admin notifications
        // to avoid cluttering admin notification panel with tea purchase confirmations
      } catch (e) { /* ignore */ }
    });

    // Admin-specific persisted notifications - notify ONLY admins
    socket.on('admin:notification', (n) => {
      try {
        if (state.user && (state.user.role === 'admin' || state.user.role === 'superadmin')) {
          const payload = {
            id: n._id || n.id || (Date.now() + Math.random()),
            message: n.message || n.msg || 'Admin notification',
            createdAt: n.createdAt || new Date().toISOString(),
            adminNotification: true,
            read: !!n.read,
            details: n.details || {}
          };
          dispatch({ type: 'ADD_NOTIFICATION', payload });
        }
      } catch (e) { /* ignore */ }
    });

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
    };
  }, [state.user]);

  const value = {
    ...state,
    dispatch,
    fetchUserWithdrawals,
    fetchNotifications,
    markNotificationRead,
    setUser: (user) => dispatch({ type: 'SET_USER', payload: user }),
    updateUserPoints: (points) => dispatch({ type: 'UPDATE_USER_POINTS', payload: points }),
    setCurrentPage: (page) => dispatch({ type: 'SET_PAGE', payload: page }),
    addRewardHistory: (history) => dispatch({ type: 'ADD_REWARD_HISTORY', payload: history }),
    updateMilestone: (milestone) => dispatch({ type: 'UPDATE_MILESTONE', payload: milestone }),
    addNotification: (notification) => {
      // Convert old format { text, id } to new format { message, type, id }
      const formattedNotification = {
        id: notification.id || Date.now(),
        message: notification.message || notification.text || 'Notification',
        type: notification.type || 'info'
      };
      dispatch({ type: 'ADD_NOTIFICATION', payload: formattedNotification });
    },
    removeNotification: (id) => dispatch({ type: 'REMOVE_NOTIFICATION', payload: id }),
    showTooltip: (show) => dispatch({ type: 'SHOW_TOOLTIP', payload: show }),
    claimPrize: () => dispatch({ type: 'CLAIM_PRIZE' }),
    toggleDarkMode: () => {
      const newDarkMode = !state.darkMode;
      dispatch({ type: 'SET_DARK_MODE', payload: newDarkMode });
      localStorage.setItem('darkMode', String(newDarkMode));
    }
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

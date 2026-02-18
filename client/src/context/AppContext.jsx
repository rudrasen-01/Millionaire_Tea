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
  notifications: []
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
    
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [action.payload, ...state.notifications]
      };
    case 'SET_NOTIFICATIONS':
      return { ...state, notifications: action.payload };
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
        // if current user is admin, also fetch persisted admin notifications
        if (state.user && (state.user.role === 'admin' || state.user.role === 'superadmin')) {
          try {
            const ares = await fetch('/api/rewards/admin/notifications', { credentials: 'include' });
            if (ares && ares.ok) {
              const ab = await ares.json();
              const adminNotifs = (ab.notifications || []).map(n => ({ ...n, id: n._id || n.id, adminNotification: true }));
              // merge admin notifications before user notifications so they appear on top
              notifs = [...adminNotifs, ...notifs];
            }
          } catch (e) { /* ignore admin fetch errors */ }
        }
        dispatch({ type: 'SET_NOTIFICATIONS', payload: notifs });
        // tag any admin confirmation messages so UI hides the 'Read' label and points line
        dispatch({ type: 'TAG_ADMIN_CONFIRMATIONS', payload: { prefix: 'Notification sent to' } });
      }
    } catch (e) {
      console.error('Failed to fetch notifications', e);
    }
  };

  useEffect(() => {
    if (state.user) fetchNotifications();
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
    socket.on('dashboard:update', (payload) => {
      // refresh app data when dashboard updates
      try { fetchAppData(); } catch(e) { /* ignore */ }
      if (payload.user && state.user && String(payload.user.id) === String(state.user._id || state.user.id)) {
        dispatch({ type: 'UPDATE_USER_POINTS', payload: payload.user.points - (state.user.points || 0) });
        dispatch({ type: 'UPDATE_USER_RANK', payload: payload.user.rankPosition });
      }
      // intentionally not adding a generic notification here to avoid empty/placeholder messages
    });
    socket.on('withdrawal:created', (payload) => {
      try {
        if (payload && state.user && String(payload.userId) === String(state.user._id || state.user.id)) {
          // notify the requesting user and refresh their withdrawals
          fetchUserWithdrawals();
          dispatch({ type: 'ADD_NOTIFICATION', payload: { id: Date.now(), text: 'Your withdrawal request was created' } });
        }
        // admins should receive a brief admin notification about new withdrawal requests
        if (state.user && (state.user.role === 'admin' || state.user.role === 'superadmin')) {
          dispatch({ type: 'ADD_NOTIFICATION', payload: { id: Date.now(), text: 'New withdrawal request' } });
        }
      } catch (e) { /* ignore */ }
    });
    socket.on('withdrawal:accepted', (payload) => {
      try {
        if (payload && state.user && String(payload.userId) === String(state.user._id || state.user.id)) {
          fetchUserWithdrawals();
          dispatch({ type: 'ADD_NOTIFICATION', payload: { id: Date.now(), text: 'Your withdrawal request was accepted' } });
        }
        // do not add a generic notification for admins here to avoid noise
      } catch (e) { /* ignore */ }
    });
    socket.on('withdrawal:confirmed', (payload) => {
      try {
        if (payload && state.user && String(payload.userId) === String(state.user._id || state.user.id)) {
          fetchUserWithdrawals();
          dispatch({ type: 'ADD_NOTIFICATION', payload: { id: Date.now(), text: 'Your withdrawal was confirmed' } });
        }
      } catch (e) { /* ignore */ }
    });
    socket.on('withdrawal:paid', (payload) => {
      try {
        if (payload && state.user && String(payload.userId) === String(state.user._id || state.user.id)) {
          fetchUserWithdrawals();
          dispatch({ type: 'ADD_NOTIFICATION', payload: { id: Date.now(), text: 'Your withdrawal was marked paid' } });
        }
      } catch (e) { /* ignore */ }
    });
    socket.on('reward:transferred', (info) => {
      try {
        // notify only the winner (if it's the current user)
        if (state.user && String(info.winnerId) === String(state.user._id || state.user.id)) {
          dispatch({ type: 'ADD_NOTIFICATION', payload: { id: Date.now(), text: `Reward transferred: ${info.amount}` } });
        }
        // If current user is admin, refresh admin awards and notify admin UI listeners
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
    socket.on('user:notification', (notif) => {
      try {
        if (!notif) return;
        // if notification is targeted to current user, add it
        if (state.user && String(notif.userId) === String(state.user._id || state.user.id)) {
          const payload = {
            id: Date.now(),
            message: notif.message || notif.text || 'Notification',
            quantity: notif.quantity,
            rewardPointsAdded: notif.rewardPointsAdded,
            totalPoints: notif.totalPoints,
            createdAt: notif.createdAt || new Date().toISOString()
          };
          dispatch({ type: 'ADD_NOTIFICATION', payload });
          // also update user points if present
          if (typeof notif.totalPoints === 'number') {
            dispatch({ type: 'SET_USER', payload: { ...state.user, points: notif.totalPoints } });
          }
        }
      } catch (e) { /* ignore */ }
    });
    socket.on('user:claimed', (info) => {
      try {
        // notify only the affected user
        if (state.user && String(info.userId) === String(state.user._id || state.user.id)) {
          dispatch({ type: 'ADD_NOTIFICATION', payload: { id: Date.now(), text: `Your claim processed: ${info.amount}` } });
        }
      } catch (e) { /* ignore */ }
    });

    socket.on('admin:configUpdated', (cfg) => {
      try {
        // only admins should get admin config update notifications
        if (state.user && (state.user.role === 'admin' || state.user.role === 'superadmin')) {
          dispatch({ type: 'ADD_NOTIFICATION', payload: { id: Date.now(), text: 'Admin config updated' } });
        }
      } catch (e) { /* ignore */ }
    });

    // admin-specific events initiated by server
    socket.on('admin:newUser', (u) => {
      try {
        // admin:newUser is emitted as a lightweight alert; the server also emits a persisted `admin:notification` which will be shown in the admin notifications list
        // no client-side local notification added here to avoid duplication
      } catch (e) { /* ignore */ }
    });

    socket.on('admin:newReview', (r) => {
      try {
        // server will emit a persisted `admin:notification`; skip creating a local one here to avoid duplicates
      } catch (e) { /* ignore */ }
    });
    
    socket.on('admin:notificationSent', (p) => {
      try {
        if (state.user && (state.user.role === 'admin' || state.user.role === 'superadmin')) {
          // ignore confirmations that were triggered by the current admin
          if (p && p.actorId && String(p.actorId) === String(state.user._id || state.user.id)) return;
          const text = p && p.userName ? `Notification sent to ${p.userName}` : 'Notification sent to user';
          // mark as adminConfirmation so the UI can render it differently (no "Read" label)
          dispatch({ type: 'ADD_NOTIFICATION', payload: { id: Date.now(), text, adminConfirmation: true } });
          // also tag any existing notifications with the same text (e.g. from earlier fetch) so they render as admin confirmations
          dispatch({ type: 'TAG_ADMIN_CONFIRMATIONS', payload: { prefix: 'Notification sent to' } });
        }
      } catch (e) { /* ignore */ }
    });

    socket.on('admin:notification', (n) => {
      try {
        if (state.user && (state.user.role === 'admin' || state.user.role === 'superadmin')) {
          const payload = {
            id: n._id || n.id || Date.now(),
            message: n.message || n.msg || '',
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
    addNotification: (notification) => dispatch({ type: 'ADD_NOTIFICATION', payload: notification }),
    showTooltip: (show) => dispatch({ type: 'SHOW_TOOLTIP', payload: show }),
    claimPrize: () => dispatch({ type: 'CLAIM_PRIZE' })
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

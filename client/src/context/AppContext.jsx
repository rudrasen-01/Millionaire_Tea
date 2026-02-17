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
      dispatch({ type: 'ADD_NOTIFICATION', payload: { id: Date.now(), text: 'Dashboard updated' } });
    });
    socket.on('withdrawal:created', (payload) => {
      // if the event belongs to the current user, refresh their withdrawals
      try { if (payload && state.user && String(payload.userId) === String(state.user._id || state.user.id)) fetchUserWithdrawals(); } catch (e) { /* ignore */ }
      dispatch({ type: 'ADD_NOTIFICATION', payload: { id: Date.now(), text: 'Withdrawal request created' } });
    });
    socket.on('withdrawal:accepted', (payload) => {
      try {
        if (payload && state.user && String(payload.userId) === String(state.user._id || state.user.id)) fetchUserWithdrawals();
        // if current user is admin, refresh admin list
        if (state.user && (state.user.role === 'admin' || state.user.role === 'superadmin')) fetchAdminWithdrawals();
      } catch (e) { /* ignore */ }
      dispatch({ type: 'ADD_NOTIFICATION', payload: { id: Date.now(), text: 'A withdrawal request was accepted' } });
    });
    socket.on('withdrawal:confirmed', (payload) => {
      try {
        if (payload && state.user && String(payload.userId) === String(state.user._id || state.user.id)) fetchUserWithdrawals();
        if (state.user && (state.user.role === 'admin' || state.user.role === 'superadmin')) fetchAdminWithdrawals();
      } catch (e) { /* ignore */ }
      dispatch({ type: 'ADD_NOTIFICATION', payload: { id: Date.now(), text: 'A withdrawal was confirmed' } });
    });
    socket.on('withdrawal:paid', (payload) => {
      try {
        if (payload && state.user && String(payload.userId) === String(state.user._id || state.user.id)) fetchUserWithdrawals();
        if (state.user && (state.user.role === 'admin' || state.user.role === 'superadmin')) fetchAdminWithdrawals();
      } catch (e) { /* ignore */ }
      dispatch({ type: 'ADD_NOTIFICATION', payload: { id: Date.now(), text: 'A withdrawal was marked paid' } });
    });
    socket.on('reward:transferred', (info) => {
      dispatch({ type: 'ADD_NOTIFICATION', payload: { id: Date.now(), text: `Reward transferred: ${info.amount}` } });
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
    });
    socket.on('user:claimed', (info) => {
      dispatch({ type: 'ADD_NOTIFICATION', payload: { id: Date.now(), text: `User claimed ${info.amount}` } });
    });
    socket.on('admin:configUpdated', (cfg) => {
      dispatch({ type: 'ADD_NOTIFICATION', payload: { id: Date.now(), text: 'Admin config updated' } });
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

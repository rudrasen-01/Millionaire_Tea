import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function Notifications() {
  const { notifications } = useApp();
  const [expandedIds, setExpandedIds] = useState({});

  function formatDate(d) {
    const dt = new Date(d);
    const pad = (v) => String(v).padStart(2, '0');
    return `${pad(dt.getDate())}/${pad(dt.getMonth()+1)}/${dt.getFullYear()} ${pad(dt.getHours())}:${pad(dt.getMinutes())}`;
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Notifications</h1>
        {(!notifications || notifications.length === 0) && (
          <div className="text-sm text-gray-500">You have no notifications.</div>
        )}
        <div className="space-y-3 mt-4">
              {notifications && notifications.map(n => {
                  const id = n.id || n._id;
                  const expanded = !!expandedIds[id];
                  const full = n.message || n.text || '';
                  // Preferred compact preview rules:
                  // - If this is the tea-update message, show a fixed short preview
                  // - Otherwise show the first sentence (split on period/newline)
                  // - If that is empty, fall back to a clipped preview
                  const teaUpdatePhrase = 'Your tea purchase has been updated';
                  const fullNorm = (full || '').replace(/\s+/g, ' ').trim();
                  let preview = '';
                  if (fullNorm.toLowerCase().includes(teaUpdatePhrase.toLowerCase())) {
                    preview = teaUpdatePhrase;
                  } else {
                    preview = fullNorm.split(/[\.\n]/)[0].trim() || '';
                    if (!preview) preview = fullNorm.slice(0, 80) + (fullNorm.length > 80 ? '...' : '');
                  }
                  const long = full.length > preview.length;
            return (
            <div key={id} className={`p-4 border rounded-md bg-white ${n.read ? 'opacity-60' : ''}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-800 truncate">{expanded ? full : preview}</div>
                </div>
                <div className="ml-4 text-right">
                  <div className="text-xs text-gray-400">{n.createdAt ? formatDate(n.createdAt) : ''}</div>
                  <div className="mt-2 text-xs text-gray-400">{(!(n.adminConfirmation || n.adminNotification) && n.read) ? 'Read' : ''}</div>
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between">
                {(() => {
                  const msg = (n.message || n.text || '').toString().toLowerCase();
                  const isReview = (n.action && n.action.toString().startsWith('review')) || (n.details && n.details.action && n.details.action.toString().startsWith('review')) || msg.includes('review');
                  const showPoints = !(n.adminConfirmation || n.adminNotification || isReview);
                  return (
                    <div className="text-xs text-gray-500">{showPoints ? `Points: ${typeof n.rewardPointsAdded === 'number' ? `+${n.rewardPointsAdded}` : '-'} • Total: ${typeof n.totalPoints === 'number' ? n.totalPoints : '-'}` : ''}</div>
                  );
                })()}
                {long && (
                  <div>
                    <button className="text-xs text-blue-600" onClick={() => setExpandedIds(prev => ({ ...prev, [id]: !prev[id] }))}>{expanded ? 'Hide' : 'Read more'}</button>
                  </div>
                )}
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

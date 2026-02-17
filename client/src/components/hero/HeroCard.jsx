import React from 'react';
import { Users, Award, Star } from 'lucide-react';
import { PrimaryButton } from '../buttons/PrimaryButton';

export default function HeroCard({ points = 120, nextReward = 250, isAuthenticated = false, onGetStarted }) {
  const progress = Math.min(1, points / nextReward);

  if (!isAuthenticated) {
    const previewProgress = 0.25; // decorative preview for unauthenticated users
    return (
      <aside className="w-full max-w-sm mx-auto md:mx-0 bg-white/95 rounded-2xl p-6 shadow-lg ring-1 ring-slate-200" aria-labelledby="hero-card-title">
        <div>
          <div id="hero-card-title" className="text-sm font-semibold text-slate-700">Rewards Preview</div>
          <div className="mt-2 text-2xl font-bold text-slate-800">Join & Start Earning</div>
          <div className="text-xs text-slate-500 mt-1">Sign up to claim 50 bonus points today</div>
        </div>

        <div className="mt-4">
          <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden" aria-hidden>
            <div className="h-3 bg-amber-400" style={{ width: `${Math.round(previewProgress * 100)}%` }} />
          </div>
          <div className="mt-3">
            <div className="text-xs text-slate-500">Sign up to view your personal progress and claimed rewards</div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3">
          <div className="flex flex-col items-center p-3 bg-slate-50 rounded-lg">
            <div className="p-2 rounded-full bg-amber-100 text-amber-600 mb-1"><Star className="w-4 h-4" /></div>
            <div className="text-sm font-bold text-slate-700">₹150</div>
            <div className="text-xs text-slate-500">Avg Reward</div>
          </div>
          <div className="flex flex-col items-center p-3 bg-slate-50 rounded-lg">
            <div className="p-2 rounded-full bg-amber-100 text-amber-600 mb-1"><Users className="w-4 h-4" /></div>
            <div className="text-sm font-bold text-slate-700">100K+</div>
            <div className="text-xs text-slate-500">Members</div>
          </div>
          <div className="flex flex-col items-center p-3 bg-slate-50 rounded-lg">
            <div className="p-2 rounded-full bg-amber-100 text-amber-600 mb-1"><Award className="w-4 h-4" /></div>
            <div className="text-sm font-bold text-slate-700">50+</div>
            <div className="text-xs text-slate-500">Partners</div>
          </div>
        </div>

        <div className="mt-5">
          <PrimaryButton onClick={onGetStarted} className="w-full px-4 py-2 rounded-lg" aria-label="Create account and claim points">Create Free Account</PrimaryButton>
        </div>

        <div className="mt-4 text-xs text-slate-500">Trusted • Secure • Curated</div>
      </aside>
    );
  }

  return (
    <aside className="w-full max-w-sm mx-auto md:mx-0 bg-white/95 rounded-2xl p-6 shadow-lg ring-1 ring-slate-200" aria-labelledby="hero-card-title">
      <div className="flex items-start justify-between">
        <div>
          <div id="hero-card-title" className="text-sm font-semibold text-slate-700">Your Points</div>
          <div className="mt-2 text-4xl font-extrabold text-vendor-700">{points}</div>
          <div className="text-xs text-slate-500 mt-1">Next reward at {nextReward} pts</div>
        </div>

        <div className="ml-4 flex items-center justify-center" aria-hidden>
          <svg width="84" height="84" viewBox="0 0 84 84" fill="none" xmlns="http://www.w3.org/2000/svg" className="rounded-full">
            <circle cx="42" cy="42" r="36" stroke="#F3F4F6" strokeWidth="6" />
            <circle cx="42" cy="42" r="36" stroke="#D97706" strokeWidth="6" strokeLinecap="round" strokeDasharray={`${Math.round(2 * Math.PI * 36 * progress)} ${Math.round(2 * Math.PI * 36)}`} transform="rotate(-90 42 42)" />
            <text x="50%" y="50%" textAnchor="middle" dy="6" fontSize="12" fill="#92400E" fontWeight="700">{Math.round(progress * 100)}%</text>
          </svg>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        <div className="flex flex-col items-center p-3 bg-slate-50 rounded-lg">
          <div className="p-2 rounded-full bg-amber-100 text-amber-600 mb-1"><Star className="w-4 h-4" /></div>
          <div className="text-sm font-bold text-slate-700">₹150</div>
          <div className="text-xs text-slate-500">Avg Reward</div>
        </div>
        <div className="flex flex-col items-center p-3 bg-slate-50 rounded-lg">
          <div className="p-2 rounded-full bg-amber-100 text-amber-600 mb-1"><Users className="w-4 h-4" /></div>
          <div className="text-sm font-bold text-slate-700">100K+</div>
          <div className="text-xs text-slate-500">Members</div>
        </div>
        <div className="flex flex-col items-center p-3 bg-slate-50 rounded-lg">
          <div className="p-2 rounded-full bg-amber-100 text-amber-600 mb-1"><Award className="w-4 h-4" /></div>
          <div className="text-sm font-bold text-slate-700">50+</div>
          <div className="text-xs text-slate-500">Partners</div>
        </div>
      </div>

      <div className="mt-4 text-xs text-slate-500">Trusted • Secure • Curated</div>
    </aside>
  );
}

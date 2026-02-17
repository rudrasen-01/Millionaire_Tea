import React from 'react';
import HeroCard from './HeroCard';
import { Sparkles } from 'lucide-react';
import { PrimaryButton, SecondaryButton } from '../buttons/PrimaryButton';

export default function Hero({ onGetStarted, isAuthenticated = false }) {
  return (
    <section className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-gradient-to-r from-[#D97706] via-[#B25A04] to-[#37170A]" aria-hidden />
      <div className="absolute inset-0 bg-black/30" aria-hidden />

      <div className="relative max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 text-white">
            <div className="inline-flex items-center px-4 py-2 rounded-full mb-6 bg-white/10 ring-1 ring-white/10">
              <Sparkles className="w-4 h-4 mr-2 text-amber-200" aria-hidden />
              <span className="text-sm font-semibold text-amber-100">Premium Tea Services Platform</span>
            </div>

            <h1 className="font-serif font-extrabold text-4xl md:text-5xl lg:text-6xl leading-tight mb-6" style={{ textShadow: '0 6px 24px rgba(0,0,0,0.25)' }}>
              Turn Every Cup Into
              <span className="block mt-2 text-white">Premium Rewards & Experiences</span>
            </h1>

            <p className="text-lg text-amber-50 max-w-2xl bg-white/6 p-4 rounded-xl border border-white/6 leading-relaxed mb-8">
              Join a curated rewards program for tea lovers — earn points, enjoy exclusive tastings, and unlock limited vendor blends.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <PrimaryButton
                onClick={onGetStarted}
                aria-label="Join Millionaire Chai — Claim 50 points"
                className="px-6 py-3 rounded-xl font-semibold bg-amber-600 hover:shadow-lg"
                style={{ background: 'linear-gradient(90deg, #B25A04, #D97706)', color: 'white' }}
              >
                Join Free — Get 50 Points
              </PrimaryButton>

              <SecondaryButton
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-6 py-3 rounded-xl"
              >
                How It Works
              </SecondaryButton>
            </div>

            <div className="flex items-center space-x-6 text-sm text-amber-100">
              <div className="flex items-center space-x-2">
                <span className="font-bold">100K+</span>
                <span className="opacity-80">Premium Members</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-bold">500+</span>
                <span className="opacity-80">Heritage Teas</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-bold">4.9/5</span>
                <span className="opacity-80">Member Rating</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="mx-auto max-w-sm">
              <HeroCard points={120} nextReward={250} isAuthenticated={isAuthenticated} onGetStarted={onGetStarted} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

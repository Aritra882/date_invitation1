/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback } from 'react';
import {
  Heart,
  Sparkles,
  Copy,
  Check,
  Code2,
  Image as ImageIcon,
  Download,
  X,
  Calendar,
  MapPin,
} from 'lucide-react';
import { FloatingHearts } from './components/FloatingHearts';
import { FloatingBalloons } from './components/FloatingBalloons';
import { BackgroundMusic } from './components/BackgroundMusic';
import { HeartBurstCanvas } from './components/HeartBurstCanvas';
import { EvasiveButton } from './components/EvasiveButton';
import { DatePlanCard } from './components/DatePlanCard';
import { ConfirmationCard } from './components/ConfirmationCard';
import { RomanticPhotoGallery } from './components/RomanticPhotoGallery';
import { RomanticSideSparkles } from './components/RomanticSparkles';
import { SplashScreen } from './components/SplashScreen';
import { GIF_PRESETS } from './data/dates';
import { DateResponse } from './types';
import { getStandaloneHtml } from './utils/generateStandaloneHtml';

type Step = 'ask' | 'plan' | 'confirmed';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [mainVisible, setMainVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState<Step>('ask');

  const handleSplashEnter = useCallback(() => {
    setShowSplash(false);
    // Small delay so fade-out of splash completes before content appears
    setTimeout(() => setMainVisible(true), 100);
  }, []);
  const [selectedGifUrl, setSelectedGifUrl] = useState<string>(GIF_PRESETS[0].url);
  const [customGifInput, setCustomGifInput] = useState<string>('');
  const [dateResponse, setDateResponse] = useState<DateResponse | null>(null);

  // Heart burst states
  const [burstActive, setBurstActive] = useState(false);
  const [burstOrigin, setBurstOrigin] = useState<{ x: number; y: number } | null>(null);

  // Toolbar modals
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [showGifModal, setShowGifModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // When "Yes" is clicked
  const handleYesClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setBurstOrigin({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    });
    setBurstActive(true);

    setTimeout(() => {
      setCurrentStep('plan');
    }, 450);
  };

  // When date & place are confirmed
  const handlePlanConfirm = (res: DateResponse) => {
    setDateResponse(res);
    setBurstOrigin({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    });
    setBurstActive(true);
    setCurrentStep('confirmed');
  };

  const handleCopyStandaloneCode = async () => {
    const code = getStandaloneHtml(selectedGifUrl);
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
    } catch {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
    }
  };

  const handleDownloadStandaloneHtml = () => {
    const code = getStandaloneHtml(selectedGifUrl);
    const blob = new Blob([code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'index.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <>
    {/* BackgroundMusic mounts immediately so YouTube starts buffering silently */}
    <BackgroundMusic />

    {/* Splash gate */}
    {showSplash && <SplashScreen onEnter={handleSplashEnter} />}

    <div
      className="relative min-h-screen gradient-bg flex flex-col justify-between py-6 px-4 sm:px-6 select-none overflow-x-hidden"
      style={{
        opacity: mainVisible ? 1 : 0,
        transition: 'opacity 0.6s ease',
        pointerEvents: mainVisible ? 'auto' : 'none',
      }}
    >
      {/* Background floating hearts */}
      <FloatingHearts count={20} />

      {/* Continuous floating balloons named 'Srija' */}
      <FloatingBalloons name="Srija" count={currentStep === 'ask' ? 10 : 6} />

      {/* Heart burst particle effect */}
      <HeartBurstCanvas
        active={burstActive}
        origin={burstOrigin}
        onComplete={() => setBurstActive(false)}
      />

      {/* Top Floating Helper Bar */}
      <header className="relative z-20 max-w-xl mx-auto w-full flex items-center justify-center pb-4">
        <div className="flex items-center gap-1.5 text-xs text-rose-800/80 font-medium px-3.5 py-1.5 rounded-full bg-white/75 backdrop-blur-md border border-rose-100/80 shadow-xs">
          <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 animate-pulse" />
          <span>For Srija 💕</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex items-center justify-center py-4">
        {/* Step 1: The Initial Ask Card & Romantic Photo Showcase */}
        {currentStep === 'ask' && (
          <div className="w-full flex flex-col items-center">
            {/* Centered Question Card with Romantic Glitter & Sparkles Flanking Both Sides */}
            <div className="w-full max-w-5xl mx-auto flex items-center justify-center gap-2 lg:gap-6 px-3">
              {/* Left Romantic Sparkles & Stardust */}
              <RomanticSideSparkles side="left" />

              <div
                id="initial-question-card"
                className="w-full max-w-md mx-auto bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-9 shadow-xl shadow-rose-100/60 border border-rose-100 text-center transition-all duration-300 flex-shrink-0 relative z-10"
              >
                {/* Top decorative chip */}
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-50 border border-rose-200/70 text-rose-700 text-xs font-semibold mb-5 tracking-wide">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>A Question For Srija 🌸</span>
                </div>

                {/* Cute GIF Placeholder / Display */}
                <div className="relative mx-auto w-36 h-36 sm:w-44 sm:h-44 rounded-2xl overflow-hidden border-2 border-rose-100 shadow-md mb-6 bg-rose-50/50">
                  <img
                    src={selectedGifUrl}
                    alt="Romantic couple date graphic"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.src = '/date-illustration.jpg';
                    }}
                  />
                </div>

                {/* Headline */}
                <h1 className="text-xl sm:text-2xl font-serif font-semibold text-stone-800 leading-snug sm:leading-relaxed mb-8 px-1">
                  "I've really enjoyed all our conversations lately, and I was wondering... would you like to go on a date with me?"
                </h1>

                {/* Interactive Buttons: Side by Side */}
                <div className="flex items-center justify-center gap-4 relative min-h-[56px]">
                  {/* Yes Button */}
                  <button
                    type="button"
                    id="yes-button"
                    onClick={handleYesClick}
                    className="px-8 py-3.5 text-base sm:text-lg font-semibold rounded-full text-white 
                      bg-gradient-to-r from-rose-500 via-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 
                      shadow-lg shadow-rose-300/50 hover:shadow-rose-300/70 
                      transform hover:-translate-y-0.5 active:scale-95 transition-all duration-150 cursor-pointer 
                      flex items-center gap-2"
                  >
                    <span>Yes</span>
                    <Heart className="w-4 h-4 fill-white text-white animate-pulse" />
                  </button>

                  {/* Playfully Evasive No Button */}
                  <EvasiveButton />
                </div>

                <p className="mt-8 text-[11px] text-stone-600 italic">
                  ✨ Made with gentle feelings and warm wishes
                </p>
              </div>

              {/* Right Romantic Sparkles & Stardust */}
              <RomanticSideSparkles side="right" />
            </div>

            {/* Aesthetic Romantic 4-Photo Showcase for Srija */}
            <RomanticPhotoGallery />
          </div>
        )}

        {/* Step 2: Date & Place Selection Card */}
        {currentStep === 'plan' && (
          <DatePlanCard
            onConfirm={handlePlanConfirm}
            onBack={() => setCurrentStep('ask')}
          />
        )}

        {/* Step 3: Confirmation Ticket */}
        {currentStep === 'confirmed' && dateResponse && (
          <ConfirmationCard
            response={dateResponse}
            onEdit={() => setCurrentStep('plan')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center text-xs sm:text-sm text-stone-600 font-medium py-3 px-4">
        <span>Made with immense passion by your most likely favourite senior, Aritra Hazra ✨</span>
      </footer>

      {/* Modal: Swap GIF */}
      {showGifModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-rose-100 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-serif font-bold text-stone-800">
                Personalize the Cute GIF
              </h3>
              <button
                type="button"
                onClick={() => setShowGifModal(false)}
                className="p-1 rounded-full text-stone-600 hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-stone-600">
              Pick one of these sweet curated GIFs or paste any Giphy image URL that matches her personality:
            </p>

            <div className="grid grid-cols-2 gap-2.5">
              {GIF_PRESETS.map((preset) => {
                const isSelected = selectedGifUrl === preset.url;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      setSelectedGifUrl(preset.url);
                      setShowGifModal(false);
                    }}
                    className={`p-2 rounded-xl border text-left flex flex-col gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-rose-500 bg-rose-50/60 ring-2 ring-rose-400/30'
                        : 'border-stone-200 hover:border-rose-200 hover:bg-stone-50'
                    }`}
                  >
                    <div className="w-full h-24 rounded-lg overflow-hidden bg-rose-100/50">
                      <img
                        src={preset.url}
                        alt={preset.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <span className="text-xs font-semibold text-stone-800 truncate">
                      {preset.name}
                    </span>
                    <span className="text-[10px] text-stone-600 truncate">
                      {preset.tagline}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-stone-100 space-y-2">
              <label className="block text-xs font-medium text-stone-700">
                Or paste a custom Giphy GIF URL:
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={customGifInput}
                  onChange={(e) => setCustomGifInput(e.target.value)}
                  placeholder="https://media.giphy.com/media/.../giphy.gif"
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (customGifInput.trim()) {
                      setSelectedGifUrl(customGifInput.trim());
                      setShowGifModal(false);
                      setCustomGifInput('');
                    }
                  }}
                  className="px-3 py-2 bg-rose-500 text-white rounded-xl text-xs font-semibold hover:bg-rose-600 cursor-pointer"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Single-File HTML Exporter */}
      {showCodeModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
          <div className="bg-white rounded-3xl p-5 sm:p-6 max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-rose-100">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-rose-50 text-rose-600 rounded-lg">
                  <Code2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-800">
                    Single-File Standalone HTML
                  </h3>
                  <p className="text-xs text-stone-600">
                    Ready to save as <code className="bg-stone-100 px-1 py-0.5 rounded text-rose-700 font-mono">index.html</code> and host anywhere immediately!
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCodeModal(false)}
                className="p-1.5 rounded-full text-stone-600 hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Code Box */}
            <div className="flex-1 my-3 overflow-hidden rounded-2xl bg-stone-900 border border-stone-800 relative">
              <pre className="p-4 text-xs font-mono text-stone-200 overflow-auto h-72 sm:h-96">
                <code>{getStandaloneHtml(selectedGifUrl)}</code>
              </pre>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <span className="text-xs text-stone-600">
                Contains inline HTML, CSS, JavaScript & background animations
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadStandaloneHtml}
                  className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-700 bg-stone-50 hover:bg-stone-100 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download index.html</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopyStandaloneCode}
                  className="px-4 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-rose-200 cursor-pointer"
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Single-File Code</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}

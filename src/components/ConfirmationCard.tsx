import React, { useState } from 'react';
import { Heart, Calendar, MapPin, Sparkles, Copy, Check, MessageCircle, RotateCcw } from 'lucide-react';
import { DateResponse } from '../types';
import { getAllowedDates } from '../data/dates';

interface ConfirmationCardProps {
  response: DateResponse;
  onEdit: () => void;
  celebrationGifUrl?: string;
}

export const ConfirmationCard: React.FC<ConfirmationCardProps> = ({
  response,
  onEdit,
  celebrationGifUrl = 'https://media.giphy.com/media/M90mJvfWfd5mbUuULX/giphy.gif',
}) => {
  const [copied, setCopied] = useState(false);
  const allowedDates = getAllowedDates();
  const dateObj = allowedDates.find((d) => d.dateString === response.selectedDate);
  const formattedDate = dateObj?.displayDate || response.selectedDate;

  const timeString = response.preferredTime ? ` at ${response.preferredTime}` : '';
  const shareText = `Hey! I'm so excited for our date on ${formattedDate}${timeString} at ${response.place}! 🥰✨${
    response.note ? ` (${response.note})` : ''
  }`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;

  return (
    <div className="w-full max-w-lg mx-auto bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-2xl shadow-rose-200/50 border border-rose-100 text-center animate-fadeIn">
      {/* Top celebratory GIF */}
      <div className="relative mx-auto w-36 h-36 sm:w-44 sm:h-44 rounded-2xl overflow-hidden border-2 border-rose-100 shadow-md mb-5 bg-rose-50/50">
        <img
          src={celebrationGifUrl}
          alt="Happy celebration"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-2 right-2 bg-white/90 p-1 rounded-full shadow-sm">
          <Sparkles className="w-4 h-4 text-amber-500" />
        </div>
      </div>

      <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold mb-2">
        <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
        <span>It’s Officially a Date!</span>
      </div>

      <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-800 tracking-tight">
        I Can’t Wait to See You
      </h2>
      <p className="text-stone-600 text-xs sm:text-sm mt-1 mb-5">
        Counting down the moments already. Here is our plan:
      </p>

      {/* Date Pass / Ticket */}
      <div className="bg-gradient-to-br from-rose-50/90 via-peach-50/70 to-orange-50/40 rounded-2xl p-4 sm:p-5 border border-rose-200/80 shadow-inner text-left space-y-3 relative overflow-hidden mb-6">
        <div className="absolute top-0 right-0 transform translate-x-3 -translate-y-3 opacity-10 pointer-events-none">
          <Heart className="w-28 h-28 fill-rose-500" />
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 bg-white rounded-xl shadow-xs border border-rose-100 text-rose-500 mt-0.5">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-semibold text-rose-500 uppercase tracking-wider block">
              When
            </span>
            <span className="text-sm sm:text-base font-bold text-stone-800">
              {formattedDate} {response.preferredTime && `• ${response.preferredTime}`}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 bg-white rounded-xl shadow-xs border border-rose-100 text-rose-500 mt-0.5">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-semibold text-rose-500 uppercase tracking-wider block">
              Where
            </span>
            <span className="text-sm sm:text-base font-bold text-stone-800">
              {response.place}
            </span>
          </div>
        </div>

        {response.note && (
          <div className="pt-2 border-t border-rose-200/60 text-xs text-stone-600 italic">
            "💕 {response.note}"
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-3 px-4 rounded-xl font-medium text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-200/50 transition-all flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Send via WhatsApp</span>
        </a>

        <button
          type="button"
          onClick={handleCopy}
          className="flex-1 py-3 px-4 rounded-xl font-medium text-stone-700 bg-stone-100 hover:bg-stone-200/80 border border-stone-200 transition-all flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-700 font-semibold">Copied details!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-stone-500" />
              <span>Copy details</span>
            </>
          )}
        </button>
      </div>

      {/* Edit button */}
      <div className="mt-4 pt-3 border-t border-stone-100">
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center gap-1.5 text-xs text-stone-600 hover:text-rose-600 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Need to change the date or place? Tap here</span>
        </button>
      </div>
    </div>
  );
};

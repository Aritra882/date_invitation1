import React, { useState } from 'react';
import { Calendar, MapPin, Sparkles, Heart, Clock, ArrowRight } from 'lucide-react';
import { getAllowedDates, MIN_DATE_STR, MAX_DATE_STR } from '../data/dates';
import { AllowedDate, DateResponse } from '../types';

interface DatePlanCardProps {
  onConfirm: (response: DateResponse) => void;
  onBack?: () => void;
}

export const DatePlanCard: React.FC<DatePlanCardProps> = ({ onConfirm, onBack }) => {
  const allowedDates = getAllowedDates();
  const [selectedDate, setSelectedDate] = useState<string>(MIN_DATE_STR); // Default to first available date (Sept 26)
  const [place, setPlace] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [showError, setShowError] = useState(false);

  const handleDateChange = (val: string) => {
    // Strict clamp between 2026-09-26 and 2026-10-09
    if (val < MIN_DATE_STR) {
      setSelectedDate(MIN_DATE_STR);
    } else if (val > MAX_DATE_STR) {
      setSelectedDate(MAX_DATE_STR);
    } else {
      setSelectedDate(val);
    }
  };

  const handleQuickChipSelect = (dateItem: AllowedDate) => {
    setSelectedDate(dateItem.dateString);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !place.trim()) {
      setShowError(true);
      return;
    }
    setShowError(false);
    onConfirm({
      selectedDate,
      place: place.trim(),
      note: note.trim() || undefined,
      confirmedAt: new Date().toISOString(),
    });
  };

  const selectedDateObj = allowedDates.find((d) => d.dateString === selectedDate);

  return (
    <div className="w-full max-w-xl mx-auto bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-xl shadow-rose-100/50 border border-rose-100/80 transition-all duration-300 animate-fadeIn">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200/60 text-rose-700 text-xs sm:text-sm font-medium mb-3">
          <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
          <span>She said yes! Yay!</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif text-stone-800 font-semibold tracking-tight">
          Let’s Make It Special
        </h2>
        <p className="text-stone-600 text-sm sm:text-base mt-1.5 max-w-md mx-auto">
          Pick any day between <span className="font-semibold text-rose-700">Sept 26</span> and{' '}
          <span className="font-semibold text-rose-700">Oct 9</span>, and tell me where you’d love to go.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Date Selection */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-stone-800 font-semibold text-sm sm:text-base">
              <Calendar className="w-4 h-4 text-rose-500" />
              <span>Choose our date</span>
            </label>
            <span className="text-xs text-rose-600 font-medium bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">
              Sept 26 – Oct 9 only
            </span>
          </div>

          {/* Quick Date Chips Carousel */}
          <div className="relative">
            <div className="flex gap-2 overflow-x-auto pb-2 pt-1 scrollbar-thin scrollbar-thumb-rose-200">
              {allowedDates.map((item) => {
                const isSelected = item.dateString === selectedDate;
                return (
                  <button
                    key={item.dateString}
                    type="button"
                    onClick={() => handleQuickChipSelect(item)}
                    className={`flex-shrink-0 flex flex-col items-center justify-center min-w-[68px] py-2.5 px-2 rounded-2xl border transition-all text-xs cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-b from-rose-500 to-rose-600 text-white border-rose-600 shadow-md shadow-rose-300/40 scale-105'
                        : 'bg-stone-50/80 hover:bg-rose-50/60 border-stone-200 text-stone-700 hover:border-rose-200'
                    }`}
                  >
                    <span className={`text-[10px] uppercase font-medium ${isSelected ? 'text-rose-100' : 'text-stone-600'}`}>
                      {item.dayOfWeek}
                    </span>
                    <span className="text-base font-bold my-0.5">{item.dayNumber}</span>
                    <span className={`text-[10px] ${isSelected ? 'text-rose-100' : 'text-stone-600'}`}>
                      {item.monthName}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Native picker alternative for ease */}
          <div className="flex items-center gap-2 bg-stone-50 p-2.5 rounded-xl border border-stone-200/80">
            <span className="text-xs text-stone-600 flex-1">
              Selected: <strong className="text-stone-800">{selectedDateObj?.displayDate || selectedDate}</strong>
            </span>
            <input
              type="date"
              min={MIN_DATE_STR}
              max={MAX_DATE_STR}
              value={selectedDate}
              onChange={(e) => handleDateChange(e.target.value)}
              className="text-xs bg-white px-2.5 py-1.5 rounded-lg border border-stone-300 text-stone-700 focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
          </div>
        </div>

        {/* Section 2: Tell Me a Place */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-stone-800 font-semibold text-sm sm:text-base">
              <MapPin className="w-4 h-4 text-rose-500" />
              <span>Tell me a place</span>
            </label>
            <span className="text-xs text-stone-600 italic">It’s completely up to you!</span>
          </div>

          <div className="relative">
            <textarea
              rows={2}
              value={place}
              onChange={(e) => {
                setPlace(e.target.value);
                if (showError) setShowError(false);
              }}
              placeholder="Where have you been wanting to go? A cute dessert cafe, your favorite coffee spot, a quiet walk, dinner..."
              className={`w-full p-3.5 text-sm rounded-2xl border transition-all focus:outline-none focus:ring-2 focus:ring-rose-400/50 resize-none ${
                showError && !place.trim()
                  ? 'border-red-400 bg-red-50/20'
                  : 'border-stone-200 bg-stone-50/60 focus:bg-white'
              }`}
            />
          </div>


        </div>

        {/* Optional notes/timing */}
        <div className="space-y-1.5 pt-1">
          <label className="flex items-center gap-1.5 text-xs text-stone-600 font-medium">
            <Clock className="w-3.5 h-3.5 text-stone-600" />
            <span>Any preferred time or sweet details? (Optional)</span>
          </label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g., Evening around 6:30 PM, I love iced matcha, casual outfit..."
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-400/50"
          />
        </div>

        {/* Error message if empty */}
        {showError && (
          <p className="text-xs text-rose-600 text-center font-medium bg-rose-50 py-1.5 px-3 rounded-lg border border-rose-200">
            Please enter a place you’d like to visit so we can plan it together! 🌸
          </p>
        )}

        {/* Submit Button */}
        <div className="pt-2 flex items-center gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="px-4 py-3 rounded-2xl border border-stone-200 text-stone-600 text-sm hover:bg-stone-50 transition-colors cursor-pointer"
            >
              Back
            </button>
          )}
          <button
            type="submit"
            id="confirm-date-button"
            className="flex-1 py-3.5 px-6 rounded-2xl font-semibold text-white bg-gradient-to-r from-rose-500 via-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 shadow-lg shadow-rose-300/40 hover:shadow-rose-300/60 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer text-sm sm:text-base"
          >
            <span>Lock In Our Date</span>
            <Heart className="w-4 h-4 fill-white text-white" />
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};

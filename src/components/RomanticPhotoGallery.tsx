import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';

export interface PhotoMemory {
  id: string;
  index: number;
  title: string;
  subtitle: string;
  quote: string;
  color: string;
  accentBg: string;
  borderColor: string;
  candidateSources: string[];
  illustrationDesc: string;
}

export const PHOTO_MEMORIES: PhotoMemory[] = [
  {
    id: 'elegance',
    index: 1,
    title: 'A Quiet Grace',
    subtitle: 'White & Blue Saree • Green Foliage',
    quote: '"In a world full of noise, your elegance is the gentlest poetry. One look from you, and everything else simply fades away."',
    color: '#1D4ED8',
    accentBg: 'from-emerald-900/10 via-blue-900/10 to-rose-900/10',
    borderColor: 'border-blue-200/80',
    candidateSources: [
      '/photo1.jpg',
      '/photo1.png',
      '/photo1.jpeg',
      '/photos/photo1.jpg',
      '/photos/photo1.png',
      '/srija-1.jpg',
      '/srija-1.png',
      '/photos/srija-1.jpg',
      '/photos/srija-1.png',
      '/Screenshot%202026-09-14%20173310.png',
      '/Screenshot 2026-09-14 173310.png',
      '/date-illustration.jpg',
    ],
    illustrationDesc: 'Srija in traditional Kasavu white saree with royal blue blouse amidst lush green foliage',
  },
  {
    id: 'golden',
    index: 2,
    title: 'Sunshine & Silk',
    subtitle: 'Crimson Red Saree • Golden Hour',
    quote: '"They say the golden hour is the most magical time of day, but they haven\'t seen your smile caught in the warm sunlight."',
    color: '#BE123C',
    accentBg: 'from-rose-900/10 via-amber-900/10 to-orange-900/10',
    borderColor: 'border-rose-200/80',
    candidateSources: [
      '/photo2.jpg',
      '/photo2.png',
      '/photo2.jpeg',
      '/photos/photo2.jpg',
      '/photos/photo2.png',
      '/srija-2.jpg',
      '/srija-2.png',
      '/photos/srija-2.jpg',
      '/photos/srija-2.png',
      '/Screenshot%202026-09-14%20173511.png',
      '/Screenshot 2026-09-14 173511.png',
      '/date-illustration.jpg',
    ],
    illustrationDesc: 'Srija in ethereal crimson red saree and jhumkas smiling softly in golden afternoon sun',
  },
  {
    id: 'colors',
    index: 3,
    title: 'Colors of Joy',
    subtitle: 'Purple Saree • Festive Holi Abir',
    quote: '"All the colors of spring couldn\'t hold a candle to the vibrant light in your eyes and that playful, infectious laugh."',
    color: '#7E22CE',
    accentBg: 'from-purple-900/10 via-pink-900/10 to-rose-900/10',
    borderColor: 'border-purple-200/80',
    candidateSources: [
      '/photo3.jpg',
      '/photo3.png',
      '/photo3.jpeg',
      '/photos/photo3.jpg',
      '/photos/photo3.png',
      '/srija-3.jpg',
      '/srija-3.png',
      '/photos/srija-3.jpg',
      '/photos/srija-3.png',
      '/Screenshot%202026-09-14%20173551.png',
      '/Screenshot 2026-09-14 173551.png',
      '/date-illustration.jpg',
    ],
    illustrationDesc: 'Srija with vibrant pink Holi gulal on her cheeks wearing royal purple, smiling playfully by a tree',
  },
  {
    id: 'story',
    index: 4,
    title: 'My Favorite Story',
    subtitle: 'Sunset at Maidan • Reading Books',
    quote: '"Lost in pages and golden sunsets — you look like the most beautiful story someone waited a lifetime to read."',
    color: '#B45309',
    accentBg: 'from-amber-900/10 via-rose-900/10 to-orange-900/10',
    borderColor: 'border-amber-200/80',
    candidateSources: [
      '/photo4.jpg',
      '/photo4.png',
      '/photo4.jpeg',
      '/photos/photo4.jpg',
      '/photos/photo4.png',
      '/srija-4.jpg',
      '/srija-4.png',
      '/photos/srija-4.jpg',
      '/photos/srija-4.png',
      '/Screenshot%202026-09-14%20173742.png',
      '/Screenshot 2026-09-14 173742.png',
      '/date-illustration.jpg',
    ],
    illustrationDesc: 'Srija sitting peacefully barefoot on green grass reading a book in warm sunset dusk',
  },
];

// Cascading image component that tries multiple filename patterns
const CascadingImage: React.FC<{
  candidates: string[];
  alt: string;
  className?: string;
}> = ({ candidates, alt, className }) => {
  const [candidateIndex, setCandidateIndex] = useState(0);
  const currentSrc = candidates[candidateIndex] || '/date-illustration.jpg';

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      referrerPolicy="no-referrer"
      onError={() => {
        if (candidateIndex < candidates.length - 1) {
          setCandidateIndex((prev) => prev + 1);
        }
      }}
    />
  );
};

export const RomanticPhotoGallery: React.FC = () => {
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  return (
    <section className="w-full max-w-4xl mx-auto mt-10 mb-8 px-2 sm:px-4 select-none">
      {/* Header Banner */}
      <div className="text-center mb-6">
        <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-800 tracking-tight flex items-center justify-center gap-2">
          <span>Moments of Srija</span>
          <span className="text-rose-500">💕</span>
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 max-w-lg mx-auto mt-1">
          Every picture holds a feeling, a spark, and a memory I cherish dearly.
        </p>
      </div>

      {/* 4 Polaroid Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {PHOTO_MEMORIES.map((memory, index) => {
          return (
            <motion.div
              key={memory.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.12 }}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              onClick={() => setActiveLightboxIndex(index)}
              className={`group relative bg-white/95 backdrop-blur-md rounded-2xl p-3 sm:p-3.5 border shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer ${
                memory.borderColor
              }`}
            >
              {/* Photo Display Frame */}
              <div className="relative aspect-[4/5] w-full rounded-xl overflow-hidden bg-stone-100 shadow-inner group/photo">
                <CascadingImage
                  candidates={memory.candidateSources}
                  alt={memory.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Subtle Romantic Overlay with Enlarge Icon */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-end p-2.5">
                  <div
                    className="p-2 rounded-full bg-white/95 text-stone-800 hover:bg-white hover:text-rose-600 shadow-md transition-transform hover:scale-110 flex items-center gap-1 text-[10px] font-medium"
                    title="View Fullscreen"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Expand</span>
                  </div>
                </div>

                {/* Floating subtle number badge */}
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-white/85 backdrop-blur-xs border border-white/60 text-[10px] font-medium text-stone-700 shadow-xs flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                  <span>#{index + 1}</span>
                </div>
              </div>

              {/* Romantic Quote & Caption */}
              <div className="mt-3 flex flex-col justify-between flex-1">
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-serif font-bold text-stone-800 tracking-tight">
                      {memory.title}
                    </h4>
                    <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-100" />
                  </div>
                  <p className="text-[10px] text-rose-700 font-medium mt-0.5">
                    {memory.subtitle}
                  </p>
                </div>

                <div className="mt-2.5 pt-2.5 border-t border-rose-100/80">
                  <p className="text-[11px] sm:text-xs text-stone-700 italic font-serif leading-relaxed line-clamp-4">
                    {memory.quote}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Lightbox / Fullscreen Modal */}
      <AnimatePresence>
        {activeLightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setActiveLightboxIndex(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative max-w-xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-rose-100"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setActiveLightboxIndex(null)}
                className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Lightbox Image */}
              <div className="relative aspect-[4/5] sm:aspect-[3/4] max-h-[60vh] w-full bg-stone-100 flex items-center justify-center overflow-hidden">
                <CascadingImage
                  candidates={PHOTO_MEMORIES[activeLightboxIndex].candidateSources}
                  alt={PHOTO_MEMORIES[activeLightboxIndex].title}
                  className="w-full h-full object-contain bg-stone-900"
                />

                {/* Left / Right Nav in Lightbox */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveLightboxIndex((prev) =>
                      prev! > 0 ? prev! - 1 : PHOTO_MEMORIES.length - 1
                    );
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-stone-800 shadow-md cursor-pointer transition-transform hover:scale-110"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveLightboxIndex((prev) =>
                      prev! < PHOTO_MEMORIES.length - 1 ? prev! + 1 : 0
                    );
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-stone-800 shadow-md cursor-pointer transition-transform hover:scale-110"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Quote & Details */}
              <div className="p-6 text-center bg-gradient-to-b from-white via-rose-50/30 to-rose-50/60">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-semibold mb-2">
                  <Heart className="w-3.5 h-3.5 fill-rose-500" />
                  <span>{PHOTO_MEMORIES[activeLightboxIndex].subtitle}</span>
                </div>
                <h3 className="text-xl font-serif font-bold text-stone-800 mb-3">
                  {PHOTO_MEMORIES[activeLightboxIndex].title}
                </h3>
                <p className="text-sm sm:text-base font-serif italic text-stone-700 leading-relaxed max-w-md mx-auto">
                  {PHOTO_MEMORIES[activeLightboxIndex].quote}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

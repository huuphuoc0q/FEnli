import React, { useState, useEffect } from 'react';
import { FlashcardData } from '../types';
import { Flashcard } from './Flashcard';
import { ArrowLeft, ArrowRight, Home, RefreshCw } from 'lucide-react';

interface DeckViewProps {
  cards: FlashcardData[];
  onReset: () => void;
}

export const DeckView: React.FC<DeckViewProps> = ({ cards, onReset }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);

  // Reset flip state when card changes
  useEffect(() => {
    setIsFlipped(false);
  }, [currentIndex]);

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setDirection('right');
      setTimeout(() => {
          setCurrentIndex(prev => prev + 1);
          setDirection(null);
      }, 150);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setDirection('left');
      setTimeout(() => {
          setCurrentIndex(prev => prev - 1);
          setDirection(null);
      }, 150);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') handleNext();
    if (e.key === 'ArrowLeft') handlePrev();
    if (e.key === ' ' || e.key === 'Enter') setIsFlipped(prev => !prev);
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, cards.length]); // Dependencies for closure safety

  const currentCard = cards[currentIndex];
  const progress = ((currentIndex + 1) / cards.length) * 100;

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto h-[85vh]">
      {/* Header Controls */}
      <div className="w-full flex justify-between items-center mb-6 px-4">
        <button 
          onClick={onReset}
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-medium"
        >
          <Home className="w-5 h-5" />
          <span className="hidden sm:inline">Trang chủ</span>
        </button>
        
        <div className="text-slate-800 font-bold text-lg">
          {currentIndex + 1} <span className="text-slate-400 font-normal">/ {cards.length}</span>
        </div>

        <button 
          onClick={() => {
              setCurrentIndex(0);
              setIsFlipped(false);
          }}
          className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
          title="Restart Deck"
        >
            <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-slate-200 rounded-full mb-8 overflow-hidden max-w-md">
        <div 
          className="h-full bg-indigo-600 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Main Card Area */}
      <div className="relative w-full max-w-md aspect-[3/4] sm:aspect-[4/3] md:h-[450px]">
         {/* Navigation Buttons (Desktop: Absolute side / Mobile: Below) */}
         
         <div className={`w-full h-full transition-all duration-200 ${
             direction === 'right' ? '-translate-x-10 opacity-0' : 
             direction === 'left' ? 'translate-x-10 opacity-0' : 
             'translate-x-0 opacity-100'
         }`}>
            <Flashcard 
                data={currentCard} 
                isFlipped={isFlipped} 
                onFlip={() => setIsFlipped(!isFlipped)} 
            />
         </div>

        {/* Floating Nav Buttons */}
        <div className="absolute top-1/2 -left-16 -translate-y-1/2 hidden md:block">
            <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="p-4 rounded-full bg-white shadow-lg text-slate-700 hover:text-indigo-600 disabled:opacity-30 disabled:hover:text-slate-700 transition-all hover:scale-110"
            >
                <ArrowLeft className="w-6 h-6" />
            </button>
        </div>

        <div className="absolute top-1/2 -right-16 -translate-y-1/2 hidden md:block">
             <button
                onClick={handleNext}
                disabled={currentIndex === cards.length - 1}
                className="p-4 rounded-full bg-white shadow-lg text-slate-700 hover:text-indigo-600 disabled:opacity-30 disabled:hover:text-slate-700 transition-all hover:scale-110"
            >
                <ArrowRight className="w-6 h-6" />
            </button>
        </div>
      </div>

      {/* Mobile Navigation Controls */}
      <div className="flex gap-6 mt-8 md:hidden">
        <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="flex-1 px-6 py-3 bg-white rounded-xl shadow-sm text-slate-700 font-medium disabled:opacity-50 active:scale-95 transition-transform border border-slate-100"
        >
            Trước
        </button>
        <button
            onClick={handleNext}
            disabled={currentIndex === cards.length - 1}
            className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-200 font-medium disabled:opacity-50 disabled:shadow-none active:scale-95 transition-transform"
        >
            Sau
        </button>
      </div>

      <div className="mt-8 text-center text-slate-400 text-sm">
        Sử dụng <span className="kbd font-mono bg-slate-100 px-1 rounded">Space</span> để lật, <span className="kbd font-mono bg-slate-100 px-1 rounded">←</span> <span className="kbd font-mono bg-slate-100 px-1 rounded">→</span> để chuyển thẻ.
      </div>
    </div>
  );
};
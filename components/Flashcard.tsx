import React from 'react';
import { FlashcardData } from '../types';
import { Volume2, Lightbulb, RotateCw, BookOpen, Quote } from 'lucide-react';

interface FlashcardProps {
  data: FlashcardData;
  isFlipped: boolean;
  onFlip: () => void;
}

export const Flashcard: React.FC<FlashcardProps> = ({ data, isFlipped, onFlip }) => {
  
  const handleAudioClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const utterance = new SpeechSynthesisUtterance(data.word);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div 
      className="w-full h-full cursor-pointer perspective-1000 group select-none"
      onClick={onFlip}
    >
      <div 
        className={`relative w-full h-full duration-500 transform-style-3d transition-all ease-[cubic-bezier(0.23,1,0.32,1)] ${isFlipped ? 'rotate-y-180' : ''}`}
      >
        {/* FRONT SIDE */}
        <div className="absolute w-full h-full bg-white rounded-[2rem] shadow-2xl shadow-indigo-100 backface-hidden flex flex-col items-center justify-center p-8 border border-slate-100 overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-50 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-fuchsia-50 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none"></div>

            <div className="absolute top-6 right-6 text-slate-300 group-hover:text-indigo-400 transition-colors">
                <RotateCw className="w-6 h-6" />
            </div>
            
            <span className="relative z-10 px-4 py-1.5 bg-gradient-to-r from-violet-100 to-fuchsia-100 text-violet-700 text-sm font-bold uppercase tracking-wider rounded-full mb-8 shadow-sm">
                {data.partOfSpeech}
            </span>
            
            <h2 className="relative z-10 text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-slate-800 to-slate-600 mb-6 text-center break-words max-w-full tracking-tight">
                {data.word}
            </h2>
            
            <div className="relative z-10 flex items-center gap-3 text-slate-500 mb-10 bg-slate-50 px-5 py-2.5 rounded-2xl border border-slate-100">
                <span className="font-mono text-xl text-slate-600">{data.pronunciation}</span>
                <div className="w-px h-5 bg-slate-200 mx-1"></div>
                <button 
                    onClick={handleAudioClick}
                    className="p-2 hover:bg-violet-100 rounded-full transition-colors text-violet-600"
                    title="Play pronunciation"
                >
                    <Volume2 className="w-5 h-5" />
                </button>
            </div>

            <p className="relative z-10 text-slate-400 text-sm mt-auto font-medium animate-pulse">
                Chạm để lật thẻ
            </p>
        </div>

        {/* BACK SIDE */}
        <div className="absolute w-full h-full bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2rem] shadow-2xl backface-hidden rotate-y-180 flex flex-col p-0 overflow-hidden text-white border border-slate-700">
             
             {/* Header Stripe */}
             <div className="h-2 w-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500 shrink-0"></div>
             
             <div className="absolute top-6 right-6 text-white/20">
                <RotateCw className="w-6 h-6" />
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                {/* Definition Section */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-3">
                         <BookOpen className="w-4 h-4 text-fuchsia-400" />
                         <h3 className="text-fuchsia-200 text-xs font-bold uppercase tracking-widest">Định nghĩa</h3>
                    </div>
                    
                    <p className="text-2xl font-bold leading-snug mb-2 text-white">
                        {data.vietnameseDefinition}
                    </p>
                    <p className="text-slate-400 text-sm font-medium leading-relaxed border-l-2 border-slate-600 pl-3">
                        {data.englishDefinition}
                    </p>
                </div>

                {/* Example Section */}
                <div className="mb-6 bg-white/5 p-5 rounded-2xl border border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 opacity-10">
                        <Quote className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-violet-300 text-xs font-bold uppercase tracking-widest mb-3 relative z-10">Ví dụ</h3>
                    
                    <p className="text-lg leading-relaxed font-medium text-white/95 mb-2 relative z-10">
                        "{data.exampleSentence}"
                    </p>
                    <p className="text-violet-200/80 text-sm italic relative z-10">
                        → {data.exampleSentenceMeaning}
                    </p>
                </div>

                {/* Tip Section */}
                {data.tip && (
                    <div className="flex gap-3 items-start bg-gradient-to-r from-indigo-900/50 to-violet-900/50 p-4 rounded-xl border border-indigo-500/30">
                        <Lightbulb className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                        <p className="text-indigo-100 text-sm font-medium leading-relaxed">{data.tip}</p>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};
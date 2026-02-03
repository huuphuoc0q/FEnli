import React, { useState } from 'react';
import { AppState, FlashcardData } from './types';
import { InputForm } from './components/InputForm';
import { DeckView } from './components/DeckView';
import { BrainCircuit, AlertCircle, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.INPUT);
  const [cards, setCards] = useState<FlashcardData[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Handle Manual Import (JSON Paste)
  const handleManualImport = (data: FlashcardData[]) => {
    if (data.length === 0) {
      setErrorMsg("Dữ liệu JSON rỗng.");
      setAppState(AppState.ERROR);
      return;
    }
    setCards(data);
    setAppState(AppState.STUDY);
    setErrorMsg(null);
  };

  const resetApp = () => {
    setAppState(AppState.INPUT);
    setCards([]);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-fuchsia-100 selection:text-fuchsia-900 font-sans">
      
      {/* Refined Background decoration */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-[#f8fafc]">
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-indigo-200/40 rounded-full mix-blend-multiply filter blur-[120px] animate-blob"></div>
        <div className="absolute top-[30%] left-[-20%] w-[600px] h-[600px] bg-fuchsia-200/40 rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-10%] right-[10%] w-[600px] h-[600px] bg-violet-200/40 rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-4000"></div>
      </div>

      <header className="relative z-10 w-full p-6 flex justify-center">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={resetApp}>
            <div className="bg-gradient-to-br from-violet-600 to-fuchsia-600 p-2.5 rounded-xl text-white shadow-lg shadow-violet-200 group-hover:scale-110 transition-transform duration-300">
                <BrainCircuit className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-800 group-hover:text-violet-700 transition-colors">FlashLingo</span>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-4 py-6 flex flex-col items-center justify-center min-h-[80vh]">
        
        {appState === AppState.INPUT && (
          <InputForm onManualImport={handleManualImport} />
        )}

        {appState === AppState.STUDY && (
          <DeckView cards={cards} onReset={resetApp} />
        )}

        {appState === AppState.ERROR && (
          <div className="bg-white/90 backdrop-blur border border-red-100 rounded-3xl p-10 max-w-md text-center shadow-2xl shadow-red-50">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-red-50/50">
              <AlertCircle className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-3">Rất tiếc!</h3>
            <p className="text-slate-500 mb-8 leading-relaxed">{errorMsg || "Đã xảy ra lỗi không xác định."}</p>
            <button 
              onClick={() => setAppState(AppState.INPUT)}
              className="w-full bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-red-200 active:scale-95"
            >
              Thử lại ngay
            </button>
          </div>
        )}

      </main>

      <footer className="relative z-10 py-8 text-center text-slate-400 text-sm font-medium">
        <p className="flex items-center justify-center gap-2">
          <span>&copy; {new Date().getFullYear()} FlashLingo.</span>
          <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
          <span className="flex items-center gap-1">Powered by AI <Sparkles className="w-3 h-3 text-fuchsia-400" /></span>
        </p>
      </footer>
      
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 10s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05); 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2); 
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3); 
        }
      `}</style>
    </div>
  );
};

export default App;
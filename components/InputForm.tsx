import React, { useState } from 'react';
import { BookOpen, Copy, FileJson, Check, ArrowRight, Sparkles, ClipboardPaste } from 'lucide-react';
import { FlashcardData } from '../types';

interface InputFormProps {
  onManualImport: (data: FlashcardData[]) => void;
}

export const InputForm: React.FC<InputFormProps> = ({ onManualImport }) => {
  const [inputText, setInputText] = useState('');
  const [jsonInput, setJsonInput] = useState('');
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [jsonError, setJsonError] = useState<string | null>(null);

  const handleManualSubmit = () => {
    setJsonError(null);
    try {
      let cleanJson = jsonInput.trim();
      // Remove markdown code blocks if present
      if (cleanJson.startsWith('```json')) {
        cleanJson = cleanJson.replace(/^```json/, '').replace(/```$/, '');
      } else if (cleanJson.startsWith('```')) {
        cleanJson = cleanJson.replace(/^```/, '').replace(/```$/, '');
      }

      const parsedData = JSON.parse(cleanJson);
      
      if (!Array.isArray(parsedData)) {
        throw new Error("Dữ liệu phải là một mảng (Array) [ ... ].");
      }

      if (parsedData.length > 0) {
        const item = parsedData[0];
        // Validate new schema fields
        if (!item.word || !item.vietnameseDefinition || !item.englishDefinition) {
          throw new Error("JSON thiếu trường bắt buộc (word, vietnameseDefinition, englishDefinition).");
        }
      }

      onManualImport(parsedData as FlashcardData[]);
    } catch (err: any) {
      setJsonError("Lỗi cấu trúc JSON: " + err.message);
    }
  };

  const handleSample = () => {
    setInputText("Serendipity, Ephemeral, Resilience, Eloquent, Solitude");
  };

  const generatePrompt = (words: string) => {
    if (!words.trim()) return "";
    return `Act as an expert English teacher for Vietnamese students.
I will provide a list of vocabulary. Please generate a JSON Array of flashcards.

List of words:
${words}

Output Requirement:
Strictly return ONLY a valid JSON Array. No markdown formatting, no conversational text.

Each object must follow this schema exactly:
{
  "word": "The word itself",
  "pronunciation": "/IPA pronunciation/",
  "partOfSpeech": "part of speech (noun/verb/adj)",
  "englishDefinition": "Short definition in English",
  "vietnameseDefinition": "Explain the meaning in Vietnamese",
  "exampleSentence": "A generic example sentence in English",
  "exampleSentenceMeaning": "Translate the example sentence into natural Vietnamese",
  "tip": "A short mnemonic, tip, or synonym in Vietnamese to help remember"
}`;
  };

  const handleCopyPrompt = () => {
    const prompt = generatePrompt(inputText);
    navigator.clipboard.writeText(prompt);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  const hasWords = inputText.trim().length > 0;

  return (
    <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      
      {/* Left Column: Instructions & Input */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 sm:p-8 space-y-8 relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-violet-500 to-fuchsia-500"></div>
         
         <div className="text-center sm:text-left">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-fuchsia-600 mb-2">
              Tạo Bộ Thẻ Mới
            </h1>
            <p className="text-slate-500">
              Quy trình 3 bước đơn giản để biến từ vựng thành thẻ học thông minh.
            </p>
         </div>

         {/* Step 1 */}
         <div className="space-y-3">
            <div className="flex justify-between items-center">
               <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                 <span className="bg-violet-100 text-violet-700 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ring-2 ring-violet-50">1</span>
                 Nhập từ vựng
               </label>
               <button onClick={handleSample} className="text-xs font-medium text-violet-600 hover:text-violet-800 hover:underline transition-colors">
                 + Dùng mẫu
               </button>
            </div>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ví dụ: apple, banana, cherry..."
              className="w-full h-32 p-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 transition-all resize-none text-slate-700 text-base"
            />
         </div>

         {/* Step 2 */}
         <div className={`space-y-3 transition-all duration-500 ${hasWords ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-4 grayscale pointer-events-none'}`}>
             <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                 <span className="bg-fuchsia-100 text-fuchsia-700 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ring-2 ring-fuchsia-50">2</span>
                 Sao chép Prompt
             </label>
             <div className="p-4 bg-slate-900 rounded-xl relative group">
                <div className="text-slate-400 text-xs font-mono line-clamp-3 leading-relaxed">
                   {generatePrompt(inputText) || "Waiting for input..."}
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/90 rounded-xl"></div>
                <button
                  onClick={handleCopyPrompt}
                  className="absolute bottom-3 right-3 flex items-center gap-2 bg-white text-slate-900 px-4 py-2 rounded-lg text-sm font-bold shadow-lg hover:scale-105 active:scale-95 transition-all"
                >
                  {copyFeedback ? (
                    <>
                       <Check className="w-4 h-4 text-green-600" /> Đã chép
                    </>
                  ) : (
                    <>
                       <Copy className="w-4 h-4" /> Sao chép Prompt
                    </>
                  )}
                </button>
             </div>
             <p className="text-xs text-slate-400 pl-8">
               Gửi prompt này cho ChatGPT, Claude, hoặc Gemini.
             </p>
         </div>
      </div>

      {/* Right Column: Paste & Action */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 sm:p-8 space-y-6 relative h-full flex flex-col">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-fuchsia-500 to-indigo-500"></div>

          <div className="space-y-3 flex-1">
             <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                 <span className="bg-indigo-100 text-indigo-700 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ring-2 ring-indigo-50">3</span>
                 Dán kết quả (JSON)
             </label>
             <div className="relative h-full min-h-[200px]">
                <textarea
                    value={jsonInput}
                    onChange={(e) => {
                      setJsonInput(e.target.value);
                      setJsonError(null);
                    }}
                    placeholder='Dán kết quả từ AI vào đây...
[
  {
    "word": "...",
    "vietnameseDefinition": "..."
  }
]'
                    className={`w-full h-full min-h-[280px] p-4 rounded-xl bg-slate-50 border font-mono text-xs resize-none transition-all focus:ring-4 ${
                      jsonError 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
                        : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
                    }`}
                />
                 {!jsonInput && (
                    <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-slate-400 opacity-60">
                        <ClipboardPaste className="w-12 h-12 mb-2" />
                        <span className="text-sm">Chờ dán dữ liệu...</span>
                    </div>
                 )}
             </div>
             
             {jsonError && (
                <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg border border-red-100 flex items-start gap-2">
                    <span className="font-bold">Lỗi:</span> {jsonError}
                </div>
              )}
          </div>

          <button
              onClick={handleManualSubmit}
              disabled={!jsonInput.trim()}
              className="w-full group flex items-center justify-center gap-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white px-6 py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed transform active:scale-[0.98]"
          >
              <FileJson className="w-6 h-6 group-hover:rotate-12 transition-transform" />
              <span>Bắt đầu học ngay</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
      </div>
    </div>
  );
};
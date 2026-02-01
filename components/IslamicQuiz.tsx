
import React, { useState } from 'react';
import { ALL_QUIZ_QUESTIONS, QuizQuestion } from '../data/quiz_data';
import { Trophy, RefreshCcw, Check, ChevronLeft } from './Icons';

interface IslamicQuizProps {
    onBack: () => void;
}

export const IslamicQuiz: React.FC<IslamicQuizProps> = ({ onBack }) => {
    const [quizState, setQuizState] = useState<'intro' | 'playing' | 'result'>('intro');
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [activeQuestions, setActiveQuestions] = useState<QuizQuestion[]>([]);

    const startQuiz = () => {
        const shuffled = [...ALL_QUIZ_QUESTIONS].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 10);
        setActiveQuestions(selected);
        setQuizState('playing');
        setCurrentQuestionIdx(0);
        setScore(0);
        setIsAnswered(false);
        setSelectedOption(null);
    };

    const handleAnswer = (optionIndex: number) => {
        if (isAnswered) return;
        setSelectedOption(optionIndex);
        setIsAnswered(true);
        const currentQ = activeQuestions[currentQuestionIdx];
        if (optionIndex === currentQ.correctIndex) setScore(prev => prev + 1);
    };

    const nextQuestion = () => {
        if (currentQuestionIdx < activeQuestions.length - 1) {
            setCurrentQuestionIdx(prev => prev + 1);
            setIsAnswered(false);
            setSelectedOption(null);
        } else { finishQuiz(); }
    };

    const finishQuiz = () => {
        setQuizState('result');
        const xpGained = score * 10;
        if (typeof window !== 'undefined') {
            const savedStats = localStorage.getItem('user_stats');
            let stats = savedStats ? JSON.parse(savedStats) : { xp: 0 };
            stats.xp = (stats.xp || 0) + xpGained;
            // İstatistikleri güncelle (Doğru cevap sayısı)
            stats.quizCorrect = (stats.quizCorrect || 0) + score;
            localStorage.setItem('user_stats', JSON.stringify(stats));
        }
    };

    return (
        <div className="h-full flex flex-col bg-warm-200 dark:bg-slate-950 animate-slide-up">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-warm-200 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0">
                <button onClick={onBack} className="p-2 -ml-2 rounded-full bg-white/50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 transition-colors">
                    <ChevronLeft size={24} />
                </button>
                <div className="text-center">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Bilgi Yarışması</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Kendini Test Et</p>
                </div>
                <div className="w-10"></div>
            </div>

            <div className="flex-1 flex flex-col p-4 overflow-y-auto no-scrollbar pb-40">
                {quizState === 'intro' && (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
                        <div className="w-24 h-24 bg-amber-100 dark:bg-amber-900/30 text-amber-500 rounded-full flex items-center justify-center shadow-lg"><Trophy size={48} /></div>
                        <div><h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Dini Bilgi Yarışması</h3><p className="text-slate-500 dark:text-slate-400 text-sm">İslami bilgini test et, her doğru cevapta puan kazan!</p></div>
                        <button onClick={startQuiz} className="w-full max-w-xs py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-bold shadow-lg active:scale-95 transition-transform">Yarışmaya Başla</button>
                    </div>
                )}
                {quizState === 'playing' && (
                    <div className="flex flex-col h-full">
                        <div className="flex justify-between items-center mb-4"><span className="text-xs font-bold text-slate-400">Soru {currentQuestionIdx + 1}/{activeQuestions.length}</span><span className="text-xs font-bold text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-lg">Puan: {score * 10}</span></div>
                        <div className="flex-1 flex flex-col justify-center py-2"><h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6 text-center">{activeQuestions[currentQuestionIdx].question}</h3><div className="space-y-2.5">{activeQuestions[currentQuestionIdx].options.map((option, idx) => { let btnClass = "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 shadow-sm"; const isSelected = selectedOption === idx; const isCorrect = idx === activeQuestions[currentQuestionIdx].correctIndex; if (isAnswered) { if (isCorrect) btnClass = "bg-emerald-500 text-white border-emerald-500"; else if (isSelected && !isCorrect) btnClass = "bg-red-500 text-white border-red-500"; else btnClass = "bg-slate-50 dark:bg-slate-900 text-slate-400 opacity-50 border-transparent"; } return (<button key={idx} onClick={() => handleAnswer(idx)} disabled={isAnswered} className={`w-full p-4 rounded-xl border-2 text-left font-bold text-sm transition-all ${btnClass}`}>{option}</button>)})}</div></div>
                        {isAnswered && (
                            <div className="mt-4 animate-fade-in-up pb-4">
                                <div className="bg-slate-100 dark:bg-slate-900 p-3 rounded-xl mb-3 text-xs text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800">
                                    <span className="font-bold block mb-1">Açıklama:</span>
                                    {activeQuestions[currentQuestionIdx].explanation}
                                </div>
                                <button onClick={nextQuestion} className="w-full py-4 bg-slate-800 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold shadow-lg">{currentQuestionIdx === activeQuestions.length - 1 ? 'Sonuçları Gör' : 'Sıradaki Soru'}</button>
                            </div>
                        )}
                    </div>
                )}
                {quizState === 'result' && (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-6 animate-scale-up">
                        <div className="w-32 h-32 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full flex items-center justify-center shadow-xl mb-2 relative"><Check size={64} strokeWidth={4} /><div className="absolute -bottom-2 bg-white dark:bg-slate-800 px-3 py-1 rounded-full text-sm font-black border border-slate-200 dark:border-slate-700">%{Math.round((score / 10) * 100)}</div></div>
                        <div><h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Tebrikler!</h3><p className="text-slate-500 dark:text-slate-400 text-sm">Yarışmayı tamamladın.</p></div>
                        <div className="w-full max-w-xs bg-white/50 dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700"><div className="flex justify-between items-center mb-2"><span className="text-sm font-medium text-slate-500">Doğru</span><span className="text-lg font-bold text-emerald-600">{score}</span></div><div className="flex justify-between items-center mb-2"><span className="text-sm font-medium text-slate-500">Yanlış</span><span className="text-lg font-bold text-red-500">{10 - score}</span></div><div className="flex justify-between items-center"><span className="text-sm font-bold text-slate-800 dark:text-white">Kazanılan XP</span><span className="text-xl font-black text-amber-500">+{score * 10} XP</span></div></div>
                        <button onClick={startQuiz} className="w-full max-w-xs py-4 bg-slate-800 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold shadow-lg flex items-center justify-center gap-2"><RefreshCcw size={18} /> Tekrar Oyna</button>
                    </div>
                )}
            </div>
        </div>
    );
};

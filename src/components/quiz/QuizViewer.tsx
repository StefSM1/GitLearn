import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, ChevronRight, Trophy, RefreshCcw } from 'lucide-react';
import { useStore } from '@/store/useStore';

interface Question {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface QuizViewerProps {
  repoId: string;
  questions: Question[];
}

export function QuizViewer({ repoId, questions }: QuizViewerProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const handleSelect = (index: number) => {
    if (isAnswerRevealed) return;
    setSelectedOption(index);
  };

  const submitAnswer = () => {
    if (selectedOption === null) return;
    
    if (selectedOption === questions[currentQuestion].correctIndex) {
      setScore(s => s + 1);
    }
    setIsAnswerRevealed(true);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(c => c + 1);
      setSelectedOption(null);
      setIsAnswerRevealed(false);
    } else {
      setIsFinished(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setIsAnswerRevealed(false);
    setScore(0);
    setIsFinished(false);
  };

  if (isFinished) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="max-w-2xl mx-auto w-full">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card rounded-3xl p-10 text-center relative overflow-hidden"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-500/10 blur-[100px] pointer-events-none" />
          
          <Trophy className={`w-20 h-20 mx-auto mb-6 ${percentage >= 80 ? 'text-amber-400' : 'text-zinc-500'}`} />
          
          <h2 className="text-4xl font-bold text-white mb-4">Quiz Complete!</h2>
          
          <div className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-indigo-600 mb-6">
            {percentage}%
          </div>
          
          <p className="text-zinc-400 text-lg mb-10">
            You scored {score} out of {questions.length} questions correctly.
          </p>

          <button onClick={resetQuiz} className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold bg-white/10 hover:bg-white/20 text-white transition-all">
            <RefreshCcw className="w-5 h-5" />
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  const q = questions[currentQuestion];

  return (
    <div className="max-w-3xl mx-auto w-full">
      {/* Progress */}
      <div className="flex justify-between text-sm font-medium text-zinc-500 mb-6">
        <span>Question {currentQuestion + 1} of {questions.length}</span>
        <span>Score: {score}</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="glass-card rounded-3xl p-6 md:p-10 mb-8"
        >
          <h2 className="text-2xl font-bold text-zinc-100 mb-8 leading-snug">
            {q.question}
          </h2>

          <div className="space-y-4">
            {q.options.map((opt, i) => {
              const isSelected = selectedOption === i;
              const isCorrect = isAnswerRevealed && i === q.correctIndex;
              const isWrong = isAnswerRevealed && isSelected && i !== q.correctIndex;
              
              let baseClass = "group w-full text-left p-5 rounded-2xl border-2 transition-all duration-300 font-medium flex justify-between items-center";
              let stateClass = "border-zinc-800 bg-zinc-900/50 hover:border-blue-500/50 hover:bg-zinc-800 text-zinc-300";
              
              if (isSelected && !isAnswerRevealed) {
                stateClass = "border-blue-500 bg-blue-500/10 text-white";
              } else if (isCorrect) {
                stateClass = "border-emerald-500 bg-emerald-500/10 text-emerald-100";
              } else if (isWrong) {
                stateClass = "border-red-500 bg-red-500/10 text-red-100";
              } else if (isAnswerRevealed) {
                stateClass = "border-zinc-800/50 bg-zinc-900/30 text-zinc-600 cursor-not-allowed";
              }

              return (
                <button
                  key={i}
                  disabled={isAnswerRevealed}
                  onClick={() => handleSelect(i)}
                  className={`${baseClass} ${stateClass}`}
                >
                  <span className="text-lg">{opt}</span>
                  {isCorrect && <CheckCircle2 className="w-6 h-6 text-emerald-500" />}
                  {isWrong && <XCircle className="w-6 h-6 text-red-500" />}
                </button>
              );
            })}
          </div>

          <AnimatePresence>
            {isAnswerRevealed && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 32 }}
                className="p-5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-200"
              >
                <div className="font-bold mb-2 flex items-center gap-2">
                  Explanation
                </div>
                <p className="text-indigo-200/80 leading-relaxed">
                  {q.explanation}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-end">
        {!isAnswerRevealed ? (
          <button
            onClick={submitAnswer}
            disabled={selectedOption === null}
            className="px-8 py-4 rounded-xl font-bold bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-all shadow-lg shadow-blue-600/20"
          >
            Submit Answer
          </button>
        ) : (
          <button
            onClick={nextQuestion}
            className="px-8 py-4 rounded-xl font-bold bg-white text-black hover:bg-zinc-200 flex items-center gap-2 transition-all"
          >
            {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}

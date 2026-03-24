import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Code2, Play, Circle, CheckCircle2, Trophy, ChevronRight } from 'lucide-react';

interface Exercise {
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  hints: string[];
  solution: string;
}

interface PracticeViewerProps {
  repoId: string;
  exercises: Exercise[];
}

export function PracticeViewer({ repoId, exercises }: PracticeViewerProps) {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [revealedHints, setRevealedHints] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [completed, setCompleted] = useState<number[]>([]);

  const exercise = exercises[currentExercise];

  const handleNext = () => {
    if (!completed.includes(currentExercise)) {
      setCompleted([...completed, currentExercise]);
    }
    
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(c => c + 1);
      setRevealedHints(0);
      setShowSolution(false);
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Easy': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'Medium': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case 'Hard': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
    }
  };

  const isFinished = completed.length === exercises.length && currentExercise === exercises.length - 1 && showSolution;

  if (isFinished) {
    return (
      <div className="max-w-2xl mx-auto w-full">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card rounded-3xl p-10 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-full h-full bg-emerald-500/10 blur-[100px] pointer-events-none" />
          <Trophy className="w-20 h-20 mx-auto mb-6 text-emerald-400" />
          <h2 className="text-4xl font-bold text-white mb-4">Practice Complete!</h2>
          <p className="text-zinc-400 text-lg mb-10">
            You've completed all {exercises.length} coding exercises for this repository.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto w-full flex flex-col lg:flex-row gap-8">
      {/* Sidebar: Progress */}
      <div className="w-full lg:w-64 shrink-0">
        <div className="glass-panel rounded-2xl p-5 sticky top-8">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
            <Code2 className="w-5 h-5 text-blue-400" />
            Exercises
          </h3>
          <ul className="space-y-3">
            {exercises.map((ex, i) => {
              const isCurrent = currentExercise === i;
              const isDone = completed.includes(i);
              return (
                <li key={i} className="flex flex-col gap-1">
                  <button 
                    onClick={() => {
                      setCurrentExercise(i);
                      setRevealedHints(0);
                      setShowSolution(false);
                    }}
                    className={`flex items-center gap-3 text-sm transition-colors text-left ${isCurrent ? 'text-white font-bold' : isDone ? 'text-zinc-400' : 'text-zinc-500'}`}
                  >
                    {isDone ? <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> : isCurrent ? <Play className="w-4 h-4 text-blue-500 shrink-0" /> : <Circle className="w-4 h-4 shrink-0" />}
                    <span className="truncate">{ex.title}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow">
        <motion.div
          key={currentExercise}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-3xl p-6 md:p-10"
        >
          <div className="flex items-center gap-4 mb-6">
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getDifficultyColor(exercise.difficulty)}`}>
              {exercise.difficulty}
            </span>
            <h2 className="text-2xl font-bold text-white">{exercise.title}</h2>
          </div>

          <div className="prose prose-invert prose-p:text-zinc-300 max-w-none mb-10">
            {exercise.description}
          </div>

          <div className="space-y-6">
            {/* Hints Section */}
            {exercise.hints && exercise.hints.length > 0 && (
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
                <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-black/20">
                  <h3 className="font-bold flex items-center gap-2 text-zinc-300">
                    <Lightbulb className="w-4 h-4 text-amber-400" />
                    Hints ({revealedHints} / {exercise.hints.length})
                  </h3>
                  {revealedHints < exercise.hints.length && (
                    <button 
                      onClick={() => setRevealedHints(h => h + 1)}
                      className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-full transition-colors font-medium"
                    >
                      Reveal Hint
                    </button>
                  )}
                </div>
                {revealedHints > 0 && (
                  <div className="p-4 space-y-3">
                    {exercise.hints.slice(0, revealedHints).map((hint, i) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        key={i} 
                        className="flex gap-3 text-sm text-amber-200/80 bg-amber-500/10 p-3 rounded-xl"
                      >
                        <span className="font-bold text-amber-500">{i + 1}.</span>
                        {hint}
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Solution Section */}
            <div>
              {!showSolution ? (
                <button
                  onClick={() => setShowSolution(true)}
                  className="w-full p-4 border-2 border-dashed border-zinc-800 rounded-2xl text-zinc-500 font-medium hover:border-zinc-600 hover:text-zinc-300 transition-colors flex flex-col justify-center items-center gap-2 h-32"
                >
                  <Code2 className="w-6 h-6" />
                  Show Solution
                </button>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="rounded-2xl border border-emerald-500/20 bg-black overflow-hidden"
                >
                  <div className="p-3 border-b border-emerald-500/20 bg-emerald-500/10 flex items-center gap-2 text-emerald-400 font-medium text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    Reference Solution
                  </div>
                  <pre className="p-4 overflow-x-auto text-sm font-mono text-zinc-300 scrollbar-thin">
                    <code>{exercise.solution}</code>
                  </pre>
                </motion.div>
              )}
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-zinc-800 flex justify-end">
            <button
              onClick={handleNext}
              disabled={!showSolution && currentExercise !== exercises.length - 1} // Can't go next without viewing solution, unless we just want to allow skipping but typically we enforce viewing it for "completion"
              className="px-6 py-3 rounded-xl font-bold bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white transition-all shadow-lg flex items-center gap-2"
            >
              {currentExercise === exercises.length - 1 ? 'Finish Practice' : 'Next Exercise'}
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

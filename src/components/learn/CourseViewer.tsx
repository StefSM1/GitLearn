import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, CheckCircle2, Code2 } from 'lucide-react';
import { useStore } from '@/store/useStore';

interface Section {
  title: string;
  content: string;
  codeExamples: string[];
}

interface CourseViewerProps {
  repoId: string;
  sections: Section[];
}

export function CourseViewer({ repoId, sections }: CourseViewerProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const updateProgress = useStore((state) => state.updateProgress);

  const prevSection = () => {
    if (currentSection > 0) setCurrentSection(c => c - 1);
  };

  const nextSection = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(c => c + 1);
      updateProgress(repoId, currentSection + 1, sections.length);
    } else {
      updateProgress(repoId, sections.length, sections.length);
    }
  };

  const progress = Math.round((currentSection / (sections.length - 1)) * 100) || 0;

  return (
    <div className="max-w-4xl mx-auto w-full">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-zinc-400 mb-2">
          <span>Course Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="glass-card rounded-2xl p-6 md:p-10 min-h-[500px] flex flex-col relative overflow-hidden bg-zinc-950/50">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex-grow z-10"
          >
            <h2 className="text-3xl font-bold text-zinc-100 mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200">
              {sections[currentSection].title}
            </h2>
            
            <div className="prose prose-invert prose-blue max-w-none text-zinc-300 leading-relaxed">
              {sections[currentSection].content}
            </div>

            {sections[currentSection].codeExamples && sections[currentSection].codeExamples.length > 0 && (
              <div className="mt-8 space-y-4">
                <h3 className="text-lg font-bold text-zinc-200 flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-blue-400" />
                  Code Examples
                </h3>
                {sections[currentSection].codeExamples.map((code, i) => (
                  <pre key={i} className="p-4 rounded-xl bg-black/60 border border-zinc-800 text-sm font-mono text-zinc-300 overflow-x-auto scrollbar-thin">
                    <code>{code}</code>
                  </pre>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Controls */}
        <div className="mt-12 pt-6 border-t border-white/5 flex items-center justify-between relative z-10">
          <button
            onClick={prevSection}
            disabled={currentSection === 0}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-white/5 hover:bg-white/10 text-white"
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </button>
          
          <div className="text-zinc-500 text-sm font-medium">
            {currentSection + 1} / {sections.length}
          </div>

          <button
            onClick={nextSection}
            disabled={currentSection === sections.length - 1}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20"
          >
            {currentSection === sections.length - 1 ? (
              <span className="flex items-center gap-2">Finish <CheckCircle2 className="w-5 h-5" /></span>
            ) : (
              <span className="flex items-center gap-2">Next <ChevronRight className="w-5 h-5" /></span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

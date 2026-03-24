import { motion, AnimatePresence } from 'framer-motion';
import { X, GraduationCap, HelpCircle, Code2, Folder, FileCode2, ChevronRight, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { Repository } from './RepoCard';
import { useState } from 'react';

interface RepoModalProps {
  repo: Repository;
  isOpen: boolean;
  onClose: () => void;
}

// Dummy file tree component for now
function FileTree() {
  const [open, setOpen] = useState(true);
  
  return (
    <div className="text-sm font-mono text-zinc-400">
      <button onClick={() => setOpen(!open)} className="flex items-center gap-1 hover:text-blue-400 py-1 w-full text-left">
        {open ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        <Folder className="w-4 h-4 text-blue-400" />
        <span>src</span>
      </button>
      {open && (
        <div className="pl-5 border-l border-zinc-800 ml-2 mt-1 flex flex-col gap-1 text-zinc-300">
          <button className="flex items-center gap-2 hover:text-blue-400 py-1 text-left bg-white/5 rounded px-2 -ml-2 border border-white/5">
            <FileCode2 className="w-4 h-4 text-amber-400" />
            <span>index.ts</span>
          </button>
          <button className="flex items-center gap-2 hover:text-blue-400 py-1 text-left px-2 -ml-2">
            <FileCode2 className="w-4 h-4 text-teal-400" />
            <span>components.tsx</span>
          </button>
        </div>
      )}
      <button className="flex items-center gap-2 hover:text-blue-400 py-1 mt-1 text-left pl-1">
        <FileCode2 className="w-4 h-4 text-blue-400" />
        <span>README.md</span>
      </button>
    </div>
  );
}

function CodePreview() {
  return (
    <div className="h-full bg-[#0d1117] rounded-lg border border-zinc-800 flex flex-col overflow-hidden">
      <div className="flex items-center px-4 py-2 border-b border-zinc-800 bg-[#161b22]">
        <FileCode2 className="w-4 h-4 text-amber-400 mr-2" />
        <span className="text-sm font-mono text-zinc-300">index.ts</span>
      </div>
      <pre className="p-4 text-sm font-mono text-zinc-300 overflow-auto scrollbar-thin">
        <code className="block">
          <span className="text-pink-400">import</span> {'{'} <span className="text-blue-300">useState</span> {'}'} <span className="text-pink-400">from</span> <span className="text-green-300">'react'</span>;<br/><br/>
          <span className="text-purple-400">export function</span> <span className="text-blue-400">main</span>() {'{'}<br/>
          {'  '}<span className="text-zinc-500">// Welcome to the code preview</span><br/>
          {'  '}<span className="text-pink-400">const</span> {'['}state, setState{']'} = <span className="text-blue-300">useState</span>(<span className="text-amber-300">0</span>);<br/>
          {'  '}<span className="text-pink-400">return</span> state;<br/>
          {'}'}
        </code>
      </pre>
    </div>
  );
}

export function RepoModal({ repo, isOpen, onClose }: RepoModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-6xl h-[85vh] bg-[#0a0a0a] border border-zinc-800 rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden"
        >
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/20 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors border border-white/5"
          >
            <X className="w-5 h-5" />
          </button>
          
          {/* LEFT PANEL: File Tree & Code Preview */}
          <div className="w-full md:w-2/3 h-1/2 md:h-full flex flex-col border-b md:border-b-0 md:border-r border-zinc-800 bg-zinc-950/50">
            <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <span className="text-blue-400">{repo.ownerName}</span>
                <span className="text-zinc-500">/</span>
                <span className="text-zinc-100">{repo.name}</span>
              </h2>
            </div>
            
            <div className="flex-grow flex overflow-hidden">
              {/* File Tree Sidebar */}
              <div className="w-64 border-r border-zinc-800 p-4 overflow-y-auto scrollbar-thin hidden lg:block bg-zinc-950/30">
                <FileTree />
              </div>
              
              {/* Code Editor Preview */}
              <div className="flex-grow p-4 bg-black">
                <CodePreview />
              </div>
            </div>
          </div>
          
          {/* RIGHT PANEL: Actions */}
          <div className="w-full md:w-1/3 h-1/2 md:h-full p-6 lg:p-10 flex flex-col justify-center bg-gradient-to-br from-zinc-900/50 to-black relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
            
            <div className="text-center mb-10">
              <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 mb-2">
                AI Learning Hub
              </h3>
              <p className="text-zinc-400">
                Select a mode to dynamically generate course material from this repository.
              </p>
            </div>
            
            <div className="grid gap-4 w-full max-w-sm mx-auto">
              <Link 
                href={`/learn/${repo.ownerName}--${repo.name}`}
                className="group relative flex items-center gap-4 p-5 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all duration-300"
                onClick={onClose}
              >
                <div className="p-3 bg-blue-500/10 rounded-xl group-hover:bg-blue-500/20 group-hover:scale-110 transition-all duration-300 text-blue-400">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-zinc-100 group-hover:text-blue-400 transition-colors">Course Mode</h4>
                  <p className="text-xs text-zinc-400">5-section generated curriculum</p>
                </div>
              </Link>
              
              <Link 
                href={`/quiz/${repo.ownerName}--${repo.name}`}
                className="group relative flex items-center gap-4 p-5 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all duration-300"
                onClick={onClose}
              >
                <div className="p-3 bg-indigo-500/10 rounded-xl group-hover:bg-indigo-500/20 group-hover:scale-110 transition-all duration-300 text-indigo-400">
                  <HelpCircle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-zinc-100 group-hover:text-indigo-400 transition-colors">Quiz Mode</h4>
                  <p className="text-xs text-zinc-400">Test your knowledge</p>
                </div>
              </Link>
              
              <Link 
                href={`/practice/${repo.ownerName}--${repo.name}`}
                className="group relative flex items-center gap-4 p-5 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all duration-300"
                onClick={onClose}
              >
                <div className="p-3 bg-emerald-500/10 rounded-xl group-hover:bg-emerald-500/20 group-hover:scale-110 transition-all duration-300 text-emerald-400">
                  <Code2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-zinc-100 group-hover:text-emerald-400 transition-colors">Practice Mode</h4>
                  <p className="text-xs text-zinc-400">Hands-on coding exercises</p>
                </div>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

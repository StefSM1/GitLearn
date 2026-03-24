'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Globe2, Building2 } from 'lucide-react';

export type TabType = 'City' | 'Country' | 'World';

interface NewsTabsProps {
  activeTab: TabType;
  onChange?: (tab: TabType) => void;
}

export function NewsTabs({ activeTab, onChange }: NewsTabsProps) {
  const tabs: { id: TabType; icon: React.ReactNode; label: string }[] = [
    { id: 'City', icon: <Building2 className="w-4 h-4" />, label: 'City' },
    { id: 'Country', icon: <Globe2 className="w-4 h-4" />, label: 'Country' },
    { id: 'World', icon: <Sparkles className="w-4 h-4" />, label: 'World' },
  ];

  return (
    <div className="flex justify-center mb-8 animate-fade-in relative z-10 w-full max-w-lg mx-auto">
      <div className="glass-panel p-1 rounded-full flex gap-2 w-full relative">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange?.(tab.id)}
            className={`
              relative flex items-center justify-center gap-2 py-3 px-6 rounded-full font-medium transition-all duration-300 flex-1 z-10
              ${activeTab === tab.id ? 'text-white' : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'}
            `}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="active-tab-indicator"
                className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-lg"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-20 flex items-center gap-2 text-sm md:text-base">
              {tab.icon}
              {tab.label}
            </span>
          </button>
        ))}
      </div>
      
      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-24 bg-blue-500/20 blur-[80px] -z-10 rounded-full mix-blend-screen pointer-events-none" />
    </div>
  );
}

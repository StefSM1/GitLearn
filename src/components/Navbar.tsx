'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Zap, GitBranch, Newspaper, Shield, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { clsx } from 'clsx';

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'News', href: '/', icon: <Newspaper className="w-4 h-4" /> },
    { name: 'Repositories', href: '/github', icon: <GitBranch className="w-4 h-4" /> },
    { name: 'Learn', href: '/learn', icon: <Zap className="w-4 h-4" /> },
    { name: 'Admin', href: '/admin', icon: <Shield className="w-4 h-4" /> },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-background/60 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-primary-600 p-1.5 rounded-lg group-hover:bg-primary-500 transition-colors">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black text-white tracking-tighter">
                ANTIGRAVITY<span className="text-primary-500">.</span>
              </span>
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2',
                    pathname === item.href
                      ? 'bg-primary-600/10 text-primary-400 border border-primary-600/20'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  )}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-2xl border-b border-white/5 animate-fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={clsx(
                  'block px-3 py-4 rounded-xl text-base font-medium flex items-center gap-3',
                  pathname === item.href
                    ? 'bg-primary-600/10 text-primary-400'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                )}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

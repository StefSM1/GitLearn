'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Play, 
  Settings, 
  History, 
  ShieldCheck, 
  Zap, 
  AlertCircle,
  Database,
  ToggleLeft,
  ToggleRight,
  LogOut,
  RefreshCw,
  Search
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  const [logs, setLogs] = useState<any[]>([]);
  const [sources, setSources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [triggering, setTriggering] = useState<string | null>(null);

  useEffect(() => {
    // Quick check session cookie manually (client side check only for UI, API is protected)
    const checkSession = () => {
      const hasCookie = document.cookie.includes('admin-session=true');
      if (hasCookie) {
        setIsAuthenticated(true);
        fetchDashboardData();
      } else {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [logsRes, sourcesRes] = await Promise.all([
        fetch('/api/admin/logs'),
        fetch('/api/admin/sources')
      ]);
      
      if (logsRes.ok && sourcesRes.ok) {
        setLogs(await logsRes.json());
        setSources(await sourcesRes.json());
      } else {
        // Probably expired
        if (logsRes.status === 401) setIsAuthenticated(false);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
        fetchDashboardData();
      } else {
        setLoginError('Invalid username or password');
      }
    } catch (err) {
      setLoginError('An error occurred. Please try again.');
    }
  };

  const handleTrigger = async (source: string) => {
    setTriggering(source);
    try {
      const res = await fetch('/api/admin/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source })
      });
      const data = await res.json();
      if (data.success) {
        fetchDashboardData();
      } else {
        alert('Trigger failed: ' + data.error);
      }
    } catch (err) {
      alert('Error triggering scraper');
    } finally {
      setTriggering(null);
    }
  };

  const toggleSource = async (id: number, enabled: boolean) => {
    try {
      const res = await fetch('/api/admin/sources', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, enabled: !enabled })
      });
      if (res.ok) {
        setSources(sources.map(s => s.id === id ? { ...s, enabled: !enabled } : s));
      }
    } catch (err) {
      console.error('Toggle error:', err);
    }
  };

  if (loading && !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <Database className="h-12 w-12 text-primary-500" />
          <p className="text-surface-300 font-medium">Initializing Admin Portal...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-900/10 via-background to-background">
        <div className="w-full max-w-md animate-slide-up">
          <div className="glass overflow-hidden rounded-2xl border-white/10 shadow-2xl">
            <div className="bg-primary-600/10 p-8 text-center border-b border-white/5">
              <ShieldCheck className="mx-auto h-12 w-12 text-primary-500 mb-4" />
              <h1 className="text-2xl font-bold text-white mb-2">Admin Access</h1>
              <p className="text-surface-300 text-sm">Sign in to manage data scrapers and sources</p>
            </div>
            <form onSubmit={handleLogin} className="p-8 space-y-6 bg-white/5">
              {loginError && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white/50 uppercase tracking-wider px-1">Username</label>
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all"
                    placeholder="Enter admin username"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white/50 uppercase tracking-wider px-1">Password</label>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
              <button 
                type="submit" 
                className="w-full bg-primary-600 hover:bg-primary-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-primary-600/20 transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Enter Dashboard
              </button>
            </form>
            <div className="p-4 bg-white/5 text-center border-t border-white/5">
              <p className="text-white/20 text-[10px] uppercase font-bold tracking-[0.2em]">Secure Data Control Center</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-900/10 via-background to-background">
      {/* Sidebar / Topnav */}
      <nav className="border-b border-surface-border glass fixed top-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary-500 p-2 rounded-lg">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl text-white tracking-tight">DataEngine <span className="text-primary-400">v1.0</span></span>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-xs font-medium text-white/50">System Online</span>
            </div>
            <button 
              onClick={() => { document.cookie = 'admin-session=; Max-Age=0'; window.location.reload(); }}
              className="p-2 text-white/40 hover:text-white transition-colors"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 pt-24 pb-12">
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="animate-slide-up">
            <h2 className="text-3xl font-extrabold text-white mb-2">Dashboard Control</h2>
            <p className="text-white/40 max-w-xl">Configure news sources, manually trigger scrapers, and monitor system health and ingestion logs.</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => handleTrigger('all')}
              disabled={!!triggering}
              className={cn(
                "group relative px-6 py-3 rounded-xl font-bold transition-all duration-300 transform hover:-translate-y-1 overflow-hidden",
                triggering ? "bg-white/5 text-white/30" : "bg-primary-600 text-white hover:bg-primary-500 shadow-xl shadow-primary-600/30"
              )}
            >
              <div className="relative flex items-center gap-2 z-10">
                {triggering === 'all' ? (
                  <RefreshCw className="h-5 w-5 animate-spin" />
                ) : (
                  <Play className="h-5 w-5 group-hover:fill-current" />
                )}
                <span>{triggering === 'all' ? 'Running All...' : 'Trigger Full Ingestion'}</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Sources */}
          <section className="space-y-8 animate-slide-up delay-100">
            <div className="glass rounded-2xl p-6 border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 -mr-8 -mt-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Settings className="h-32 w-32 rotate-12" />
              </div>
              
              <div className="flex items-center gap-3 mb-6 relative">
                <Settings className="h-5 w-5 text-primary-400" />
                <h3 className="text-lg font-bold text-white">Configured Sources</h3>
              </div>

              <div className="space-y-4 relative">
                {sources.map(source => (
                  <div key={source.id} className="glass-card rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-white/90">{source.name}</h4>
                      <p className="text-[10px] text-white/30 uppercase font-bold tracking-wider mt-0.5">{source.type}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => handleTrigger(source.name)}
                        disabled={!!triggering}
                        className="p-2 hover:bg-white/10 rounded-lg text-white/20 hover:text-primary-400 transition-all"
                      >
                        {triggering === source.name ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                      </button>
                      <button 
                        onClick={() => toggleSource(source.id, source.enabled)}
                        className={cn("transition-colors", source.enabled ? "text-primary-500" : "text-white/10")}
                      >
                         {source.enabled ? <ToggleRight className="h-8 w-8" /> : <ToggleLeft className="h-8 w-8" />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass rounded-2xl p-6 border-white/5">
              <div className="flex items-center gap-3 mb-6">
                <BarChart3 className="h-5 w-5 text-indigo-400" />
                <h3 className="text-lg font-bold text-white">Statistics</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <span className="block text-2xl font-black text-white">{sources.filter(s => s.enabled).length}</span>
                  <span className="text-[10px] uppercase font-bold text-white/20 tracking-wider">Active Sources</span>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <span className="block text-2xl font-black text-white">{logs.reduce((acc, l) => acc + l.articles, 0)}</span>
                  <span className="text-[10px] uppercase font-bold text-white/20 tracking-wider">Total Articles</span>
                </div>
              </div>
            </div>
          </section>

          {/* Right Column - Logs */}
          <section className="lg:col-span-2 animate-slide-up delay-200">
            <div className="glass rounded-2xl p-6 border-white/5 min-h-[500px] flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="bg-white/5 p-2 rounded-lg">
                    <History className="h-5 w-5 text-primary-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Ingestion Logs</h3>
                </div>
                <button 
                  onClick={fetchDashboardData}
                  className="p-2 text-white/20 hover:text-white transition-colors hover:rotate-180 duration-500"
                >
                  <RefreshCw className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-grow overflow-x-auto scrollbar-thin">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 text-[10px] uppercase font-black text-white/20 tracking-widest">
                      <th className="pb-4 px-2">Date/Time</th>
                      <th className="pb-4 px-2">Source</th>
                      <th className="pb-4 px-2">Result</th>
                      <th className="pb-4 px-2">Items</th>
                      <th className="pb-4 px-2">Message</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-20 text-center">
                          <History className="h-10 w-10 text-white/5 mx-auto mb-4" />
                          <p className="text-white/20 font-medium">No logs available</p>
                        </td>
                      </tr>
                    ) : (
                      logs.map(log => (
                        <tr key={log.id} className="border-b border-white/5 group hover:bg-white/[0.02] transition-colors">
                          <td className="py-4 px-2">
                            <span className="block text-xs font-semibold text-white/70">
                              {new Date(log.createdAt).toLocaleDateString()}
                            </span>
                            <span className="block text-[10px] text-white/30">
                              {new Date(log.createdAt).toLocaleTimeString()}
                            </span>
                          </td>
                          <td className="py-4 px-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/5 text-white/50 group-hover:bg-primary-500/10 group-hover:text-primary-400 transition-colors">
                              {log.source}
                            </span>
                          </td>
                          <td className="py-4 px-2">
                            <div className="flex items-center gap-1.5">
                              <div className={cn(
                                "w-1.5 h-1.5 rounded-full shadow-[0_0_5px_currentColor]",
                                log.status === 'success' ? "bg-green-500 text-green-500/50" : "bg-red-500 text-red-500/50"
                              )}></div>
                              <span className={cn(
                                "text-xs font-bold uppercase tracking-tight",
                                log.status === 'success' ? "text-green-500/80" : "text-red-500/80"
                              )}>
                                {log.status}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-2">
                            <span className="text-xs font-mono font-bold text-white/90">{log.articles}</span>
                          </td>
                          <td className="py-4 px-2">
                            <p className="text-xs text-white/50 line-clamp-1 max-w-[200px]">{log.message}</p>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

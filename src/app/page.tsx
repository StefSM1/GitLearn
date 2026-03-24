import { prisma } from '@/lib/db';
import { NewsCard } from '@/components/news/NewsCard';
import { NewsTabs } from '@/components/news/NewsTabs';
import { Navbar } from '@/components/Navbar';
import { Search, ArrowRight, Zap, TrendingUp, Globe } from 'lucide-react';
import Link from 'next/link';

export default async function Home() {
  const articles = await prisma.article.findMany({
    orderBy: { createdAt: 'desc' },
    take: 24,
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary-900/10 via-background to-background" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary-600/10 blur-[120px] rounded-full -z-10" />
          
          <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-600/10 border border-primary-600/20 text-primary-400 text-xs font-bold mb-8 animate-fade-in">
              <Zap className="w-3.5 h-3.5" />
              <span>AI-POWERED NEWS ENGINE v1.0</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6 animate-slide-up">
              STAY AHEAD OF THE <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-primary-500 to-indigo-500">
                TECH FRONTIER
              </span>
            </h1>
            
            <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 animate-slide-up [animation-delay:100ms]">
              Aggregating global tech news, local insights, and trending GitHub repositories in one beautiful, real-time dashboard.
            </p>
            
            <div className="max-w-xl mx-auto relative group animate-slide-up [animation-delay:200ms]">
              <div className="absolute inset-0 bg-primary-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative glass-panel rounded-2xl flex items-center p-2">
                <Search className="w-5 h-5 text-zinc-500 ml-4" />
                <input 
                  type="text" 
                  placeholder="Search articles, repositories, or topics..." 
                  className="bg-transparent border-none outline-none flex-grow text-white px-4 py-3 placeholder:text-zinc-600"
                />
                <button className="bg-primary-600 hover:bg-primary-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-primary-600/20">
                  Search
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="max-w-7xl mx-auto px-4 pb-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-primary-500" />
                Latest Insights
              </h2>
              <p className="text-zinc-500">Real-time technology news from across the globe and local sources.</p>
            </div>
            
            {/* Note: In a real app, this would be a client component for interactive filtering */}
            {/* For now, we render it for UI consistency */}
            <div className="hidden lg:block">
              <NewsTabs activeTab="World" />
            </div>
          </div>

          {articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <NewsCard 
                  key={article.id} 
                  article={{
                    ...article,
                    id: article.id.toString(),
                    description: article.category || 'Expert tech news and analysis',
                    category: article.category || 'News',
                    publishedAt: article.createdAt.toISOString()
                  }} 
                />
              ))}
            </div>
          ) : (
            <div className="glass-card rounded-3xl p-20 text-center border-dashed border-zinc-800">
              <div className="bg-zinc-900 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Globe className="w-10 h-10 text-zinc-700" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No Articles Found</h3>
              <p className="text-zinc-500 mb-8 max-w-sm mx-auto">
                Head over to the admin panel to trigger the ingestion scrapers and populate your feed.
              </p>
              <Link href="/admin" className="text-primary-400 font-bold flex items-center gap-2 justify-center hover:text-primary-300 transition-colors">
                Go to Admin Portal <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </section>
      </main>

      <footer className="border-t border-white/5 py-12 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary-600" />
            <span className="font-bold text-white">ANTIGRAVITY</span>
          </div>
          <p className="text-zinc-600 text-sm">© 2026 Antigravity News Aggregator. All rights reserved.</p>
          <div className="flex gap-8 text-sm text-zinc-600">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Ensure Link is available if used

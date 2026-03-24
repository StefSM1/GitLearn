import { ExternalLink as LinkIcon, Clock as TimeIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
  category: string;
}

export function NewsCard({ article }: { article: NewsArticle }) {
  return (
    <a 
      href={article.url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="group block animate-slide-up"
    >
      <article className="glass-card rounded-2xl p-6 h-full flex flex-col relative overflow-hidden">
        {/* Subtle top border gradient */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="flex justify-between items-start mb-4 gap-4">
          <span className="inline-block px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold border border-blue-500/20">
            {article.category}
          </span>
          <div className="p-2 rounded-full bg-white/5 opacity-0 group-hover:opacity-100 transition-all duration-300 shrink-0 group-hover:bg-blue-500/20">
            <LinkIcon className="w-4 h-4 text-zinc-400 group-hover:text-blue-400" />
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-zinc-100 mb-3 leading-snug group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-blue-200 transition-all duration-300">
          {article.title}
        </h3>
        
        <p className="text-zinc-400 text-sm mb-6 flex-grow line-clamp-3">
          {article.description}
        </p>
        
        <div className="flex items-center justify-between text-xs text-zinc-500 mt-auto pt-4 border-t border-white/5">
          <span className="font-medium text-zinc-300">{article.source}</span>
          <div className="flex items-center gap-1.5">
            <TimeIcon className="w-3.5 h-3.5" />
            <span>{formatDistanceToNow(new Date(article.publishedAt))} ago</span>
          </div>
        </div>
      </article>
    </a>
  );
}

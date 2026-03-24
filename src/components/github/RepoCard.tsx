import { Star, GitFork, BookOpen } from 'lucide-react';

export interface Repository {
  id: string;
  name: string;
  ownerName: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  url: string;
}

interface RepoCardProps {
  repo: Repository;
  onClick: (repo: Repository) => void;
}

export function RepoCard({ repo, onClick }: RepoCardProps) {
  return (
    <button
      onClick={() => onClick(repo)}
      className="group w-full text-left bg-surface-100/30 backdrop-blur-sm border border-surface-border rounded-xl p-5 hover:bg-surface-200 hover:border-blue-500/30 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] transition-all duration-300 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -z-10 group-hover:bg-blue-500/10 transition-colors" />
      
      <div className="flex justify-between items-start mb-3 gap-2">
        <h3 className="text-lg font-bold text-zinc-100 group-hover:text-blue-400 transition-colors flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-zinc-500 group-hover:text-blue-400" />
          <span className="truncate">{repo.ownerName}/{repo.name}</span>
        </h3>
        {repo.language && (
          <span className="px-2 py-0.5 text-xs font-medium rounded-md bg-zinc-800 text-zinc-300 border border-zinc-700 whitespace-nowrap">
            {repo.language}
          </span>
        )}
      </div>
      
      <p className="text-zinc-400 text-sm mb-4 line-clamp-2 min-h-[40px]">
        {repo.description || "No description provided."}
      </p>
      
      <div className="flex items-center gap-4 text-sm font-medium text-zinc-500">
        <div className="flex items-center gap-1.5 group-hover:text-amber-400/80 transition-colors">
          <Star className="w-4 h-4" />
          <span>{repo.stars.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-1.5 group-hover:text-emerald-400/80 transition-colors">
          <GitFork className="w-4 h-4" />
          <span>{repo.forks.toLocaleString()}</span>
        </div>
      </div>
    </button>
  );
}

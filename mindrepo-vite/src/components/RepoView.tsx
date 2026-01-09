import React, { useEffect, useState } from 'react';
import { Folder, FileCode, FileText, GitBranch, Star, Eye } from 'lucide-react';
import { useCommits } from '../hooks/useCommits';
import type { Repository, Commit } from '../types';

interface RepoViewProps {
    repository?: Repository;
    onBack?: () => void;
}

export const RepoView: React.FC<RepoViewProps> = ({ repository }) => {
    const { commits, refresh } = useCommits();
    const [repoCommits, setRepoCommits] = useState<Commit[]>([]);

    useEffect(() => {
        if (repository) {
            refresh('', '', repository.id);
        }
    }, [repository, refresh]);

    useEffect(() => {
        if (repository) {
            setRepoCommits(commits);
        }
    }, [commits, repository]);

    if (!repository) {
        return <div className="p-8 text-center text-subtext0">Select a repository to view details</div>;
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Repo Header */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2 text-text">
                    <div className="w-8 h-8 rounded bg-blue/10 flex items-center justify-center text-blue">
                        <span className="font-bold text-lg">{repository.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="flex flex-col">
                        <h2 className="font-bold text-lg leading-tight flex items-center gap-2">
                            {repository.name}
                            <span className="text-xs border border-surface1 px-2 py-0.5 rounded-full text-subtext0 font-normal">Public</span>
                        </h2>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-3 py-1 bg-surface0 border border-surface1 rounded text-sm font-medium hover:bg-surface1 transition-colors">
                        <Eye size={14} /> Watch <span className="bg-surface1 px-1.5 rounded-full text-xs ml-1">1</span>
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1 bg-surface0 border border-surface1 rounded text-sm font-medium hover:bg-surface1 transition-colors">
                        <GitBranch size={14} /> Fork <span className="bg-surface1 px-1.5 rounded-full text-xs ml-1">0</span>
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1 bg-surface0 border border-surface1 rounded text-sm font-medium hover:bg-surface1 transition-colors text-yellow">
                        <Star size={14} className="fill-yellow" /> Star <span className="bg-surface1 px-1.5 rounded-full text-xs ml-1 text-text">3</span>
                    </button>
                </div>
            </div>

            {/* Branch / Meta */}
            <div className="flex justify-between items-center mb-4">
                <button className="flex items-center gap-2 px-3 py-1.5 bg-surface0 rounded border border-surface1 text-sm font-bold hover:border-subtext0 transition-colors">
                    <GitBranch size={16} />
                    <span>main</span>
                </button>
                <div className="flex items-center gap-4 text-sm font-mono text-subtext0">
                    <span className="hover:text-blue cursor-pointer"><strong>{repoCommits.length}</strong> commits</span>
                    <span className="hover:text-blue cursor-pointer"><strong>1</strong> branch</span>
                    <span className="hover:text-blue cursor-pointer"><strong>0</strong> tags</span>
                </div>
            </div>

            {/* File Tree (Simulated for aesthetics, but lists recent categories as folders) */}
            <div className="border border-surface0 rounded-lg overflow-hidden bg-mantle shadow-sm">
                <div className="bg-surface0/30 p-3 border-b border-surface0 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-sm">
                        <div className="w-5 h-5 rounded-full bg-blue/20"></div>
                        <span className="font-bold text-text">FreakyAdy</span>
                        <span className="text-subtext0 truncate">Latest commit: {repoCommits[0]?.title || 'Initial commit'}</span>
                    </div>
                    <div className="text-xs text-subtext0 font-mono">
                        {repoCommits[0] ? new Date(repoCommits[0].timestamp).toLocaleDateString() : 'Now'}
                    </div>
                </div>

                <div className="divide-y divide-surface0">
                    {repoCommits.slice(0, 5).map((commit, i) => (
                        <div key={i} className="flex items-center justify-between p-2.5 hover:bg-surface0/50 transition-colors cursor-pointer group">
                            <div className="flex items-center gap-3 w-1/3">
                                <FileCode size={16} className="text-subtext0" />
                                <span className="text-sm text-text group-hover:text-blue group-hover:underline transition-colors">{commit.title}</span>
                            </div>
                            <div className="flex-1 text-sm text-subtext0 truncate px-4 group-hover:text-subtext1">
                                {commit.description || 'No description'}
                            </div>
                            <div className="text-xs text-subtext1 w-24 text-right">
                                {new Date(commit.timestamp).toLocaleDateString()}
                            </div>
                        </div>
                    ))}
                    {repoCommits.length === 0 && (
                        <div className="p-4 text-center text-sm text-subtext0">No commits yet.</div>
                    )}
                </div>
            </div>

            {/* README Preview */}
            <div className="mt-6 border border-surface0 rounded-lg overflow-hidden bg-mantle">
                <div className="p-3 border-b border-surface0 bg-surface0/30 flex items-center gap-2">
                    <FileText size={16} className="text-subtext0" />
                    <span className="text-xs font-bold uppercase tracking-wider text-subtext0">README.md</span>
                </div>
                <div className="p-8 prose prose-invert max-w-none">
                    <h1 className="text-2xl font-bold mb-4">{repository.name}</h1>
                    <p className="text-subtext0 mb-4">{repository.description || "No description provided."}</p>
                </div>
            </div>
        </div>
    );
};
